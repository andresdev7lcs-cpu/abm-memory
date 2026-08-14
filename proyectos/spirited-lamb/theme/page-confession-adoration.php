<?php
/**
 * Template Name: Confession & Adoration
 */
if (!defined('ABSPATH')) exit;

$county_sections = [
    [
        'eyebrow' => 'Ventura County',
        'title' => 'Ventura County',
        'parishes' => [
            [
                'name' => 'Mission Basilica San Buenaventura',
                'address' => '211 E. Main St, Ventura',
                'confession' => 'Saturday, 4pm',
                'adoration' => 'Monday 6am to Thursday 6am',
                'link' => 'https://www.sanbuenaventuramission.org/',
                'ya' => 'Elwin Arroyo — youngadults@sanbuenaventuramission.org',
            ],
            [
                'name' => 'Our Lady of Assumption',
                'address' => '3175 Telegraph Rd, Ventura',
                'confession' => 'Monday 8:30am & Wednesday 5:30pm & Saturday 8:30am',
                'adoration' => 'Tuesday morning to Sunday noon',
                'link' => 'https://www.olaventura.com/Eucharistic-Adoration',
                'ya' => 'Anya Kewley & Jack Cooper — youngadults@ola-vta.org',
            ],
            [
                'name' => 'Sacred Heart Church',
                'address' => '10800 Henderson Road, Ventura',
                'confession' => 'Friday 5:00pm to 7:00pm',
                'adoration' => 'Friday 9am to Saturday 8:30am',
                'link' => 'https://sacredheartventura.org/',
                'ya' => 'Jesse Valdovinos — jvaldovinos@stjohnsem.edu',
            ],
            [
                'name' => 'Mary Star of the Sea',
                'address' => '463 West Pleasant Valley Road, Oxnard',
                'confession' => 'Wednesdays 4:00-4:45pm & Saturdays 4:00-4:45pm, 6:00-6:45pm',
                'adoration' => 'Daily 6am to 7:30pm',
                'link' => 'https://marystaroxnard.com/adoration/',
            ],
            [
                'name' => 'Santa Clara Church',
                'address' => '323 S E St., Oxnard',
                'confession' => 'Wednesday 6:30pm to 7:45pm',
                'adoration' => 'Wednesday 6pm to 8pm',
                'link' => 'https://santaclaraparish.org/events/-adoration-of-the-blessed-sacrament-',
                'ya' => 'Ashley Ramirez — connectingcatholics@gmail.com',
            ],
            [
                'name' => 'St. Anthony Church',
                'address' => '2511 S. "C" Street, Oxnard',
                'confession' => 'Friday 6:30pm',
                'adoration' => 'Friday 6 to 8pm',
                'link' => 'https://stanthonyoxnard.org/',
                'ya' => 'Andrea Ramirez — @stanthonyoxnardya (Instagram, no email on file)',
            ],
            [
                'name' => 'Our Lady of Guadalupe Church',
                'address' => '500 North Juanita Avenue, Oxnard',
                'confession' => 'Thursday & Friday 4:30-6:30pm',
                'adoration' => 'Thursday & Friday 5-7pm',
                'link' => 'https://www.olgoxnard.org/hours-of-operation',
                'ya' => 'Carter & Railene Farrier — lenefarrier@icloud.com',
            ],
            [
                'name' => 'St. Mary Magdalen Chapel',
                'address' => '2532 Ventura Blvd., Camarillo',
                'confession' => 'Wednesday 4pm to 5pm',
                'adoration' => 'Monday-Friday 1pm to 10pm',
                'link' => 'https://www.smmcam.org/mass',
            ],
            [
                'name' => 'Padre Serra Church',
                'address' => '5205 Upland Road, Camarillo',
                'confession' => 'Saturday 3:30-4:30pm',
                'adoration' => 'First Friday 2pm to 7pm',
                'link' => 'https://www.padreserra.org/adoration.html',
                'ya' => 'Brett Becker — brett@padreserra.org',
            ],
            [
                'name' => 'St. Paschal Babylon',
                'address' => '155 East Janss Road, Thousand Oaks',
                'confession' => 'Saturday 3:30-5pm',
                'adoration' => 'Daily 6am to 10pm',
                'link' => 'https://stpaschal.org/adoration-chapel',
            ],
            [
                'name' => 'St. Thomas Aquinas Church',
                'address' => '185 St. Thomas Drive, Ojai',
                'confession' => 'Saturday 3:30-4:30pm',
                'adoration' => 'Thursday 9:30am to Saturday 7:45am',
                'link' => 'https://stacojai.org/news-events/calendars/liturgy-sacrament-calendar',
            ],
            [
                'name' => 'St. Sebastian Church, Santa Paula',
                'address' => '235 N. Ninth St, Santa Paula',
                'confession' => 'Saturday 4-5pm',
                'adoration' => 'Friday 8:15am to Saturday 8am',
                'link' => 'https://stsebastiansp.com/adoration',
            ],
        ],
    ],
    [
        'eyebrow' => 'Santa Barbara County',
        'title' => 'Santa Barbara County',
        'parishes' => [
            [
                'name' => 'St. Joseph Church',
                'address' => '1500 Linden Ave, Carpinteria',
                'confession' => 'Saturday 4-5pm',
                'adoration' => 'Monday 7-8pm & Thursday 9-10am',
                'link' => 'https://stjosephchurch.org/',
                'ya' => 'Jackie Pacheco — jackie@stjosephchurch.org',
            ],
            [
                'name' => 'Our Lady of Mount Carmel',
                'address' => '1300 E Valley Rd, Santa Barbara',
                'confession' => 'Saturday 3:30-4:15pm',
                'adoration' => 'Wednesday 3:30-6pm',
                'link' => 'https://www.mtcarmelsb.com/index.cfm?&secure',
                'ya' => 'Sarah Mac — sarahm@mtcarmelsb.com',
            ],
            [
                'name' => 'Our Lady of Sorrows',
                'address' => '21 E. Sola St, Santa Barbara',
                'confession' => 'Tuesday 6-7pm',
                'adoration' => 'Tuesday 6-7pm',
                'link' => 'https://our-lady-of-sorrows-santa-barbara.com/mass-schedule',
                'ya' => 'Zac Gonzalez — zacgonzalez@ymail.com',
            ],
            [
                'name' => 'St. Raphael Church',
                'address' => '5444 Hollister Ave, Santa Barbara',
                'confession' => 'Saturday 4-5pm',
                'adoration' => 'First Friday 8am to 8am',
                'link' => 'https://straphaelsb.org/eucharistic-adoration',
                'ya' => 'Anna Catherine Reed — acreed@straphaelsb.org',
            ],
            [
                'name' => "St. Mark's Church",
                'address' => '6550 Picasso Rd, Isla Vista',
                'confession' => 'Tuesday & Thursday 4-5pm',
                'adoration' => 'Tuesday & Thursday 4-5pm',
                'link' => 'https://saint-marks.net/adoration',
            ],
            [
                'name' => 'Mission Santa Ines',
                'address' => '1760 Mission Drive, Solvang',
                'confession' => 'Saturday 3-5pm',
                'adoration' => 'Monday-Friday 6am to 10pm',
                'link' => 'https://missionsantaines.org/adoration',
                'ya' => 'Aaron Eggman — eggmanaa@gmail.com',
            ],
            [
                'name' => 'St. Louis de Montefort',
                'address' => '1190 East Clark Ave, Santa Maria',
                'confession' => 'Saturday 3:15-4:45pm & 8-9pm',
                'adoration' => 'Monday 8:30am to 12pm',
                'link' => 'https://sldm.org/mass-times/',
                'ya' => 'Hector & Alani Vasquez — solideo1673@gmail.com',
            ],
        ],
    ],
];

