import Fetch, { FetchOptions } from '@watch-state/fetch';
export declare type Data = Record<string, string | number | boolean>;
export declare type AvailableData = Data | void;
export interface ApiOptions<V = any, E = any> extends FetchOptions<V, E> {
    data?: Data;
}
export declare const dataReg: RegExp;
export declare function apiReplace(url: string, values: Data): string;
export default class Api<V = any, E = any, D extends AvailableData = AvailableData> {
    url: string;
    options: ApiOptions<V, E>;
    cache: Record<string, Fetch<V, E>>;
    constructor(url: string, options?: ApiOptions<V, E>);
    get(data?: D): Fetch<V, E>;
}
