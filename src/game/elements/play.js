import {Surface} from '../cells/surface'
import React, {useRef} from 'react'
import {element} from '../lib'

element(ParticleSurface)

function ParticleSurface() {
    const surface = useRef(new Surface(1000, 500))
    return <surface.current.Render />
}
