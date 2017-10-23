(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }
        g.jsdeepclone = f();
    }
})(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f;
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s;
    }({
        1: [ function(require, module, exports) {
            "use strict";
            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            function _toConsumableArray(arr) {
                if (Array.isArray(arr)) {
                    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                        arr2[i] = arr[i];
                    }
                    return arr2;
                } else {
                    return Array.from(arr);
                }
            }
            var deepMethods = {
                getType: function getType(item, objectMap) {
                    var constructor = typeof item === "undefined" ? "undefined" : item.constructor.toString().slice(9);
                    constructor = constructor.slice(0, constructor.indexOf("("));
                    if ((typeof objectMap === "undefined" ? "undefined" : _typeof(objectMap)) === "object" && objectMap.hasOwnProperty(constructor)) {
                        constructor = objectMap[constructor] || "Object";
                    }
                    return constructor;
                },
                referenced: function referenced(item) {
                    var type = typeof item === "undefined" ? "undefined" : _typeof(item);
                    return type === "object" || type === "function";
                },
                getKeys: function getKeys(item) {
                    var proto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                    var shadow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                    var keys = [];
                    if (shadow) {
                        keys.push.apply(keys, _toConsumableArray(Object.getOwnPropertyNames(item)));
                    } else {
                        keys.push.apply(keys, _toConsumableArray(Object.keys(item)));
                    }
                    if (proto) {
                        var _proto = Object.getPrototypeOf(item);
                        if (shadow) {
                            keys.push.apply(keys, _toConsumableArray(Object.getOwnPropertyNames(_proto)));
                        } else {
                            keys.push.apply(keys, _toConsumableArray(Object.getOwnPropertyNames(_proto).filter(function(key) {
                                return Object.getOwnPropertyDescriptor(_proto, key).enumerable;
                            })));
                        }
                    }
                    return keys;
                },
                merge: function merge(target, source) {
                    var staticMerge = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                    var objectMap = arguments[3];
                    var proto = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
                    var shadow = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
                    var sourceType = deepMethods.getType(source, objectMap);
                    if (!deepMethods.referenced(target)) {
                        return source;
                    }
                    if (typeof source === "undefined") {
                        return target;
                    }
                    var response = void 0;
                    switch (sourceType) {
                      case "Object":
                        response = {};
                        var keys = deepMethods.getKeys(source, proto, shadow);
                        if ((typeof target === "undefined" ? "undefined" : _typeof(target)) === (typeof source === "undefined" ? "undefined" : _typeof(source))) {
                            keys.push.apply(keys, _toConsumableArray(deepMethods.getKeys(target, proto, shadow)));
                        }
                        for (var i = 0, iLen = keys.length; i < iLen; i++) {
                            var property = keys[i];
                            if (typeof response[property] !== "undefined") {
                                continue;
                            }
                            var sourceDescriptor = source && Object.getOwnPropertyDescriptor(source, keys[i]), targetDescriptor = target && Object.getOwnPropertyDescriptor(target, keys[i]), descriptor = sourceDescriptor || targetDescriptor, sourceValue = source[keys[i]], targetValue = target[keys[i]], value = typeof sourceValue === "undefined" ? targetValue : sourceValue;
                            var writable = true, configurable = true, enumerable = true;
                            if (typeof descriptor !== "undefined") {
                                writable = descriptor.writable;
                                if (typeof descriptor.get !== "undefined" && typeof descriptor.set === "undefined") {
                                    writable = false;
                                }
                                configurable = descriptor.configurable;
                                enumerable = descriptor.enumerable;
                            }
                            var properties = {
                                writable: writable,
                                configurable: configurable,
                                enumerable: enumerable
                            };
                            if (typeof sourceValue !== "undefined" && typeof targetValue !== "undefined") {
                                properties.value = deepMethods.merge(targetValue, sourceValue, staticMerge, objectMap, proto, shadow);
                            } else if (staticMerge) {
                                properties.value = value;
                            } else {
                                properties.get = property.get;
                                properties.set = property.set;
                            }
                            Object.defineProperty(response, property, properties);
                        }
                        break;

                      case "Int8Array":
                      case "Uint8Array":
                      case "Uint8ClampedArray":
                      case "Int16Array":
                      case "Uint16Array":
                      case "Int32Array":
                      case "Uint32Array":
                      case "Float32Array":
                      case "Float64Array":
                      case "Array":
                        var tmpTarget = target || [];
                        var tmpSource = source || [];
                        var len = Math.max(tmpTarget.length, tmpSource.length);
                        response = new (eval(sourceType))(len);
                        for (var _i = 0; _i < len; _i++) {
                            if (typeof source[_i] === "undefined") {
                                response[_i] = tmpTarget[_i];
                            } else if (!deepMethods.referenced(tmpSource[_i])) {
                                response[_i] = tmpSource[_i];
                            } else {
                                response[_i] = deepMethods.merge(tmpTarget[_i], tmpSource[_i], objectMap, staticMerge, proto, shadow);
                            }
                        }
                        break;

                      default:
                        response = source || target;
                        break;
                    }
                    return response;
                },
                clone: function clone(source) {
                    var staticClone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                    var objectMap = arguments[2];
                    var proto = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                    var shadow = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
                    if (!deepMethods.referenced(source)) {
                        return source;
                    }
                    var target = void 0;
                    var sourceType = deepMethods.getType(source, objectMap);
                    switch (sourceType) {
                      case "Object":
                        target = {};
                        var keys = deepMethods.getKeys(source, proto, shadow);
                        for (var i = 0, iLen = keys.length; i < iLen; i++) {
                            var property = keys[i], descriptor = Object.getOwnPropertyDescriptor(source, keys[i]), value = source[keys[i]];
                            var writable = true, configurable = true, enumerable = true;
                            if (typeof descriptor !== "undefined") {
                                writable = descriptor.writable;
                                if (typeof descriptor.get !== "undefined" && typeof descriptor.set === "undefined") {
                                    writable = false;
                                }
                                configurable = descriptor.configurable;
                                enumerable = descriptor.enumerable;
                            }
                            var properties = {
                                writable: writable,
                                configurable: configurable,
                                enumerable: enumerable
                            };
                            if (staticClone) {
                                properties.value = deepMethods.referenced(value) ? deepMethods.clone(value, staticClone, objectMap, proto, shadow) : value;
                            } else {
                                properties.get = property.get;
                                properties.set = property.set;
                            }
                            Object.defineProperty(target, property, properties);
                        }
                        break;

                      case "Int8Array":
                      case "Uint8Array":
                      case "Uint8ClampedArray":
                      case "Int16Array":
                      case "Uint16Array":
                      case "Int32Array":
                      case "Uint32Array":
                      case "Float32Array":
                      case "Float64Array":
                      case "Array":
                        target = new (eval(sourceType))(source.length);
                        for (var _i2 = 0, _iLen = source.length; _i2 < _iLen; _i2++) {
                            target[_i2] = deepMethods.referenced(source[_i2]) ? deepMethods.clone(source[_i2], staticClone, objectMap, proto, shadow) : source[_i2];
                        }
                        break;

                      case "RegExp":
                      case "Error":
                      case "EvalError":
                      case "InternalError":
                      case "RangeError":
                      case "ReferenceError":
                      case "SyntaxError":
                      case "TypeError":
                      case "URIError":
                        target = new (eval(sourceType))(source);
                        break;

                      default:
                        target = source;
                        break;
                    }
                    return target;
                }
            };
            module.exports = deepMethods;
        }, {} ]
    }, {}, [ 1 ])(1);
});