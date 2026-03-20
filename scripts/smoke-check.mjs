import { readFile } from 'node:fs/promises';
import { cards } from '../src/data/cards.js';
import { cardIcons } from '../src/data/cardIcons.js';

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

const main = async () => {
    const [
        indexHtml,
        manifestJson,
        rootStyleCss,
        componentCss,
        effectsCss,
        animationCss,
        renderCardsJs,
        cardEffectsJs,
        stardustJs,
        mainJs,
        entryGateJs,
        themeJs,
        storageJs,
    ] = await Promise.all([
        readFile(new URL('../index.html', import.meta.url), 'utf8'),
        readFile(new URL('../public/manifest.json', import.meta.url), 'utf8'),
        readFile(new URL('../src/style.css', import.meta.url), 'utf8'),
        readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8'),
        readFile(new URL('../src/styles/effects.css', import.meta.url), 'utf8'),
        readFile(new URL('../src/styles/animations.css', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/renderCards.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/cardEffects.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/stardust.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/main.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/entryGate.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/theme.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/storage.js', import.meta.url), 'utf8'),
    ]);

    addCheck(cards.length > 0, 'Card data includes at least one entry');
    addCheck(new Set(cards.map(({ href }) => href)).size === cards.length, 'Card links are unique');
    addCheck(cards.every(({ href }) => href.startsWith('https://')), 'Card links use HTTPS');
    addCheck(
        cards.every(({ slug, icon }) => slug && typeof slug === 'string' && typeof icon === 'function'),
        'Each card has a valid slug and icon factory',
    );
    addCheck(
        cards.every(({ index, portal, heading, copy }) => (
            index
            && portal
            && heading?.main
            && heading?.accent
            && copy?.label
            && copy?.description
            && copy?.cta
        )),
        'Each card contains the required structured fields',
    );
    addCheck(new Set(cards.map(({ slug }) => slug)).size === cards.length, 'Card slugs are unique');
    addCheck(cards.every(({ icon }) => Object.values(cardIcons).includes(icon)), 'Cards use shared icon definitions');
    addCheck(cards.filter(({ featured }) => featured).length <= 1, 'At most one featured card exists');
    addCheck(cards.every(({ tone }) => ['celestial', 'sutra', 'divine', 'liberation', 'trinity'].includes(tone)), 'Each card uses a supported tone');
    addCheck(cards.some(({ href }) => href === 'https://3sin.simsang.org/'), 'Threefold card link is present');
    addCheck(cards.some(({ copy }) => copy.label === '밀교의 성불 원리'), 'Samshin card label is normalized');

    addCheck(indexHtml.includes('id="theme-toggle"'), 'Theme toggle button exists');
    addCheck(indexHtml.includes('id="entry-gate"'), 'Entry gate dialog exists');
    addCheck(indexHtml.includes('id="entry-gate-input"'), 'Entry gate input exists');
    addCheck(indexHtml.includes('id="entry-gate-submit"'), 'Entry gate submit button exists');
    addCheck(indexHtml.includes('aria-label="Toggle color theme"'), 'Theme toggle has an accessibility label');
    addCheck(indexHtml.includes('aria-describedby="entry-gate-copy"'), 'Entry gate describes its supporting copy');
    addCheck(indexHtml.includes('id="archive-shell"'), 'Archive shell exists for gate state management');
    addCheck(indexHtml.includes('id="cards-grid"'), 'Cards grid container exists');
    addCheck(indexHtml.includes('A Living Portal for Astrology, Yoga, the Gita, Bardo Wisdom, and Samshin Doctrine'), 'Header support copy is present');
    addCheck(indexHtml.includes('밀교의 성불 원리'), 'Header pills use normalized Korean copy');
    addCheck(indexHtml.includes('property="og:locale" content="ko_KR"'), 'OG locale is present');
    addCheck(indexHtml.includes('property="og:image:width" content="1200"'), 'OG image width is declared');
    addCheck(indexHtml.includes('property="og:image:height" content="630"'), 'OG image height is declared');
    addCheck(indexHtml.includes('property="og:image:alt"'), 'OG image alt text is declared');
    addCheck(indexHtml.includes('깊이 읽는 지혜의 서고'), 'Share copy uses the normalized Korean title');
    addCheck(indexHtml.includes('오컬트 주역 천체 관측소, 파탄잘리 요가 수트라, 바가바드 기타, 티베트 사자의 서, 밀교의 성불 원리를 아우르는 프리미엄 지식 아카이브.'), 'Meta description is normalized');
    addCheck(indexHtml.includes('class="archive-grid w-full px-1 md:px-0 py-6 md:py-0"'), 'Cards grid uses the adaptive archive grid layout');
    addCheck(componentCss.includes('.archive-grid'), 'Adaptive archive grid styles exist');
    addCheck(!indexHtml.includes('portal-overlay'), 'Unused portal overlay has been removed');
    addCheck(!indexHtml.includes('onclick='), 'Inline event handlers have been removed');
    addCheck(!indexHtml.includes('Four Portals'), 'Meta copy does not hardcode a fixed card count in English');

    addCheck(manifestJson.includes('오컬트 주역 천체 관측소, 파탄잘리 요가 수트라, 바가바드 기타, 티베트 사자의 서, 밀교의 성불 원리를 아우르는 프리미엄 지식 아카이브.'), 'Manifest description matches current language policy');

    addCheck(rootStyleCss.includes("@import './styles/base.css';"), 'Style entry imports base.css');
    addCheck(rootStyleCss.includes("@import './styles/components.css';"), 'Style entry imports components.css');
    addCheck(rootStyleCss.includes("@import './styles/effects.css';"), 'Style entry imports effects.css');
    addCheck(rootStyleCss.includes("@import './styles/animations.css';"), 'Style entry imports animations.css');

    addCheck(animationCss.includes('.delay-700'), 'delay-700 animation utility exists');
    addCheck(animationCss.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion animation fallback exists');
    addCheck(effectsCss.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced-motion visual-effects fallback exists');
    addCheck(cardEffectsJs.includes("prefers-reduced-motion: reduce"), 'Card tilt honors reduced-motion preference');
    addCheck(stardustJs.includes("prefers-reduced-motion: reduce"), 'Particle system honors reduced-motion preference');

    addCheck(renderCardsJs.includes('premium-card__meta'), 'Card renderer uses explicit meta classes');
    addCheck(renderCardsJs.includes('premium-card__topline'), 'Card renderer includes portal topline markup');
    addCheck(renderCardsJs.includes('premium-card__cta-target'), 'Card renderer exposes a dedicated CTA behavior hook');
    addCheck(mainJs.includes('initEntryGate();'), 'Main entry initializes the password gate');
    addCheck(entryGateJs.includes("const unlockCode = '0228';"), 'Entry gate uses the configured unlock code');
    addCheck(entryGateJs.includes('getPersistentValue(storageKey)'), 'Entry gate reads persistent unlock state through the shared storage helper');
    addCheck(entryGateJs.includes('setPersistentValue(storageKey, unlockCode'), 'Entry gate persists unlock state through the shared storage helper');
    addCheck(entryGateJs.includes('element.inert = locked;'), 'Entry gate locks the underlying app shell');
    addCheck(entryGateJs.includes('gate.remove();'), 'Entry gate removes itself after unlock');
    addCheck(entryGateJs.includes("event.key !== 'Tab'"), 'Entry gate traps keyboard focus');
    addCheck(themeJs.includes('getPersistentValue(storageKey)'), 'Theme uses defensive persistent storage reads');
    addCheck(themeJs.includes('setPersistentValue(storageKey, nextTheme'), 'Theme uses defensive persistent storage writes');
    addCheck(storageJs.includes('document.cookie'), 'Shared storage helper uses cookie fallback');
    addCheck(!cardEffectsJs.includes("querySelector('.mt-auto')"), 'Card effects no longer depend on utility classes for behavior');
    addCheck(cardEffectsJs.includes("querySelector('.premium-card__cta-target')"), 'Card effects use a dedicated CTA behavior hook');
    addCheck(!componentCss.includes('nth-child'), 'Component styles do not depend on nth-child card ordering');
    addCheck(componentCss.includes('.entry-gate__panel'), 'Entry gate styles exist');
    addCheck(componentCss.includes('.premium-card__meta--trinity'), 'Trinity tone styles exist');
    addCheck(componentCss.includes('text-wrap: pretty;'), 'Compact card labels use improved wrapping');
    addCheck(cards.every(({ delayClass }) => animationCss.includes(`.${delayClass}`)), 'All card delay classes map to defined animations');

    assertChecks();
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
