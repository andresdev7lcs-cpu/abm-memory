<?php
/**
 * Template Name: Faith Formation Media
 */
if (!defined('ABSPATH')) exit;

$media_sections = [
    [
        'eyebrow' => 'National Media',
        'title' => 'National Media',
        'items' => [
            [
                'name' => 'Pints with Aquinas',
                'desc' => 'Pints with Aquinas is an online Catholic community of faith and truth… and maybe a pint or two.',
                'link' => 'https://pintswithaquinas.com/',
            ],
            [
                'name' => 'The Counsel of Trent',
                'desc' => 'Trent Horn cuts through the noise with his entertaining and thought-provoking takes on faith, morality, and culture.',
                'link' => 'https://www.youtube.com/@TheCounselofTrent',
            ],
            [
                'name' => 'Dr. Scott Hahn',
                'desc' => 'Scott Hahn, author and speaker, is a leading expert on biblical theology and the Church\'s teachings.',
                'link' => 'https://www.scotthahn.com/',
            ],
            [
                'name' => 'Chastity Project',
                'desc' => 'Chastity Project promotes the virtue of chastity through seminars, resources, clubs, and social media.',
                'link' => 'https://chastity.com/',
            ],
            [
                'name' => 'How to Be Christian',
                'desc' => "How to be Christian teaches you about the topic of Christianity. Whether you're Christian or not Christian, this series welcomes you to learn about what Christianity is.",
                'link' => 'https://www.youtube.com/channel/UC_cZXWB6T4WRXyTZiyH_LDw',
            ],
            [
                'name' => 'Godsplaining',
                'desc' => 'Godsplaining delves into meaningful, faith-based discussions, shares personal stories, and explores the richness of Catholic faith and tradition.',
                'link' => 'https://godsplaining.org/',
            ],
            [
                'name' => 'Ascension Press',
                'desc' => 'Authentic Catholic faith formation videos and programs, bible study, Confirmation, and sacrament preparation.',
                'link' => 'https://ascensionpress.com/',
            ],
            [
                'name' => 'Fr. David Michael Moses',
                'desc' => 'Fr. David Michael Moses is a Roman Catholic priest and social media influencer.',
                'link' => 'https://www.fatherdavidmichael.com/',
            ],
            [
                'name' => 'Life is Worth Living',
                'desc' => 'Bishop Fulton Sheen\'s nationally syndicated program, Life is Worth Living, ran from 1951-1957, making Bishop Sheen the first to preach Christian values on TV.',
                'link' => 'https://www.bishopsheen.com/',
            ],
            [
                'name' => 'Sips with Serra',
                'desc' => 'Adrian Lawson presents Catholicism as a reasonable and beneficial alternative to the prevailing lifestyle.',
                'link' => 'https://www.youtube.com/@SipswithSerra/videos',
            ],
            [
                'name' => 'Brian Holdsworth',
                'desc' => 'Brian Holdsworth is a Catholic thinker, apologist, writer, speaker, and communication professional.',
                'link' => 'https://www.youtube.com/c/brianholdsworth',
            ],
            [
                'name' => 'Cameron Reicker',
                'desc' => 'Cameron Reicker explores the rich theological tradition and teachings of the Catholic Church.',
                'link' => 'https://www.youtube.com/@CameronRiecker/videos',
            ],
            [
                'name' => 'Religious Hippie',
                'desc' => "Amber Rose talks about everything from dating, to beginner's guides, to suffering, modesty, addictions, and controversial topics through the lens of Catholicism.",
                'link' => 'https://linktr.ee/thereligioushippie',
            ],
            [
                'name' => 'Word on Fire',
                'desc' => 'Word on Fire harnesses goodness, truth, and beauty to draw people into, or back to, Catholicism.',
                'link' => 'https://www.wordonfire.org/',
            ],
            [
                'name' => 'Uncatechized Catholic',
                'desc' => "Don't absorb Catholicism–engage with it. By making catechesis a priority, you can move from simple trust to intelligent opinions.",
                'link' => 'https://uncatechizedcatholic.com/',
            ],
            [
                'name' => 'The Catechumen',
                'desc' => 'Braydon Cook fosters a charitable environment that facilitates informative content ordered towards ecumenical dialogue between Catholics and Protestants.',
                'link' => 'https://www.youtube.com/@thecatechumen',
            ],
            [
                'name' => 'Lepanto',
                'desc' => 'Lepanto is a Catholic media project dedicated to creating artistic biblical imagery.',
                'link' => 'https://www.lepanto.xyz/',
            ],
        ],
    ],
    [
        'eyebrow' => 'Local Media',
        'title' => 'Local Media',
        'items' => [
            [
                'name' => '#LACatholics',
                'desc' => 'Inspiring stories about LA Catholics.',
                'link' => 'https://www.youtube.com/playlist?list=PLLdDEeGf6fy5WDMCrV_uxD_KJg-ZsrXiz',
            ],
            [
                'name' => 'Noelle Mering',
                'desc' => 'Noelle Mering is wife and mother of six in Southern California. She is the author of the book, Awake, Not Woke: A Christian Response to the Cult of Progressive Ideology and an editor for the website Theology of Home.',
                'link' => 'https://www.noellemering.com/',
            ],
            [
                'name' => 'Fresh Catholic',
                'desc' => 'A podcast giving a FRESH perspective of the Catholic faith with Lori Balderas.',
                'link' => 'https://www.freshcatholic.com/',
            ],
            [
                'name' => 'The Spirited Lamb Podcast',
                'desc' => 'Listen to recorded Tongues of Fire talks and interviews with members of our regional community with Don and Emily.',
                'link' => 'https://www.youtube.com/channel/UCA0oFV-X0qWrbFmgHo4lvaA',
            ],
            [
                'name' => 'Texting with the Saints',
                'desc' => "A podcast hosted by Santa Barbara Young Adult Catholic's leader, Anna Catherine.",
                'link' => 'https://creators.spotify.com/p/profile/textingwiththesaints/',
            ],
            [
                'name' => 'First Friday Talks',
                'desc' => 'A place to experience, or re-experience, the Saint Barbara Young Adult Catholic Ministry first Friday talks, and other worthwhile resources.',
                'link' => 'https://open.spotify.com/show/1Qd7PtjoAmjio3zQa5Jqos?si=M_MHtVhwTTSK1OsEzredFw&nd=1&dlsi=6375a66fdeb44679',
            ],
        ],
    ],
];

