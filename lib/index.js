'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var Fetch = require('@watch-state/fetch');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Fetch__default = /*#__PURE__*/_interopDefaultLegacy(Fetch);

var dataReg = /\{(\w+)\}/g;
var Api = /** @class */ (function () {
    function Api(url, options) {
        if (options === void 0) { options = {}; }
        this.url = url;
        this.options = options;
        this.cache = Object.create(null);
        if (options.getKeys) {
            this.keyCache = Object.create(null);
            this.keyCacheMap = Object.create(null);
        }
    }
    Api.prototype.get = function (data) {
        var e_1, _a;
        var _this = this;
        var values = tslib.__assign(tslib.__assign({}, this.options.data), data);
        var foundKeys = Object.create(null);
        var url = this.url.replace(dataReg, function (str, key) {
            if (key in values) {
                foundKeys[key] = true;
                return String(values[key]);
            }
            return '';
        });
        var search = '';
        for (var key in values) {
            if (key in foundKeys)
                continue;
            var value = values[key];
            if (value === undefined)
                continue;
            if (Array.isArray(value)) {
                try {
                    for (var value_1 = (e_1 = void 0, tslib.__values(value)), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                        var subValue = value_1_1.value;
                        search += "".concat(key, "[]=").concat(subValue, "&");
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                search += "".concat(key, "=").concat(values[key], "&");
            }
        }
        if (search) {
            url += "?".concat(search.slice(0, -1));
        }
        if (url in this.cache) {
            return this.cache[url];
        }
        var request = new Fetch__default["default"](url, this.options);
        this.cache[url] = request;
        var getKeys = this.options.getKeys;
        if (getKeys) {
            request.on('resolve', function () {
                var e_2, _a;
                var _b;
                (_b = _this.keyCacheMap[url]) === null || _b === void 0 ? void 0 : _b.forEach(function (key) {
                    _this.keyCache[key].delete(request);
                });
                var map = _this.keyCacheMap[url] = [];
                var data = request.value;
                var keys = getKeys(data);
                try {
                    for (var keys_1 = tslib.__values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                        var key = keys_1_1.value;
                        map.push(key);
                        if (!_this.keyCache[key]) {
                            _this.keyCache[key] = new Set([request]);
                        }
                        else {
                            _this.keyCache[key].add(request);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
        }
        return request;
    };
    Api.prototype.update = function (keys, timeout) {
        var e_3, _a, e_4, _b;
        if (!keys) {
            for (var key in this.cache) {
                this.cache[key].update(timeout);
            }
            return;
        }
        if (!this.keyCache) {
            return;
        }
        try {
            for (var keys_2 = tslib.__values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
                var key = keys_2_1.value;
                var cache = this.keyCache[key];
                if (cache) {
                    try {
                        for (var cache_1 = (e_4 = void 0, tslib.__values(cache)), cache_1_1 = cache_1.next(); !cache_1_1.done; cache_1_1 = cache_1.next()) {
                            var request = cache_1_1.value;
                            request.update(timeout);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (cache_1_1 && !cache_1_1.done && (_b = cache_1.return)) _b.call(cache_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (keys_2_1 && !keys_2_1.done && (_a = keys_2.return)) _a.call(keys_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    return Api;
}());

exports.dataReg = dataReg;
exports["default"] = Api;
