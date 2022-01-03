import Fetch, { FetchOptions } from '@watch-state/fetch'

export type Data = Record<string, string | number | boolean>

export interface ApiOptions<V = any, E = any> extends FetchOptions<V, E> {
  data?: Data
}

export const dataReg = /\{(\w+)\}/g

export function apiReplace (url: string, values: Data): string {
  return url.replace(dataReg, (str, key) => key in values ? String(values[key]) : '')
}

export default class Api<V = any, E = any, D extends Data = Data> {
  cache: Record<string, Fetch<V, E>> = Object.create(null)
  constructor (public url: string, public options: ApiOptions<V, E> = {}) {}

  get (data?: D): Fetch<V, E> {
    const values = data || this.options.data ? { ...this.options.data, ...data } : undefined
    const url = values ? apiReplace(this.url,values) : this.url

    if (url in this.cache) {
      return this.cache[url]
    }
    return this.cache[url] = new Fetch(url, this.options)
  }
}
