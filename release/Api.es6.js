import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';
import Fetch from '@watch-state/fetch';

var _FetchApi_resolveBC, _FetchApi_bcResolve;
const dataReg = /\{(\w+)\}/g;
class FetchApi extends Fetch {
    constructor(url, options = {}) {
        super(url, options);
        this.url = url;
        this.options = options;
        _FetchApi_resolveBC.set(this, void 0);
        _FetchApi_bcResolve.set(this, false);
        const bc = new BroadcastChannel(`@watch-state/api:resolveBC:${url}`);
        __classPrivateFieldSet(this, _FetchApi_resolveBC, bc, "f");
        bc.addEventListener('message', (event) => {
            __classPrivateFieldSet(this, _FetchApi_bcResolve, true, "f");
            this.fetchResolve(event.data);
        });
    }
    fetchResolve(value) {
        super.fetchResolve(value);
        if (__classPrivateFieldGet(this, _FetchApi_bcResolve, "f")) {
            __classPrivateFieldSet(this, _FetchApi_bcResolve, false, "f");
        }
        else {
            __classPrivateFieldGet(this, _FetchApi_resolveBC, "f").postMessage(value);
        }
    }
    destroy() {
        __classPrivateFieldGet(this, _FetchApi_resolveBC, "f").close();
    }
}
_FetchApi_resolveBC = new WeakMap(), _FetchApi_bcResolve = new WeakMap();
class ApiFetch extends FetchApi {
    constructor(url, api) {
        super(url, api.options);
        this.url = url;
        this.api = api;
    }
    resolve(value) {
        var _a;
        const { api: { keyCacheMap, keyCache, options: { getKeys }, }, url, } = this;
        if (getKeys) {
            (_a = keyCacheMap[url]) === null || _a === void 0 ? void 0 : _a.forEach(key => {
                keyCache[key].delete(this);
            });
            const map = keyCacheMap[url] = [];
            const keys = getKeys(value);
            for (const key of keys) {
                map.push(key);
                if (!keyCache[key]) {
                    keyCache[key] = new Set([this]);
                }
                else {
                    keyCache[key].add(this);
                }
            }
        }
        super.resolve(value);
    }
}
class Api {
    constructor(url, options = {}) {
        this.url = url;
        this.options = options;
        this.cache = Object.create(null);
        if (options === null || options === void 0 ? void 0 : options.getKeys) {
            this.keyCache = Object.create(null);
            this.keyCacheMap = Object.create(null);
        }
    }
    get(data) {
        const values = Object.assign(Object.assign({}, this.options.data), data);
        const urlKeys = Object.create(null);
        let url = this.url.replace(dataReg, (str, key) => {
            if (key in values) {
                urlKeys[key] = true;
                return String(values[key]);
            }
            return '';
        });
        let search = '';
        for (const key in values) {
            if (key in urlKeys)
                continue;
            const value = values[key];
            if (value === undefined)
                continue;
            if (Array.isArray(value)) {
                for (const subValue of value) {
                    search += `${key}[]=${subValue}&`;
                }
            }
            else {
                search += `${key}=${String(value)}&`;
            }
        }
        if (search) {
            url += `?${search.slice(0, -1)}`;
        }
        if (url in this.cache) {
            return this.cache[url];
        }
        const request = new ApiFetch(url, this);
        this.cache[url] = request;
        return request;
    }
    update(keys, timeout) {
        if (!keys) {
            for (const key in this.cache) {
                this.cache[key].update(timeout);
            }
            return;
        }
        if (!this.keyCache) {
            return;
        }
        for (const key of keys) {
            const cache = this.keyCache[key];
            if (cache) {
                for (const request of cache) {
                    request.update(timeout);
                }
            }
        }
    }
    destroy() {
        for (const cacheKey in this.cache) {
            this.cache[cacheKey].destroy();
        }
    }
}

export { FetchApi, dataReg, Api as default };
