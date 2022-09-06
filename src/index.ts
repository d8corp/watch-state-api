import Fetch, { FetchOptions } from '@watch-state/fetch'

export interface ApiOptions<V = any, E = any, D = any, K extends string | number = string | number> extends FetchOptions<V, E> {
  data?: D
  getKeys?: (value: V) => K[]
}

export const dataReg = /\{(\w+)\}/g

export default class Api<V = any, E = any, D = any, K extends string | number = string | number> {
  cache: Record<string, Fetch<V, E>> = Object.create(null)
  keyCache: Record<K, Set<Fetch<V, E>>>
  keyCacheMap: Record<string, K[]>

  constructor (public url: string, public options: ApiOptions<V, E, D, K> = {}) {
    if (options.getKeys) {
      this.keyCache = Object.create(null)
      this.keyCacheMap = Object.create(null)
    }
  }

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

    const request = new Fetch<V, E>(url, this.options)
    this.cache[url] = request

    const { getKeys } = this.options

    if (getKeys) {
      request.on('resolve', () => {
        this.keyCacheMap[url]?.forEach(key => {
          this.keyCache[key].delete(request)
        })

        const map = this.keyCacheMap[url] = []

        const data = request.value
        const keys = getKeys(data)

        for (const key of keys) {
          map.push(key)

          if (!this.keyCache[key]) {
            this.keyCache[key] = new Set([request])
          } else {
            this.keyCache[key].add(request)
          }
        }
      })
    }

    return request
  }

  update (keys?: K[], timeout?: number) {
    if (!keys) {
      for (const key in this.cache) {
        this.cache[key].update(timeout)
      }
      return
    }

    if (!this.keyCache) {
      return
    }

    for (const key of keys) {
      const cache = this.keyCache[key]

      if (cache) {
        for (const request of cache) {
          request.update(timeout)
        }
      }
    }
  }
}
