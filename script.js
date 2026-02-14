document.addEventListener('DOMContentLoaded', () => {
    // Entrance animations are largely handled by CSS, 
    // but we can add more complex interactions here if needed.

    console.log("Simsang Archive Gateway Initialized.");

    // Optional: Add a subtle parallax effect to the background
    const container = document.body;
    const nebula = document.querySelector('.nebula');

    container.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        if (nebula) {
            nebula.style.transform = `translate(-50%, -50%) translate(${x * 20}px, ${y * 20}px)`;
        }
    });
    const overlay = document.getElementById('portal-overlay');
    const frame = document.getElementById('portal-frame');

    window.openPortal = (url) => {
        if (!overlay || !frame) return;
        frame.src = url;
        overlay.classList.remove('hidden');
        // Force reflow to enable transition
        void overlay.offsetWidth;
        overlay.classList.remove('opacity-0');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    window.closePortal = () => {
        if (!overlay || !frame) return;
        overlay.classList.add('opacity-0');
        setTimeout(() => {
            overlay.classList.add('hidden');
            frame.src = '';
            document.body.style.overflow = '';
        }, 500); // Match transition duration
    };

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
            closePortal();
        }
    });
});
