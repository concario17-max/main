export const initCardEffects = () => {
    const cards = document.querySelectorAll('.premium-card');
    if (!cards.length) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reduceMotionQuery.matches) {
        cards.forEach((card) => {
            card.style.removeProperty('transform');

            const cta = card.querySelector('.mt-auto');
            if (cta) {
                cta.style.removeProperty('transform');
            }
        });

        return;
    }

    const state = { cardRects: new Map() };
    const targets = new Map();
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const updateCardRects = () => {
        cards.forEach((card) => state.cardRects.set(card, card.getBoundingClientRect()));
    };

    updateCardRects();
    window.addEventListener('resize', updateCardRects, { passive: true });

    cards.forEach((card) => {
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
            const rect = state.cardRects.get(card);
            if (!rect) return;

            const currentTarget = targets.get(card);
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const cta = card.querySelector('.mt-auto');

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
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            const currentTarget = targets.get(card);

            targets.set(card, {
                ...currentTarget,
                tiltX: 0,
                tiltY: 0,
                magneticX: 0,
                magneticY: 0,
            });
        });

        card.addEventListener('mouseenter', () => {
            state.cardRects.set(card, card.getBoundingClientRect());
        });
    });

    const animate = () => {
        cards.forEach((card) => {
            const currentTarget = targets.get(card);
            if (!currentTarget) return;

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

            const cta = card.querySelector('.mt-auto');
            if (cta) {
                cta.style.transform = `translate(${nextTarget.currMagneticX}px, ${nextTarget.currMagneticY}px)`;
            }
        });

        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
};
