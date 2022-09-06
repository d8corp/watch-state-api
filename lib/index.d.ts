import Fetch, { FetchOptions } from '@watch-state/fetch';
export interface ApiOptions<V = any, E = any, D = any, K extends string | number = string | number> extends FetchOptions<V, E> {
    data?: D;
    getKeys?: (value: V) => K[];
}
export declare const dataReg: RegExp;
export default class Api<V = any, E = any, D = any, K extends string | number = string | number> {
    url: string;
    options: ApiOptions<V, E, D, K>;
    cache: Record<string, Fetch<V, E>>;
    keyCache: Record<K, Set<Fetch<V, E>>>;
    keyCacheMap: Record<string, K[]>;
    constructor(url: string, options?: ApiOptions<V, E, D, K>);
    get(data?: D): Fetch<V, E>;
    update(keys?: K[], timeout?: number): void;
}
