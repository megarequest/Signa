import {
    signal,
    computed,
    batch,
} from '@preact/signals-core';

import { html, svg } from 'uhtml';

import { defineComponent } from './component.js';
import { defineStore, store } from './store.js';
import { effect } from './scope.js';
import { bus } from './bus.js';
import { ext } from './ext.js';

ext.bus = bus;

export const Plainly = {
    defineComponent,
    defineStore,
    store,

    signal,
    computed,
    effect,
    batch,

    html,
    svg,

    bus,

    // поля, которые аддоны добавляют в контекст компонентов и сторов
    ctx: ext,
};

window.Plainly = Plainly;
