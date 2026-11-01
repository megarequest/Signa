const { defineComponent } = window.Plainly;

const modals = Plainly.store('modals');
const toasts = Plainly.store('toasts');


// --- окна из разметки + обычный JS ---

document.getElementById('accept-terms').addEventListener('click', () => {
    toasts.success('Условия приняты');
});

document.getElementById('subscribe-form').addEventListener('submit', e => {
    e.preventDefault();

    const { email } = Object.fromEntries(new FormData(e.target));

    modals.close('subscribe');
    e.target.reset();
    toasts.success(`Подписали ${email}`);
});


// --- Promise-окна из компонента ---

defineComponent('file-list', ({ html, signal }) => {
    const files = signal(['отчёт.pdf', 'смета.xlsx', 'фото.jpg']);

    async function rename(name) {
        const next = await modals.prompt('Новое имя файла', { title: 'Переименовать', value: name, ok: 'Сохранить' });

        if (next === null || !next.trim() || next === name) return;

        files.value = files.value.map(file => (file === name ? next.trim() : file));
        toasts.show(`«${name}» → «${next.trim()}»`);
    }

    async function remove(name) {
        const ok = await modals.confirm(`Файл «${name}» будет удалён без возможности восстановления.`, {
            title: 'Удалить файл?',
            ok: 'Удалить',
            danger: true,
        });

        if (!ok) return;

        files.value = files.value.filter(file => file !== name);
        toasts.error(`«${name}» удалён`);
    }

    async function info() {
        await modals.alert(`Всего файлов: ${files.value.length}`, { title: 'Информация' });
        toasts.show('alert закрыт');
    }

    return () => html`
        <ul class="files">
            ${files.value.map(file => html`
                <li>
                    <span>📄 ${file}</span>
                    <button class="ghost" onclick=${() => rename(file)}>Переименовать</button>
                    <button class="ghost" onclick=${() => remove(file)}>Удалить</button>
                </li>
            `)}
        </ul>
        <button onclick=${info}>Сколько файлов?</button>
    `;
});


// --- уведомления ---

document.getElementById('toast-info').onclick = () => toasts.show('Просто сообщение');
document.getElementById('toast-success').onclick = () => toasts.success('Сохранено');
document.getElementById('toast-error').onclick = () => toasts.error('Не удалось сохранить', { timeout: 0 });
