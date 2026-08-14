<?php
/**
 * Homepage template — Spirited Lamb
 */
if (!defined('ABSPATH')) exit;
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Spirited Lamb — Catholic young adult community in Santa Barbara & Ventura Counties. Faith. Friends. Fellowship.">
    <meta property="og:title" content="Spirited Lamb — Faith. Friends. Fellowship.">
    <meta property="og:description" content="Catholic young adult community in Santa Barbara & Ventura Counties. Est. 2023.">
    <meta property="og:image" content="<?php echo SL_URI; ?>/assets/img/hero-1.jpg">
    <meta property="og:url" content="https://spiritedlamb.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap" rel="stylesheet">
    <link rel="icon" href="https://mlptyjrdcsxoojvszlbn.supabase.co/storage/v1/object/public/SLWeb/logo%20black.png">
    <?php wp_head(); ?>
</head>
<body class="sl-body">

<!-- ═══════════════════════════════════════════
     NAVBAR
═══════════════════════════════════════════ -->
<header id="sl-navbar">
    <div class="sl-nav-inner">

        <a href="#hero" class="sl-nav-logo">
            <img src="https://mlptyjrdcsxoojvszlbn.supabase.co/storage/v1/object/public/SLWeb/logo%20black.png" alt="Spirited Lamb" height="40" class="sl-nav-logo__img">
            <span class="sl-nav-logo__name">Spirited Lamb</span>
        </a>

        <nav class="sl-nav-links" aria-label="Main navigation">
            <a href="#hero">Home</a>
            <a href="#events">Events</a>
            <a href="#media">Media</a>
            <a href="#shop">Shop</a>
        </nav>

        <div class="sl-nav-actions">
            <a href="#contact" class="sl-btn sl-btn--outline-nav">Contact</a>
            <a href="#contact" class="sl-btn sl-btn--primary sl-btn--sm">Join Now</a>
        </div>

        <button class="sl-nav-burger" id="sl-burger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    </div>
</header>

<!-- Mobile menu -->
<div class="sl-mobile-menu" id="sl-mobile-menu" aria-hidden="true">
    <button class="sl-mobile-close" id="sl-mobile-close" aria-label="Close menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <nav class="sl-mobile-nav">
        <a href="#hero" class="sl-mobile-link">Home</a>
        <a href="#events" class="sl-mobile-link">Events</a>
        <a href="#media" class="sl-mobile-link">Media</a>
        <a href="#shop" class="sl-mobile-link">Shop</a>
    </nav>
    <div class="sl-mobile-actions">
        <a href="#contact" class="sl-btn sl-btn--primary">Join the Mission</a>
    </div>
</div>


<!-- ═══════════════════════════════════════════
     HERO
═══════════════════════════════════════════ -->
<section id="hero" class="sl-hero">

    <!-- Slides -->
    <div class="sl-hero__slides" id="sl-hero-slides">
        <div class="sl-hero__slide active">
            <img src="<?php echo SL_URI; ?>/assets/img/hero-1.jpg" alt="Eucharistic adoration" class="sl-hero__slide-img">
        </div>
        <div class="sl-hero__slide">
            <img src="<?php echo SL_URI; ?>/assets/img/hero-2.jpg" alt="Spirited Lamb community gathering" class="sl-hero__slide-img">
        </div>
        <div class="sl-hero__slide">
            <img src="<?php echo SL_URI; ?>/assets/img/hero-3.jpg" alt="Spirited Lamb community member" class="sl-hero__slide-img">
        </div>
    </div>

    <!-- Gradients -->
    <div class="sl-hero__grad-lr"></div>
    <div class="sl-hero__grad-tb"></div>

    <!-- Content — LEFT aligned -->
    <div class="sl-hero__content">
        <div class="sl-hero__est-wrap">
            <div class="sl-hero__est-line"></div>
            <span class="sl-hero__est">Est. 2023</span>
        </div>

        <h1 class="sl-hero__title">
            Ignite your faith,<br>
            <span class="sl-hero__title--accent">Build bonds</span>
        </h1>

        <h2 class="sl-hero__sub">
            Your home for building <br class="sl-br-md"> Catholic community
        </h2>

        <div class="sl-hero__ctas">
            <a href="#contact" class="sl-btn sl-btn--white-hero">
                Join the Mission
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#events" class="sl-btn sl-btn--glass">Explore Events</a>
        </div>
    </div>