$schema_items = [];
$position = 1;
foreach ($county_sections as $county_section) {
    foreach ($county_section['parishes'] as $parish) {
        $schema_items[] = [
            '@type' => 'ListItem',
            'position' => $position++,
            'item' => [
                '@type' => 'Church',
                'name' => $parish['name'],
                'address' => [
                    '@type' => 'PostalAddress',
                    'streetAddress' => $parish['address'],
                ],
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
    <title>Confession &amp; Adoration Ventura &amp; Santa Barbara County | Spirited Lamb</title>
    <meta name="description" content="Find Confession &amp; Adoration times across Ventura and Santa Barbara County Catholic parishes, with eucharistic adoration and young adult contacts.">
    <meta property="og:title" content="Confession &amp; Adoration Ventura &amp; Santa Barbara County | Spirited Lamb">
    <meta property="og:description" content="Browse Catholic confession times, eucharistic adoration, and young adult parish contacts across Ventura and Santa Barbara County.">
    <meta property="og:url" content="<?php echo esc_url(home_url('/confession-adoration/')); ?>">
    <meta property="og:image" content="<?php echo esc_url(SL_URI . '/assets/img/hero-1.jpg'); ?>">
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
        <span class="sl-resource-section__eyebrow">Local Parish Guide</span>
        <h1>Confession &amp; Adoration — Ventura &amp; Santa Barbara County</h1>
        <p>Find Catholic confession times, Eucharistic adoration, and young adult parish contacts across Ventura and Santa Barbara County in one place.</p>
    </div>
</section>

<?php foreach ($county_sections as $county_section) : ?>
<section class="sl-resource-section">
    <div class="sl-container">
        <span class="sl-resource-section__eyebrow">County Guide</span>
        <h2><?php echo esc_html($county_section['title']); ?></h2>
        <div class="sl-parish-grid">
            <?php foreach ($county_section['parishes'] as $parish) : ?>
                <article class="sl-parish-card">
                    <h3 class="sl-parish-card__name"><?php echo esc_html($parish['name']); ?></h3>
                    <p class="sl-parish-card__address"><?php echo esc_html($parish['address']); ?></p>
                    <div class="sl-parish-card__times">
                        <div class="sl-parish-card__times-row">
                            <span>Confession</span>
                            <p><?php echo esc_html($parish['confession']); ?></p>
                        </div>
                        <div class="sl-parish-card__times-row">
                            <span>Adoration</span>
                            <p><?php echo esc_html($parish['adoration']); ?></p>
                        </div>
                    </div>
                    <?php if (!empty($parish['ya'])) : ?>
                        <p class="sl-parish-card__ya">Young Adults: <?php echo esc_html($parish['ya']); ?></p>
                    <?php endif; ?>
                    <a href="<?php echo esc_url($parish['link']); ?>" target="_blank" rel="noopener" class="sl-parish-card__link">
                        Visit <?php echo esc_html($parish['name']); ?> &rarr;
                    </a>
                </article>
            <?php endforeach; ?>
        </div>
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
