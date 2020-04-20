import {randGen, VELOCITY_MULT} from '../constants'
import Prob from 'prob.js'
import {allTypes, typeIds, types} from './types'
import {Sprite} from 'pixi.js'
import {textures} from './sprites'

let id = 1

const frequency = [
    { count: 5, type: 'nucleus' },
    { count: 70, type: 'defender' },
]

function getType(i) {
    for (let instance of frequency) {
        i -= instance.count
        if (i < 0) {
            return instance.type
        }
    }
    return frequency[frequency.length - 1].type
}

export class Particles {
    particles = []
    length = 0

    startParticles() {
        let particles = this.particles
        for (let i = 0, l = this.length; i < l; i++) {
            particles[i].sprite.x = -10000
            particles[i].sprite.alpha = 0
        }
        this.length = 0
    }
    getParticle() {
        let p = this.particles[this.length]
        if (!p) {
            p = this.particles[this.length] = {
                x: -10000.0,
                y: -10000.0,
                vx: 0.0,
                vy: 0.0,
                type: 0,
                id: id++,
                speed: 0.0,
                rotation: 1.1,
                tick: 'move',
                collide: 'collide',
                sprite: new Sprite(),
                r1: Math.random(),
                r2: Math.random()
            }
        }
        p.alive = true
        p.x = -10000.0
        p.y = -10000.0
        p.vx = 0.0
        p.vy = 0.0
        p.other = Math.random() * 300
        p.speed = Math.random() * .9 + .1
        p.speed2 = Math.random() * .9 + .1
        p.scale = .7
        p.sprite.scale.set(0.5)
        p.sprite.anchor.set(0.5)
        p.sprite.interactive = false
        p.sprite.pointerdown = null
        p.sprite.pointerup = null
        p.sprite.pointermove = null
        this.length++
        return p
    }
    randomParticles(number, width, height, random = randGen) {
        const randUni = Prob.uniform(0, 1)
        const randNorm = Prob.normal(0, 1)

        this.startParticles()
        for (let i = 0; i < number; i++) {
            const p = this.getParticle()
            p.type = getType(i)
            p.x = (randUni(random) * 0.5 + 0.25) * width
            p.y = (randUni(random) * 0.5 + 0.25) * height
            p.vx = randNorm(random) * VELOCITY_MULT
            p.vy = randNorm(random) * VELOCITY_MULT
            p.speed = randUni(random)
            p.sprite.texture = textures[types[p.type].sprite]
        }
    }
    get(index) {
        if (index < 0 || index >= this.length) return undefined
        return this.particles[index]
    }
    getParticles(into = []) {
        into.length = 0
        const particles = this.particles
        for (let i = 0, l = this.length; i < l; i++) {
            into.push(particles[i])
        }
        return into
    }
    getGroups() {
        let max = -1
        let into = this.groups = this.groups || Array.from({length: allTypes.length}, () => [])
        const particles = this.particles
        for (let i = 0, l = this.length; i < l; i++) {
            const p = particles[i]
            let id = typeIds[p.type]
            into[id].push(particles[i])
        }

        return into
    }
}
