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
    const [indexHtml, rootStyleCss, animationCss] = await Promise.all([
        readFile(new URL('../index.html', import.meta.url), 'utf8'),
        readFile(new URL('../src/style.css', import.meta.url), 'utf8'),
        readFile(new URL('../src/styles/animations.css', import.meta.url), 'utf8'),
    ]);

    addCheck(cards.length === 4, '카드 데이터가 4개다');
    addCheck(new Set(cards.map(({ href }) => href)).size === cards.length, '카드 링크가 중복되지 않는다');
    addCheck(cards.every(({ href }) => href.startsWith('https://')), '모든 카드 링크가 https를 사용한다');
    addCheck(cards.every(({ slug, heading, copy, icon }) => slug && heading?.main && heading?.accent && copy?.label && copy?.description && copy?.cta && typeof icon === 'function'), '모든 카드 데이터에 구조화된 필수 필드가 존재한다');
    addCheck(new Set(cards.map(({ slug }) => slug)).size === cards.length, '카드 slug가 중복되지 않는다');
    addCheck(cards.every(({ icon }) => Object.values(cardIcons).includes(icon)), '모든 카드 아이콘이 중앙 아이콘 모듈을 사용한다');

    addCheck(indexHtml.includes('id="theme-toggle"'), '테마 토글 버튼이 존재한다');
    addCheck(indexHtml.includes('aria-label="Toggle color theme"'), '테마 토글 버튼에 접근성 레이블이 있다');
    addCheck(indexHtml.includes('id="cards-grid"'), '카드 그리드 컨테이너가 존재한다');
    addCheck(!indexHtml.includes('portal-overlay'), '미사용 포털 오버레이가 제거됐다');
    addCheck(!indexHtml.includes('onclick='), 'inline 이벤트 핸들러가 제거됐다');

    addCheck(rootStyleCss.includes("@import './styles/base.css';"), '스타일 엔트리가 base.css를 불러온다');
    addCheck(rootStyleCss.includes("@import './styles/components.css';"), '스타일 엔트리가 components.css를 불러온다');
    addCheck(rootStyleCss.includes("@import './styles/effects.css';"), '스타일 엔트리가 effects.css를 불러온다');
    addCheck(rootStyleCss.includes("@import './styles/animations.css';"), '스타일 엔트리가 animations.css를 불러온다');
    addCheck(animationCss.includes('.delay-700'), 'delay-700 애니메이션 유틸리티가 존재한다');

    addCheck(cards.every(({ delayClass }) => animationCss.includes(`.${delayClass}`)), '모든 카드 delay 클래스가 애니메이션 정의와 연결된다');

    assertChecks();
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
