import Fetch, { FetchOptions } from '@watch-state/fetch';
export interface ApiOptions<V = any, E = any, D = any> extends FetchOptions<V, E> {
    data?: D;
}
export declare const dataReg: RegExp;
export default class Api<V = any, E = any, D = any> {
    url: string;
    options: ApiOptions<V, E, D>;
    cache: Record<string, Fetch<V, E>>;
    constructor(url: string, options?: ApiOptions<V, E, D>);
    get(data?: D): Fetch<V, E>;
}
