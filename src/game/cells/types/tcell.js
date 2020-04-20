import {cell3, white as whiteSprite} from '../sprites'
import {chaser, explode, sparks} from '../explode'
import {raise} from 'common/events'
import {DIAMETER} from '../../constants'
import {callFunction, types} from '../types'
import {play} from '../../sounds'

export const white = {
    name: 'White',
    life: 1000,
    color: 0xffffff,
    sprite: whiteSprite,
}

export const tcell = {
    name: 'T Cell',
    good: true,
    description: 'Fights off infection',
    cost: 400,
    life: 40,
    color: 0x39b0e9,
    sprite: cell3,
    hit(surface, tcell, points) {
        play('drop')
        tcell.life -= points
        if (tcell.life <= 0) {
            explode(surface.spawn, tcell.x, tcell.y, types.tcell.color)
            tcell.alive = false
            raise('particle-destroyed', tcell)
        }
    },
    init(tcell) {
        tcell.beams = [{target: null}, {target: null}, {target: null}]
        tcell.beat = 0
    },
    collide: {
        default({source: tcell, target, r}) {
            if (r < DIAMETER * 12) {
                let typeDef = types[target.type]
                if (!typeDef.good && !typeDef.notarget) {
                    let beam = getBeam()
                    if (beam) {
                        beam.target = target
                    }
                }
            }

            function getBeam() {
                return tcell.beams.find((b) => !b.target || !b.target.alive)
            }
        },
    },
    after(surface, tcell) {
        if (!tcell.beams) return
        tcell.beat = tcell.beat + 1

        for (let beam of tcell.beams) {
            if (beam.target && beam.target.alive) {
                let dx = tcell.x - beam.target.x
                let dy = tcell.y - beam.target.y
                let r = Math.sqrt(dx * dx + dy * dy)
                if (r < DIAMETER * 12) {
                    chaser(surface.spawn, tcell.x, tcell.y, beam.target, tcell, types.tcell.color, strike)
                } else {
                    beam.target = null
                }
            }
        }

        function strike(source, target) {
            if (!target || !target.type || !target.alive) return
            play('beam')
            callFunction(target.type, 'hit', surface, target, .3, source)
            sparks(
                surface.spawn,
                source.x,
                source.y,
                types[target.type].color || 0xA0A0A0,
                4,
                0.25,
                3
            )
        }
    },

    attract: {
        nucleus: 0.45,
        defender: -0.01,
        repel: -0.32,
        virus: 0.26,
        phage: 0.26,
        toxin: 0.26,
        tcell: -5,
    },
    minR: {
        nucleus: DIAMETER * 3.2,
        defender: DIAMETER,
        repel: DIAMETER * 6,
        virus: DIAMETER * 3,
        phage: DIAMETER * 1.6,
        toxin: DIAMETER * 1.6,
        tcell: DIAMETER * 5,
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
