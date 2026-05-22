export const initStardust = () => {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');

    if (reduceMotionQuery.matches || coarsePointerQuery.matches) {
        container.style.display = 'none';
        return;
    }

    const fragment = document.createDocumentFragment();
    const count = 28;

    for (let index = 0; index < count; index += 1) {
        const particle = document.createElement('div');
        const size = Math.random() * 2 + 1;

        particle.className = 'stardust-particle';
        particle.style.setProperty('--particle-size', `${size}px`);
        particle.style.setProperty('--particle-left', `${Math.random() * 100}vw`);
        particle.style.setProperty('--particle-duration', `${Math.random() * 18 + 18}s`);
        particle.style.setProperty('--particle-delay', `${Math.random() * 10}s`);

        fragment.appendChild(particle);
    }

    container.appendChild(fragment);
};
