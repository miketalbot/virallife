import React from 'react'
import {game, RouteContext} from 'game/lib'
import {useParams} from 'react-router-dom'
import useAsync from 'common/use-async'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'

export function register(stateName, handler, opts) {
    const state = (game.states[stateName] = game.states[stateName] || {})
    Object.merge(state, handler, {deep: true, ...opts})
}

function Empty({stateName}) {
    return <Box position={'relative'} display={'flex'} height={'100vh'}>
        <Box position={'absolute'} left={'50%'} top={'50%'} style={{transform: 'scale(20) translate(-50% -50% 0)'}}>
            <CircularProgress/>
        </Box>

    </Box>
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
