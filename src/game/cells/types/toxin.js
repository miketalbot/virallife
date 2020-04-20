import {bad3} from '../sprites'
import {explode, smoke} from '../explode'
import {DIAMETER} from '../../constants'
import {callFunction, types} from '../types'

export const toxin = {
    name: 'Toxin',
    description: 'Releases a dose of poison killing surrounding cells',
    cost: 250,
    life: 120,
    color: 0xa6ef00,
    sprite: bad3,
    earlyUpdate(surface, toxin) {
        toxin.proximal = toxin.proximal || []
        toxin.proximal.length = 0
        smoke(surface.spawn, toxin.x, toxin.y, types.toxin.color)
    },
    hit(surface, toxin, points) {
        toxin.life -= points

        if (toxin.life <= 0) {
            toxin.alive = false
            explode(surface.spawn, toxin.x, toxin.y, types.toxin.color)
            for (let target of toxin.proximal) {
                explode(surface.spawn, target.x, target.y, types.toxin.color)
                callFunction(target.type, 'hit', surface, target, 350, toxin)
            }
        }
    },
    after(surface, toxin) {
        if (toxin.proximal.length > 6) {
            callFunction('toxin', 'hit', surface, toxin, 20)
        } else if (toxin.proximal.length > 2) {
            callFunction('toxin', 'hit', surface, toxin, 2)
        }
        toxin.ticks--
        if (toxin.ticks <= 0) {
            callFunction('toxin', 'hit', surface, toxin, 1000)
        }
    },
    collide: {
        defender({source, target, r, dx, dy, surface}) {
            if (r < DIAMETER * 3) {
                source.proximal.push(target)
            }
        },
    },
    attract: {
        nucleus: 0.15,
        defender: 0.27,
        repel: -0.32,
        virus: -3.35,
        toxin: -6.9,
        phage: -4,
        tcell: -0.05
    },
    minR: {
        nucleus: DIAMETER * 1.2,
        defender: DIAMETER,
        repel: DIAMETER * 6,
        virus: DIAMETER,
        phage: DIAMETER,
        toxin: DIAMETER * 1.6,
        tcell: DIAMETER * 2
    },
    maxR: {
        nucleus: DIAMETER * 7,
        defender: DIAMETER * 14,
        repel: DIAMETER * 6,
        virus: DIAMETER * 2,
        phage: DIAMETER * 6,
        toxin: DIAMETER * 10,
        tcell: DIAMETER * 7
    },
    init(phage) {
        phage.ticks = 500
    },
}
