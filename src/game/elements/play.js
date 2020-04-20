import {Surface} from '../cells/surface'
import React, {useEffect, useRef} from 'react'
import {element} from '../lib'
import {GAME_HEIGHT, GAME_WIDTH} from '../constants'
import {Container} from '@inlet/react-pixi'
import {textures} from '../cells/sprites'
import {types} from '../cells/types'
import {updateSprite} from '../cells/process'
import {getStructures} from '../data'

element(ParticleSurface)

function ParticleSurface({ structure }) {
    const surface = useRef(new Surface(GAME_WIDTH, GAME_HEIGHT))
    structure = structure || getStructures()[1]
    useEffect(() => {
        const particles = surface.current.particles
        particles.startParticles()
        for (let part of structure.parts) {
            let p = particles.getParticle()
            p.x = part.x
            p.y = part.y
            p.type = part.type
            p.sprite.texture = textures[types[p.type].sprite]
            p.sprite.alpha = 1
            updateSprite(p)
        }
        surface.current.refresh()
    }, [])
    return (
        <Container x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2}>
            <surface.current.Render />
        </Container>
    )
}
