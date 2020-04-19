import React from 'react'
import {Collision} from './collision'
import {Particles} from './particles'
import {getSettingsForPreset, ParticleTypes} from './types'
import {Sprite} from '@inlet/react-pixi'

export class Surface {
    list = []

    constructor(width, height) {
        this.width = width
        this.height = height
        this.collision = new Collision()
        this.particles = new Particles()
        this.types = new ParticleTypes(6)
        this.types.setRandomTypes(getSettingsForPreset('Balanced'))
        this.particles.randomParticles(50, 1000, 500, this.types)
        this.Render = this.Render.bind(this)
    }

    Render() {
        this.list.length = 0
        const list = this.particles.getParticles(this.list)
        return (
            <>
                {list.map((particle) => {
                    return (
                        <Particle
                            sprites={this.types.sprite}
                            colours={this.types.colour}
                            key={particle.id}
                            particle={particle}
                        />
                    )
                })}
            </>
        )
    }
}

function Particle({ particle, sprites, colours }) {
    return (
        <Sprite
            image={sprites[particle.type]}
            x={particle.x}
            y={particle.y}
            anchor={0.5}
            tint={colours[particle.type]}
        />
    )
}
