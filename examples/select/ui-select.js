/**
 * <ui-select> — выпадающий список.
 *
 *   <ui-select data-name="city" data-placeholder="Город" data-value="spb" data-search>
 *       <option value="msk">Москва</option>
 *       <option value="spb">Санкт-Петербург</option>
 *       <option value="kzn" disabled>Казань</option>
 *   </ui-select>
 *
 * Варианты — дочерние <option> (удобно рендерить на сервере)
 * или свойство .options=${[{ value, label, disabled }]} / сигнал с таким массивом.
 *
 * data-name         имя скрытого input: значение уходит вместе с <form>
 * data-value        начальное значение
 * data-placeholder  текст, пока ничего не выбрано
 * data-search       поле поиска по вариантам
 * data-disabled     заблокирован
 * .onChange         колбэк (value, option) — удобно из родительского компонента
 *
 * Событие "change" с detail: { value, option } — удобно из обычного JS.
 */
Plainly.defineComponent('ui-select', ({ html, signal, computed, effect, prop, slot, $this }) => {
    const name = prop('name', String, '');
    const placeholder = prop('placeholder', String, 'Выберите…');
    const search = prop('search', Boolean, false);
    const disabled = prop('disabled', Boolean, false);
    const onChange = prop('onChange');

    // варианты из разметки, если .options не передали
    const fromMarkup = slot.default
        .filter(node => node.tagName === 'OPTION')
        .map(option => ({
            value: option.value,
            label: option.textContent.trim(),
            disabled: option.disabled,
            selected: option.hasAttribute('selected'),
        }));

    const options = prop('options', Array, fromMarkup);

    const initial = prop('value', String, '').peek()
        || fromMarkup.find(option => option.selected)?.value
        || null;

    const value = signal(initial);
    const open = signal(false);
    const query = signal('');
    const active = signal(0);

    const current = computed(() =>
        options.value.find(option => option.value === value.value) ?? null
    );

    const filtered = computed(() => {
        const q = query.value.trim().toLowerCase();

        return q
            ? options.value.filter(option => option.label.toLowerCase().includes(q))
            : options.value;
    });

    // список вариантов сменился, а выбранного в нём нет — сбрасываем
    effect(() => {
        if (value.value !== null && !current.value) value.value = null;
    });

    function show() {
        if (disabled.value) return;

        query.value = '';
        active.value = Math.max(0, options.value.indexOf(current.value));
        open.value = true;
    }

    function hide(focusButton = true) {
        open.value = false;

        if (focusButton) $this.querySelector('.sel-trigger')?.focus();
    }

    function choose(option) {
        if (!option || option.disabled) return;

        hide();

        if (option.value === value.value) return;

        value.value = option.value;

        if (typeof onChange === 'function') onChange(option.value, option);

        $this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: { value: option.value, option },
        }));
    }

    // следующий не заблокированный вариант в направлении step
    function move(step) {
        const list = filtered.value;

        for (let i = 1; i <= list.length; i++) {
            const index = (active.value + step * i + list.length) % list.length;

            if (!list[index].disabled) {
                active.value = index;
                return;
            }
        }
    }

    function onKey(e) {
        if (!open.value) {
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
                show();
            }

            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                move(1);
                break;

            case 'ArrowUp':
                e.preventDefault();
                move(-1);
                break;

            case 'Enter':
                e.preventDefault();
                choose(filtered.value[active.value]);
                break;

            case 'Escape':
                e.preventDefault();
                hide();
                break;

            case 'Tab':
                hide(false);
                break;
        }
    }

    // клик снаружи закрывает список
    effect(() => {
        if (!open.value) return;

        const onPointer = e => {
            if (!$this.contains(e.target)) hide(false);
        };

        document.addEventListener('pointerdown', onPointer);

        return () => document.removeEventListener('pointerdown', onPointer);
    });

    // после открытия: фокус в поиск, активный вариант — в зону видимости
    effect(() => {
        if (!open.value) return;

        active.value;

        queueMicrotask(() => {
            if (search.peek()) $this.querySelector('.sel-search')?.focus();
            $this.querySelector('.sel-option.active')?.scrollIntoView({ block: 'nearest' });
        });
    });

    const id = `sel-${Math.random().toString(36).slice(2, 8)}`;

    return () => html`
        <div class=${open.value ? 'sel open' : 'sel'} onkeydown=${onKey}>
            <input type="hidden" name=${name.value} .value=${value.value ?? ''}>

            <button type="button" class="sel-trigger"
                role="combobox"
                aria-haspopup="listbox"
                aria-controls=${id}
                aria-expanded=${String(open.value)}
                ?disabled=${disabled.value}
                onclick=${() => (open.value ? hide() : show())}>
                <span class=${current.value ? 'sel-value' : 'sel-value sel-placeholder'}>
                    ${current.value?.label ?? placeholder.value}
                </span>
                <span class="sel-arrow" aria-hidden="true">▾</span>
            </button>

            ${open.value ? html`
                <div class="sel-panel">
                    ${search.value ? html`
                        <input class="sel-search" placeholder="Поиск…" autocomplete="off"
                            .value=${query.value}
                            oninput=${e => { query.value = e.target.value; active.value = 0; }}
                            onchange=${e => e.stopPropagation()}>
                    ` : null}

                    <ul class="sel-list" role="listbox" id=${id}>
                        ${filtered.value.length === 0
                            ? html`<li class="sel-empty">Ничего не найдено</li>`
                            : filtered.value.map((option, index) => html`
                                <li role="option"
                                    class=${[
                                        'sel-option',
                                        index === active.value && 'active',
                                        option.value === value.value && 'selected',
                                        option.disabled && 'disabled',
                                    ].filter(Boolean).join(' ')}
                                    aria-selected=${String(option.value === value.value)}
                                    aria-disabled=${String(!!option.disabled)}
                                    onpointermove=${() => { if (!option.disabled) active.value = index; }}
                                    onclick=${() => choose(option)}>
                                    ${option.label}
                                </li>
                            `)}
                    </ul>
                </div>
            ` : null}
        </div>
    `;
});
