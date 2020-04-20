import React, {useRef, useState} from 'react'
import {Collision} from './collision'
import {Particles} from './particles'
import {Graphics, ParticleContainer} from '@inlet/react-pixi'
import {particleFunctions} from './process'
import {noop} from 'common/noop'
import {Trail} from './trail'
import {DIAMETER} from '../constants'
import {useLocalEvent} from 'common/use-event'
import {Explosions} from './explosions'
import {callFunction} from './types'
import {useRefresh} from 'common/useRefresh'

export class Surface {
    list = []

    constructor(width, height, count, trail = true, Container = ParticleContainer) {
        this.emit = noop
        this.spawn = noop
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
        this.refresh = refresh
        this.reactRefresh = useRefresh()
        const trail = useRef()
        const explode = useRef()
        const cache = {}
        const [containers] = useState([])
        useLocalEvent('tick', () => {
            this.emit = trail.current || noop
            this.spawn = explode.current || noop
            const list = this.particles.getParticles(this.list)
            this.collision.startCollision()

            for (let p of list) {
                if (p.alive) {
                    let tick = particleFunctions[p.tick]
                    tick && tick.call(this, this.rate, p)
                }
            }
            this.collision.collisions((p, q) => {
                let collision = particleFunctions[p.collide]
                collision && collision.call(this, p, q)
            })
            for (let p of list) {
                if (p.alive) {
                    callFunction(p.type, 'after', self, p)
                } else {
                    p.sprite.alpha = 0
                }
            }

        })

        const groups = this.particles.getGroups()
        return (
            <>
                {!this.trail && <Graphics preventRedraw={false} draw={drawOuter}/>}
                {this.trail && <Trail api={trail}/>}
                {groups.map((group, type) => {
                    return <this.Container ref={attachSprites(group, type)} key={type}/>
                })}
                {this.trail && <Explosions api={explode}/>}
            </>
        )

        function refresh() {
            const groups = self.particles.getGroups()
            groups.forEach((group, type) => {

                const container = cache[type]
                if (container) {
                    group.forEach(item => {
                        container.addChild(item.sprite)
                    })
                }
            })
        }

        function attachSprites(group, type) {
            return function (container) {
                if (!container) return
                cache[type] = container
                containers.push(container)
                group.forEach((item) => container.addChild(item.sprite))
            }
        }

        function drawOuter(g) {
            g.clear()
            g.lineStyle(DIAMETER, 0xffd900, 1)
            g.drawRect(-self.width / 2, -self.height / 2, self.width, self.height)
        }
    }
}