$schema_items = [];
$position = 1;
foreach ($media_sections as $media_section) {
    foreach ($media_section['items'] as $media_item) {
        $schema_items[] = [
            '@type' => 'ListItem',
            'position' => $position++,
            'item' => [
                '@type' => 'CreativeWork',
                'name' => $media_item['name'],
                'url' => $media_item['link'],
            ],
        ];
    }
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faith Formation Media: Catholic Creators &amp; Podcasts | Spirited Lamb</title>
    <meta name="description" content="Explore Catholic creators, podcasts, and faith formation media, including local Spirited Lamb resources and young adult parish links.">
    <meta property="og:title" content="Faith Formation Media: Catholic Creators &amp; Podcasts | Spirited Lamb">
    <meta property="og:description" content="Find Catholic creators, podcasts, and local media resources for faith formation and community connection.">
    <meta property="og:url" content="<?php echo esc_url(home_url('/faith-formation-media/')); ?>">
    <meta property="og:image" content="<?php echo esc_url(SL_URI . '/assets/img/hero-2.jpg'); ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700;900&display=swap" rel="stylesheet">
    <link rel="icon" href="https://mlptyjrdcsxoojvszlbn.supabase.co/storage/v1/object/public/SLWeb/logo%20black.png">
    <?php wp_head(); ?>
    <script type="application/ld+json">
        <?php echo wp_json_encode([
            '@context' => 'https://schema.org',
            '@type' => 'ItemList',
            'itemListElement' => $schema_items,
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>
    </script>
</head>
<body class="sl-body">

<header id="sl-navbar">
    <div class="sl-nav-inner">

        <a href="/#hero" class="sl-nav-logo">
            <img src="https://mlptyjrdcsxoojvszlbn.supabase.co/storage/v1/object/public/SLWeb/logo%20black.png" alt="Spirited Lamb" height="40" class="sl-nav-logo__img">
            <span class="sl-nav-logo__name">Spirited Lamb</span>
        </a>

        <nav class="sl-nav-links" aria-label="Main navigation">
            <a href="/#hero">Home</a>
            <a href="/#events">Events</a>
            <a href="/#media">Media</a>
            <a href="/#shop">Shop</a>
        </nav>

        <div class="sl-nav-actions">
            <a href="/#contact" class="sl-btn sl-btn--outline-nav">Contact</a>
            <a href="/#contact" class="sl-btn sl-btn--primary sl-btn--sm">Join Now</a>
        </div>

        <button class="sl-nav-burger" id="sl-burger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    </div>
</header>

<div class="sl-mobile-menu" id="sl-mobile-menu" aria-hidden="true">
    <button class="sl-mobile-close" id="sl-mobile-close" aria-label="Close menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <nav class="sl-mobile-nav">
        <a href="/#hero" class="sl-mobile-link">Home</a>
        <a href="/#events" class="sl-mobile-link">Events</a>
        <a href="/#media" class="sl-mobile-link">Media</a>
        <a href="/#shop" class="sl-mobile-link">Shop</a>
    </nav>
    <div class="sl-mobile-actions">
        <a href="/#contact" class="sl-btn sl-btn--primary">Join the Mission</a>
    </div>
</div>

<section class="sl-resource-hero">
    <div class="sl-container sl-resource-hero__inner">
        <span class="sl-resource-section__eyebrow">Catholic Media Guide</span>
        <h1>Faith Formation Media — Catholic Creators &amp; Podcasts</h1>
        <p>Discover Catholic voices, podcasts, and video channels that can deepen faith formation and connect you with local young adult community resources.</p>
    </div>
</section>

<?php foreach ($media_sections as $media_section) : ?>
<section class="sl-resource-section">
    <div class="sl-container">
        <span class="sl-resource-section__eyebrow"><?php echo esc_html($media_section['eyebrow']); ?></span>
        <h2><?php echo esc_html($media_section['title']); ?></h2>
        <div class="sl-media-grid">
            <?php foreach ($media_section['items'] as $media_item) : ?>
                <article class="sl-media-card">
                    <h3 class="sl-media-card__name"><?php echo esc_html($media_item['name']); ?></h3>
                    <p class="sl-media-card__desc"><?php echo esc_html($media_item['desc']); ?></p>
                    <a href="<?php echo esc_url($media_item['link']); ?>" target="_blank" rel="noopener" class="sl-media-card__link">Visit &rarr;</a>
                </article>
            <?php endforeach; ?>
        </div>
        <?php if ($media_section['eyebrow'] === 'Local Media') : ?>
            <p class="sl-resource-section__intro">Looking for a parish near you? Browse local <a href="/confession-adoration/">Confession &amp; Adoration times</a>, or download our <a href="<?php echo esc_url(SL_URI . '/assets/pdf/catholic-young-adult-directory.pdf'); ?>" target="_blank" rel="noopener">Catholic Young Adult Directory (PDF)</a>. You can also revisit the homepage's <a href="/#media">YouTube bento card</a>.</p>
        <?php endif; ?>
    </div>
</section>
<?php endforeach; ?>

<section class="sl-resource-cta">
    <div class="sl-container sl-resource-cta__inner">
        <h2 class="sl-resource-cta__title">Stay Connected</h2>
        <p class="sl-resource-cta__sub">Keep exploring the calendar for upcoming events, then join the community when you are ready to get involved.</p>
        <div class="sl-resource-cta__actions">
            <a href="/#events" class="sl-btn sl-btn--white-solid">See upcoming events &rarr;</a>
            <a href="/#contact" class="sl-btn sl-btn--glass">Join the community &rarr;</a>
        </div>
    </div>
</section>

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
                    <a href="/#contact">Join Now</a>
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

<?php wp_footer(); ?>
</body>
</html>
