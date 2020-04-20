import React, {useRef, useState} from 'react'
import {Collision} from './collision'
import {Particles} from './particles'
import {Graphics, ParticleContainer, useTick} from '@inlet/react-pixi'
import {particleFunctions} from './process'
import {noop} from 'common/noop'
import {Trail} from './trail'
import {useRefresh} from 'common/useRefresh'
import {DIAMETER} from '../constants'

export class Surface {
    list = []

    constructor(width, height, count, trail = true, Container = ParticleContainer) {
        this.rate = 1
        this.Container = Container
        this.width = width | 0
        this.trail = trail
        this.height = height | 0
        this.particles = new Particles()
        this.collision = new Collision(140)
        this.friction = 0.07
        this.particles.startParticles()
        count && this.particles.randomParticles(count, width, height)
        this.Render = this.Render.bind(this)
        this.boundaryCheck = this.boundaryCheck.bind(this)
    }

    boundaryCheck(p) {
        if (p.x < -this.width / 2 + DIAMETER) {
            p.vx = -p.vx
            p.x = -this.width / 2 + DIAMETER
        } else if (p.x >= this.width / 2 - DIAMETER) {
            p.vx = -p.vx
            p.x = this.width / 2 - DIAMETER
        }

        if (p.y < -this.height / 2 + DIAMETER) {
            p.vy = -p.vy
            p.y = -this.height / 2 + DIAMETER
        } else if (p.y >= this.height / 2 - DIAMETER) {
            p.vy = -p.vy
            p.y = this.height / 2 - DIAMETER
        }
    }

    Render() {
        const self = this
        this.refresh = useRefresh()
        const trail = useRef()
        const [containers] = useState([])
        useTick(() => {
            this.emit = trail.current || noop
            const list = this.particles.getParticles(this.list)
            this.collision.startCollision()

            for (let p of list) {
                let tick = particleFunctions[p.tick]
                tick && tick.call(this, this.rate, p)
            }
            this.collision.collisions((p, q) => {
                let collision = particleFunctions[p.collide]
                collision && collision.call(this, p, q)
            })
        })

        const groups = this.particles.getGroups()
        return (
            <>
                {!this.trail && <Graphics preventRedraw={false} draw={drawOuter} />}
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
                group.forEach((item) => container.addChild(item.sprite))
            }
        }

        function drawOuter(g) {
            g.clear()
            g.lineStyle(DIAMETER, 0xffd900, 1)
            g.drawRect(0, 0, self.width, self.height)
        }
    }
}
