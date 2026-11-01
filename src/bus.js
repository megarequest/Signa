import { untracked } from '@preact/signals-core';

const listeners = new Map();
const cache = new Map();

// Событие "липкое": новый подписчик сразу получает последнее значение,
// а затем и все следующие
export const bus = {
    emit(type, payload) {
        cache.set(type, payload);
        listeners.get(type)?.forEach(fn => fn(payload));
    },
    on(type, handler) {
        if (!listeners.has(type)) listeners.set(type, new Set());

        const set = listeners.get(type);

        set.add(handler);

        // on() обычно зовут внутри effect: без untracked эффект подписался бы
        // на сигналы, которые читает обработчик, и зациклился
        if (cache.has(type)) untracked(() => handler(cache.get(type)));

        return () => set.delete(handler);
    },
};
