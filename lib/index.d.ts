import Fetch, { FetchOptions } from '@watch-state/fetch';
export declare type Data = Record<string, string | number | boolean>;
export interface ApiOptions extends FetchOptions {
    data?: Data;
}
export declare const dataReg: RegExp;
export declare function apiReplace(url: string, values: Data): string;
export default class Api<V = any, E = any, D extends Data = Data> {
    url: string;
    options: ApiOptions;
    cache: Record<string, Fetch<V, E>>;
    constructor(url: string, options?: ApiOptions);
    get(data?: D): Fetch<V, E>;
}
