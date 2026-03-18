const createHeadingMarkup = ({ main, accent }) => `${main}<br />${accent}`;

const toneClassMap = {
    celestial: {
        label: 'premium-card--celestial',
        icon: 'premium-card__icon--celestial',
        meta: 'premium-card__meta--celestial',
        rule: 'premium-card__rule--celestial',
        cta: 'premium-card__cta--celestial',
    },
    sutra: {
        label: 'premium-card--sutra',
        icon: 'premium-card__icon--sutra',
        meta: 'premium-card__meta--sutra',
        rule: 'premium-card__rule--sutra',
        cta: 'premium-card__cta--sutra',
    },
    divine: {
        label: 'premium-card--divine',
        icon: 'premium-card__icon--divine',
        meta: 'premium-card__meta--divine',
        rule: 'premium-card__rule--divine',
        cta: 'premium-card__cta--divine',
    },
    liberation: {
        label: 'premium-card--liberation',
        icon: 'premium-card__icon--liberation',
        meta: 'premium-card__meta--liberation',
        rule: 'premium-card__rule--liberation',
        cta: 'premium-card__cta--liberation',
    },
    trinity: {
        label: 'premium-card--trinity',
        icon: 'premium-card__icon--trinity',
        meta: 'premium-card__meta--trinity',
        rule: 'premium-card__rule--trinity',
        cta: 'premium-card__cta--trinity',
    },
};

const getToneClasses = (tone) => toneClassMap[tone] ?? toneClassMap.celestial;

const createFeaturedBadge = (featured) => {
    if (!featured) return '';

    return `
        <div class="premium-card__badge mb-4 md:mb-5 inline-flex items-center gap-2 rounded-full border border-accent-light/30 bg-white/40 px-3 py-1.5 md:px-3.5 text-[8px] md:text-[9px] font-body uppercase tracking-[0.22em] md:tracking-[0.26em] text-accent-light dark:border-accent-dark/30 dark:bg-black/30 dark:text-accent-dark">
            <span class="h-px w-6 bg-current opacity-70"></span>
            Featured Archive
        </div>
    `;
};

const createCtaMarkup = (featured, cta, tone) => {
    const toneClasses = getToneClasses(tone);

    if (featured) {
        return `
            <div class="premium-card__cta ${toneClasses.cta} mt-auto inline-flex items-center gap-2 md:gap-2.5 rounded-full border px-3.5 py-2 md:px-4 md:py-2.5 text-[8px] md:text-[9px] font-body tracking-[0.22em] md:tracking-[0.26em] uppercase transition-all duration-700">
                <span class="w-5 h-px bg-current opacity-80"></span>
                ${cta}
            </div>
        `;
    }

    return `
        <div class="premium-card__cta ${toneClasses.cta} mt-auto text-[8px] md:text-[9px] font-body tracking-[0.22em] md:tracking-[0.26em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
            <span class="w-4 h-px bg-current transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></span>
            ${cta}
        </div>
    `;
};

const createCardMarkup = ({ slug, href, delayClass, featured, tone, index, portal, icon, heading, copy }) => {
    const toneClasses = getToneClasses(tone);
    const hasCompactLabel = copy.compactLabel || copy.label.length > 12;
    const cardSpanClass = featured ? 'premium-card--featured archive-grid__feature' : '';

    return `
    <a
        class="group premium-card ${toneClasses.label} ${cardSpanClass} p-5 sm:p-6 md:p-7 shadow-premium hover:shadow-premium-hover dark:shadow-premium-dark dark:hover:shadow-premium-hover-dark flex flex-col items-center text-center rounded-xl animate-fade-up ${delayClass}"
        data-card="${slug}"
        href="${href}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${heading.main} ${heading.accent}"
    >
        <div class="grain-overlay"></div>
        <div class="premium-card-content ${featured ? 'lg:items-start lg:text-left' : ''} justify-center w-full">
            <div class="premium-card__topline mb-4 md:mb-5 flex w-full items-center justify-between gap-3">
                <div class="premium-card__portal ${toneClasses.meta}">
                    ${portal}
                </div>
                <div class="premium-card__index ${toneClasses.meta}" aria-hidden="true">
                    ${index}
                </div>
            </div>
            ${createFeaturedBadge(featured)}
            <div class="premium-card__icon ${toneClasses.icon} ${featured ? 'w-18 h-18 sm:w-20 sm:h-20 md:w-22 md:h-22 mb-4 sm:mb-5 lg:mb-5' : 'w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mb-4 sm:mb-5'} flex items-center justify-center transition-transform duration-1000 group-hover:scale-110">
                ${icon()}
            </div>
            <h2 class="premium-card__title ${featured ? 'text-[15px] sm:text-base md:text-lg lg:text-[1.35rem] leading-[1.22] md:leading-[1.14] pb-1' : 'text-[15px] sm:text-base md:text-lg lg:text-[1.35rem] leading-[1.24] md:leading-[1.16] pb-1'} font-display font-medium mb-1 text-primary dark:text-white tracking-[0.08em] md:tracking-[0.1em] uppercase break-keep">
                ${createHeadingMarkup(heading)}
            </h2>
            <div class="premium-card__meta ${toneClasses.meta} ${hasCompactLabel ? 'premium-card__meta--compact' : ''} text-[9px] sm:text-[10px] font-body tracking-[0.14em] md:tracking-[0.18em] ${featured ? 'mb-3 md:mb-4' : 'mb-3 md:mb-4'} font-medium">
                ${copy.label}
            </div>
            <div class="premium-card__rule ${toneClasses.rule} w-7 h-px ${featured ? 'mb-3 md:mb-4' : 'mb-3 md:mb-4'} transition-all duration-500 group-hover:w-12"></div>
            <p class="premium-card__description break-keep ${featured ? 'text-slate-800 dark:text-slate-100 text-[11px] sm:text-[12px] leading-5 sm:leading-6' : 'text-slate-700 dark:text-slate-300 text-[11px] sm:text-[12px] leading-5 sm:leading-6'} font-medium italic mb-4 md:mb-5">
                ${copy.description}
            </p>
            ${createCtaMarkup(featured, copy.cta, tone)}
        </div>
    </a>
`;
};

export const renderCards = (cards) => {
    const cardsGrid = document.getElementById('cards-grid');
    if (!cardsGrid) return;

    cardsGrid.innerHTML = cards.map(createCardMarkup).join('');
};
