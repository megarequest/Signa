/**
 * <ui-dropdown> — обёртка: кнопка-триггер + выпадающая панель с любым содержимым.
 *
 *   <ui-dropdown data-align="end" data-hover data-keep-open>
 *       <div data-slot="trigger"><button>Меню</button></div>
 *       ...содержимое панели...
 *   </ui-dropdown>
 *
 * data-align      start | end — к какому краю триггера прижать панель
 * data-hover      открывать при наведении, а не по клику
 * data-keep-open  не закрывать при клике по ссылкам и кнопкам внутри панели
 *
 * События: "dropdown:open", "dropdown:close" на самом элементе.
 */
Plainly.defineComponent('ui-dropdown', ({ html, signal, effect, prop, slot, $this }) => {
    const align = prop('align', String, 'start');
    const hover = prop('hover', Boolean, false);
    const keepOpen = prop('keepOpen', Boolean, false);

    const open = signal(false);

    const trigger = slot('trigger');
    const triggerEl = trigger.find(node => node.nodeType === 1);

    triggerEl?.setAttribute('aria-haspopup', 'true');

    // закрытие по клику снаружи и по Escape — только пока панель открыта
    effect(() => {
        if (!open.value) return;

        const onPointer = e => {
            if (!$this.contains(e.target)) open.value = false;
        };

        const onKey = e => {
            if (e.key !== 'Escape') return;

            open.value = false;
            triggerEl?.focus();
        };

        document.addEventListener('pointerdown', onPointer);
        document.addEventListener('keydown', onKey);

        return () => {
            document.removeEventListener('pointerdown', onPointer);
            document.removeEventListener('keydown', onKey);
        };
    });

    // aria-состояние на кнопке и события для внешнего кода
    let mounted = false;

    effect(() => {
        triggerEl?.setAttribute('aria-expanded', String(open.value));

        if (mounted) {
            $this.dispatchEvent(new CustomEvent(open.value ? 'dropdown:open' : 'dropdown:close'));
        }

        mounted = true;
    });

    // небольшая задержка, чтобы панель не закрывалась, пока курсор идёт от кнопки к панели
    let leaveTimer = 0;

    const onEnter = () => {
        if (!hover.value) return;

        clearTimeout(leaveTimer);
        open.value = true;
    };

    const onLeave = () => {
        if (!hover.value) return;

        leaveTimer = setTimeout(() => (open.value = false), 150);
    };

    effect(() => () => clearTimeout(leaveTimer));

    // в hover-режиме клик только открывает: на тач-экранах наведения нет
    const onTriggerClick = () => {
        open.value = hover.value || !open.value;
    };

    const onPanelClick = e => {
        if (!keepOpen.value && e.target.closest('a, button')) open.value = false;
    };

    return () => html`
        <div class="dd" onmouseenter=${onEnter} onmouseleave=${onLeave}>
            <div class="dd-trigger" onclick=${onTriggerClick}>${trigger}</div>
            <div class=${`dd-panel dd-${align.value}${open.value ? ' open' : ''}`} onclick=${onPanelClick}>
                ${slot.default}
            </div>
        </div>
    `;
});
