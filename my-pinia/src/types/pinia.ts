export type PiniaOpt<S extends AnyRecord<any>> = {
    state?: () => S
    getters?: AnyRecord<(this: S, state: S) => any>
    actions?: AnyRecord<(this: S) => any>
}

export type PiniaSetup = () => AnyRecord<any>
export type AnyRecord<E> = Record<string | number | symbol, E>

export type PiniaStore = {
    state: AnyRecord<any>
}
