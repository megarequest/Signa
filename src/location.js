import { signal, computed } from '@preact/signals-core';

function parseQuery(search = window.location.search) {
    const result = {};
    const params = new URLSearchParams(search);

    for (const [rawKey, value] of params) {
        const isArray = rawKey.endsWith('[]');
        const key = isArray ? rawKey.slice(0, -2) : rawKey;

        if (isArray) {
            (result[key] ??= []).push(value);
        } else {
            result[key] = value;
        }
    }

    return result;
}

function stringifyQuery(query) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value == null) continue;

        if (Array.isArray(value)) {
            for (const item of value) {
                if (item != null) {
                    params.append(`${key}[]`, item);
                }
            }
        } else {
            params.set(key, value);
        }
    }

    return params.toString();
}

function getPath() {
    return window.location.pathname || '/';
}

function getHash() {
    return window.location.hash;
}

function getUrl() {
    return getPath() + window.location.search + getHash();
}

function snapshot() {
    return {
        url: getUrl(),
        path: getPath(),
        hash: getHash(),
        query: parseQuery(),
    };
}

const current = signal(snapshot());

const query = computed(() => current.value.query);

function sync() {
    // не создаём новый объект, если URL не изменился,
    // чтобы не вызывать лишние перерисовки
    if (getUrl() === current.peek().url) {
        return;
    }

    current.value = snapshot();
}

function update(url, replace = true) {
    history[replace ? 'replaceState' : 'pushState'](
        null,
        '',
        url
    );

    // sync вызовет обёртка над history в конце файла
    return url;
}

function withQuery(path, next) {
    const search = stringifyQuery(next);

    return path + (search ? `?${search}` : '');
}

export const location = {
    current,
    query,

    url(value) {
        if (value === undefined) {
            return getUrl();
        }

        return update(value);
    },

    path(value) {
        if (value === undefined) {
            return getPath();
        }

        return update(withQuery(value, current.value.query));
    },

    get(key) {
        return current.value.query[key];
    },

    getAll() {
        return current.value.query;
    },

    set(values, value) {
        const next = {
            ...current.value.query,
        };

        if (typeof values === 'string') {
            values = {
                [values]: value,
            };
        }

        for (const [key, val] of Object.entries(values)) {
            if (val == null) {
                delete next[key];
            } else {
                next[key] = val;
            }
        }

        // hash сохраняем: на нём может жить hash-роутер
        return update(withQuery(getPath(), next) + getHash());
    },

    go(value) {
        window.location.href = value ?? getUrl();
    },

    // меняет URL без записи в историю
    replace(value) {
        return update(value ?? getUrl(), true);
    },

    // меняет URL с новой записью в истории (работает кнопка «назад»)
    push(value) {
        return update(value ?? getUrl(), false);
    },

    back() {
        window.history.back();
    },

    forward() {
        window.history.forward();
    },
};

window.addEventListener('popstate', sync);
window.addEventListener('hashchange', sync);

// pushState / replaceState сами по себе не вызывают popstate,
// поэтому оборачиваем их один раз на всю страницу
for (const method of ['pushState', 'replaceState']) {
    const original = history[method];

    history[method] = function (...args) {
        const result = original.apply(this, args);
        sync();
        return result;
    };
}