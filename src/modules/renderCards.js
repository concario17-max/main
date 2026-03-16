const createHeadingMarkup = ({ main, accent }) => `${main}<br />${accent}`;

const createCardMarkup = ({ slug, href, delayClass, icon, heading, copy }) => `
    <a
        class="group premium-card p-10 md:p-12 shadow-premium hover:shadow-premium-hover dark:shadow-premium-dark dark:hover:shadow-premium-hover-dark flex flex-col items-center text-center h-full rounded-xl animate-fade-up ${delayClass}"
        data-card="${slug}"
        href="${href}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${heading.main} ${heading.accent}"
    >
        <div class="grain-overlay"></div>
        <div class="premium-card-content justify-center w-full">
            <div class="w-24 h-24 mb-10 flex items-center justify-center text-accent-light dark:text-accent-dark transition-transform duration-1000 group-hover:scale-110">
                ${icon()}
            </div>
            <h2 class="text-lg md:text-xl lg:text-2xl font-display font-medium mb-1 text-primary dark:text-white tracking-[0.15em] uppercase">
                ${createHeadingMarkup(heading)}
            </h2>
            <div class="text-[10px] sm:text-[11px] font-body tracking-[0.3em] text-accent-light dark:text-accent-dark/80 mb-5 font-light">
                ${copy.label}
            </div>
            <div class="w-8 h-px bg-accent-light/30 dark:bg-accent-dark/30 mb-6 transition-all duration-500 group-hover:w-16 group-hover:bg-accent-light dark:group-hover:bg-accent-dark"></div>
            <p class="break-keep text-slate-700 dark:text-slate-300 text-[13px] leading-relaxed font-medium italic mb-8 flex-grow">
                ${copy.description}
            </p>
            <div class="mt-auto text-[9px] font-body tracking-[0.3em] text-accent-light dark:text-accent-dark uppercase opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
                <span class="w-4 h-px bg-current transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></span>
                ${copy.cta}
            </div>
        </div>
    </a>
`;

export const renderCards = (cards) => {
    const cardsGrid = document.getElementById('cards-grid');
    if (!cardsGrid) return;

    cardsGrid.innerHTML = cards.map(createCardMarkup).join('');
};
