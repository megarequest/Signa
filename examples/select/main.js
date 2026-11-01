const { defineComponent } = window.Plainly;


// Обычный JS: слушаем событие компонента
document.getElementById('sort').addEventListener('change', e => {
    document.getElementById('sort-out').textContent =
        `change: ${e.detail.value} (${e.detail.option.label})`;
});

document.getElementById('order').addEventListener('submit', e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    document.getElementById('order-out').textContent = JSON.stringify(data);
});


// Зависимые списки внутри компонента
const cars = {
    toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
    bmw: ['3 Series', '5 Series', 'X3', 'X5'],
    lada: ['Vesta', 'Granta', 'Niva'],
};

const brands = [
    { value: 'toyota', label: 'Toyota' },
    { value: 'bmw', label: 'BMW' },
    { value: 'lada', label: 'Lada' },
];

defineComponent('car-picker', ({ html, signal, computed }) => {
    const brand = signal(null);
    const model = signal(null);

    // сигнал уходит в дочерний ui-select: он перерисуется при смене марки
    const models = computed(() =>
        (cars[brand.value] ?? []).map(name => ({ value: name, label: name }))
    );

    const pickBrand = value => {
        brand.value = value;
        model.value = null;
    };

    return () => html`
        <div class="row">
            <ui-select data-placeholder="Марка" .options=${brands} .onChange=${pickBrand}></ui-select>
            <ui-select
                data-placeholder=${brand.value ? 'Модель' : 'Сначала марка'}
                ?data-disabled=${!brand.value}
                .options=${models}
                .onChange=${value => (model.value = value)}
            ></ui-select>
        </div>
        <p class="muted">${brand.value && model.value
            ? `Выбрано: ${brand.value} ${model.value}`
            : 'Выберите марку и модель'}</p>
    `;
});
