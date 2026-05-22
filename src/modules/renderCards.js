const createHeadingMarkup = ({ main, accent }) => `${main}<br />${accent}`;

const toneClassMap = {
    celestial: 'premium-card--celestial',
    sutra: 'premium-card--sutra',
    divine: 'premium-card--divine',
    liberation: 'premium-card--liberation',
    trinity: 'premium-card--trinity',
};

const getToneClass = (tone) => toneClassMap[tone] ?? toneClassMap.celestial;

const createCtaMarkup = (cta) => {
    return `
        <div class="premium-card__cta premium-card__cta-target ui-card__cta mt-auto">
            <span class="premium-card__cta-line ui-card__cta-line" aria-hidden="true"></span>
            ${cta}
        </div>
    `;
};

const createCardMarkup = ({ slug, href, delayClass, featured, tone, index, portal, icon, heading, copy }) => {
    const toneClass = getToneClass(tone);
    const hasCompactLabel = copy.compactLabel || copy.label.length > 12;
    const cardSpanClass = featured ? 'premium-card--featured' : '';

    return `
    <li class="archive-grid__item">
        <a
            class="ui-card premium-card ${toneClass} ${cardSpanClass} animate-fade-up ${delayClass}"
            data-card="${slug}"
            href="${href}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="${heading.main} ${heading.accent}"
        >
            <div class="grain-overlay"></div>
            <div class="premium-card-content ui-card__content">
                <div class="premium-card__topline ui-card__topline mb-4 md:mb-5">
                    <div class="premium-card__portal ui-card__portal">
                        ${portal}
                    </div>
                    <div class="premium-card__index ui-card__index" aria-hidden="true">
                        ${index}
                    </div>
                </div>
                <div class="premium-card__icon ui-card__icon">
                    ${icon()}
                </div>
                <h2 class="premium-card__title ui-card__title">
                    ${createHeadingMarkup(heading)}
                </h2>
                <div class="premium-card__meta ui-card__meta ${hasCompactLabel ? 'premium-card__meta--compact' : ''}">
                    ${copy.label}
                </div>
                <div class="premium-card__rule ui-card__rule"></div>
                <p class="premium-card__description ui-card__description">
                    ${copy.description}
                </p>
                ${createCtaMarkup(copy.cta)}
            </div>
        </a>
    </li>
`;
};

export const renderCards = (cards) => {
    const cardsGrid = document.getElementById('cards-grid');

    if (!cardsGrid) {
        return;
    }

    cardsGrid.innerHTML = cards.map(createCardMarkup).join('');
};
