import { useEffect } from 'react'

import events from 'alcumus-local-events'

import decamelize from 'decamelize'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'

export function handle(type, fn) {
    let pairs = []
    let result = () => {
        pairs.forEach((handler) => events.off(...handler))
    }
    if (isFunction(type) || isObject(type)) {
        let props = methods(type)
        for (let [definedType, fn] of props) {
            const toProcessType = clean(definedType)
            const handler = function(event, ...params) {
                let result = fn.call(type, ...params)
                if (result === false) {
                    event.preventDefault()
                }
                return result
            }
            pairs.push([toProcessType, handler])
            events.on(toProcessType, handler)
            result[definedType] = declareAsync(definedType)
        }
    } else {
        const handler = function(event, ...params) {
            let result = fn(...params)
            if (result === false) {
                event.preventDefault()
            }
            return result
        }
        type = eventName(type)
        pairs.push([type, handler])
        events.on(type, handler)
    }
    return result
}

export function useHandler(handler) {
    useEffect(() => {
        return handle(handler)
    })
}

function eventName(name) {
    let parts = name.replace(/(?!\.)\$/g, '.*').split('.')
    return [decamelize(parts[0], '.'), ...parts.slice(1)].join('.')
}

export function handler(pattern, handler) {
    const process = (event, ...params) => {
        let result = (handler || pattern)(...params)
        if (result === false) event.preventDefault()
    }
    if (!handler && typeof pattern === 'function') {
        return events.on(eventName(pattern.name), process)
    }
    events.on(pattern, process)
}

export function once(pattern, handler) {
    const process = (event, ...params) => {
        let result = (handler || pattern)(...params)
        if (result === false) event.preventDefault()
    }
    if (!handler && typeof pattern === 'function') {
        return events.once(eventName(pattern.name), process)
    }
    events.once(pattern, process)
}

events.handle = handle

export function raise(event, ...params) {
    events.emit(eventName(event), ...params)
    return params[0]
}

export async function raiseAsync(event, ...params) {
    await events.emitAsync(eventName(event), ...params)
    return params[0]
}

export function declare(event) {
    return (...params) => raise(event, ...params)
}

export function declareAsync(event) {
    return (...params) => raiseAsync(event, ...params)
}

export { events }
export default events

function methods(klass) {
    let properties = []
    for (let item of Object.getOwnPropertyNames(klass)) {
        if (typeof klass[item] === 'function') {
            properties.push([item, klass[item]])
        }
    }
    if (klass.prototype) {
        for (let item of Object.getOwnPropertyNames(klass.prototype)) {
            if (item === 'constructor') continue
            if (typeof klass.prototype[item] === 'function') {
                properties.push([item, klass.prototype[item]])
            }
        }
    }

    return properties
}

function clean(name) {
    return eventName(name)
        .replace(/\$/g, '*')
        .replace(/_/g, '-')
}
