import { getPersistentValue, setPersistentValue } from './storage.js';

const storageKey = 'simsang-theme';

const applyTheme = (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const initThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = getPersistentValue(storageKey);
    const initialTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light';

    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(nextTheme);
        setPersistentValue(storageKey, nextTheme, { maxAgeSeconds: 60 * 60 * 24 * 365 });
    });
};
