import React from 'react'
import {Collision} from './collision'
import {Particles} from './particles'
import {getSettingsForPreset, ParticleTypes} from './types'
import {Text} from '@inlet/react-pixi'

export class Surface {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.collision = new Collision()
        this.particles = new Particles()
        this.types = new ParticleTypes(6)
        this.types.setRandomTypes(getSettingsForPreset('Balanced'))
        this.particles.randomParticles(500, 1000, 500, this.types)
    }

    Render() {
        console.log(this)
        return <Text text={'here'} />
    }
}
