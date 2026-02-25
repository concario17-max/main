/**
 * Ray Standard 적용 (효율성 극대화 및 메타-디자인 지향)
 *
 * 1. 상태 돌연변이 차단 (Immutability).
 * 2. 리플로우(Reflow) 및 레이아웃 스래싱(Layout Thrashing) 빙지.
 * 3. 한국어 반말형 주석 (명사 기반 종결).
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 프리미엄 카드 스포트라이트 호버링 연산 최적화 (O(1) 캐싱)
    const cards = document.querySelectorAll('.premium-card');

    // 상태 관리를 위한 불변 객체 생성 (DOM 요소에 값 바인딩 회피)
    const state = {
        cardRects: new Map()
    };

    // 카드 크기와 위치를 캐싱하는 순수 함수
    const updateCardRects = () => {
        const newRects = new Map();
        cards.forEach(card => {
            newRects.set(card, card.getBoundingClientRect());
        });
        // 상태 직접 변경 대신 맵을 교체함 (Immutability)
        state.cardRects = newRects;
    };

    // 초기 및 리사이즈 시 캐싱 수행 (디바운싱 생략, 단발성 연산)
    updateCardRects();
    window.addEventListener('resize', updateCardRects);

    // 마우스 이동 시 캐시된 좌표를 이용해 리플로우 없는 빠른 연산
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // requestAnimationFrame을 이용한 렌더 큐 최적화 (Frame Drop 차단)
            window.requestAnimationFrame(() => {
                const rect = state.cardRects.get(card);
                if (!rect) return;

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // CSS Custom Property 업데이트
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // 윈도우 스크롤 시 위치 오프셋 발생 방지를 위해 호버 진입 시 부분 갱신
        card.addEventListener('mouseenter', () => {
            state.cardRects.set(card, card.getBoundingClientRect());
        });
    });
});

/**
 * 포털(모달) 닫기 기능
 *
 * @description 단순한 클래스 토글링 대신 DOM 접근 최소화를 위한 순수 함수 분리
 */
const closePortal = () => {
    const overlay = document.getElementById('portal-overlay');
    const iframe = document.getElementById('portal-frame');

    if (overlay) {
        overlay.classList.remove('opacity-100');
        // setTimeout의 사이드 이펙트를 격리 및 명시적 리소스 해제
        setTimeout(() => {
            overlay.classList.add('hidden');
            if (iframe) iframe.src = '';
        }, 700); // 트랜지션 지속 시간에 맞춘 정리
    }
};

/**
 * 앰비언트 스타더스트(Stardust) 생성 로직
 * 
 * @description 초기화 시점에만 연산을 수행하여 이후 Reflow를 유발하지 않는 정적 파티클 레이어 구현
 */
const initStardust = () => {
    const container = document.getElementById('particles-container');
    if (!container) return;

    // 파티클 개수 (성능을 위해 50개 제한)
    const particleCount = 50;
    // 다중 DOM 삽입 최소화를 위한 DocumentFragment 사용
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');

        // CSS Custom Property 및 인라인 스타일 렌더링
        const size = Math.random() * 2 + 1; // 1px ~ 3px
        const xPos = Math.random() * 100; // 0vw ~ 100vw
        const duration = Math.random() * 20 + 20; // 20s ~ 40s (매우 느린 속도)
        const delay = Math.random() * 10; // 0s ~ 10s

        particle.style.cssText = `
            position: absolute;
            bottom: -5%;
            left: ${xPos}vw;
            width: ${size}px;
            height: ${size}px;
            background-color: var(--tw-prose-body, rgba(212, 175, 55, 0.5));
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 ${size * 2}px rgba(212, 175, 55, 0.4);
            animation: drift ${duration}s linear ${delay}s infinite;
        `;

        fragment.appendChild(particle);
    }

    container.appendChild(fragment);
};

// 스크립트 로드 시 파티클 생성 함수 추가 등록
document.addEventListener('DOMContentLoaded', initStardust);
