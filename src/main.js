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

    // Physics Engine State
    const mouse = { x: 0, y: 0 };
    const targets = new Map(); // Store target values for lerp

    const lerp = (start, end, factor) => start + (end - start) * factor;

    // 카드 위치 정보 캐싱
    const updateCardRects = () => {
        cards.forEach(card => state.cardRects.set(card, card.getBoundingClientRect()));
    };

    updateCardRects();
    window.addEventListener('resize', updateCardRects, { passive: true });

    // Initialize animation state for each card
    cards.forEach(card => {
        targets.set(card, {
            spotX: 50, spotY: 50,
            currSpotX: 50, currSpotY: 50,
            tiltX: 0, tiltY: 0,
            currTiltX: 0, currTiltY: 0,
            magneticX: 0, magneticY: 0,
            currMagneticX: 0, currMagneticY: 0
        });

        card.addEventListener('mousemove', (e) => {
            const rect = state.cardRects.get(card);
            if (!rect) return;

            const t = targets.get(card);
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Tilt Calculation (Center is 0, edges are -1 to 1)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            let newMagneticX = 0;
            let newMagneticY = 0;

            // Magnetic Pull for CTA
            const cta = card.querySelector('.mt-auto');
            if (cta) {
                const ctaRect = cta.getBoundingClientRect();
                const ctaCenterX = ctaRect.left + ctaRect.width / 2;
                const ctaCenterY = ctaRect.top + ctaRect.height / 2;
                const dist = Math.hypot(e.clientX - ctaCenterX, e.clientY - ctaCenterY);

                if (dist < 100) {
                    newMagneticX = (e.clientX - ctaCenterX) * 0.3;
                    newMagneticY = (e.clientY - ctaCenterY) * 0.3;
                }
            }

            // Update Target Values Immutably
            targets.set(card, {
                ...t,
                spotX: x,
                spotY: y,
                tiltY: ((x - centerX) / centerX) * 10,
                tiltX: -((y - centerY) / centerY) * 10,
                magneticX: newMagneticX,
                magneticY: newMagneticY
            });
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            const t = targets.get(card);
            targets.set(card, {
                ...t,
                tiltX: 0, 
                tiltY: 0,
                magneticX: 0, 
                magneticY: 0
            });
        });

        card.addEventListener('mouseenter', () => {
            state.cardRects.set(card, card.getBoundingClientRect());
        });
    });

    // Unified Animation Loop (Physics-based Inertia)
    const animate = () => {
        cards.forEach(card => {
            const t = targets.get(card);

            // Lerp everything for that "viscous" feeling, Immutably
            const newT = {
                ...t,
                currSpotX: lerp(t.currSpotX, t.spotX, 0.06),
                currSpotY: lerp(t.currSpotY, t.spotY, 0.06),
                currTiltX: lerp(t.currTiltX, t.tiltX, 0.06),
                currTiltY: lerp(t.currTiltY, t.tiltY, 0.06),
                currMagneticX: lerp(t.currMagneticX, t.magneticX, 0.1),
                currMagneticY: lerp(t.currMagneticY, t.magneticY, 0.1)
            };
            targets.set(card, newT);

            // Apply Styles
            card.style.setProperty('--mouse-x', `${newT.currSpotX}px`);
            card.style.setProperty('--mouse-y', `${newT.currSpotY}px`);
            card.style.transform = `rotateX(${newT.currTiltX}deg) rotateY(${newT.currTiltY}deg)`;

            const cta = card.querySelector('.mt-auto');
            if (cta) {
                cta.style.transform = `translate(${newT.currMagneticX}px, ${newT.currMagneticY}px)`;
            }
        });
        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
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
