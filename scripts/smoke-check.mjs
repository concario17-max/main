import { readFile } from 'node:fs/promises';
import { cards } from '../src/data/cards.js';
import { cardIcons } from '../src/data/cardIcons.js';
import { SITE } from '../src/lib/site.js';

const checks = [];

const addCheck = (condition, message) => {
    checks.push({ condition, message });
};

const assertChecks = () => {
    const failures = checks.filter(({ condition }) => !condition);

    if (failures.length) {
        failures.forEach(({ message }) => {
            console.error(`FAIL: ${message}`);
        });

        process.exit(1);
    }

    checks.forEach(({ message }) => {
        console.log(`PASS: ${message}`);
    });
};

const extractTagContent = (html, tagName) => html
    .match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}>`, 'i'))?.[1]
    ?.replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const main = async () => {
    const [
        cardsJs,
        indexHtml,
        manifestJson,
        robotsTxt,
        sitemapXml,
        headersTxt,
        renderCardsJs,
        cardEffectsJs,
        stardustJs,
        mainJs,
        entryGateJs,
        storageJs,
    ] = await Promise.all([
        readFile(new URL('../src/data/cards.js', import.meta.url), 'utf8'),
        readFile(new URL('../index.html', import.meta.url), 'utf8'),
        readFile(new URL('../public/manifest.json', import.meta.url), 'utf8'),
        readFile(new URL('../public/robots.txt', import.meta.url), 'utf8'),
        readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8'),
        readFile(new URL('../public/_headers', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/renderCards.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/cardEffects.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/stardust.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/main.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/entryGate.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/storage.js', import.meta.url), 'utf8'),
    ]);

    const expectedCardCopy = [
        {
            slug: 'celestial-ephemeris',
            label: '오컬트 주역 천체 관측소',
            description: '헤르메스학적 주역, 프란츠 바르돈의 소환마법실천, 루돌프 슈타이너의 영혼 달력을 엮은 영성 달력입니다. 시간을 날짜가 아니라 상징, 수행, 내면 성찰의 리듬으로 읽게 합니다. 일상 속에서 우주적 질서와 영혼의 변화를 함께 관조하려는 이들을 위한 안내서입니다.',
            cta: 'Enter the Archive',
        },
        {
            slug: 'sutra-exegesis',
            label: '파탄잘리 요가 수트라',
            description: '요가수트라(Yoga Sutras of Patanjali)는 고대 요가의 근원이 되는 문헌으로서 기원전 2세기 파탄잘리가 저술했다. 인도 철학에서 요가는 6대 철학학파 중 하나였고, 이 짧은 작품은 요가 철학과 수행 전통에 큰 영향을 주었다. 여기서 요가는 생각과 느낌이 확실히 유지되는 마음의 상태이며, 수트라는 줄이라는 뜻이다.',
            cta: 'Unveil the Sutras',
        },
        {
            slug: 'divine-song',
            label: '바가바드 기타',
            description: '바가바드 기타(산스크리트어: भगवद् गीता Bhagavad Gītā)는 성스러운 신에 대한 기타(Gita:歌頌)라는 뜻이며, 기원전 4∼2·3세기경에 성립된 것으로 여겨진다. 현재는 《마하바라타》 속에 수록되어 있으나 원래는 별개의 것으로 성립되었던 것이다. 인도에서는 평상시에 늘 암송할 정도로 사람들에게 친숙해져 있다.',
            cta: 'Hear the Song',
        },
        {
            slug: 'eternal-liberation',
            label: '티베트 사자의 서',
            description: '바르도 퇴돌(티베트어: བར་དོ་ཐོས་གྲོལ, 와일리 표기법: bar do thos grol)은 티베트 불교 닝마파의 경전이다. 파드마삼바바가 저술해 제자가 산중에 묻어 숨긴 것을 후대에 테르톤 업 림프액이 발굴한 매장교법(테르마) 《사프츄우 시트 곤파 란돌(적정·분노백존을 명상 하는 것에 의한 스스로의 해탈)》에 포함되어 있는 《바르드 트 달러 첸모(중유에 대해 청문 하는 것에 의한 해탈)》라는 문구를 가리킨다.',
            cta: 'Cross the Bardo',
        },
        {
            slug: 'threefold-luminaries',
            label: '밀교의 성불 원리',
            description: '티베트 대장경에는 밀교부에 해당하는 방대하고 다양한 경전과 논서가 전한다. 그중 책의 원전인 〈시이꾸쑴기남샥랍쌜된메(因位三身行相明燈論) 〉는 ‘닦지 않은 상태’를 뜻하는 인위(因位)의 단계에서 ‘중생의 마음 흐름[心流注]’에 존재하는 부처님의 삼신[法身·報身·化身]의 상태구조를 드러내 법의 의혹을 제거한 뒤, 법을 성취하는 심오한 길을 바르게 여는 등불이라는 의미의 논서다.',
            cta: 'Open the Treatise',
        },
        {
            slug: 'bori-dodeunglon',
            label: '보리도등론',
            description: '보리도등론(菩提道燈論, Bodhipathapradīpa)은 11세기 인도 스승 아띠샤(Atīśa)가 지은 68게송의 짧은 논서로, 깨달음으로 가는 길을 비추는 등불이라는 뜻을 지닌다. 이 문헌은 티베트 불교의 핵심 수행 체계인 보리도차제(菩提道次第)의 사상적 기초가 된 중요한 텍스트다.',
            cta: 'Read the Treatise',
        },
        {
            slug: 'nag-hammadi-library',
            label: '나그함마디 문서',
            description: '나그함마디 문서(Nag Hammadi library)는 1945년 이집트 나그함마디 마을 근처에서 발견된 초기 기독교 영지주의 복음서들을 가리키는 낱말이다. 발견된 나그함마디 문서에는 영지주의 문서 52편, 헤르메스주의 문헌(Hermetica · 헤르메티카)의 문서 3편, 그리고 플라톤의 《국가》의 번역본이 포함되어 있었다.',
            cta: 'Open the Library',
        },
        {
            slug: 'item-archive',
            label: '아이템 아카이브',
            description: 'items.simsang.org에 모아 둔 항목 아카이브입니다.',
            cta: 'Open the Archive',
        },
    ];

    addCheck(cards.length > 0, 'Card data includes at least one entry');
    addCheck(new Set(cards.map(({ href }) => href)).size === cards.length, 'Card links are unique');
    addCheck(cards.every(({ href }) => href.startsWith('https://')), 'Card links use HTTPS');
    addCheck(cards.every(({ slug, icon }) => slug && typeof slug === 'string' && typeof icon === 'function'), 'Each card has a valid slug and icon factory');
    addCheck(cards.every(({ index, portal, heading, copy }) => index && portal && heading?.main && heading?.accent && copy?.label && copy?.description && copy?.cta), 'Each card contains the required structured fields');
    addCheck(new Set(cards.map(({ slug }) => slug)).size === cards.length, 'Card slugs are unique');
    addCheck(cards.every(({ icon }) => Object.values(cardIcons).includes(icon)), 'Cards use shared icon definitions');
    addCheck(cards.filter(({ featured }) => featured).length <= 1, 'At most one featured card exists');
    addCheck(cards.every(({ tone }) => ['celestial', 'sutra', 'divine', 'liberation', 'trinity'].includes(tone)), 'Each card uses a supported tone');
    addCheck(cards.some(({ href }) => href === 'https://3sin.simsang.org/'), 'Threefold card link is present');
    addCheck(cards.some(({ href }) => href === 'https://bori.simsang.org/'), 'Bori card link is present');
    addCheck(cards.some(({ slug, href, heading }) => slug === 'nag-hammadi-library' && href === 'https://nag.simsang.org/' && heading.main === 'Gnostic' && heading.accent === 'Library'), 'Nag Hammadi card is present');
    addCheck(cards.some(({ slug, href, heading }) => slug === 'item-archive' && href === 'https://items.simsang.org/' && heading.main === 'Item' && heading.accent === 'Archive'), 'Item Archive card is present');
    addCheck(!cardsJs.includes('\uFFFD'), 'Card source text contains no replacement characters');
    expectedCardCopy.forEach(({ slug, label, description, cta }) => {
        const card = cards.find(({ slug: cardSlug }) => cardSlug === slug);

        addCheck(card?.copy?.label === label, `${slug} label matches the restored copy`);
        addCheck(card?.copy?.description === description, `${slug} description matches the restored copy`);
        addCheck(card?.copy?.cta === cta, `${slug} CTA matches the restored copy`);
    });

    addCheck(indexHtml.includes(`<title>${SITE.title}</title>`), 'Title uses the shared site constant');
    addCheck(indexHtml.includes(`name="description" content="${SITE.description}"`), 'Meta description uses the shared site constant');
    addCheck(indexHtml.includes(`link rel="canonical" href="${SITE.canonicalUrl}"`), 'Canonical URL is declared');
    addCheck(indexHtml.includes(`link rel="manifest" href="${SITE.manifestPath}"`), 'Manifest link uses the shared site constant');
    addCheck(indexHtml.includes('name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"'), 'Robots meta is declared');
    addCheck(indexHtml.includes(`property="og:title" content="${SITE.title}"`), 'OG title uses the shared site constant');
    addCheck(indexHtml.includes(`property="og:description" content="${SITE.description}"`), 'OG description uses the shared site constant');
    addCheck(indexHtml.includes(`property="og:url" content="${SITE.canonicalUrl}"`), 'OG URL uses the canonical site URL');
    addCheck(indexHtml.includes(`property="og:image" content="${SITE.ogImageUrl}"`), 'OG image is declared');
    addCheck(indexHtml.includes('name="twitter:card" content="summary_large_image"'), 'Twitter card is declared');
    addCheck(indexHtml.includes('name="color-scheme" content="light"'), 'Light-only color scheme is declared');
    addCheck(indexHtml.includes(`meta name="theme-color" content="${SITE.themeColor}"`) || indexHtml.includes(`name="theme-color" content="${SITE.themeColor}"`), 'Theme color matches the light brand');
    addCheck(indexHtml.includes('id="page-title"'), 'Hero title is present');
    addCheck(extractTagContent(indexHtml, 'h1') === 'Simsang Archive', 'Hero headline is concise');
    addCheck(indexHtml.includes('aria-labelledby="archive-heading"'), 'Archive section is labeled');
    addCheck(/<ul\b[^>]*id="cards-grid"/i.test(indexHtml), 'Cards grid uses a list structure');
    addCheck(indexHtml.includes('<h2 id="archive-heading" class="sr-only">Archive links</h2>'), 'Archive section has a semantic heading');
    addCheck(indexHtml.includes('class="ui-pill"'), 'Header pills remain present');

    addCheck(manifestJson.includes(`"name": "${SITE.name}"`), 'Manifest uses the shared site name');
    addCheck(manifestJson.includes(`"short_name": "${SITE.shortName}"`), 'Manifest uses the shared short name');
    addCheck(manifestJson.includes(`"description": "${SITE.description}"`), 'Manifest description matches the site description');
    addCheck(manifestJson.includes('"display": "standalone"'), 'Manifest stays standalone');
    addCheck(manifestJson.includes(`"background_color": "${SITE.backgroundColor}"`), 'Manifest background stays light');
    addCheck(manifestJson.includes(`"theme_color": "${SITE.themeColor}"`), 'Manifest theme stays light');

    addCheck(robotsTxt.includes('User-agent: *'), 'Robots.txt allows all user agents');
    addCheck(robotsTxt.includes('Allow: /'), 'Robots.txt allows the site root');
    addCheck(robotsTxt.includes(`Sitemap: ${SITE.url}${SITE.sitemapPath}`), 'Robots.txt references the sitemap');

    addCheck(sitemapXml.includes(`<loc>${SITE.canonicalUrl}</loc>`), 'Sitemap includes the canonical URL');
    addCheck(sitemapXml.includes('<changefreq>weekly</changefreq>'), 'Sitemap declares a sensible change frequency');

    addCheck(headersTxt.includes("X-Frame-Options: DENY"), 'Security headers deny framing');
    addCheck(headersTxt.includes("X-Content-Type-Options: nosniff"), 'Security headers prevent MIME sniffing');
    addCheck(headersTxt.includes("Referrer-Policy: strict-origin-when-cross-origin"), 'Security headers tighten referrer leakage');
    addCheck(headersTxt.includes("Permissions-Policy: camera=(), geolocation=(), microphone=(), payment=(), usb=()"), 'Security headers lock down high-risk browser APIs');
    addCheck(headersTxt.includes("Content-Security-Policy: default-src 'self'"), 'Security headers include a CSP baseline');
    addCheck(headersTxt.includes("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com"), 'CSP allows the bundled styles and font stylesheet');
    addCheck(headersTxt.includes("font-src 'self' https://fonts.gstatic.com"), 'CSP allows Google font assets');

    addCheck(renderCardsJs.includes('<li class="archive-grid__item">'), 'Card renderer emits list items');
    addCheck(renderCardsJs.includes('premium-card__topline'), 'Card renderer includes portal topline markup');
    addCheck(renderCardsJs.includes('premium-card__cta-target'), 'Card renderer exposes a dedicated CTA behavior hook');
    addCheck(renderCardsJs.includes('ui-card premium-card'), 'Card renderer makes cards fill the grid cell');

    addCheck(mainJs.includes('initEntryGate();'), 'Main entry initializes the password gate');
    addCheck(!mainJs.includes('initThemeToggle'), 'Main entry no longer initializes theme toggling');
    addCheck(entryGateJs.includes("const unlockCode = '0228';"), 'Entry gate uses the configured unlock code');
    addCheck(entryGateJs.includes('getPersistentValue(storageKey)'), 'Entry gate reads persistent unlock state through the shared storage helper');
    addCheck(entryGateJs.includes('setPersistentValue(storageKey, unlockCode'), 'Entry gate persists unlock state through the shared storage helper');
    addCheck(entryGateJs.includes('element.inert = locked;'), 'Entry gate locks the underlying app shell');
    addCheck(entryGateJs.includes('gate.remove();'), 'Entry gate removes itself after unlock');
    addCheck(entryGateJs.includes("event.key !== 'Tab'"), 'Entry gate traps keyboard focus');
    addCheck(storageJs.includes('document.cookie'), 'Shared storage helper uses cookie fallback');
    addCheck(!cardEffectsJs.includes("querySelector('.mt-auto')"), 'Card effects no longer depend on utility classes for behavior');
    addCheck(cardEffectsJs.includes("querySelector('.premium-card__cta-target')"), 'Card effects use a dedicated CTA behavior hook');
    addCheck(stardustJs.includes("prefers-reduced-motion: reduce"), 'Particle system honors reduced-motion preference');

    assertChecks();
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
