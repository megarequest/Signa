const { defineComponent } = window.Signa;


defineComponent('x-counter', ({ html, signal, computed, prop }) => {
    const start = prop('start', Number, 0);

    const count = signal(start.peek());
    const double = computed(() => count.value * 2);

    return () => html`
        <div class="row">
            <button onclick=${() => count.value--}>−</button>
            <output class="big">${count.value}</output>
            <button onclick=${() => count.value++}>+</button>
            <span class="muted">× 2 = ${double.value}</span>
        </div>
    `;
});


defineComponent('x-price', ({ html, prop, computed }) => {
    const amount = prop('amount', Number, 0);
    const currency = prop('currency', String, '₽');
    const sale = prop('sale', Boolean, false);

    const final = computed(() =>
        sale.value ? Math.round(amount.value * 0.8) : amount.value
    );

    return () => html`
        <span class="price">
            ${sale.value ? html`<s>${amount.value} ${currency.value}</s>` : null}
            <b>${final.value} ${currency.value}</b>
        </span>
    `;
});

// обычный JS: компонент сам заметит смену атрибутов
const price = document.getElementById('price');

document.getElementById('cheaper').onclick = () => {
    price.dataset.amount = Math.max(0, Number(price.dataset.amount) - 100);
};

document.getElementById('dearer').onclick = () => {
    price.dataset.amount = Number(price.dataset.amount) + 100;
};

document.getElementById('sale').onclick = () => {
    price.dataset.sale = price.dataset.sale !== 'true';
};


defineComponent('x-card', ({ html, signal, slot }) => {
    const open = signal(true);

    return () => html`
        <article class="card">
            <button class="card-head" onclick=${() => (open.value = !open.value)}>
                <span>${slot('title')}</span>
                <span class="muted">${open.value ? '▾' : '▸'}</span>
            </button>
            ${open.value ? html`
                <div class="card-body">${slot.default}</div>
                <footer class="card-foot muted">${slot('footer')}</footer>
            ` : null}
        </article>
    `;
});


defineComponent('x-color-picker', ({ html, signal }) => {
    const colors = ['#e5484d', '#f76b15', '#ffc53d', '#30a46c', '#0090ff', '#8e4ec6'];
    const selected = signal(colors[4]);

    return () => html`
        <div class="row">
            ${colors.map(color => html`
                <x-swatch
                    .color=${color}
                    .selected=${selected}
                    .onPick=${c => (selected.value = c)}
                ></x-swatch>
            `)}
            <code>${selected.value}</code>
        </div>
    `;
});

defineComponent('x-swatch', ({ html, prop }) => {
    const color = prop('color', String);
    // сигнал родителя приходит как есть
    const selected = prop('selected');
    // функция тоже, это не сигнал
    const onPick = prop('onPick');

    return () => html`
        <button
            class=${selected.value === color.value ? 'swatch active' : 'swatch'}
            style=${`background:${color.value}`}
            aria-label=${color.value}
            onclick=${() => onPick(color.value)}
        ></button>
    `;
});
