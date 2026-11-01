/**
 * Всплывающие уведомления.
 *
 *   const toasts = Plainly.store('toasts')
 *   toasts.show('Готово')
 *   toasts.success('Сохранено')
 *   toasts.error('Не удалось', { timeout: 0 })   // 0 — пока не закроют вручную
 *
 * Контейнер <ui-toasts> создаётся сам при первом вызове.
 */

Plainly.defineStore('toasts', ({ signal }) => {
    const list = signal([]);

    let seq = 0;

    function dismiss(id) {
        list.value = list.value.filter(toast => toast.id !== id);
    }

    function show(text, { type = 'info', timeout = 3500 } = {}) {
        let host = document.querySelector('ui-toasts');

        if (!host) {
            host = document.createElement('ui-toasts');
            host.popover = 'manual';
            document.body.append(host);
        }

        // popover живёт в верхнем слое: показываем заново, чтобы оказаться
        // поверх модального окна, открытого позже
        if (host.showPopover) {
            if (host.matches(':popover-open')) host.hidePopover();
            host.showPopover();
        }

        const id = ++seq;

        list.value = [...list.value, { id, text, type }];

        if (timeout) setTimeout(() => dismiss(id), timeout);

        return id;
    }

    return {
        list,
        show,
        dismiss,
        success: (text, options) => show(text, { ...options, type: 'success' }),
        error: (text, options) => show(text, { ...options, type: 'error' }),
    };
});


Plainly.defineComponent('ui-toasts', ({ html }, { toasts }) => {
    const icons = { info: 'ℹ', success: '✓', error: '!' };

    return () => html`
        <div class="toasts" role="status" aria-live="polite">
            ${toasts.list.value.map(toast => html`
                <div class=${`toast toast-${toast.type}`}>
                    <span class="toast-icon">${icons[toast.type]}</span>
                    <span class="toast-text">${toast.text}</span>
                    <button class="toast-x" aria-label="Закрыть" onclick=${() => toasts.dismiss(toast.id)}>✕</button>
                </div>
            `)}
        </div>
    `;
});
