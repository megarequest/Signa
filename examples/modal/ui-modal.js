/**
 * Модальные окна на нативном <dialog>: фокус внутри окна, Escape, верхний слой.
 *
 * 1. Декларативно — разметка окна прямо в странице:
 *
 *   <ui-modal id="terms" data-title="Условия" data-size="lg">
 *       ...содержимое...
 *       <div data-slot="footer"><button data-close>Понятно</button></div>
 *   </ui-modal>
 *
 *   <button data-open-modal="terms">Открыть</button>     — без единой строки JS
 *   Plainly.store('modals').open('terms')                  — или из кода
 *
 *   Любой элемент с data-close внутри окна закрывает его. Клик по фону и Escape — тоже.
 *
 * 2. Через Promise — без разметки:
 *
 *   await modals.alert('Сохранено')
 *   if (await modals.confirm('Удалить?', { danger: true, ok: 'Удалить' })) ...
 *   const name = await modals.prompt('Новое имя', { value: 'старое' })   // null — отмена
 */

Plainly.defineStore('modals', ({ signal }) => {
    // id открытых декларативных окон, по порядку открытия
    const opened = signal([]);

    function open(id) {
        if (!opened.value.includes(id)) opened.value = [...opened.value, id];
    }

    function close(id) {
        if (opened.value.includes(id)) opened.value = opened.value.filter(x => x !== id);
    }

    // каждый вызов создаёт свой <ui-ask>, который удалит себя после ответа
    function ask(type, text, options = {}) {
        return new Promise(resolve => {
            const el = document.createElement('ui-ask');

            el.ask = { type, text, ...options, resolve };

            document.body.append(el);
        });
    }

    return {
        opened,
        open,
        close,
        isOpen: id => opened.value.includes(id),

        alert: (text, options) => ask('alert', text, options),
        confirm: (text, options) => ask('confirm', text, options),
        prompt: (text, options) => ask('prompt', text, options),
    };
});


// кнопки с data-open-modal="id" работают без JS на странице
document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open-modal]');

    if (opener) Plainly.store('modals').open(opener.dataset.openModal);
});


Plainly.defineComponent('ui-modal', ({ html, signal, computed, effect, prop, slot, $this }, { modals }) => {
    const title = prop('title', String, '');
    const size = prop('size', String, 'md');

    const dialog = signal(null);
    const isOpen = computed(() => modals.opened.value.includes($this.id));

    // состояние стора -> настоящий <dialog>
    effect(() => {
        const el = dialog.value;

        if (!el) return;

        if (isOpen.value && !el.open) el.showModal();
        if (!isOpen.value && el.open) el.close();
    });

    // <dialog> закрылся сам (Escape) -> стор
    const onClose = () => modals.close($this.id);

    const onClick = e => {
        // клик по фону попадает в сам <dialog>, клик по окну — во вложенный .modal-box
        if (e.target === e.currentTarget || e.target.closest('[data-close]')) {
            modals.close($this.id);
        }
    };

    const footer = slot('footer');

    return () => html`
        <dialog class=${`modal modal-${size.value}`}
            ref=${el => (dialog.value = el)}
            onclose=${onClose}
            onclick=${onClick}>
            <div class="modal-box">
                <header class="modal-head">
                    <h3>${title.value}</h3>
                    <button class="modal-x" data-close aria-label="Закрыть">✕</button>
                </header>
                <div class="modal-body">${slot.default}</div>
                ${footer.length ? html`<footer class="modal-foot">${footer}</footer>` : null}
            </div>
        </dialog>
    `;
});


// Окно alert / confirm / prompt. Создаётся стором, удаляет себя само.
Plainly.defineComponent('ui-ask', ({ html, signal, effect, $this }) => {
    const ask = $this.ask;

    // что вернуть при Escape, клике по фону или «Отмена»
    const cancelValue = ask.type === 'confirm' ? false : ask.type === 'prompt' ? null : undefined;

    const dialog = signal(null);
    const input = signal(ask.value ?? '');

    let result = cancelValue;

    effect(() => dialog.value?.showModal());

    const finish = value => {
        result = value;
        dialog.value.close();
    };

    const onClose = () => {
        ask.resolve(result);
        $this.remove();
    };

    // обработчик без return: uhtml вешает onclick свойством, и false отменил бы событие
    const onBackdrop = e => {
        if (e.target === e.currentTarget) finish(cancelValue);
    };

    const onSubmit = e => {
        e.preventDefault();
        finish(ask.type === 'prompt' ? input.value : true);
    };

    return () => html`
        <dialog class="modal modal-sm"
            ref=${el => (dialog.value = el)}
            onclose=${onClose}
            onclick=${onBackdrop}>
            <form class="modal-box" onsubmit=${onSubmit}>
                ${ask.title ? html`<header class="modal-head"><h3>${ask.title}</h3></header>` : null}

                <div class="modal-body">
                    <p>${ask.text}</p>
                    ${ask.type === 'prompt' ? html`
                        <input class="modal-input" autofocus
                            placeholder=${ask.placeholder ?? ''}
                            .value=${input.value}
                            oninput=${e => (input.value = e.target.value)}>
                    ` : null}
                </div>

                <footer class="modal-foot">
                    ${ask.type === 'alert' ? null : html`
                        <button type="button" onclick=${() => finish(cancelValue)}>${ask.cancel ?? 'Отмена'}</button>
                    `}
                    <button class=${ask.danger ? 'danger' : 'primary'} ?autofocus=${ask.type !== 'prompt'}>
                        ${ask.ok ?? 'OK'}
                    </button>
                </footer>
            </form>
        </dialog>
    `;
});
