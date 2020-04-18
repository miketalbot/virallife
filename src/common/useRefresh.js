import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import { generate } from 'shortid'

import { useLocalEvent } from 'common/use-event'

export function useRefreshOnEvent(event, predicate = () => true) {
    const refresh = useRefresh()
    useLocalEvent(event, (...params) => predicate(...params) && refresh())
    return refresh
}

export function boundRefresh(v) {
    if (v) {
        return (lastRefresh = v)
    } else {
        return lastRefresh
    }
}

let lastRefresh = null

export function useRefresh(...functions) {
    const [innerId, refresh] = useState(generate())
    const others = useRef([])
    const isLoaded = useRef(true)
    useLayoutEffect(() => {
        return () => {
            isLoaded.current = false
        }
    }, [])

    let result = (lastRefresh = (...params) => {
        ReactDOM.unstable_batchedUpdates(() => {
            try {
                if (!isLoaded.current) return
                for (let fn of [...params, ...functions].compact()) {
                    try {
                        typeof fn === 'function' && fn()
                    } catch (e) {
                        console.error(e)
                    }
                }
                const nextId = generate()
                refresh(nextId)
                others.current.forEach((c) => c(nextId))
            } catch (e) {
                console.error(e)
            }
        })
    })
    result.functions = functions.compact()

    Object.assign(result, {
        execute: (...params) => {
            for (let fn of [...params, ...functions].compact()) {
                try {
                    typeof fn === 'function' && fn()
                } catch (e) {
                    console.error(e)
                }
            }
        },
        planRefresh: (fn) => {
            return (...params) => {
                fn(...params)
                result()
            }
        },
        always: () => {
            result.id = generate()
            result()
        },
        useRefresh: () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [, setValue] = useState(0)
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                others.current.push(setValue)
                return () => {
                    others.current = others.current.filter((f) => f !== setValue)
                }
            }, [])
        },
    })

    result.id = innerId

    return result
}
