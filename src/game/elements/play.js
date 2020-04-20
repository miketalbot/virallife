import {Surface} from '../cells/surface'
import React, {useEffect, useRef} from 'react'
import {element, SurfaceContext} from '../lib'
import {GAME_HEIGHT, GAME_WIDTH} from '../constants'
import {Container} from '@inlet/react-pixi'
import {textures} from '../cells/sprites'
import {callFunction, types} from '../cells/types'
import {updateSprite} from '../cells/process'
import {getStructures} from '../data'
import {Launcher} from '../cells/launcher'
import {raise} from 'common/events'

element(ParticleSurface)

const BASE_X = -GAME_WIDTH / 2
const BASE_Y = -GAME_HEIGHT / 2

function ParticleSurface({structure}) {
    const {id = 0} = window.routeParams
    const surface = useRef(new Surface(GAME_WIDTH, GAME_HEIGHT))
    structure = structure || getStructures()[+(id || 0)]
    const parts = structure.parts
    useEffect(() => {
        const particles = surface.current.particles
        particles.startParticles()
        for (let part of parts) {
            let p = particles.getParticle()
            p.x = part.x
            p.y = part.y
            p.type = part.type
            const typeDef = types[p.type]
            p.life = typeDef.life
            p.sprite.texture = textures[typeDef.sprite]
            p.sprite.alpha = 1
            updateSprite(p)
            callFunction(p.type, 'init', p)
        }
        raise('additional-particles', particles, surface)
        surface.current.refresh()
    }, [parts, structure.id])

    return (
        <SurfaceContext.Provider value={surface.current}>
            <Container x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2}>
                <surface.current.Render/>
                <Launcher x={BASE_X + (GAME_WIDTH * 1) / 14} y={BASE_Y + (GAME_HEIGHT * 2) / 12}/>
                <Launcher x={BASE_X + (GAME_WIDTH * 1) / 14} y={BASE_Y + (GAME_HEIGHT * 6) / 12}/>
                <Launcher x={BASE_X + (GAME_WIDTH * 1) / 14} y={BASE_Y + (GAME_HEIGHT * 10) / 12}/>
                <Launcher x={BASE_X + (GAME_WIDTH * 13) / 14} y={BASE_Y + (GAME_HEIGHT * 2) / 12}/>
                <Launcher x={BASE_X + (GAME_WIDTH * 13) / 14} y={BASE_Y + (GAME_HEIGHT * 6) / 12}/>
                <Launcher x={BASE_X + (GAME_WIDTH * 13) / 14} y={BASE_Y + (GAME_HEIGHT * 10) / 12}/>
            </Container>
        </SurfaceContext.Provider>
    )
}
