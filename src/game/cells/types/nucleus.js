import chroma from 'chroma-js'
import {nucleusSprite} from '../sprites'
import {DIAMETER} from '../../constants'
import {explode} from '../explode'
import {raise} from 'common/events'
import {mapToRgb} from '../../lib'
import {types} from '../types'
import {play} from '../../sounds'

const scale = chroma.scale()
export const nucleus = {
    good: true,
    name: 'Nucleus',
    cost: 600,
    life: 150,
    description: 'The core of your structure',
    color: 0xffd990,
    sprite: nucleusSprite,
    attract: {
        nucleus: -4.5,
        defender: 0.01,
        repel: -5,
        virus: -2.84,
        phage: -0.25,
        toxin: -1,
        tcell: 0,
    },
    minR: {
        nucleus: DIAMETER * 4,
        defender: DIAMETER * 2,
        repel: DIAMETER * 6,
        virus: DIAMETER * 0.9,
        phage: DIAMETER,
        toxin: DIAMETER,
        tcell: DIAMETER,
    },
    maxR: {
        nucleus: DIAMETER * 9,
        defender: DIAMETER * 4,
        repel: DIAMETER * 8,
        virus: DIAMETER * 2,
        phage: DIAMETER * 4,
        toxin: DIAMETER * 8,
        tcell: DIAMETER * 7,
    },
    hit(surface, nucleus, points, source) {
        if (source.type !== 'virus') return
        play('mutate')
        nucleus.life -= points
        if (nucleus.life <= 0) {
            nucleus.alive = false
            explode(surface.spawn, nucleus.x, nucleus.y, 0x605020, 40, 2.8, 3, 10)
            raise('particle-destroyed', nucleus)
            source.ticks = 100000000
        }
    },
    after(surface, nucleus) {
        nucleus.life = Math.min(types.nucleus.life, nucleus.life + 0.07)
        nucleus.sprite.tint = mapToRgb(scale(0.7 - nucleus.life / types.nucleus.life))
    },
}
