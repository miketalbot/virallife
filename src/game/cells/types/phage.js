import {bad1} from '../sprites'
import {explode, sparks} from '../explode'
import {DIAMETER} from '../../constants'
import {callFunction, types} from '../types'
import {play} from '../../sounds'

export const phage = {
    name: 'Phage',
    description: 'Tries to kill shields',
    cost: 50,
    life: 200,
    color: 0xf200ff,
    sprite: bad1,
    earlyUpdate(surface, phage) {
        phage.proximal = 0
    },
    hit(surface, phage, points) {
        phage.life -= points
        play('drop')
        if (phage.life <= 0) {
            phage.alive = false
            explode(surface.spawn, phage.x, phage.y, types.phage.color)
        }
    },
    after(surface, phage) {
        if (phage.proximal > 1) {
            callFunction('phage', 'hit', surface, phage, 1)
        }
        phage.ticks--
        if (phage.ticks <= 0) {
            play('hit')
            callFunction('phage', 'hit', surface, phage, 1000)
        }
    },
    collide: {
        defender: hit,
        tcell: hit,
    },
    attract: {
        nucleus: 0.01,
        defender: 1.2,
        repel: -0.32,
        virus: -0.35,
        phage: -0.9,
        toxin: -1.3,
        tcell: 0.5,
    },
    minR: {
        nucleus: DIAMETER * 1.2,
        defender: DIAMETER,
        repel: DIAMETER * 6,
        virus: DIAMETER,
        phage: DIAMETER,
        toxin: DIAMETER,
        tcell: DIAMETER,
    },
    maxR: {
        nucleus: DIAMETER * 9,
        defender: DIAMETER * 5,
        repel: DIAMETER * 6,
        virus: DIAMETER * 2,
        phage: DIAMETER * 6,
        toxin: DIAMETER * 7,
        tcell: DIAMETER * 8,
    },
    init(phage) {
        phage.ticks = 700
    },
}

function hit({source, target, r, dx, dy, surface}) {
    if (r < DIAMETER * 1.7 && target.type === 'defender') {
        source.proximal++
    }
    if (r < DIAMETER * 1.3) {
        callFunction(target.type, 'hit', surface, target, 1)
        sparks(surface.spawn, source.x + (dx * r) / 2, source.y + (dy * r) / 2, types[target.type].color, 8, 0.3, 5)
    }
}
