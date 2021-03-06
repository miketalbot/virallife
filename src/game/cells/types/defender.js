import {explode} from '../explode'
import {raise} from 'common/events'
import {DIAMETER} from '../../constants'
import {types} from '../types'
import {cell1} from '../sprites/index'
import {play} from '../../sounds'

export const defender = {
    name: 'Shield',
    good: true,
    description: 'Shields a nucleus',
    cost: 20,
    life: 25,
    color: 0xff0000,
    sprite: cell1,
    hit(surface, defender, points) {
        play('drop')
        defender.life -= points
        if (defender.life <= 0) {
            explode(surface.spawn, defender.x, defender.y, types.defender.color)
            defender.alive = false
            raise('particle-destroyed', defender)
        }
    },
    attract: {
        nucleus: 1.72,
        defender: -0.22,
        repel: -0.32,
        virus: 2.85,
        phage: -1,
        toxin: .25,
        tcell: .1
    },
    minR: {
        nucleus: DIAMETER * 1.2,
        defender: DIAMETER,
        repel: DIAMETER * 6,
        virus: DIAMETER,
        phage: DIAMETER,
        toxin: DIAMETER,
        tcell: DIAMETER
    },
    maxR: {
        nucleus: DIAMETER * 9,
        defender: DIAMETER * 5,
        repel: DIAMETER * 8,
        virus: DIAMETER * 6,
        phage: DIAMETER * 4,
        toxin: DIAMETER * 9,
        tcell: DIAMETER * 5
    },
}
