import React from 'react'
import {Collision} from './collision'
import {Particles} from './particles'
import {types} from './types'
import {ParticleContainer, Sprite, useTick} from '@inlet/react-pixi'
import {useRefresh} from 'common/useRefresh'
import {particleFunctions} from './process'
import circle from './sprites/circle.png'

export class Surface {
    list = []

    constructor(width, height, count = 100) {
        this.rate = 1
        this.width = width
        this.height = height
        this.particles = new Particles()
        // let { numTypes, numParticles, friction, ...settings } = getSettingsForPreset('Small Clusters')
        this.collision = new Collision(100)
        this.friction = 0.07
        count && this.particles.randomParticles(80, width, height)
        this.Render = this.Render.bind(this)
    }

    Render() {
        const refresh = useRefresh()

        useTick((delta) => {
            delta = (delta * this.rate) | 0
            const list = this.particles.getParticles(this.list)
            for (let i = 0; i < 1; i++) {
                this.collision.startCollision()
                for (let p of list) {
                    let tick = particleFunctions[p.tick]
                    tick && tick.call(this, delta, p)
                }
                this.collision.collisions((p, q) => {
                    let collision = particleFunctions[p.collide]
                    collision && collision.call(this, p, q)
                })
            }
            refresh()
        })

        const groups = this.particles.getGroups()
        return (
            <>
                {groups.map((group, type) => {
                    return (
                        <ParticleContainer key={type}>
                            {group.map((particle) => {
                                return <Particle key={particle.id} particle={particle} />
                            })}
                        </ParticleContainer>
                    )
                })}
            </>
        )
    }
}
const emitterConfig = {
    alpha: {
        start: 0.9,
        end: 0.1,
    },
    scale: {
        start: 0.9,
        end: 0.1,
    },
    color: {
        start: 'ffffff',
        end: 'ffffff',
    },
    speed: {
        start: 0,
        end: 0,
    },
    startRotation: {
        min: 0,
        max: 0,
    },
    rotationSpeed: {
        min: 0,
        max: 0,
    },
    lifetime: {
        min: 0.4,
        max: 0.3,
    },
    blendMode: 'normal',
    frequency: 0.003,
    emitterLifetime: 0,
    maxParticles: 40,
    pos: {
        x: 0,
        y: 0,
    },
    addAtBack: false,
    spawnType: 'circle',
    spawnCircle: {
        x: 0,
        y: 0,
        r: 1,
    },
}
function Particle({ particle }) {
    return (
        <>
            <Sprite
                image={types[particle.type].sprite}
                x={particle.x}
                y={particle.y}
                scale={0.5}
                angle={particle.rotation}
                anchor={0.5}
                // tint={colours[particle.type]}
            />
        </>
    )
}
