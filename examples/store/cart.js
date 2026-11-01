const { defineStore } = window.Signa;

defineStore('products', ({ signal }) => ({
    list: signal([]),
}));

// глобальная переменная, чтобы main.js мог вызвать useCart()
var useCart = defineStore('cart', ({ signal, computed, effect }) => {
    // корзина переживает перезагрузку страницы
    const saved = JSON.parse(localStorage.getItem('signa-cart') ?? '[]');
    const items = signal(saved);

    effect(() => {
        localStorage.setItem('signa-cart', JSON.stringify(items.value));
    });

    const count = computed(() =>
        items.value.reduce((n, item) => n + item.qty, 0)
    );

    const total = computed(() =>
        items.value.reduce((sum, item) => sum + item.qty * item.price, 0)
    );

    function add(product) {
        const exists = items.value.some(item => item.id === product.id);

        items.value = exists
            ? items.value.map(item =>
                item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            )
            : [...items.value, { ...product, qty: 1 }];
    }

    function remove(id) {
        items.value = items.value
            .map(item => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
            .filter(item => item.qty > 0);
    }

    function clear() {
        items.value = [];
    }

    return { items, count, total, add, remove, clear };
});
