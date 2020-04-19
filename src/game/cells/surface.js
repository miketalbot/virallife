import React, {useRef, useState} from 'react'
import {Collision} from './collision'
import {Particles} from './particles'
import {ParticleContainer, useTick} from '@inlet/react-pixi'
import {particleFunctions} from './process'
import {noop} from 'common/noop'
import {Trail} from './trail'
import {useRefresh} from 'common/useRefresh'
import {DIAMETER} from '../constants'
import {lerp} from '../lib'

export class Surface {
    list = []

    constructor(width, height, count, trail = true, Container = ParticleContainer) {
        this.rate = 1
        this.Container = Container
        this.width = width | 0
        this.trail = trail
        this.height = height | 0
        this.particles = new Particles()
        this.collision = new Collision(100)
        this.friction = 0.07
        this.particles.startParticles()
        count && this.particles.randomParticles(count, width, height)
        this.Render = this.Render.bind(this)
        this.boundaryCheck = this.boundaryCheck.bind(this)
    }

    boundaryCheck(p) {
        if (this.track) return
        if (p.x < DIAMETER) {
            p.vx = -p.vx
            p.x = DIAMETER
        } else if (p.x >= this.width - DIAMETER) {
            p.vx = -p.vx
            p.x = this.width - DIAMETER
        }

        if (p.y < DIAMETER) {
            p.vy = -p.vy
            p.y = DIAMETER
        } else if (p.y >= this.height - DIAMETER) {
            p.vy = -p.vy
            p.y = this.height - DIAMETER
        }
    }

    Render() {
        const track = this.track
        this.refresh = useRefresh()
        const trail = useRef()
        const [containers] = useState([])
        let tx = 0,
            ty = 0
        let firstGo = true
        useTick((delta) => {
            this.emit = trail.current || noop
            delta = 1
            const list = this.particles.getParticles(this.list)
            this.collision.startCollision()
            if (list.length && this.track) {
                const first = list[0]
                tx = lerp(tx, first.x - this.width / 2, firstGo ? 1 : 0.03)
                ty = lerp(ty, first.y - this.height / 2, firstGo ? 1 : 0.03)
                firstGo = false
            }
            for (let container of containers) {
                if (container) {
                    try {
                        container.x = -tx
                        container.y = -ty
                    } catch (e) {}
                }
            }
            if (this.background && track) {
                this.background.x = -tx % this.background.texture.width
                this.background.y = -ty % this.background.texture.height
            }
            for (let p of list) {
                let tick = particleFunctions[p.tick]
                tick && tick.call(this, delta, p)
            }
            this.collision.collisions((p, q) => {
                let collision = particleFunctions[p.collide]
                collision && collision.call(this, p, q)
            })
        })

        const groups = this.particles.getGroups()
        return (
            <>
                {this.trail && <Trail api={trail} />}
                {groups.map((group, type) => {
                    return <this.Container ref={attachSprites(group)} key={type} />
                })}
            </>
        )

        function attachSprites(group) {
            return function(container) {
                if (!container) return
                containers.push(container)
                if (track) {
                    container.x = -1000000
                }
                group.forEach((item) => container.addChild(item.sprite))
            }
        }
    }
}
