# Plainly

Нативные веб-компоненты и сигналы для обычных HTML / PHP-сайтов. Один `<script>`, без сборки на странице, без React, Vue и jQuery.

Под капотом — [uhtml](https://github.com/WebReflection/uhtml) (шаблоны) и [@preact/signals-core](https://github.com/preactjs/signals) (реактивность).

- **~6 KB gzip** — ядро; роутер подключается отдельно (+1.2 KB)
- **Custom Elements** — компонент работает в любой разметке, в том числе отданной сервером
- **Сигналы** — перерисовывается только то, что прочитало изменившееся значение
- **Пропсы из `data-*`** — смена атрибута из обычного JS перерисовывает компонент
- **Сторы** — общее состояние между независимыми компонентами, заполняется прямо из PHP
- **Типы** — `plainly.d.ts` для подсказок в редакторе

```html
<script src="dist/plainly.core.min.js"></script>

<x-counter data-start="5"></x-counter>

<script>
    Plainly.defineComponent('x-counter', ({ html, signal, prop }) => {
        const count = signal(prop('start', Number, 0).peek())

        return () => html`
            <button onclick=${() => count.value++}>Нажато: ${count.value}</button>
        `
    })
</script>
```

## Примеры

Каждый пример — отдельная папка с `index.html`, открывается прямо из файла. Под каждым блоком есть вкладка «Код».

| Пример | Что показывает |
| --- | --- |
| [basics](examples/basics/) | сигналы, пропсы из `data-*`, слоты, передача сигналов и колбэков дочерним компонентам |
| [store](examples/store/) | общий стор корзины, три способа доступа, данные с сервера |
| [todo](examples/todo/) | composable, состояние фильтра в URL |
| [router](examples/router/) | hash-роутер, параметры, активная ссылка |
| [dropdown](examples/dropdown/) | `<ui-dropdown>` — обёртка вокруг любой кнопки и любого содержимого |
| [select](examples/select/) | `<ui-select>` — выпадающий список: поиск, клавиатура, формы, зависимые списки |
| [modal](examples/modal/) | `<ui-modal>` на `<dialog>`, `confirm` / `prompt` / `alert` через Promise, уведомления |

Компоненты из `dropdown`, `select` и `modal` лежат отдельными файлами `.js` + `.css` — их можно копировать в свой проект как есть.

## Установка

Готовые файлы лежат в `dist/`, их достаточно подключить на страницу.

| Файл | Что внутри | gzip |
| --- | --- | --- |
| `plainly.core.min.js` | компоненты, сторы, шина событий, сигналы | ~6.0 KB |
| `plainly.router.min.js` | `Plainly.location` и `Plainly.router`; подключается после ядра | ~1.2 KB |
| `plainly.min.js` | ядро и роутер одним файлом | ~6.9 KB |
| `plainly.min.mjs` | то же как ES-модуль: `import { Plainly } from './plainly.min.mjs'` | ~6.9 KB |
| `plainly.dev.js` | без минификации, с предупреждениями и sourcemap — для разработки | |
| `plainly.d.ts` | типы | |

```html
<!-- только то, что нужно странице -->
<script src="/dist/plainly.core.min.js"></script>
<script src="/dist/plainly.router.min.js"></script>
```

Собрать самостоятельно:

```bash
npm install
npm run build
```

## Компоненты

```js
Plainly.defineComponent('user-card', ({ html, signal, computed, effect, prop, slot, $this, bus, location }, stores) => {
    const name = prop('name', String, 'Аноним')     // data-name="..."
    const open = signal(false)

    effect(() => {
        console.log('имя:', name.value)
        return () => {}                               // очистка; вызовется и при удалении компонента
    })

    return () => html`
        <h3 onclick=${() => (open.value = !open.value)}>${name.value}</h3>
        ${open.value ? html`<div>${slot.default}</div>` : null}
        <footer>${slot('footer')}</footer>
    `
})
```

```html
<user-card data-name="Алекс">
    <p>Слот по умолчанию</p>
    <div data-slot="footer">Именованный слот</div>
</user-card>
```

| Контекст | |
| --- | --- |
| `html` | шаблон uhtml: `onclick=${fn}`, `.prop=${value}`, `?bool=${flag}`, `ref=${el => ...}` |
| `signal`, `computed` | реактивные значения |
| `effect(fn)` | эффект; останавливается вместе с компонентом |
| `prop(name, Type?, default?)` | пропс только для чтения |
| `slot.default`, `slot('name')` | дочерние узлы из разметки |
| `$this` | сам элемент |
| `bus` | шина событий |
| `location` | реактивный URL (с аддоном роутера) |

Второй аргумент setup — доступ к сторам по имени: `({ html }, { cart }) => ...`.

### Пропсы

Из атрибутов — значение приводится к типу (`String`, `Number`, `Boolean`, `Object`, `Array`), смена атрибута перерисовывает компонент:

```html
<x-price data-amount="1990" data-sale="false" data-tags='["new"]'></x-price>
```

```js
price.dataset.amount = 1890   // обычный JS, компонент обновится сам
```

Из родительского компонента — через свойство. Сигнал и функция приходят как есть:

```js
html`<x-swatch .color=${'#0090ff'} .selected=${selectedSignal} .onPick=${pick}></x-swatch>`
```

### Слоты

Содержимое элемента с `data-slot="имя"` попадает в `slot('имя')`, всё остальное — в `slot.default`. Удобно, когда разметку рендерит сервер.

## Сторы

```js
const useCart = Plainly.defineStore('cart', ({ signal, computed }) => {
    const items = signal([])
    const total = computed(() => items.value.reduce((sum, item) => sum + item.price, 0))

    return {
        items,
        total,
        add: item => (items.value = [...items.value, item]),
    }
})
```

Стор — ленивый синглтон: фабрика вызывается один раз, при первом обращении. Три способа его получить:

```js
const cart = useCart()                                         // функция из defineStore
Plainly.defineComponent('cart-badge', (ctx, { cart }) => ...)    // второй аргумент setup
Plainly.store('cart')                                            // по имени, откуда угодно
```

Данные с сервера:

```php
<script>Plainly.store('cart').items.value = <?= json_encode($items) ?></script>
```

## Composable

Обычные функции. `Plainly.effect`, вызванный внутри setup компонента, привязывается к нему и останавливается вместе с ним.

```js
function useStoredSignal(key, initial) {
    const value = Plainly.signal(JSON.parse(localStorage.getItem(key)) ?? initial)

    Plainly.effect(() => localStorage.setItem(key, JSON.stringify(value.value)))

    return value
}
```

## Шина событий

```js
effect(() => bus.on('message', text => { /* ... */ }))   // on() возвращает отписку
bus.emit('message', 'привет')
```

События «липкие»: новый подписчик сразу получает последнее значение.

## Роутер и location

Нужен `plainly.router.min.js` (или полный `plainly.min.js`).

```js
const useRouter = Plainly.defineStore('router', ({ html }) => Plainly.router([
    { name: 'home', path: '/', render: () => html`Главная` },
    { name: 'user', path: '/users/:id', render: ({ id }) => html`Пользователь ${id}` },
    { path: '*', render: () => html`404` },
], { mode: 'hash' }))   // или 'history'

// в компоненте
const router = useRouter()

html`<a href=${router.route('user', { id: 1 })}>Алекс</a> ${router.view()}`
router.go('user', { id: 2 })
router.current.value   // { path, params, route }
```

```js
Plainly.location.query.value.page    // реактивная query-строка
Plainly.location.set('page', 2)      // null удаляет ключ; без записи в историю
Plainly.location.push('/path')       // с записью в историю
```

## Глобальный API

`Plainly.defineComponent`, `defineStore`, `store`, `signal`, `computed`, `effect`, `batch`, `html`, `svg`, `bus`; с аддоном — `router`, `location`.

## Важно знать

- **Несколько `<script>` делят одну глобальную область.** `const { defineComponent } = Plainly` в двух файлах — ошибка повторного объявления. Деструктурируйте в одном файле (или внутри блока `{ ... }`), а в переиспользуемых компонентах пишите `Plainly.defineComponent`.
- **`onclick=${fn}` uhtml записывает свойством элемента**, поэтому `return false` отменяет событие (например, отправку формы). Пишите `e => { if (a) b() }`, а не `e => a && b()`.
- **Имена родных свойств** (`title`, `id`, `hidden`…) передаются в пропсы только через `data-*`.
- **Предупреждения** (запись в пропс, неверное значение атрибута) есть только в `plainly.dev.js`.
- **Браузеры:** Chrome / Edge 91+, Firefox 90+, Safari 15+.

## Структура

```
src/          исходники библиотеки
dist/         готовые сборки и типы
examples/     примеры, каждый в своей папке
build.js      сборка (esbuild)
```

## Лицензия

MIT
