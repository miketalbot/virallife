import {element} from 'game/lib'
import {Surface} from '../cells/surface'
import React, {useRef} from 'react'

element(ParticleSurface)

function ParticleSurface() {
    const surface = useRef(new Surface(500, 500))
    return <surface.current.Render />
}
