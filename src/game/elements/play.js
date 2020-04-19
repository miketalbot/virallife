import {Surface} from '../cells/surface'
import React, {useRef} from 'react'
import {element} from '../lib'
import {GAME_HEIGHT, GAME_WIDTH} from '../constants'

element(ParticleSurface)

function ParticleSurface() {
    const surface = useRef(new Surface(GAME_WIDTH, GAME_HEIGHT))
    return <surface.current.Render />
}
