import Fetch from '@watch-state/fetch';
import type { ApiData, ApiOptions, DataKeys } from './types';
export declare const dataReg: RegExp;
export declare class FetchApi<Value = unknown, Err = Error, Data extends ApiData = ApiData> extends Fetch<Value, Err> {
    #private;
    url: string;
    options?: ApiOptions<Value, Data>;
    constructor(url: string, options?: ApiOptions<Value, Data>);
    protected resolve(value: Value): void;
    destroy(): void;
}
declare class ApiFetch<Value, Err, Data extends ApiData> extends FetchApi<Value, Err, Data> {
    url: string;
    api: Api<Value, Err, Data>;
    constructor(url: string, api: Api<Value, Err, Data>);
    protected resolve(value: Value): void;
}
export default class Api<Value = unknown, Err = Error, Data extends ApiData = ApiData> {
    url: string;
    options: ApiOptions<Value, Data>;
    cache: Record<string, ApiFetch<Value, Err, Data>>;
    keyCache: Record<DataKeys, Set<ApiFetch<Value, Err, Data>>>;
    keyCacheMap: Record<string, DataKeys[]>;
    constructor(url: string, options?: ApiOptions<Value, Data>);
    get(data?: Data): ApiFetch<Value, Err, Data>;
    update(keys?: string[], timeout?: number): void;
    destroy(): void;
}
export {};
