import React from 'react'
import {game, RouteContext} from 'game/lib'
import {useParams} from 'react-router-dom'
import useAsync from 'common/use-async'

export function register(stateName, handler, opts) {
    const state = (game.states[stateName] = game.states[stateName] || {})
    Object.merge(state, handler, {deep: true, ...opts})
}

function Empty({stateName}) {
    return `No state mapped for "${stateName}"`
}

export function Game({ state, ...props }) {
    useAsync(async () => {
        await import('./states')
        await import('./elements')
    })
    const {state: paramState, ...params} = useParams()

    state = state || paramState
    const activeState = game.states[state] ?? {}
    const Render = activeState.Page || Empty
    let rp = window.routeParams = {state, ...params}
    return (
        <RouteContext.Provider value={rp}>
            <Render state={activeState} stateName={state} {...rp} {...props} {...params} />
        </RouteContext.Provider>
    )
}
