import { cards } from './data/cards.js';
import { initCardEffects } from './modules/cardEffects.js';
import { renderCards } from './modules/renderCards.js';
import { initStardust } from './modules/stardust.js';
import { initThemeToggle } from './modules/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    renderCards(cards);
    initThemeToggle();
    initCardEffects();
    initStardust();
});
