import { getPersistentValue, setPersistentValue } from './storage.js';

const unlockCode = '0228';
const storageKey = 'simsang-entry-unlocked-code';
const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([type="hidden"]):not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

const getManagedElements = () => [
    document.getElementById('archive-shell'),
].filter(Boolean);

const setLockedState = (locked) => {
    document.body.classList.toggle('entry-locked', locked);
    document.body.classList.toggle('entry-unlocked', !locked);

    getManagedElements().forEach((element) => {
        if (!('inert' in element)) {
            if (locked) {
                element.setAttribute('aria-hidden', 'true');
            } else {
                element.removeAttribute('aria-hidden');
            }

            return;
        }

        element.inert = locked;

        if (locked) {
            element.setAttribute('aria-hidden', 'true');
        } else {
            element.removeAttribute('aria-hidden');
        }
    });
};

const getStoredUnlockState = () => getPersistentValue(storageKey) === unlockCode;

const persistUnlockState = () => {
    setPersistentValue(storageKey, unlockCode, { maxAgeSeconds: 60 * 60 * 24 * 30 });
};

const getFocusableElements = (container) => Array.from(
    container.querySelectorAll(focusableSelector),
).filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');

export const initEntryGate = () => {
    const gate = document.getElementById('entry-gate');
    const input = document.getElementById('entry-gate-input');
    const error = document.getElementById('entry-gate-error');
    const submit = document.getElementById('entry-gate-submit');
    const dismiss = document.getElementById('entry-gate-dismiss');

    if (!gate || !input || !error || !submit || !dismiss) return;

    const archiveShell = document.getElementById('archive-shell');
    const managedFallbackTabIndex = new Map();
    const supportsNativeInert = Boolean(archiveShell && 'inert' in archiveShell);

    const focusGate = () => {
        input.focus();
    };

    const restoreFallbackTabIndex = () => {
        managedFallbackTabIndex.forEach((previousTabIndex, element) => {
            if (previousTabIndex === null) {
                element.removeAttribute('tabindex');
                return;
            }

            element.setAttribute('tabindex', previousTabIndex);
        });

        managedFallbackTabIndex.clear();
    };

    const applyFallbackTabIndex = (locked) => {
        if (!archiveShell || supportsNativeInert) return;

        if (!locked) {
            restoreFallbackTabIndex();
            return;
        }

        getFocusableElements(archiveShell).forEach((element) => {
            if (!managedFallbackTabIndex.has(element)) {
                managedFallbackTabIndex.set(element, element.getAttribute('tabindex'));
            }

            element.setAttribute('tabindex', '-1');
        });
    };

    const trapFocusInsideGate = (event) => {
        if (!gate.contains(event.target)) {
            focusGate();
        }
    };

    const handleDocumentKeydown = (event) => {
        if (event.key !== 'Tab' || !gate.isConnected) return;

        const focusableElements = getFocusableElements(gate);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) {
            event.preventDefault();
            focusGate();
            return;
        }

        if (event.shiftKey) {
            if (!gate.contains(document.activeElement) || document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }

            return;
        }

        if (!gate.contains(document.activeElement) || document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    };

    const unlock = () => {
        persistUnlockState();
        error.textContent = '';
        document.removeEventListener('focusin', trapFocusInsideGate, true);
        document.removeEventListener('keydown', handleDocumentKeydown, true);
        applyFallbackTabIndex(false);
        setLockedState(false);
        gate.hidden = true;
        gate.setAttribute('aria-hidden', 'true');
        gate.remove();
    };

    const attemptUnlock = () => {
        if (input.value.trim() === unlockCode) {
            unlock();
            return;
        }

        error.textContent = '비밀번호가 올바르지 않습니다.';
        input.focus();
        input.select();
    };

    if (getStoredUnlockState()) {
        unlock();
        return;
    }

    gate.hidden = false;
    gate.setAttribute('aria-hidden', 'false');
    setLockedState(true);
    applyFallbackTabIndex(true);

    document.addEventListener('focusin', trapFocusInsideGate, true);
    document.addEventListener('keydown', handleDocumentKeydown, true);

    input.addEventListener('input', () => {
        input.value = input.value.replace(/\D+/g, '').slice(0, 4);

        if (error.textContent) {
            error.textContent = '';
        }
    });

    input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;

        event.preventDefault();
        attemptUnlock();
    });

    submit.addEventListener('click', attemptUnlock);

    dismiss.addEventListener('click', () => {
        error.textContent = '비밀번호를 입력해 주세요.';
        focusGate();
    });

    window.requestAnimationFrame(focusGate);
};
