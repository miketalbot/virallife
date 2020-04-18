import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'

import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import { generate } from 'shortid'

import { batch } from 'common/batched'

let incrementalId = 1

export function importComponent(component) {
    let loaded = false
    let current = () => {}
    return function Component(props) {
        const Component = useAsync(async () => {
            let result = current
            if (!loaded) {
                result = await component()
            }
            loaded = true
            return result
        }, current)
        const Draw = useCallback(Component, [Component ? 1 : 0])
        return <Draw {...props} />
    }
}

function useAsync(promiseProducingFunction, defaultValue = null, refId = 'standard') {
    let [, setValue] = useState(null)
    let currentSetV = useRef()
    currentSetV.current = setValue
    let execute = useRef({ value: defaultValue })
    useLayoutEffect(() => {
        return () => (currentSetV.current = null)
    }, [])
    // noinspection JSPrimitiveTypeWrapperUsage
    let useId = isObject(refId) ? (refId.__id = refId.__id || generate()) : refId
    if (useId !== execute.current.id) {
        execute.current.id = useId
        // execute.current.value = defaultValue
        let tempValue = promiseProducingFunction
        promiseProducingFunction = !isFunction(promiseProducingFunction)
            ? async () => tempValue
            : promiseProducingFunction
        Promise.resolve(promiseProducingFunction()).then((v) => {
            execute.current.value = v || defaultValue
            batch(() => currentSetV.current && currentSetV.current(incrementalId++))
        }, console.error)
    }
    return execute.current.value
}

function isAsync(fn, name) {
    if (typeof fn !== 'function') return false
    if (fn.constructor.name === 'AsyncFunction') return true
    if (fn._isAsync) return true
    if (fn._isAsync === false) return false
    return !!(name && !name.startsWith('on') && fn.length === 0)
}

function returnNull() {
    return null
}

export { useAsync }
export default useAsync
