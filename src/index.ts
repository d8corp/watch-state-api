import Fetch, { FetchOptions } from '@watch-state/fetch'

export interface ApiOptions<V = any, E = any, D = any> extends FetchOptions<V, E> {
  data?: D
}

export const dataReg = /\{(\w+)\}/g

export default class Api<V = any, E = any, D = any> {
  cache: Record<string, Fetch<V, E>> = Object.create(null)
  constructor (public url: string, public options: ApiOptions<V, E, D> = {}) {}

  get (data?: D): Fetch<V, E> {
    const values = { ...this.options.data, ...data }
    const foundKeys = Object.create(null)
    let url = this.url.replace(dataReg, (str, key) => {
      if (key in values) {
        foundKeys[key] = true
        return String(values[key])
      }

      return ''
    })

    let search = ''
    for (const key in values) {
      if (key in foundKeys) continue
      const value = values[key]
      if (value === undefined) continue

      if (Array.isArray(value)) {
        for (const subValue of value) {
          search += `${key}[]=${subValue}&`
        }
      } else {
        search += `${key}=${values[key]}&`
      }
    }

    if (search) {
      url += `?${search.slice(0, -1)}`
    }

    if (url in this.cache) {
      return this.cache[url]
    }

    return this.cache[url] = new Fetch(url, this.options)
  }
}
