export const initCardEffects = () => {
    const cards = document.querySelectorAll('.premium-card');
    if (!cards.length) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reduceMotionQuery.matches) {
        cards.forEach((card) => {
            card.style.removeProperty('transform');

            const cta = card.querySelector('.premium-card__cta-target');
            if (cta) {
                cta.style.removeProperty('transform');
            }
        });

        return;
    }

    const state = { cardRects: new Map() };
    const targets = new Map();
    const hoveredCards = new Set();
    const visibleCards = new Set();
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // 화면 가시성 상태 변화 관찰자 설정 (화면 밖 연산 제거 목적)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                visibleCards.add(entry.target);
                state.cardRects.set(entry.target, entry.target.getBoundingClientRect());
                startLoop();
            } else {
                visibleCards.delete(entry.target);
            }
        });
    }, { threshold: 0.01 });

    const updateCardRects = () => {
        cards.forEach((card) => {
            if (visibleCards.has(card)) {
                state.cardRects.set(card, card.getBoundingClientRect());
            }
        });
    };

    window.addEventListener('resize', updateCardRects, { passive: true });

    cards.forEach((card) => {
        observer.observe(card);

        targets.set(card, {
            spotX: 50,
            spotY: 50,
            currSpotX: 50,
            currSpotY: 50,
            tiltX: 0,
            tiltY: 0,
            currTiltX: 0,
            currTiltY: 0,
            magneticX: 0,
            magneticY: 0,
            currMagneticX: 0,
            currMagneticY: 0,
        });

        card.addEventListener('mousemove', (event) => {
            // 게이트웨이가 차단 상태면 마우스 연산 생략
            if (document.body.classList.contains('entry-locked')) return;

            const rect = state.cardRects.get(card);
            if (!rect) return;

            const currentTarget = targets.get(card);
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const cta = card.querySelector('.premium-card__cta-target');

            let magneticX = 0;
            let magneticY = 0;

            if (cta) {
                const ctaRect = cta.getBoundingClientRect();
                const ctaCenterX = ctaRect.left + ctaRect.width / 2;
                const ctaCenterY = ctaRect.top + ctaRect.height / 2;
                const distance = Math.hypot(event.clientX - ctaCenterX, event.clientY - ctaCenterY);

                if (distance < 100) {
                    magneticX = (event.clientX - ctaCenterX) * 0.3;
                    magneticY = (event.clientY - ctaCenterY) * 0.3;
                }
            }

            targets.set(card, {
                ...currentTarget,
                spotX: x,
                spotY: y,
                tiltY: ((x - centerX) / centerX) * 10,
                tiltX: -((y - centerY) / centerY) * 10,
                magneticX,
                magneticY,
            });

            startLoop();
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            hoveredCards.delete(card);
            const currentTarget = targets.get(card);

            targets.set(card, {
                ...currentTarget,
                tiltX: 0,
                tiltY: 0,
                magneticX: 0,
                magneticY: 0,
            });

            startLoop();
        });

        card.addEventListener('mouseenter', () => {
            if (document.body.classList.contains('entry-locked')) return;

            hoveredCards.add(card);
            state.cardRects.set(card, card.getBoundingClientRect());
            startLoop();
        });
    });

    let isAnimating = false;

    const startLoop = () => {
        if (isAnimating) return;
        isAnimating = true;
        requestAnimationFrame(animate);
    };

    const animate = () => {
        if (document.body.classList.contains('entry-locked')) {
            isAnimating = false;
            return;
        }

        let needsNextFrame = false;

        cards.forEach((card) => {
            if (!visibleCards.has(card)) return;

            const currentTarget = targets.get(card);
            if (!currentTarget) return;

            const diffSpotX = currentTarget.spotX - currentTarget.currSpotX;
            const diffSpotY = currentTarget.spotY - currentTarget.currSpotY;
            const diffTiltX = currentTarget.tiltX - currentTarget.currTiltX;
            const diffTiltY = currentTarget.tiltY - currentTarget.currTiltY;
            const diffMagX = currentTarget.magneticX - currentTarget.currMagneticX;
            const diffMagY = currentTarget.magneticY - currentTarget.currMagneticY;

            const isHovered = hoveredCards.has(card);
            const hasSpotMovement = Math.abs(diffSpotX) > 0.05 || Math.abs(diffSpotY) > 0.05;
            const hasTiltMovement = Math.abs(diffTiltX) > 0.005 || Math.abs(diffTiltY) > 0.005;
            const hasMagMovement = Math.abs(diffMagX) > 0.01 || Math.abs(diffMagY) > 0.01;

            // 마우스 호버 상태이거나 아직 0으로 회귀하지 못한 연산이 존재할 때만 프레임 갱신
            if (isHovered || hasSpotMovement || hasTiltMovement || hasMagMovement) {
                const nextTarget = {
                    ...currentTarget,
                    currSpotX: lerp(currentTarget.currSpotX, currentTarget.spotX, 0.06),
                    currSpotY: lerp(currentTarget.currSpotY, currentTarget.spotY, 0.06),
                    currTiltX: lerp(currentTarget.currTiltX, currentTarget.tiltX, 0.06),
                    currTiltY: lerp(currentTarget.currTiltY, currentTarget.tiltY, 0.06),
                    currMagneticX: lerp(currentTarget.currMagneticX, currentTarget.magneticX, 0.1),
                    currMagneticY: lerp(currentTarget.currMagneticY, currentTarget.magneticY, 0.1),
                };

                targets.set(card, nextTarget);
                card.style.setProperty('--mouse-x', `${nextTarget.currSpotX}px`);
                card.style.setProperty('--mouse-y', `${nextTarget.currSpotY}px`);
                card.style.transform = `rotateX(${nextTarget.currTiltX}deg) rotateY(${nextTarget.currTiltY}deg)`;

                const cta = card.querySelector('.premium-card__cta-target');
                if (cta) {
                    cta.style.transform = `translate(${nextTarget.currMagneticX}px, ${nextTarget.currMagneticY}px)`;
                }

                needsNextFrame = true;
            } else {
                // 완전히 정지했을 경우 고정값 스냅을 적용해 미세 떨림 방지
                if (currentTarget.currTiltX !== currentTarget.tiltX ||
                    currentTarget.currTiltY !== currentTarget.tiltY ||
                    currentTarget.currMagneticX !== currentTarget.magneticX ||
                    currentTarget.currMagneticY !== currentTarget.magneticY) {

                    const clampedTarget = {
                        ...currentTarget,
                        currSpotX: currentTarget.spotX,
                        currSpotY: currentTarget.spotY,
                        currTiltX: currentTarget.tiltX,
                        currTiltY: currentTarget.tiltY,
                        currMagneticX: currentTarget.magneticX,
                        currMagneticY: currentTarget.magneticY,
                    };
                    targets.set(card, clampedTarget);
                    card.style.setProperty('--mouse-x', `${clampedTarget.currSpotX}px`);
                    card.style.setProperty('--mouse-y', `${clampedTarget.currSpotY}px`);
                    card.style.transform = `rotateX(${clampedTarget.currTiltX}deg) rotateY(${clampedTarget.currTiltY}deg)`;

                    const cta = card.querySelector('.premium-card__cta-target');
                    if (cta) {
                        cta.style.transform = `translate(${clampedTarget.currMagneticX}px, ${clampedTarget.currMagneticY}px)`;
                    }
                }
            }
        });

        if (needsNextFrame) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
        }
    };

    startLoop();
};
