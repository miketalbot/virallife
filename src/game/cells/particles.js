import {randGen, VELOCITY_MULT} from '../constants'
import Prob from 'prob.js'

let id = 1

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
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                type: '',
                id: id++,
            }
        }
        this.length++
        return particle
    }
    randomParticles(number, width, height, types, random = randGen) {
        const randType = Prob.uniform(0, types.size() - 1)
        const randUni = Prob.uniform(0, 1)
        const randNorm = Prob.normal(0, 1)

        this.startParticles()
        for (let i = 0; i < number; i++) {
            const p = this.getParticle()
            p.type = Math.round(randType(random))
            p.x = (randUni(random) * 0.5 + 0.25) * width
            p.y = (randUni(random) * 0.5 + 0.25) * height
            p.vx = randNorm(random) * VELOCITY_MULT
            p.vy = randNorm(random) * VELOCITY_MULT
        }
    }
    get(index) {
        if (index < 0 || index >= this.length) return undefined
        return this.particles[index]
    }
    getParticles(into = []) {
        const particles = this.particles
        for (let i = 0, l = this.length; i < l; i++) {
            into.push(particles[i])
        }
        return into
    }
}