</section>

<!-- Scrolling banner -->
<div class="sl-scroll-banner" aria-hidden="true">
    <div class="sl-scroll-banner__track">
        <?php for ($i = 0; $i < 6; $i++) { ?>
            <span class="sl-scroll-banner__item">Faith<span class="sl-scroll-banner__dot">●</span></span>
            <span class="sl-scroll-banner__item">Friends<span class="sl-scroll-banner__dot">●</span></span>
            <span class="sl-scroll-banner__item">Fellowship<span class="sl-scroll-banner__dot">●</span></span>
        <?php } ?>
    </div>
</div>


<!-- ═══════════════════════════════════════════
     CALENDAR — LOCAL PULSE
═══════════════════════════════════════════ -->
<section id="events" class="sl-section sl-section--light sl-cal-section">
    <div class="sl-container">

        <div class="sl-cal-header">
            <div class="sl-cal-header__left">
                <span class="sl-label sl-label--gold">Local Pulse</span>
                <h2 class="sl-heading-xl">CALENDAR</h2>
            </div>
            <div class="sl-cal-header__filters">
                <div class="sl-filter-group-wrap">
                    <p class="sl-filter-label">Filter by Pillar</p>
                    <div class="sl-filter-group sl-filter-group--pill">
                        <button class="sl-filter active" data-filter="type" data-value="all">All</button>
                        <button class="sl-filter" data-filter="type" data-value="Spiritual">Spiritual</button>
                        <button class="sl-filter" data-filter="type" data-value="Action">Action</button>
                        <button class="sl-filter" data-filter="type" data-value="Connection">Connection</button>
                    </div>
                </div>
                <div class="sl-filter-group-wrap">
                    <p class="sl-filter-label">Filter by Location</p>
                    <div class="sl-filter-group sl-filter-group--pill">
                        <button class="sl-filter active" data-filter="county" data-value="all">All Counties</button>
                        <button class="sl-filter" data-filter="county" data-value="Ventura">Ventura</button>
                        <button class="sl-filter" data-filter="county" data-value="Santa Barbara">Santa Barbara</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Calendar glass card -->
        <div class="sl-cal-card">
            <div class="sl-cal-card__nav">
                <div>
                    <h3 class="sl-cal-card__month" id="sl-cal-month-label">Loading…</h3>
                    <p class="sl-cal-card__sub">Local Community Updates</p>
                </div>
                <div class="sl-cal-card__nav-btns">
                    <button class="sl-cal-nav-btn" id="sl-cal-prev" aria-label="Previous month">&#8592;</button>
                    <button class="sl-cal-nav-btn" id="sl-cal-next" aria-label="Next month">&#8594;</button>
                </div>
            </div>

            <div class="sl-cal-weekdays">
                <span>SUN</span><span>MON</span><span>TUE</span>
                <span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>

            <div class="sl-cal-grid" id="sl-cal-grid">
                <!-- Populated by main.js -->
            </div>
        </div>

        <!-- Event list -->
        <div class="sl-events-list-wrap">
            <div class="sl-events-list-header">
                <h4 class="sl-events-list-title">Upcoming Events</h4>
                <span class="sl-events-count" id="sl-events-count">— Events Found</span>
            </div>
            <div class="sl-events-list" id="sl-events-list">
                <!-- Populated by main.js -->
            </div>
        </div>

    </div>
</section>


<!-- ═══════════════════════════════════════════
     EVENT MODAL
