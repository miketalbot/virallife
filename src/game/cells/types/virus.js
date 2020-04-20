import {virusSprite} from '../sprites'
import {DIAMETER} from '../../constants'
import {darkSparks, explode} from '../explode'
import {callFunction} from '../types'
import {play} from '../../sounds'

export const virus = {
    name: 'Virus',
    description: 'Tries to infect a nucleus',
    cost: 600,
    life: 60 * 3,
    notarget: true,
    color: 0x544622,
    sprite: virusSprite,
    attract: {
        nucleus: 5.4,
        defender: -0.03,
        repel: -0.32,
        virus: -2,
        phage: 0.03,
        toxin: 0.25,
        tcell: -0.05
    },
    minR: {
        nucleus: DIAMETER * 0.2,
        defender: DIAMETER,
        repel: DIAMETER * 6,
        virus: DIAMETER,
        phage: DIAMETER,
        toxin: DIAMETER,
        tcell: DIAMETER * 2
    },
    maxR: {
        nucleus: DIAMETER * 14,
        defender: DIAMETER * 5,
        repel: DIAMETER * 6,
        virus: DIAMETER * 2,
        phage: DIAMETER * 4,
        toxin: DIAMETER * 4,
        tcell: DIAMETER * 8
    },
    collide: {
        nucleus({source, target, r, dx, dy, surface}) {
            if (r < DIAMETER * 1.5) {
                callFunction(target.type, 'hit', surface, target, 1, source)
                darkSparks(surface.spawn, source.x + (dx * r) / 2, source.y + (dy * r) / 2, 0x404040, 10, 0.8, 6)
            }
        },
    },
    after(surface, virus) {
        virus.ticks--
        if (virus.ticks < 0) {
            play('hit')
            explode(surface.spawn, virus.x, virus.y, 0x605020, 20, 1.2, 3, 5)
            virus.alive = false
        }
    },
    init(virus) {
        virus.ticks = 800
    },
}
