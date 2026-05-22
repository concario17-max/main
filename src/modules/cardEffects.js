export const initCardEffects = () => {
    const cards = document.querySelectorAll('.premium-card');
    if (!cards.length) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');

    if (reduceMotionQuery.matches || coarsePointerQuery.matches) {
        cards.forEach((card) => {
            card.style.removeProperty('--card-pointer-x');
            card.style.removeProperty('--card-pointer-y');
            card.style.removeProperty('--card-tilt-x');
            card.style.removeProperty('--card-tilt-y');

            const cta = card.querySelector('.premium-card__cta-target');
            if (cta) {
                cta.style.removeProperty('--cta-offset-x');
                cta.style.removeProperty('--cta-offset-y');
            }
        });

        return;
    }

    const state = new Map();
    const ctaTargets = new Map();
    let rafId = 0;
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const settleThreshold = 0.05;

    cards.forEach((card) => {
        ctaTargets.set(card, card.querySelector('.premium-card__cta-target'));
        state.set(card, {
            rect: card.getBoundingClientRect(),
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
    });

    const startAnimation = () => {
        if (rafId) return;

        const animate = () => {
            let activeFrame = false;

            cards.forEach((card) => {
                const currentTarget = state.get(card);
                if (!currentTarget) return;

                const nextTarget = {
                    ...currentTarget,
                    currSpotX: lerp(currentTarget.currSpotX, currentTarget.spotX, 0.08),
                    currSpotY: lerp(currentTarget.currSpotY, currentTarget.spotY, 0.08),
                    currTiltX: lerp(currentTarget.currTiltX, currentTarget.tiltX, 0.08),
                    currTiltY: lerp(currentTarget.currTiltY, currentTarget.tiltY, 0.08),
                    currMagneticX: lerp(currentTarget.currMagneticX, currentTarget.magneticX, 0.12),
                    currMagneticY: lerp(currentTarget.currMagneticY, currentTarget.magneticY, 0.12),
                };

                state.set(card, nextTarget);

                card.style.setProperty('--card-pointer-x', `${nextTarget.currSpotX}px`);
                card.style.setProperty('--card-pointer-y', `${nextTarget.currSpotY}px`);
                card.style.setProperty('--card-tilt-x', `${nextTarget.currTiltX}deg`);
                card.style.setProperty('--card-tilt-y', `${nextTarget.currTiltY}deg`);

                const cta = ctaTargets.get(card);
                if (cta) {
                    cta.style.setProperty('--cta-offset-x', `${nextTarget.currMagneticX}px`);
                    cta.style.setProperty('--cta-offset-y', `${nextTarget.currMagneticY}px`);
                }

                const tiltActive = Math.abs(nextTarget.currTiltX) > settleThreshold || Math.abs(nextTarget.currTiltY) > settleThreshold;
                const pointerActive = Math.abs(nextTarget.currSpotX - nextTarget.spotX) > settleThreshold || Math.abs(nextTarget.currSpotY - nextTarget.spotY) > settleThreshold;
                const magneticActive = Math.abs(nextTarget.currMagneticX - nextTarget.magneticX) > settleThreshold || Math.abs(nextTarget.currMagneticY - nextTarget.magneticY) > settleThreshold;
                if (tiltActive || pointerActive || magneticActive) {
                    activeFrame = true;
                }
            });

            if (activeFrame) {
                rafId = requestAnimationFrame(animate);
                return;
            }

            rafId = 0;
        };

        rafId = requestAnimationFrame(animate);
    };

    const refreshRects = () => {
        cards.forEach((card) => {
            const current = state.get(card);
            if (!current) return;
            current.rect = card.getBoundingClientRect();
            state.set(card, current);
        });
    };

    refreshRects();
    window.addEventListener('resize', refreshRects, { passive: true });

    cards.forEach((card) => {
        card.addEventListener('pointerenter', () => {
            const current = state.get(card);
            if (!current) return;
            current.rect = card.getBoundingClientRect();
            state.set(card, current);
        });

        card.addEventListener('pointermove', (event) => {
            if (event.pointerType !== 'mouse') return;

            const current = state.get(card);
            if (!current) return;

            const rect = current.rect ?? card.getBoundingClientRect();
            const cta = ctaTargets.get(card);
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            let magneticX = 0;
            let magneticY = 0;

            if (cta) {
                const ctaRect = cta.getBoundingClientRect();
                const ctaCenterX = ctaRect.left + ctaRect.width / 2;
                const ctaCenterY = ctaRect.top + ctaRect.height / 2;
                const distance = Math.hypot(event.clientX - ctaCenterX, event.clientY - ctaCenterY);

                if (distance < 100) {
                    magneticX = (event.clientX - ctaCenterX) * 0.24;
                    magneticY = (event.clientY - ctaCenterY) * 0.24;
                }
            }

            current.spotX = x;
            current.spotY = y;
            current.tiltY = ((x - centerX) / centerX) * 8;
            current.tiltX = -((y - centerY) / centerY) * 8;
            current.magneticX = magneticX;
            current.magneticY = magneticY;
            state.set(card, current);

            startAnimation();
        }, { passive: true });

        card.addEventListener('pointerleave', () => {
            const current = state.get(card);
            if (!current) return;

            current.tiltX = 0;
            current.tiltY = 0;
            current.magneticX = 0;
            current.magneticY = 0;
            state.set(card, current);

            startAnimation();
        });
    });
};