═══════════════════════════════════════════ -->
<div class="sl-modal" id="sl-event-modal" aria-modal="true" role="dialog" aria-hidden="true">
    <div class="sl-modal__backdrop" id="sl-modal-backdrop"></div>

    <button class="sl-modal__nav sl-modal__nav--prev" id="sl-modal-prev" aria-label="Previous event day">&#8592;</button>

    <div class="sl-modal__box">
        <button class="sl-modal__close" id="sl-modal-close" aria-label="Close">&#x2715;</button>
        <img class="sl-modal__img" id="sl-modal-img" src="" alt="">
        <h3 class="sl-modal__title" id="sl-modal-title"></h3>
        <div class="sl-modal__meta">
            <span class="sl-modal__meta-item" id="sl-modal-date"></span>
            <span class="sl-modal__meta-item" id="sl-modal-location"></span>
            <span class="sl-modal__meta-item" id="sl-modal-cost"></span>
        </div>
        <p class="sl-modal__desc" id="sl-modal-desc"></p>
        <a class="sl-btn sl-btn--primary sl-modal__link" id="sl-modal-link" href="#" target="_blank" rel="noopener">More Info →</a>
    </div>

    <button class="sl-modal__nav sl-modal__nav--next" id="sl-modal-next" aria-label="Next event day">&#8594;</button>
</div>

<!-- Hover mini-preview -->
<div class="sl-cal-tooltip" id="sl-cal-tooltip" aria-hidden="true">
    <img id="sl-cal-tooltip-img" src="" alt="">
    <span id="sl-cal-tooltip-title"></span>
</div>


<!-- ═══════════════════════════════════════════
     PARTNER / DONATE — dark strip
═══════════════════════════════════════════ -->
<section id="partner" class="sl-partner">
    <div class="sl-container sl-partner__inner">
        <div class="sl-partner__text">
            <h2 class="sl-partner__title">
                LOCAL <span class="sl-partner__title--accent">PARTNERS</span>
            </h2>
        </div>
        <div class="sl-partner__actions">
            <a href="#contact" class="sl-btn sl-btn--white-solid">
                Sponsorship Opportunities
            </a>
        </div>
    </div>
</section>


<!-- ═══════════════════════════════════════════
     PILLARS — rounded dark container
═══════════════════════════════════════════ -->
<section class="sl-pillars-section">
    <div class="sl-pillars-container">
        <div class="sl-pillars-grid">

            <a class="sl-pillar" href="/faith-formation-media/">
                <img src="<?php echo SL_URI; ?>/assets/img/pillar-education.jpg"
                     alt="Education" class="sl-pillar__img">
                <div class="sl-pillar__overlay"></div>
                <div class="sl-pillar__label">Education</div>
            </a>

            <a class="sl-pillar" href="/confession-adoration/">
                <img src="<?php echo SL_URI; ?>/assets/img/pillar-faith.jpg"
                     alt="Faith" class="sl-pillar__img">
                <div class="sl-pillar__overlay"></div>
                <div class="sl-pillar__label">Faith</div>
            </a>

            <a class="sl-pillar" href="<?php echo SL_URI; ?>/assets/pdf/catholic-young-adult-directory.pdf" target="_blank" rel="noopener">
                <img src="<?php echo SL_URI; ?>/assets/img/pillar-connection.jpg"
                     alt="Connection" class="sl-pillar__img">
                <div class="sl-pillar__overlay"></div>
                <div class="sl-pillar__label">Connection</div>
            </a>

        </div>
    </div>
</section>


<!-- ═══════════════════════════════════════════
     MEDIA HUB — dark bento
