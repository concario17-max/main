export const initStardust = () => {
    const container = document.getElementById('particles-container');
    if (!container) return;

    const fragment = document.createDocumentFragment();
    const count = 50;

    for (let index = 0; index < count; index += 1) {
        const particle = document.createElement('div');
        const size = Math.random() * 2 + 1;

        particle.style.cssText = `
            position: absolute; bottom: -5%; left: ${Math.random() * 100}vw;
            width: ${size}px; height: ${size}px;
            background: rgba(212, 175, 55, 0.4); border-radius: 50%;
            pointer-events: none; box-shadow: 0 0 ${size * 2}px rgba(212, 175, 55, 0.3);
            animation: drift ${Math.random() * 20 + 20}s linear ${Math.random() * 10}s infinite;
        `;

        fragment.appendChild(particle);
    }

    container.appendChild(fragment);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            container.style.display = entry.isIntersecting ? 'block' : 'none';
        });
    }, { threshold: 0.01 });

    observer.observe(container);
};
