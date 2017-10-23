const deepMethods = {
    // Object map can be used to replace certain instances with default JS type handling for clone and merge.
    // If key is defined with a falsy value `Object` will be used by default.
    getType(item, objectMap) {
        let constructor = typeof item === 'undefined' ? 'undefined' : item.constructor.toString().slice(9);

        constructor = constructor.slice(0, constructor.indexOf('('));

        if (typeof objectMap === 'object' && objectMap.hasOwnProperty(constructor)) {
            constructor = objectMap[constructor] || 'Object';
        }

        return constructor;
    },
    referenced(item) {
        const type = typeof item;

        return type === 'object' || type === 'function';
    },
    getKeys(item, proto = false, shadow = false) {
        const keys = [];

        if (shadow) {
            keys.push(...Object.getOwnPropertyNames(item));
        } else {
            keys.push(...Object.keys(item));
        }

        if (proto) {
            const proto = Object.getPrototypeOf(item);

            if (shadow) {
                keys.push(...Object.getOwnPropertyNames(proto));
            } else {
                keys.push(
                    ...Object.getOwnPropertyNames(proto).filter(
                        key => Object.getOwnPropertyDescriptor(proto, key).enumerable
                    )
                );
            }
        }

        return keys;
    },
    merge(target, source, staticMerge = false, objectMap, proto = false, shadow = false) {
        const sourceType = deepMethods.getType(source, objectMap);

        if (!deepMethods.referenced(target)) {
            return source;
        }

        if (typeof source === 'undefined') {
            return target;
        }

        let response;

        switch (sourceType) {
            case 'Object':
                response = {};

                const keys = deepMethods.getKeys(source, proto, shadow);

                if (typeof target === typeof source) {
                    keys.push(...deepMethods.getKeys(target, proto, shadow));
                }

                for (let i = 0, iLen = keys.length; i < iLen; i++) {
                    const property = keys[i];

                    if (typeof response[property] !== 'undefined') {
                        continue;
                    }

                    const sourceDescriptor = source && Object.getOwnPropertyDescriptor(source, keys[i]),
                        targetDescriptor = target && Object.getOwnPropertyDescriptor(target, keys[i]),
                        descriptor = sourceDescriptor || targetDescriptor,
                        sourceValue = source[keys[i]],
                        targetValue = target[keys[i]],
                        value = typeof sourceValue === 'undefined' ? targetValue : sourceValue;

                    let writable = true,
                        configurable = true,
                        enumerable = true;

                    if (typeof descriptor !== 'undefined') {
                        writable = descriptor.writable;
                        if (typeof descriptor.get !== 'undefined' && typeof descriptor.set === 'undefined') {
                            writable = false;
                        }
                        configurable = descriptor.configurable;
                        enumerable = descriptor.enumerable;
                    }

                    const properties = {
                        writable,
                        configurable,
                        enumerable
                    };

                    if (typeof sourceValue !== 'undefined' && typeof targetValue !== 'undefined') {
                        properties.value = deepMethods.merge(
                            targetValue,
                            sourceValue,
                            staticMerge,
                            objectMap,
                            proto,
                            shadow
                        );
                    } else if (staticMerge) {
                        properties.value = value;
                    } else {
                        properties.get = property.get;
                        properties.set = property.set;
                    }

                    Object.defineProperty(response, property, properties);
                }
                break;
            case 'Int8Array':
            case 'Uint8Array':
            case 'Uint8ClampedArray':
            case 'Int16Array':
            case 'Uint16Array':
            case 'Int32Array':
            case 'Uint32Array':
            case 'Float32Array':
            case 'Float64Array':
            case 'Array':
                const tmpTarget = target || [];
                const tmpSource = source || [];

                const len = Math.max(tmpTarget.length, tmpSource.length);

                response = new (eval(sourceType))(len);

                for (let i = 0; i < len; i++) {
                    if (typeof source[i] === 'undefined') {
                        response[i] = tmpTarget[i];
                    } else if (!deepMethods.referenced(tmpSource[i])) {
                        response[i] = tmpSource[i];
                    } else {
                        response[i] = deepMethods.merge(
                            tmpTarget[i],
                            tmpSource[i],
                            objectMap,
                            staticMerge,
                            proto,
                            shadow
                        );
                    }
                }
                break;
            default:
                response = source || target;
                break;
        }

        return response;
    },
    clone(source, staticClone = true, objectMap, proto = false, shadow = false) {
        if (!deepMethods.referenced(source)) {
            return source;
        }

        let target;
        const sourceType = deepMethods.getType(source, objectMap);

        switch (sourceType) {
            case 'Object':
                target = {};

                const keys = deepMethods.getKeys(source, proto, shadow);

                for (let i = 0, iLen = keys.length; i < iLen; i++) {
                    const property = keys[i],
                        descriptor = Object.getOwnPropertyDescriptor(source, keys[i]),
                        value = source[keys[i]];

                    let writable = true,
                        configurable = true,
                        enumerable = true;

                    if (typeof descriptor !== 'undefined') {
                        writable = descriptor.writable;
                        if (typeof descriptor.get !== 'undefined' && typeof descriptor.set === 'undefined') {
                            writable = false;
                        }
                        configurable = descriptor.configurable;
                        enumerable = descriptor.enumerable;
                    }

                    const properties = {
                        writable,
                        configurable,
                        enumerable
                    };

                    if (staticClone) {
                        properties.value = deepMethods.referenced(value)
                            ? deepMethods.clone(value, staticClone, objectMap, proto, shadow)
                            : value;
                    } else {
                        properties.get = property.get;
                        properties.set = property.set;
                    }

                    Object.defineProperty(target, property, properties);
                }
                break;
            case 'Int8Array':
            case 'Uint8Array':
            case 'Uint8ClampedArray':
            case 'Int16Array':
            case 'Uint16Array':
            case 'Int32Array':
            case 'Uint32Array':
            case 'Float32Array':
            case 'Float64Array':
            case 'Array':
                target = new (eval(sourceType))(source.length);
                for (let i = 0, iLen = source.length; i < iLen; i++) {
                    target[i] = deepMethods.referenced(source[i])
                        ? deepMethods.clone(source[i], staticClone, objectMap, proto, shadow)
                        : source[i];
                }
                break;
            case 'RegExp':
            case 'Error':
            case 'EvalError':
            case 'InternalError':
            case 'RangeError':
            case 'ReferenceError':
            case 'SyntaxError':
            case 'TypeError':
            case 'URIError':
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