═══════════════════════════════════════════ -->
<section id="media" class="sl-media">
    <div class="sl-container sl-media__inner">

        <div class="sl-media__header">
            <div class="sl-media__header-left">
                <span class="sl-label sl-label--gold">Digital Community</span>
                <h2 class="sl-media__title">SHARED <br><span class="sl-text--primary">MISSION</span></h2>
            </div>
            <div class="sl-media__header-right">
                <p class="sl-media__subtitle">Get connected and be part of our digital community</p>
            </div>
        </div>

        <div class="sl-bento">

            <!-- Daily Intention -->
            <div class="sl-bento__card sl-bento__card--intention">
                <div class="sl-bento__card-top">
                    <div class="sl-bento__pulse"></div>
                    <span class="sl-bento__label">Daily Intention</span>
                </div>
                <h3 class="sl-bento__quote">
                    Seek the Lord in the breaking of bread and the warmth of community.
                </h3>
                <div class="sl-bento__avatars">
                    <div class="sl-bento__avatar"></div>
                    <div class="sl-bento__avatar"></div>
                    <div class="sl-bento__avatar"></div>
                    <p class="sl-bento__community">Coastal Community</p>
                </div>
            </div>

            <!-- YouTube — large card -->
            <a href="https://www.youtube.com/channel/UCA0oFV-X0qWrbFmgHo4lvaA"
               target="_blank" rel="noopener" class="sl-bento__card sl-bento__card--yt">
                <img src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1200"
                     alt="YouTube" class="sl-bento__yt-bg">
                <div class="sl-bento__yt-overlay"></div>
                <div class="sl-bento__yt-play">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <div class="sl-bento__yt-bottom">
                    <div>
                        <span class="sl-label sl-label--gold">YouTube Channel</span>
                        <h3 class="sl-bento__yt-title">Spirited <br>Lamb <br>Featured</h3>
                    </div>
                    <span class="sl-btn sl-btn--white-solid sl-btn--sm">Subscribe Now</span>
                </div>
            </a>

            <!-- Instagram row -->
                <div class="sl-bento__ig-row">
                    <a href="https://www.instagram.com/spirited_lamb" target="_blank" rel="noopener" class="sl-bento__ig-info">
                        <div class="sl-bento__ig-top">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="#C05A3F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        <h4 class="sl-bento__ig-handle">@spirited_lamb</h4>
                    </div>
                    <p class="sl-bento__ig-desc">Connect for local stories, highlights, and community updates.</p>
                </a>
                <div class="sl-bento__ig-thumb">
                    <img src="<?php echo SL_URI; ?>/assets/img/instagram-1.jpg" alt="IG preview 1">
                </div>
                <div class="sl-bento__ig-thumb">
                    <img src="<?php echo SL_URI; ?>/assets/img/instagram-2.jpg" alt="IG preview 2">
                </div>
            </div>

        </div>
    </div>
</section>


<!-- ═══════════════════════════════════════════
     SHOP
═══════════════════════════════════════════ -->
<section id="shop" class="sl-shop">
    <div class="sl-container">

        <div class="sl-shop-header">
            <div class="sl-shop-header__left">
                <span class="sl-label sl-label--primary">Limited Release</span>
                <h2 class="sl-shop-title">
                    THE<br>SPIRITED<br><span class="sl-text--gold">SHOP</span>
                </h2>
            </div>
            <div class="sl-shop-header__right">
                <p class="sl-shop-sub">Every purchase fuels our local community events and spiritual outreach.</p>
                <div class="sl-shop-line"></div>
            </div>
        </div>

        <div class="sl-shop-grid">
            <?php
            if (class_exists('WooCommerce')) {
                echo do_shortcode('[products limit="4" columns="2" orderby="date" order="DESC"]');
            } else { ?>
                <div class="sl-shop-notice">
                    <p>Shop launching soon — powered by Printify &amp; WooCommerce.</p>
                    <a href="#contact" class="sl-btn sl-btn--primary sl-btn--sm">Get Notified →</a>
                </div>
            <?php } ?>
        </div>

    </div>
</section>


<!-- ═══════════════════════════════════════════
     CONTACT / JOIN
