const getCookieValue = (key) => {
    if (typeof document === 'undefined') return null;

    const encodedKey = encodeURIComponent(key);
    const cookies = document.cookie ? document.cookie.split('; ') : [];

    for (const cookie of cookies) {
        const [name, ...rest] = cookie.split('=');

        if (name !== encodedKey) continue;

        return decodeURIComponent(rest.join('='));
    }

    return null;
};

export const getPersistentValue = (key) => {
    try {
        const storedValue = window.localStorage.getItem(key);

        if (storedValue !== null) {
            return storedValue;
        }
    } catch {
        // Fall through to cookies when storage is unavailable.
    }

    return getCookieValue(key);
};

export const setPersistentValue = (key, value, options = {}) => {
    const { maxAgeSeconds = 60 * 60 * 24 * 30 } = options;
    let persisted = false;

    try {
        window.localStorage.setItem(key, value);
        persisted = true;
    } catch {
        // Keep going so cookies can still persist the value.
    }

    try {
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
        persisted = true;
    } catch {
        // No-op when cookies are blocked.
    }

    return persisted;
};
