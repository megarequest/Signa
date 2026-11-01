// В отдельной сборке аддона сигналы берутся из уже загруженного ядра,
// чтобы на странице не оказалось двух копий @preact/signals-core
const core = window.Plainly;

if (!core) {
    throw new Error('[Plainly] plainly.core.min.js must be loaded before this addon');
}

export const { signal, computed, effect, batch } = core;
