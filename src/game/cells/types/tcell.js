import {cell3} from '../sprites'
import {explode} from '../explode'
import {raise} from 'common/events'
import {DIAMETER} from '../../constants'
import {types} from '../types'

export const tcell = {
    name: 'T Cell',
    good: true,
    description: 'Fights off infection',
    cost: 400,
    life: 100,
    color: 0x39B0E9,
    sprite: cell3,
    hit(surface, tcell, points) {
        tcell.life -= points
        if (tcell.life <= 0) {
            explode(surface.spawn, tcell.x, tcell.y, types.tcell.color)
            tcell.alive = false
            raise('particle-destroyed', tcell)
        }
    },
    attract: {
        nucleus: .45,
        defender: -0.01,
        repel: -0.32,
        virus: .26,
        phage: .26,
        toxin: .26,
        tcell: -5
    },
    minR: {
        nucleus: DIAMETER * 3.2,
        defender: DIAMETER,
        repel: DIAMETER * 6,
        virus: DIAMETER * 3,
        phage: DIAMETER * 3,
        toxin: DIAMETER * 3,
        tcell: DIAMETER * 5
    },
    maxR: {
        nucleus: DIAMETER * 12,
        defender: DIAMETER * 12,
        repel: DIAMETER * 8,
        virus: DIAMETER * 12,
        phage: DIAMETER * 12,
        toxin: DIAMETER * 12,
        tcell: DIAMETER * 9,
    },
}
