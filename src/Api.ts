import Fetch from '@watch-state/fetch'

import type {
  ApiData,
  ApiOptions,
  DataKeys,
} from './types'

export const dataReg = /\{(\w+)\}/g

export class FetchApi <
  Value = unknown,
  Err = Error,
  Data extends ApiData = ApiData
> extends Fetch<Value, Err> {
  #resolveBC: BroadcastChannel
  constructor (public url: string, public options: ApiOptions<Value, Err, Data> = {}) {
    super(url, options)
    const bc = new BroadcastChannel(`@watch-state/api:resolveBC:${url}`)
    this.#resolveBC = bc
    bc.addEventListener('message', (event) => {
      super.resolve(event.data)
    })
  }

  protected resolve (value: Value) {
    super.resolve(value)
    this.#resolveBC.postMessage(value)
  }

  destroy () {
    this.#resolveBC.close()
  }
}

class ApiFetch <Value, Err, Data extends ApiData> extends FetchApi<Value, Err, Data> {
  constructor (public url: string, public api: Api<Value, Err, Data>) {
    super(url, api.options)
  }

  protected resolve (value: Value) {
    const {
      api: {
        keyCacheMap,
        keyCache,
        options: { getKeys },
      },
      url,
    } = this

    if (getKeys) {
      keyCacheMap[url]?.forEach(key => {
        keyCache[key].delete(this)
      })

      const map = keyCacheMap[url] = []

      const keys = getKeys(value)

      for (const key of keys) {
        map.push(key)

        if (!keyCache[key]) {
          keyCache[key] = new Set([this])
        } else {
          keyCache[key].add(this)
        }
      }
    }

    super.resolve(value)
  }
}

export default class Api<
  Value = unknown,
  Err = Error,
  Data extends ApiData = ApiData,
> {
  cache: Record<string, ApiFetch<Value, Err, Data>> = Object.create(null)
  keyCache: Record<DataKeys, Set<ApiFetch<Value, Err, Data>>>
  keyCacheMap: Record<string, DataKeys[]>

  constructor (public url: string, public options: ApiOptions<Value, Err, Data> = {}) {
    if (options?.getKeys) {
      this.keyCache = Object.create(null)
      this.keyCacheMap = Object.create(null)
    }
  }

  get (data?: Data): ApiFetch<Value, Err, Data> {
    const values = { ...this.options.data, ...data }
    const urlKeys = Object.create(null)
    let url = this.url.replace(dataReg, (str, key) => {
      if (key in values) {
        urlKeys[key] = true
        return String(values[key])
      }

      return ''
    })

    let search = ''
    for (const key in values) {
      if (key in urlKeys) continue
      const value = values[key]
      if (value === undefined) continue

      if (Array.isArray(value)) {
        for (const subValue of value) {
          search += `${key}[]=${subValue}&`
        }
      } else {
        search += `${key}=${String(value)}&`
      }
    }

    if (search) {
      url += `?${search.slice(0, -1)}`
    }

    if (url in this.cache) {
      return this.cache[url]
    }

    const request = new ApiFetch<Value, Err, Data>(url, this)

    this.cache[url] = request

    return request
  }

  update (keys?: (string | number)[], timeout?: number) {
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

  destroy () {
    for (const cacheKey in this.cache) {
      this.cache[cacheKey].destroy()
    }
  }
}
