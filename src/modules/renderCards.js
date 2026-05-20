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

const createCtaMarkup = (cta, tone) => {
    const toneClasses = getToneClasses(tone);

    return `
        <div class="premium-card__cta premium-card__cta-target ${toneClasses.cta} mt-auto text-[8px] md:text-[9px] font-body tracking-[0.22em] md:tracking-[0.26em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 flex items-center gap-2">
            <span class="w-4 h-px bg-current transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></span>
            ${cta}
        </div>
    `;
};

const createCardMarkup = ({ slug, href, delayClass, featured, tone, index, portal, icon, heading, copy }) => {
    const toneClasses = getToneClasses(tone);
    const hasCompactLabel = copy.compactLabel || copy.label.length > 12;
    const cardSpanClass = featured ? 'premium-card--featured' : '';

    return `
    <a
        class="group premium-card ${toneClasses.label} ${cardSpanClass} p-5 sm:p-6 md:p-7 shadow-premium hover:shadow-premium-hover flex flex-col items-center text-center rounded-xl animate-fade-up ${delayClass}"
        data-card="${slug}"
        href="${href}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${heading.main} ${heading.accent}"
    >
        <div class="grain-overlay"></div>
        <div class="premium-card-content justify-center w-full">
            <div class="premium-card__topline mb-4 md:mb-5 flex w-full items-center justify-between gap-3">
                <div class="premium-card__portal ${toneClasses.meta}">
                    ${portal}
                </div>
                <div class="premium-card__index ${toneClasses.meta}" aria-hidden="true">
                    ${index}
                </div>
            </div>
            <div class="premium-card__icon ${toneClasses.icon} w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mb-4 sm:mb-5 flex items-center justify-center transition-transform duration-1000 group-hover:scale-110">
                ${icon()}
            </div>
            <h2 class="premium-card__title text-[15px] sm:text-base md:text-lg lg:text-[1.35rem] leading-[1.24] md:leading-[1.16] pb-1 font-display font-medium mb-1 text-primary tracking-[0.08em] md:tracking-[0.1em] uppercase break-keep">
                ${createHeadingMarkup(heading)}
            </h2>
            <div class="premium-card__meta ${toneClasses.meta} ${hasCompactLabel ? 'premium-card__meta--compact' : ''} text-[9px] sm:text-[10px] font-body tracking-[0.14em] md:tracking-[0.18em] mb-3 md:mb-4 font-medium">
                ${copy.label}
            </div>
            <div class="premium-card__rule ${toneClasses.rule} w-7 h-px mb-3 md:mb-4 transition-all duration-500 group-hover:w-12"></div>
            <p class="premium-card__description break-keep text-slate-700 text-[11px] sm:text-[12px] leading-5 sm:leading-6 font-medium italic mb-4 md:mb-5">
                ${copy.description}
            </p>
            ${createCtaMarkup(copy.cta, tone)}
        </div>
    </a>
`;
};

export const renderCards = (cards) => {
    const cardsGrid = document.getElementById('cards-grid');
    if (!cardsGrid) return;

    cardsGrid.innerHTML = cards.map(createCardMarkup).join('');
};
