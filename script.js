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
});
