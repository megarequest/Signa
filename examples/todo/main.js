const { defineComponent, signal, effect } = window.Signa;


// Composable — обычная функция. Вызванный внутри setup, effect
// привязывается к компоненту и остановится вместе с ним.
function useStoredSignal(key, initial) {
    const stored = localStorage.getItem(key);
    const value = signal(stored === null ? initial : JSON.parse(stored));

    effect(() => localStorage.setItem(key, JSON.stringify(value.value)));

    return value;
}


defineComponent('todo-app', ({ html, computed, location }) => {
    const todos = useStoredSignal('signa-todos', [
        { id: 1, text: 'Подключить signa.core.min.js', done: true },
        { id: 2, text: 'Объявить компонент', done: true },
        { id: 3, text: 'Выкинуть jQuery', done: false },
    ]);

    const draft = signal('');

    const filter = computed(() => location.query.value.filter ?? 'all');

    const visible = computed(() =>
        todos.value.filter(todo =>
            filter.value === 'all' ||
            (filter.value === 'done' ? todo.done : !todo.done)
        )
    );

    const left = computed(() => todos.value.filter(todo => !todo.done).length);

    function add(e) {
        e.preventDefault();

        const text = draft.value.trim();

        if (!text) return;

        todos.value = [...todos.value, { id: Date.now(), text, done: false }];
        draft.value = '';
    }

    function toggle(id) {
        todos.value = todos.value.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
        );
    }

    function remove(id) {
        todos.value = todos.value.filter(todo => todo.id !== id);
    }

    const filters = [['all', 'Все'], ['active', 'Активные'], ['done', 'Готовые']];

    return () => html`
        <form class="row" onsubmit=${add}>
            <input class="grow" placeholder="Новая задача" .value=${draft.value}
                oninput=${e => (draft.value = e.target.value)}>
            <button class="primary">Добавить</button>
        </form>

        <ul class="todos">
            ${visible.value.map(todo => html`
                <li class=${todo.done ? 'done' : ''}>
                    <label>
                        <input type="checkbox" .checked=${todo.done} onchange=${() => toggle(todo.id)}>
                        ${todo.text}
                    </label>
                    <button class="ghost" aria-label="Удалить" onclick=${() => remove(todo.id)}>✕</button>
                </li>
            `)}
        </ul>

        <div class="row">
            <span class="muted">Осталось: ${left.value}</span>
            <span class="spacer"></span>
            ${filters.map(([key, label]) => html`
                <button
                    class=${filter.value === key ? 'active' : ''}
                    onclick=${() => location.set('filter', key === 'all' ? null : key)}
                >${label}</button>
            `)}
        </div>
    `;
});
