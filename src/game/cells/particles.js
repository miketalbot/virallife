import {randGen, VELOCITY_MULT} from '../constants'
import Prob from 'prob.js'
import {typeIds} from './types'
import {Sprite} from 'pixi.js'

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
        this.length = 0
    }
    getParticle() {
        let particle = this.particles[this.length]
        if (!particle) {
            particle = this.particles[this.length] = {
                x: 0.0,
                y: 0.0,
                vx: 0.0,
                vy: 0.0,
                type: 0,
                id: id++,
                speed: 0.0,
                rotation: 1.1,
                tick: 'move',
                collide: 'collide',
                sprite: new Sprite(),
            }
        }
        this.length++
        return particle
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
        let into = []
        const particles = this.particles
        for (let i = 0, l = this.length; i < l; i++) {
            const p = particles[i]
            let id = typeIds[p.type]
            max = Math.max(id, max)
            const list = (into[id] = into[id] || [])
            list.push(particles[i])
        }
        into.length = max + 1
        return into
    }
}
