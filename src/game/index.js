import React from 'react'
import { game } from 'game/lib'
import { useParams } from 'react-router-dom'
import './states'
import './elements'

export function register(stateName, handler, opts) {
    const state = (game.states[stateName] = game.states[stateName] || {})
    Object.merge(state, handler, { deep: true, ...opts })
}

function Empty({ stateName }) {
    return `No state mapped for "${stateName}"`
}

export function Game({ state, ...props }) {
    const { state: paramState, ...params } = useParams()
    state = state || paramState
    const activeState = game.states[state] ?? {}
    const Render = activeState.Page || Empty
    return <Render state={activeState} stateName={state} {...props} {...params} />
}
