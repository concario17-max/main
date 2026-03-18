const unlockCode = '0228';
const storageKey = 'simsang-entry-unlocked';

const setLockedState = (locked) => {
    document.body.classList.toggle('entry-locked', locked);
};

const getStoredUnlockState = () => {
    try {
        return window.sessionStorage.getItem(storageKey) === 'true';
    } catch {
        return false;
    }
};

const persistUnlockState = () => {
    try {
        window.sessionStorage.setItem(storageKey, 'true');
    } catch {
        return;
    }
};

export const initEntryGate = () => {
    const gate = document.getElementById('entry-gate');
    const form = document.getElementById('entry-gate-form');
    const input = document.getElementById('entry-gate-input');
    const error = document.getElementById('entry-gate-error');
    const dismiss = document.getElementById('entry-gate-dismiss');

    if (!gate || !form || !input || !error || !dismiss) return;

    const unlock = () => {
        persistUnlockState();
        gate.hidden = true;
        gate.setAttribute('aria-hidden', 'true');
        error.textContent = '';
        setLockedState(false);
    };

    const isUnlocked = getStoredUnlockState();

    if (isUnlocked) {
        unlock();
        return;
    }

    gate.hidden = false;
    setLockedState(true);
    window.requestAnimationFrame(() => input.focus());

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (input.value.trim() === unlockCode) {
            unlock();
            return;
        }

        error.textContent = '비밀번호가 올바르지 않습니다.';
        input.select();
    });

    dismiss.addEventListener('click', () => {
        error.textContent = '입장하려면 비밀번호를 입력해 주세요.';
        input.focus();
    });
};
