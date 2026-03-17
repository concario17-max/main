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
    const [indexHtml, rootStyleCss, componentCss, effectsCss, animationCss, renderCardsJs, cardEffectsJs, stardustJs] = await Promise.all([
        readFile(new URL('../index.html', import.meta.url), 'utf8'),
        readFile(new URL('../src/style.css', import.meta.url), 'utf8'),
        readFile(new URL('../src/styles/components.css', import.meta.url), 'utf8'),
        readFile(new URL('../src/styles/effects.css', import.meta.url), 'utf8'),
        readFile(new URL('../src/styles/animations.css', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/renderCards.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/cardEffects.js', import.meta.url), 'utf8'),
        readFile(new URL('../src/modules/stardust.js', import.meta.url), 'utf8'),
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
    addCheck(cards.every(({ tone }) => ['celestial', 'sutra', 'divine', 'liberation'].includes(tone)), 'Each card uses a supported tone');

    addCheck(indexHtml.includes('id="theme-toggle"'), 'Theme toggle button exists');
    addCheck(indexHtml.includes('aria-label="Toggle color theme"'), 'Theme toggle has an accessibility label');
    addCheck(indexHtml.includes('id="cards-grid"'), 'Cards grid container exists');
    addCheck(indexHtml.includes('점성, 요가, 기타, 사자의 서를 잇는 살아 있는 포털'), 'Header support copy is present');
    addCheck(indexHtml.includes('header-pill'), 'Header portal pills are present');
    addCheck(indexHtml.includes('점성, 요가 수트라, 바가바드 기타, 티베트 사자의 서를 잇는 프리미엄 지혜 아카이브.'), 'Meta description is normalized');
    addCheck(indexHtml.includes('property="og:locale" content="ko_KR"'), 'OG locale is present');
    addCheck(indexHtml.includes('property="og:image:width" content="1200"'), 'OG image width is declared');
    addCheck(indexHtml.includes('property="og:image:height" content="630"'), 'OG image height is declared');
    addCheck(indexHtml.includes('property="og:image:alt"'), 'OG image alt text is declared');
    addCheck(!indexHtml.includes('portal-overlay'), 'Unused portal overlay has been removed');
    addCheck(!indexHtml.includes('onclick='), 'Inline event handlers have been removed');
    addCheck(!indexHtml.includes('네 개'), 'Header copy does not hardcode a fixed card count');
    addCheck(!indexHtml.includes('Four'), 'Meta copy does not hardcode a fixed card count in English');

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
    addCheck(!componentCss.includes('nth-child'), 'Component styles do not depend on nth-child card ordering');
    addCheck(cards.every(({ delayClass }) => animationCss.includes(`.${delayClass}`)), 'All card delay classes map to defined animations');

    assertChecks();
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