═══════════════════════════════════════════ -->
<section id="contact" class="sl-section sl-section--primary">
    <div class="sl-container">
        <div class="sl-contact">
            <h2 class="sl-contact__title">Ready to join the mission?</h2>
            <p class="sl-contact__sub">Connect with young Catholics across Santa Barbara &amp; Ventura Counties.</p>
            <form class="sl-contact__form" id="sl-contact-form" novalidate>
                <div class="sl-contact__row">
                    <input type="text"  name="name"  placeholder="Your name"    class="sl-input" required>
                    <input type="email" name="email" placeholder="Email address" class="sl-input" required>
                </div>
                <textarea name="message" placeholder="Tell us a bit about yourself (optional)" class="sl-input sl-input--textarea" rows="3"></textarea>
                <button type="submit" class="sl-btn sl-btn--white">Send →</button>
                <p class="sl-contact__status" id="sl-contact-status" aria-live="polite"></p>
            </form>
        </div>
    </div>
</section>


<!-- ═══════════════════════════════════════════
     BOTTOM BANNER — dark scroll
═══════════════════════════════════════════ -->
<div class="sl-bottom-banner" aria-hidden="true">
    <div class="sl-bottom-banner__track">
        <?php for ($i = 0; $i < 8; $i++) { ?>
            <span class="sl-bottom-banner__text">Coastal Faith</span>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#C05A3F" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span class="sl-bottom-banner__text sl-bottom-banner__text--gold">Community Joy</span>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M10 21c0-1.9-.4-3.5-1.2-4.7-.8-1.2-1.9-2.2-3.4-3V9.5c0-.8.6-1.5 1.4-1.5.5 0 1 .3 1.2.8l.7 1.6c.3.6 1 .9 1.6.7.5-.2.8-.6.8-1.1V5.3c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3V10c0 .4.3.8.7 1 .6.2 1.3-.1 1.6-.7l.7-1.6c.2-.5.7-.8 1.2-.8.8 0 1.4.7 1.4 1.5V13c-1.5.8-2.6 1.8-3.4 3-.8 1.2-1.2 2.8-1.2 4.7M8.2 16.4l1.7-2.1M15.8 16.4l-1.7-2.1"/></svg>
        <?php } ?>
    </div>
</div>


<!-- ═══════════════════════════════════════════
     FOOTER
═══════════════════════════════════════════ -->
<footer class="sl-footer">
    <div class="sl-container">
        <div class="sl-footer__top">

            <div class="sl-footer__brand">
                <div class="sl-footer__brand-name">
                    <img src="https://mlptyjrdcsxoojvszlbn.supabase.co/storage/v1/object/public/SLWeb/logo%20white.png" alt="Spirited Lamb" height="40" onerror="this.style.display='none'">
                    <div>
                        <p class="sl-footer__name">Spirited Lamb</p>
                        <p class="sl-footer__est-tag">Est. 2023</p>
                    </div>
                </div>
                <p class="sl-footer__tagline">Authentic Catholic community for young adults in Santa Barbara &amp; Ventura Counties.</p>
            </div>

            <div class="sl-footer__cols">
                <div class="sl-footer__col">
                    <h5>Social</h5>
                    <a href="https://www.instagram.com/spirited_lamb" target="_blank" rel="noopener">Instagram</a>
                    <a href="https://www.youtube.com/channel/UCA0oFV-X0qWrbFmgHo4lvaA" target="_blank" rel="noopener">YouTube</a>
                </div>
                <div class="sl-footer__col">
                    <h5>Contact</h5>
                    <a href="mailto:emily@spiritedlamb.com">Email</a>
                    <a href="#contact">Join Now</a>
                </div>
            </div>
        </div>

        <div class="sl-footer__bottom">
            <p>&copy; <?php echo date('Y'); ?> Spirited Lamb. All rights reserved.</p>
            <div class="sl-footer__legal">
                <span>Privacy</span>
                <span>Terms</span>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
