import {bad1} from '../sprites'
import {explode, sparks} from '../explode'
import {DIAMETER} from '../../constants'
import {callFunction, types} from '../types'

export const phage = {
    name: 'Phage',
    description: 'Tries to kill shields',
    cost: 100,
    life: 100,
    color: 0xf200ff,
    sprite: bad1,
    earlyUpdate(surface, phage) {
        phage.proximal = 0
    },
    hit(surface, phage, points) {
        phage.life -= points

        if (phage.life <= 0) {
            phage.alive = false
            explode(surface.spawn, phage.x, phage.y, types.phage.color)
        }
    },
    after(surface, phage) {
        if (phage.proximal > 1) {
            callFunction('phage', 'hit', surface, phage, phage.proximal - 1)
        }
        phage.ticks--
        if (phage.ticks <= 0) {
            callFunction('phage', 'hit', surface, phage, 1000)
        }
    },
    collide: {
        defender({source, target, r, dx, dy, surface}) {
            if (r < DIAMETER * 1.7) {
                source.proximal++
            }
            if (r < DIAMETER * 1.2) {
                callFunction(target.type, 'hit', surface, target, 1)
                sparks(
                    surface.spawn,
                    source.x + (dx * r) / 2,
                    source.y + (dy * r) / 2,
                    types[target.type].color,
                    8,
                    0.3,
                    5
                )
            }
        },
    },
    attract: {
        nucleus: 0.3,
        defender: 1.2,
        repel: -0.32,
        virus: -0.35,
        phage: -0.9,
        toxin: -1.3,
        tcell: -0.05
    },
    minR: {
        nucleus: DIAMETER * 1.2,
        defender: DIAMETER,
        repel: DIAMETER * 6,
        virus: DIAMETER,
        phage: DIAMETER,
        toxin: DIAMETER,
        tcell: DIAMETER * 2
    },
    maxR: {
        nucleus: DIAMETER * 9,
        defender: DIAMETER * 5,
        repel: DIAMETER * 6,
        virus: DIAMETER * 2,
        phage: DIAMETER * 6,
        toxin: DIAMETER * 7,
        tcell: DIAMETER * 8
    },
    init(phage) {
        phage.ticks = 500
    },
}