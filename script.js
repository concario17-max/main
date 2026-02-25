document.addEventListener('DOMContentLoaded', () => {
    // Dynamic spotlight effect for premium cards
    const cards = document.querySelectorAll('.premium-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// Portal functionality 
function closePortal() {
    const overlay = document.getElementById('portal-overlay');
    const iframe = document.getElementById('portal-frame');
    if (overlay) {
        overlay.classList.remove('opacity-100');
        setTimeout(() => {
            overlay.classList.add('hidden');
            if (iframe) iframe.src = '';
        }, 700); // Wait for transition duration
    }
}
