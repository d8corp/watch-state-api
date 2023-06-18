import { type FetchOptions } from '@watch-state/fetch';
export type GetRequiredDataKeys<URL extends string> = URL extends `${infer Before}{${infer Field}}${infer After}` ? Field | GetRequiredDataKeys<After> | GetRequiredDataKeys<Before> : never;
export type DataKeys = string | number | symbol;
export type RequiredDataValues = string | number | boolean | null | undefined;
export type OptionalDataValues = RequiredDataValues | RequiredDataValues[];
export type ApiData = Record<DataKeys, OptionalDataValues>;
export interface ApiOptions<Value = unknown, Data extends ApiData = ApiData> extends FetchOptions<Value> {
    data?: Data;
    getKeys?: (value: Value) => DataKeys[];
}
