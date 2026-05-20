import { getPersistentValue, setPersistentValue } from './storage.js';

const unlockCode = '0228';
const storageKey = 'simsang-entry-unlocked-code';

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

const getFocusableElements = (gate) => Array.from(
    gate.querySelectorAll('button, input, a, [tabindex]:not([tabindex="-1"])'),
).filter((element) => !element.hasAttribute('disabled'));

export const initEntryGate = () => {
    const gate = document.getElementById('entry-gate');
    const input = document.getElementById('entry-gate-input');
    const error = document.getElementById('entry-gate-error');
    const submit = document.getElementById('entry-gate-submit');
    const dismiss = document.getElementById('entry-gate-dismiss');

    if (!gate || !input || !error || !submit || !dismiss) return;

    const unlock = () => {
        persistUnlockState();
        error.textContent = '';
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

    gate.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;

        const focusableElements = getFocusableElements(gate);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });

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
        input.focus();
    });

    window.requestAnimationFrame(() => input.focus());
};
