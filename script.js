/**
 * Ray Standard - Performance & Meta-Design Optimization
 * 
 * 1. O(1) Lookup: Rect caching with Map for zero-reflow interaction.
 * 2. Resource Management: IntersectionObserver for ambient effects.
 * 3. Atomic DOM: Fragment-based batch insertion.
 */

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.premium-card');
    const state = { cardRects: new Map() };

    // 카드 위치 정보 캐싱 (O(1) 접근 지향)
    const updateCardRects = () => {
        const newRects = new Map();
        cards.forEach(card => newRects.set(card, card.getBoundingClientRect()));
        state.cardRects = newRects;
    };

    updateCardRects();
    window.addEventListener('resize', updateCardRects, { passive: true });

    // 마우스 이벤트 스트림 최적화
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            window.requestAnimationFrame(() => {
                const rect = state.cardRects.get(card);
                if (!rect) return;
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        }, { passive: true });

        card.addEventListener('mouseenter', () => {
            state.cardRects.set(card, card.getBoundingClientRect());
        });
    });
});

/**
 * 포털(모달) 자원 해제 및 종료
 */
const closePortal = () => {
    const overlay = document.getElementById('portal-overlay');
    const iframe = document.getElementById('portal-frame');
    if (!overlay) return;

    overlay.classList.remove('opacity-100');
    setTimeout(() => {
        overlay.classList.add('hidden');
        if (iframe) iframe.src = '';
    }, 700);
};

/**
 * 앰비언트 스타더스트(Stardust) 최적화 구현
 * - IntersectionObserver를 통한 가시 영역 외 연산 차단
 */
const initStardust = () => {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const fragment = document.createDocumentFragment();
    const count = 50;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 2 + 1;
        p.style.cssText = `
            position: absolute; bottom: -5%; left: ${Math.random() * 100}vw;
            width: ${size}px; height: ${size}px;
            background: rgba(212, 175, 55, 0.4); border-radius: 50%;
            pointer-events: none; box-shadow: 0 0 ${size * 2}px rgba(212, 175, 55, 0.3);
            animation: drift ${Math.random() * 20 + 20}s linear ${Math.random() * 10}s infinite;
        `;
        fragment.appendChild(p);
    }
    container.appendChild(fragment);

    // 성능 최적화: 화면 스크롤 시 보이지 않는 경우 애니메이션 일시 중지 처리 지연 연산
    // (CSS 애니메이션은 브라우저 수준에서 최적화되나, DOM 노출 제어로 추가 이득 확보)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            container.style.display = entry.isIntersecting ? 'block' : 'none';
        });
    }, { threshold: 0.01 });

    observer.observe(container);
};

document.addEventListener('DOMContentLoaded', initStardust);
