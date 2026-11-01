import {
    signal,
    computed,
} from '@preact/signals-core';

import { html } from 'uhtml';

import {
    createScope,
    withScope,
    effect,
    disposeScope,
} from './scope.js';

import { ext } from './ext.js';

const registry = new Map();

export function isSignal(obj) {
    return (
        obj &&
        typeof obj === 'object' &&
        typeof obj.peek === 'function' &&
        'value' in obj
    );
}

// Регистрирует стор и возвращает функцию доступа к нему.
// Фабрика вызывается лениво, один раз, при первом обращении.
export function defineStore(name, factory) {
    if (registry.has(name)) {
        throw new Error(
            __DEV__ ? `[Plainly] store "${name}" is already defined` : name
        );
    }

    registry.set(name, {
        _factory: factory,
        _ready: false,
        _resolving: false,
    });

    return () => store(name);
}

export function store(name) {
    const entry = registry.get(name);

    if (!entry) {
        throw new Error(
            __DEV__ ? `[Plainly] store "${name}" is not defined` : name
        );
    }

    if (entry._ready) {
        return entry._instance;
    }

    if (entry._resolving) {
        throw new Error(
            __DEV__ ? `[Plainly] circular dependency: "${name}"` : name
        );
    }

    entry._resolving = true;

    const scope = createScope();

    try {
        entry._instance = withScope(
            scope,
            () =>
                entry._factory(
                    {
                        ...ext,
                        signal,
                        computed,
                        effect,
                        html,
                        store,
                    },
                    storeAccess()
                )
        );

        entry._ready = true;
    } catch (e) {
        disposeScope(scope);

        throw e;
    } finally {
        entry._resolving = false;
    }

    return entry._instance;
}

// Второй аргумент setup: ({ cart }) — то же, что store('cart')
export function storeAccess() {
    return new Proxy(
        {},
        {
            get(_, name) {
                if (typeof name !== 'string') {
                    return undefined;
                }

                return store(name);
            },

            has(_, name) {
                return (
                    typeof name === 'string' &&
                    registry.has(name)
                );
            },
        }
    );
}
