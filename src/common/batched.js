import React from 'react'
import ReactDOM from 'react-dom'

import debounce from 'lodash/debounce'

let batched = []

const internalBatch = debounce(function() {
    ReactDOM.unstable_batchedUpdates(function() {
        let toRun = batched
        batched = []
        for (let run of toRun) {
            try {
                run()
            } catch (e) {
                console.error(e)
            }
        }
    })
})

export function batch(fn) {
    batched.push(fn)
    internalBatch()
}
