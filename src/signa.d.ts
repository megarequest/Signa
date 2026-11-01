import type {
    Signal as PreactSignal,
    ReadonlySignal as PreactReadonlySignal,
} from '@preact/signals-core';

declare global {

    type Signal<T = any> = PreactSignal<T>;

    type ReadonlySignal<T = any> = PreactReadonlySignal<T>;

    /**
     * Реестр сторов для доступа по имени: Signa.store('cart') и ({ cart }) в setup.
     * Расширяется через declaration merging:
     *
     *   interface SignaStores { cart: ReturnType<typeof useCart> }
     *
     * Функция, которую вернул defineStore, типизирована и без этого.
     */
    interface SignaStores { }

    type StoreAccess = SignaStores & Record<string, any>;

    // ---------------------------------------------------------------
    // Bus
    // ---------------------------------------------------------------

    interface SignaBus {
        emit(type: string, payload?: any): void;

        /**
         * Возвращает функцию отписки. Если событие уже было,
         * обработчик сразу получит последнее значение.
         */
        on(type: string, handler: (payload: any) => void): () => void;
    }

    // ---------------------------------------------------------------
    // Router (аддон)
    // ---------------------------------------------------------------

    interface RouteDefinition {
        name?: string;
        path: string;
        render(params: Record<string, string>): any;
    }

    interface SignaRouter {
        current: ReadonlySignal<{
            path: string;
            params: Record<string, string>;
            route: RouteDefinition;
        }>;

        go(nameOrPath: string, params?: Record<string, any>): string;

        route(name: string, params?: Record<string, any>): string;

        view(): any;
    }

    // ---------------------------------------------------------------
    // Location (аддон)
    // ---------------------------------------------------------------

    type LocationQuery = Record<string, string | string[]>;

    type LocationValue =
        | string
        | number
        | boolean
        | string[]
        | number[]
        | null
        | undefined;

    interface SignaLocation {
        current: ReadonlySignal<{
            url: string;
            path: string;
            hash: string;
            query: LocationQuery;
        }>;

        query: ReadonlySignal<LocationQuery>;

        url(): string;
        url(value: string): string;

        path(): string;
        path(value: string): string;

        get(key: string): string | string[] | undefined;

        getAll(): LocationQuery;

        /** null / undefined удаляют ключ. Без записи в историю. */
        set(key: string, value: LocationValue): string;
        set(values: Record<string, LocationValue>): string;

        /** Полная перезагрузка страницы. */
        go(value?: string): void;

        /** Меняет URL без новой записи в истории. */
        replace(value?: string): string;

        /** Меняет URL с новой записью в истории. */
        push(value?: string): string;

        back(): void;

        forward(): void;
    }

    // ---------------------------------------------------------------
    // Props
    // ---------------------------------------------------------------

    type PropConstructor =
        | StringConstructor
        | NumberConstructor
        | BooleanConstructor
        | ObjectConstructor
        | ArrayConstructor
        | FunctionConstructor;

    type PropValue<T extends PropConstructor> =
        T extends StringConstructor ? string
        : T extends NumberConstructor ? number
        : T extends BooleanConstructor ? boolean
        : T extends ArrayConstructor ? any[]
        : T extends ObjectConstructor ? Record<string, any>
        : T extends FunctionConstructor ? Function
        : never;

    /**
     * Что возвращает prop(): объект с value/peek.
     * Если родитель передал настоящий сигнал, придёт он сам.
     */
    interface Prop<T = any> {
        readonly value: T;
        peek(): T;
    }

    type PropType<T extends PropConstructor> =
        T extends FunctionConstructor ? Function : Prop<PropValue<T>>;

    type SlotFn = ((name: string) => Node[]) & { default: Node[] };

    // ---------------------------------------------------------------
    // Contexts
    // ---------------------------------------------------------------

    type HtmlTag = (strings: TemplateStringsArray, ...values: any[]) => any;

    type EffectFn = (fn: () => (() => void) | void) => () => void;

    interface BaseContext {
        signal: <T>(initial?: T) => Signal<T>;
        computed: <T>(fn: () => T) => ReadonlySignal<T>;

        /** Эффект живёт в scope и останавливается автоматически. Возвращает stop. */
        effect: EffectFn;

        html: HtmlTag;
        bus: SignaBus;

        /** Есть, только если подключён аддон роутера (или полный signa.min.js). */
        location: SignaLocation;
    }

    interface StoreContext extends BaseContext {
        store: SignaCore['store'];
    }

    interface ComponentContext extends BaseContext {
        $this: HTMLElement;

        prop<T extends PropConstructor>(
            name: string,
            type: T,
            defaultValue?: PropValue<T>
        ): PropType<T>;

        prop<V = any>(name: string, type?: undefined, defaultValue?: V): Prop<V>;

        slot: SlotFn;
    }

    // ---------------------------------------------------------------
    // Signa
    // ---------------------------------------------------------------

    interface SignaCore {
        /** Имя тега обязательно содержит дефис. */
        defineComponent(
            tagName: `${string}-${string}`,
            setup: (ctx: ComponentContext, stores: StoreAccess) => (() => any) | void
        ): void;

        /** Регистрирует стор и возвращает функцию доступа к синглтону. */
        defineStore<T>(
            name: string,
            factory: (ctx: StoreContext, stores: StoreAccess) => T
        ): () => T;

        /** Стор по имени. */
        store<K extends keyof SignaStores>(name: K): SignaStores[K];
        store<T = any>(name: string): T;

        signal: <T>(initial?: T) => Signal<T>;
        computed: <T>(fn: () => T) => ReadonlySignal<T>;

        /** Внутри setup останавливается вместе с компонентом/стором, снаружи — вручную. */
        effect: EffectFn;

        batch: <T>(fn: () => T) => T;

        html: HtmlTag;
        svg: HtmlTag;

        bus: SignaBus;

        /** Поля, которые аддоны добавляют в контекст компонентов и сторов. */
        ctx: Record<string, any>;

        /** Только с аддоном роутера. */
        router(
            routes: RouteDefinition[],
            options?: { mode?: 'hash' | 'history' }
        ): SignaRouter;

        /** Только с аддоном роутера. */
        location: SignaLocation;
    }

    // var, а не const: тогда доступно и как window.Signa
    var Signa: SignaCore;
}

export { };
