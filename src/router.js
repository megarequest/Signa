import { computed } from '@preact/signals-core';
import { location } from './location.js';

// Роутер не слушает браузер сам: путь берётся из реактивного Signa.location
export function createRouter(routes, { mode = 'hash' } = {}) {
    const hashMode = mode === 'hash';

    const routeMap = {};
    const compiledRoutes = [];

    let notFound = {
        render: () => '404',
    };

    for (const r of routes) {
        if (r.path === '*') {
            notFound = routeMap[r.name || '*'] = {
                ...r,
                keys: [],
            };

            continue;
        }

        const keys = [];

        const regex = new RegExp(
            '^' +
            r.path.replace(
                /:([^/]+)/g,
                (_, k) => {
                    keys.push(k);
                    return '([^/]+)';
                }
            ) +
            '$'
        );

        const entry = {
            ...r,
            keys,
            regex,
        };

        compiledRoutes.push(entry);

        if (r.name) {
            routeMap[r.name] = entry;
        }
    }

    function parse(path) {
        for (const route of compiledRoutes) {
            const match = path.match(route.regex);

            if (!match) continue;

            const params = {};

            route.keys.forEach((key, index) => {
                params[key] = decodeURIComponent(
                    match[index + 1]
                );
            });

            return {
                path,
                route,
                params,
            };
        }

        return {
            path,
            route: notFound,
            params: {},
        };
    }

    // отдельный computed для строки пути: смена query или
    // другой части URL не вызывает лишний разбор и перерисовку
    const path = computed(() => {
        const { path, hash } = location.current.value;

        return (hashMode ? hash.slice(1) : path) || '/';
    });

    const current = computed(() => parse(path.value));

    function route(name, params = {}) {
        const r = routeMap[name];

        if (!r) {
            throw new Error(
                __DEV__ ? `[Signa] route "${name}" not found` : name
            );
        }

        let path = r.path;

        for (const key of r.keys) {
            if (!(key in params)) {
                throw new Error(
                    __DEV__
                        ? `[Signa] missing param "${key}" for route "${name}"`
                        : key
                );
            }

            path = path.replace(
                ':' + key,
                encodeURIComponent(params[key])
            );
        }

        return hashMode
            ? '#' + path
            : path;
    }

    function go(nameOrPath, params) {
        const href = routeMap[nameOrPath]
            ? route(nameOrPath, params)
            : hashMode
                ? '#' + nameOrPath.replace(/^#/, '')
                : nameOrPath;

        location.push(href);

        return href;
    }

    function view() {
        const { route, params } = current.value;

        return route.render(params);
    }

    return {
        current,
        go,
        view,
        route,
    };
}
