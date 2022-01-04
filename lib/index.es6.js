import Fetch from '@watch-state/fetch';

const dataReg = /\{(\w+)\}/g;
function apiReplace(url, values) {
    return url.replace(dataReg, (str, key) => key in values ? String(values[key]) : '');
}
class Api {
    constructor(url, options = {}) {
        this.url = url;
        this.options = options;
        this.cache = Object.create(null);
    }
    get(data) {
        const values = Object.assign(Object.assign({}, this.options.data), data);
        const foundKeys = Object.create(null);
        let url = this.url.replace(dataReg, (str, key) => {
            if (key in values) {
                foundKeys[key] = true;
                return String(values[key]);
            }
            return '';
        });
        let search = '';
        for (const key in values) {
            if (key in foundKeys)
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
                search += `${key}=${values[key]}&`;
            }
        }
        if (search) {
            url += `?${search.slice(0, -1)}`;
        }
        if (url in this.cache) {
            return this.cache[url];
        }
        return this.cache[url] = new Fetch(url, this.options);
    }
}

export { apiReplace, dataReg, Api as default };
