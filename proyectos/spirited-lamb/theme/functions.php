<?php
if (!defined('ABSPATH')) exit;

define('SL_VERSION', '1.3.0');
define('SL_DIR', get_template_directory());
define('SL_URI', get_template_directory_uri());

// ── Theme support ──────────────────────────────────────────────
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');
    add_theme_support('html5', ['search-form','comment-form','comment-list','gallery','caption','style','script']);
    register_nav_menus(['primary' => __('Primary Menu', 'spirited-lamb')]);
});

// ── Enqueue assets ─────────────────────────────────────────────
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'spirited-lamb-main',
        SL_URI . '/assets/css/main.css',
        [],
        SL_VERSION
    );
    wp_enqueue_script(
        'spirited-lamb-main',
        SL_URI . '/assets/js/main.js',
        [],
        SL_VERSION,
        true
    );
    // Pass config to JS
    wp_localize_script('spirited-lamb-main', 'SLConfig', [
        'n8nEventsUrl' => 'https://no-26feb-n8n.ydlmwq.easypanel.host/webhook/sl-parish-events',
        'ajaxUrl'      => admin_url('admin-ajax.php'),
        'themeUri'     => SL_URI,
    ]);
    // WooCommerce styles on all pages
    if (class_exists('WooCommerce')) {
        wp_enqueue_style('woocommerce-layout');
        wp_enqueue_style('woocommerce-general');
        wp_enqueue_style('woocommerce-smallscreen');
    }
});

// ── WooCommerce: remove default wrappers ───────────────────────
remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
add_action('woocommerce_before_main_content', function () {
    echo '<div class="sl-woo-wrap">';
});
add_action('woocommerce_after_main_content', function () {
    echo '</div>';
});

// ── Auto-provision resource pages (Faith Formation Media, Confession & Adoration) ──
// Runs once; creates the WP Page + assigns the matching page-{slug}.php template so
// the pillar links on the homepage resolve without any manual wp-admin step.
add_action('init', function () {
    if (get_option('sl_resource_pages_synced_v1')) return;

    $pages = [
        'confession-adoration'  => ['title' => 'Confession & Adoration',  'template' => 'page-confession-adoration.php'],
        'faith-formation-media' => ['title' => 'Faith Formation Media',   'template' => 'page-faith-formation-media.php'],
    ];

    foreach ($pages as $slug => $data) {
        $existing = get_page_by_path($slug, OBJECT, 'page');
        if (!$existing) {
            $id = wp_insert_post([
                'post_title'  => $data['title'],
                'post_name'   => $slug,
                'post_type'   => 'page',
                'post_status' => 'publish',
            ]);
            if ($id && !is_wp_error($id)) {
                update_post_meta($id, '_wp_page_template', $data['template']);
            }
        } elseif (get_post_meta($existing->ID, '_wp_page_template', true) !== $data['template']) {
            update_post_meta($existing->ID, '_wp_page_template', $data['template']);
        }
    }

    update_option('sl_resource_pages_synced_v1', 1);
});

// ── AJAX: proxy to n8n events endpoint (avoids CORS) ──────────
add_action('wp_ajax_nopriv_sl_get_events', 'sl_get_events');
add_action('wp_ajax_sl_get_events',        'sl_get_events');
function sl_get_events() {
    $n8n_url = 'https://no-26feb-n8n.ydlmwq.easypanel.host/webhook/sl-parish-events';
    if ($n8n_url === 'PLACEHOLDER_N8N_WEBHOOK_URL') {
        wp_send_json_success(['events' => []]);
        return;
    }
    $response = wp_remote_get($n8n_url, ['timeout' => 15, 'sslverify' => false]);
    if (is_wp_error($response)) {
        wp_send_json_error($response->get_error_message());
        return;
    }
    $body = wp_remote_retrieve_body($response);
    $decoded = json_decode($body, true);
    if (!is_array($decoded)) {
        wp_send_json_error('Invalid JSON from n8n endpoint');
        return;
    }
    if (isset($decoded['events']) && is_array($decoded['events'])) {
        wp_send_json_success(['events' => $decoded['events']]);
        return;
    }
    $is_list = ($decoded === []) || (array_keys($decoded) === range(0, count($decoded) - 1));
    if ($is_list) {
        wp_send_json_success(['events' => $decoded]);
        return;
    }
    wp_send_json_success(['events' => []]);
}
