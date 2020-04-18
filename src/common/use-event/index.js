import { useEffect } from 'react'

import events from 'alcumus-local-events'

import decamelize from 'decamelize'

import { ensureArray } from 'common/ensure-array'
import { useRefresh } from 'common/useRefresh'

function eventName(name) {
    let parts = name.split('.')
    return [decamelize(parts[0], '.'), ...parts.slice(1)].join('.')
}

export function useWindowSize() {
    const refresh = useRefresh().debounce(100)
    useEvent(window, 'resize', refresh)
    return { width: window.innerWidth, height: window.innerHeight }
}

export function useLocalEvent(pattern, handler) {
    const fn = useEvent
    const eventWrapper = (event, ...params) => {
        let result = (handler || pattern)(...params)
        if (result === false) event.preventDefault()
    }
    if (!handler && typeof pattern === 'function') {
        return fn(events, eventName(pattern.name), eventWrapper)
    }

    for (let instance of ensureArray(pattern)) {
        fn(events, instance, eventWrapper)
    }
}

export function useLocalEventDeferred(pattern, handler) {
    useLocalEvent(pattern, handler.debounce())
}

export function useLocalEventAsync(pattern, handler) {
    const fn = useEventAsync
    const eventWrapper = async (event, ...params) => {
        let result = await (handler || pattern)(...params)
        if (result === false) event.preventDefault()
    }
    if (!handler && typeof pattern === 'function') {
        return fn(events, eventName(pattern.name), eventWrapper)
    }

    for (let instance of ensureArray(pattern)) {
        fn(events, instance, eventWrapper)
    }
}

export function useLocalEvents(...handlers) {
    const fn = useLocalEvent
    for (let handler of handlers) {
        fn(...ensureArray(handler))
    }
}

export function useEvent(emitter, pattern, handler) {
    if (!handler) {
        ;[emitter, pattern, handler] = [events, emitter, pattern]
    }
    let runner = (...params) => {
        handler(...params)
    }
    if (emitter) {
        if (emitter.addEventListener) {
            emitter.addEventListener(eventName(pattern), runner)
        } else {
            emitter.addListener(eventName(pattern), runner)
        }
    }

    useEffect(() => {
        return () => {
            if (emitter.removeEventListener) {
                emitter.removeEventListener(eventName(pattern), runner)
            } else {
                emitter.removeListener(eventName(pattern), runner)
            }
        }
    })
}

export function useEventAsync(emitter, pattern, handler) {
    if (!handler) {
        ;[emitter, pattern, handler] = [events, emitter, pattern]
    }
    let runner = async (...params) => {
        await handler(...params)
    }
    if (emitter) {
        if (emitter.addEventListener) {
            emitter.addEventListener(eventName(pattern), runner)
        } else {
            emitter.addListener(eventName(pattern), runner)
        }
    }

    useEffect(() => {
        return () => {
            if (emitter.removeEventListener) {
                emitter.removeEventListener(eventName(pattern), runner)
            } else {
                emitter.removeListener(eventName(pattern), runner)
            }
        }
    })
}
