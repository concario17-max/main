const unlockCode = '0228';
const storageKey = 'simsang-entry-unlocked';

const setLockedState = (locked) => {
    document.body.classList.toggle('entry-locked', locked);
    document.body.classList.toggle('entry-unlocked', !locked);
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
        error.textContent = '입장하려면 비밀번호 0228을 입력해 주세요.';
        input.focus();
    });

    window.requestAnimationFrame(() => input.focus());
};
