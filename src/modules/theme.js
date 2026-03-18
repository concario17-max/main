const storageKey = 'simsang-theme';

const applyTheme = (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const initThemeToggle = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = window.localStorage.getItem(storageKey);
    const initialTheme = savedTheme ?? 'light';

    applyTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(nextTheme);
        window.localStorage.setItem(storageKey, nextTheme);
    });
};
