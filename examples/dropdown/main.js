// Обычный JS: dropdown ничего не знает о том, что у него внутри

document.getElementById('actions').addEventListener('click', e => {
    const button = e.target.closest('[data-action]');

    if (button) {
        document.getElementById('last-action').textContent = `Выбрано: ${button.textContent}`;
    }
});

const filters = document.getElementById('filters');

filters.addEventListener('submit', e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    document.getElementById('filters-out').textContent = JSON.stringify(data, null, 2);
});

filters.addEventListener('dropdown:close', () => console.log('filters closed'));
