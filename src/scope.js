import { effect as rawEffect } from '@preact/signals-core';

let currentScope = null;

export function createScope() {
    return {
        _cleanups: new Set(),
        _disposed: false,
    };
}

export function withScope(scope, fn) {
    const previousScope = currentScope;

    currentScope = scope;

    try {
        return fn();
    } finally {
        currentScope = previousScope;
    }
}

// Внутри setup компонента или фабрики стора эффект привязывается к scope
// и останавливается вместе с ним. Снаружи — обычный эффект.
export function effect(fn) {
    const stop = rawEffect(fn);

    if (currentScope && !currentScope._disposed) {
        currentScope._cleanups.add(stop);
    }

    return stop;
}

export function disposeScope(scope) {
    if (!scope || scope._disposed) {
        return;
    }

    scope._disposed = true;

    const cleanups = [...scope._cleanups].reverse();

    scope._cleanups.clear();

    for (const cleanup of cleanups) {
        try {
            cleanup();
        } catch (e) {
            console.error('[Plainly] cleanup error:', e);
        }
    }
}
