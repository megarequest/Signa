// В отдельной сборке аддона сигналы берутся из уже загруженного ядра,
// чтобы на странице не оказалось двух копий @preact/signals-core
const core = window.Signa;

if (!core) {
    throw new Error('[Signa] signa.core.min.js must be loaded before this addon');
}

export const { signal, computed, effect, batch } = core;
