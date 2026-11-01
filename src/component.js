import { render, html } from 'uhtml';

import {
    signal,
    computed,
} from '@preact/signals-core';

import {
    isSignal,
    storeAccess,
} from './store.js';

import {
    createScope,
    withScope,
    effect,
    disposeScope,
} from './scope.js';

import { ext } from './ext.js';


function toKebab(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}


function toCamel(str) {
    return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}


// фабрики, а не значения: {} и [] не должны делиться между экземплярами
const DEFAULTS = new Map([
    [String, () => ''],
    [Number, () => 0],
    [Boolean, () => false],
    [Object, () => ({})],
    [Array, () => []],
]);

function defaultFor(type) {
    return DEFAULTS.get(type)?.() ?? null;
}


function parseAttr(value, type) {
    if (type === Number) {
        const n = Number(value);

        if (!Number.isNaN(n)) {
            return n;
        }

        if (__DEV__) {
            console.warn(`[Plainly] cannot parse "${value}" as Number`);
        }

        return 0;
    }

    if (type === Boolean) {
        // "" (голый атрибут) и любое значение, кроме "false" -> true
        return value !== 'false';
    }

    if (type === Object || type === Array) {
        try {
            return JSON.parse(value);
        } catch {
            return defaultFor(type);
        }
    }

    return value;
}


function detectType(raw, attrVal, defaultValue) {
    if (raw != null) {
        return raw.constructor;
    }

    if (attrVal === null) {
        return defaultValue != null ? defaultValue.constructor : String;
    }

    const trimmed = attrVal.trim();

    if (trimmed !== '' && !isNaN(Number(trimmed))) return Number;
    if (trimmed === 'true' || trimmed === 'false') return Boolean;
    if (trimmed[0] === '{') return Object;
    if (trimmed[0] === '[') return Array;

    return String;
}


// Обёртка пропса только для чтения. Один прототип на все пропсы
// вместо объекта с геттерами на каждый вызов prop()
class ReadonlyProp {
    constructor(s, key) {
        this._s = s;
        this._key = key;
    }

    get value() {
        return this._s.value;
    }

    set value(_) {
        if (__DEV__) {
            console.warn(`[Plainly] prop "${this._key}" is read-only`);
        }
    }

    peek() {
        return this._s.peek();
    }
}


export function defineComponent(tagName, setup) {
    if (customElements.get(tagName)) {
        throw new Error(
            __DEV__ ? `[Plainly] <${tagName}> is already defined` : tagName
        );
    }

    class Component extends HTMLElement {
        // name -> ReadonlyProp или внешний сигнал/функция
        #props = new Map();

        // name -> { s, type, def }: только сигналы, которыми владеет компонент.
        // Внешние сигналы сюда НЕ попадают, атрибуты их не перезаписывают.
        #owned = new Map();

        // имя атрибута (в нижнем регистре) -> имя пропса
        #attrToProp = new Map();

        #slots = null;

        // scope живёт, пока компонент смонтирован; null — не смонтирован
        #scope = null;
        #observer = null;

        #resolveProp(name, type, defaultValue) {
            // нормализуем: prop('user-name') и prop('userName') — один и тот же пропс
            const key = toCamel(name);

            if (this.#props.has(key)) {
                return this.#props.get(key);
            }

            // только собственное свойство экземпляра (.prop=${...} от родителя):
            // родные title, id, hidden и т.п. не должны перебивать data-атрибут
            const raw = Object.prototype.hasOwnProperty.call(this, key) ? this[key] : undefined;

            if (isSignal(raw) || typeof raw === 'function') {
                this.#props.set(key, raw);
                return raw;
            }

            const kebab = toKebab(key);
            const attrVal =
                this.getAttribute(`data-${kebab}`) ??
                this.getAttribute(`data-${key.toLowerCase()}`);

            const finalType = type ?? detectType(raw, attrVal, defaultValue);

            const initial =
                raw !== undefined
                    ? raw
                    : attrVal !== null
                        ? parseAttr(attrVal, finalType)
                        : defaultValue !== undefined
                            ? defaultValue
                            : defaultFor(finalType);

            const s = signal(initial);

            this.#owned.set(key, { s, type: finalType, def: defaultValue });
            this.#attrToProp.set(`data-${kebab}`, key);
            this.#attrToProp.set(`data-${key.toLowerCase()}`, key);

            const prop = new ReadonlyProp(s, key);

            this.#props.set(key, prop);

            return prop;
        }

        #collectSlots() {
            // собираем один раз: после первого рендера в childNodes
            // уже лежит отрисованный результат, а не исходные слоты
            if (this.#slots) {
                return this.#slots;
            }

            const slots = {
                default: [],
            };

            for (const node of [...this.childNodes]) {
                const name = node instanceof Element && node.getAttribute('data-slot');

                if (name) {
                    (slots[name] ??= []).push(...node.childNodes);
                } else {
                    slots.default.push(node);
                }
            }

            return (this.#slots = slots);
        }

        #ctx() {
            const slots = this.#collectSlots();

            return {
                ...ext,

                $this: this,

                signal,
                computed,
                effect,

                html,

                prop: (name, type, def) =>
                    this.#resolveProp(name, type, def),

                slot: Object.assign(
                    name => slots[name] ?? [],
                    { default: slots.default }
                ),
            };
        }

        #onAttributes(mutations) {
            for (const { attributeName } of mutations) {
                const entry = this.#owned.get(this.#attrToProp.get(attributeName));

                if (!entry) {
                    continue;
                }

                const value = this.getAttribute(attributeName);

                entry.s.value = value === null
                    ? entry.def ?? defaultFor(entry.type)
                    : parseAttr(value, entry.type);
            }
        }

        #mount(scope) {
            // элемент успели отключить, пока ждали монтирования
            if (this.#scope !== scope) {
                return;
            }

            try {
                withScope(scope, () => {
                    const renderFn = setup(
                        this.#ctx(),
                        storeAccess()
                    );

                    if (typeof renderFn === 'function') {
                        // эффект живёт в scope компонента и
                        // останавливается вместе с ним
                        effect(() => {
                            render(this, renderFn());
                        });
                    }
                });
            } catch (e) {
                console.error(
                    `[Plainly] error mounting <${tagName}>:`,
                    e
                );

                this.#teardown();
            }
        }

        connectedCallback() {
            // повторное подключение в том же тике (перемещение по DOM):
            // компонент остаётся смонтированным и сохраняет состояние
            if (this.#scope) {
                return;
            }

            const scope = (this.#scope = createScope());

            this.#observer = new MutationObserver(
                mutations => this.#onAttributes(mutations)
            );

            this.#observer.observe(this, {
                attributes: true,
            });

            // пока парсер не дошёл до конца документа, дети элемента
            // (а значит и слоты) могут быть ещё не созданы
            if (document.readyState === 'loading') {
                document.addEventListener(
                    'DOMContentLoaded',
                    () => this.#mount(scope),
                    { once: true }
                );
            } else {
                queueMicrotask(() => this.#mount(scope));
            }
        }

        disconnectedCallback() {
            queueMicrotask(() => {
                if (!this.isConnected) {
                    this.#teardown();
                }
            });
        }

        #teardown() {
            this.#observer?.disconnect();
            this.#observer = null;

            disposeScope(this.#scope);
            this.#scope = null;

            // при повторном подключении setup выполнится заново,
            // поэтому пропсы должны быть созданы с нуля
            this.#props.clear();
            this.#owned.clear();
            this.#attrToProp.clear();
        }
    }

    customElements.define(tagName, Component);
}
