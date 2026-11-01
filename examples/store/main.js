const { defineComponent } = window.Signa;


// способ 1: функция доступа из defineStore
defineComponent('cart-view', ({ html }) => {
    const cart = useCart();

    return () => html`
        <div class="cart">
            <h3>Корзина</h3>
            ${cart.items.value.length === 0
                ? html`<p class="muted">Пусто</p>`
                : html`
                    <ul class="list">
                        ${cart.items.value.map(item => html`
                            <li>
                                <span>${item.name} × ${item.qty}</span>
                                <span>${item.qty * item.price} ₽</span>
                                <button class="ghost" onclick=${() => cart.remove(item.id)}>−</button>
                            </li>
                        `)}
                    </ul>
                    <div class="row">
                        <button class="ghost" onclick=${cart.clear}>Очистить</button>
                        <span class="spacer"></span>
                        <span>Итого: <b>${cart.total.value} ₽</b></span>
                    </div>
                `}
        </div>
    `;
});


// способ 2: второй аргумент setup
defineComponent('product-list', ({ html }, { products, cart }) => {
    return () => html`
        <div>
            <h3>Каталог</h3>
            <ul class="list">
                ${products.list.value.map(product => html`
                    <li>
                        <span>${product.name}</span>
                        <span class="muted">${product.price} ₽</span>
                        <button onclick=${() => cart.add(product)}>В корзину</button>
                    </li>
                `)}
            </ul>
        </div>
    `;
});


// способ 3: по имени
defineComponent('cart-badge', ({ html }) => {
    const cart = Signa.store('cart');

    return () => html`<span class="badge">🛒 ${cart.count.value}</span>`;
});
