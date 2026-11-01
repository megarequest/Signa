const { defineComponent, defineStore, html } = window.Plainly;

const users = [
    { id: 1, name: 'Анна', role: 'дизайнер' },
    { id: 2, name: 'Борис', role: 'бэкенд' },
    { id: 3, name: 'Вера', role: 'фронтенд' },
];

const useRouter = defineStore('router', () =>
    Plainly.router([
        {
            name: 'home',
            path: '/',
            render: () => html`<h2>Главная</h2><p>Выберите раздел в меню.</p>`,
        },
        {
            name: 'users',
            path: '/users',
            render: () => html`
                <h2>Пользователи</h2>
                <ul>
                    ${users.map(user => html`
                        <li><a href=${useRouter().route('user', { id: user.id })}>${user.name}</a></li>
                    `)}
                </ul>
            `,
        },
        {
            name: 'user',
            path: '/users/:id',
            render: ({ id }) => {
                const user = users.find(u => u.id === Number(id));

                return user
                    ? html`<h2>${user.name}</h2><p>${user.role}</p><p class="muted">params.id = ${id}</p>`
                    : html`<h2>Нет пользователя ${id}</h2>`;
            },
        },
        {
            name: 'about',
            path: '/about',
            render: () => html`<h2>О проекте</h2><p>Нативные веб-компоненты и сигналы.</p>`,
        },
        {
            path: '*',
            render: () => html`<h2>404</h2><p>Такой страницы нет.</p>`,
        },
    ])
);


defineComponent('nav-link', ({ html, prop, slot }) => {
    const router = useRouter();
    const to = prop('to', String, 'home');

    const href = () => router.route(to.value);

    return () => html`
        <a class=${router.current.value.route.name === to.value ? 'btn active' : 'btn'}
            href=${href()}>${slot.default}</a>
    `;
});


defineComponent('app-root', ({ html }) => {
    const router = useRouter();

    return () => html`
        <nav class="row">
            <nav-link data-to="home">Главная</nav-link>
            <nav-link data-to="users">Пользователи</nav-link>
            <nav-link data-to="about">О проекте</nav-link>
            <a class="btn" href="#/missing">Битая ссылка</a>
            <span class="spacer"></span>
            <button class="ghost" onclick=${() => router.go('user', { id: 2 })}>router.go('user', { id: 2 })</button>
        </nav>
        <section class="page">
            <code class="muted">${router.current.value.path}</code>
            ${router.view()}
        </section>
    `;
});
