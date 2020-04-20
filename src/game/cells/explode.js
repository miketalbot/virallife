import {lerp, mapToRgb, toRad} from '../lib'
import chroma from 'chroma-js'
import {noop} from 'common/noop'
import {DIAMETER} from '../constants'

const explodeOpts = {
    life: 0.0,
    dx: 0.0,
    dy: 0.0,
    startSpeed: 0.0,
    endSpeed: 0.0,
    startScale: 0.6,
    endScale: 3,
    startColor: 0,
    endColor: 0,
    startAlpha: 0.8,
    endAlpha: 0.000001,
}

export function explode(
    emit,
    x,
    y,
    color,
    number = 6,
    life = 0.5,
    speed = 4,
    shell = 0,
    startAngle = 0,
    endAngle = 360
) {
    const offset = Math.random() * 360
    for (let i = 0; i < number; i++) {
        const angle = toRad(lerp(startAngle + offset, endAngle + offset, i / number) + Math.random() * 45)
        const dx = Math.sin(angle)
        const dy = Math.cos(angle)
        const ex = x + dx * shell
        const ey = y + dy * shell
        explodeOpts.dx = dx
        explodeOpts.dy = dy
        explodeOpts.endScale = Math.random() * 7 + 2
        explodeOpts.startSpeed = speed
        explodeOpts.endSpeed = speed / 3
        explodeOpts.life = life
        explodeOpts.startColor = color
        sparkOpts.startColor = mapToRgb(chroma(color.toString(16)).darken(Math.random() * 3))

        let p = emit(ex, ey, explodeOpts)
        p.t = Math.random()
    }
}

const chaserOpts = {
    life: 2.0,
    dx: 0.0,
    dy: 0.0,
    startSpeed: 0.5,
    endSpeed: 0.5,
    startScale: 0.2,
    endScale: 0,
    startColor: 0xffffff,
    endColor: 0xffffff,
    startAlpha: 0.1,
    endAlpha: 0,
}

export function chaser(emit, x, y, target, source, color, cb) {
    chaserOpts.startColor = color
    chaserOpts.endColor = color

    let p = emit(x, y, chaserOpts)
    p.tick = function (p) {
        if (!target.alive) {
            p.t = 10000
            p.tick = noop
            p.alive = false
            p.alpha = 0
            return
        }
        p.x = lerp(p.x, target.x, p.t / 4)
        p.y = lerp(p.y, target.y, p.t / 4)

        let dx = source.x - target.x
        let dy = source.y - target.y
        let original = Math.sqrt(dx * dx + dy * dy)
        dx = p.x - target.x
        dy = p.y - target.y
        let r = Math.sqrt(dx * dx + dy * dy)
        if (r < DIAMETER * 1.6) {
            p.alive = false
            p.alpha = 0
            p.tick = noop
            cb(p, target)
            return
        }
        let t = Math.min(1, Math.max(0, 1 - r / original))
        p.alpha = lerp(0.09, 0.03, t)
        p.scale.set(lerp(0.8, 0.1, t))
    }
}

const sparkOpts = {
    life: 0.0,
    dx: 0.0,
    dy: 0.0,
    startSpeed: 0.0,
    endSpeed: 0.0,
    startScale: 0.6,
    endScale: 0.1,
    startColor: 0xffffff,
    endColor: 0xffffff,
    startAlpha: 0.6,
    endAlpha: 0,
}

let baseOffset = 0

export function sparks(
    emit,
    x,
    y,
    color,
    number = 6,
    life = 0.5,
    speed = 4,
    shell = 0,
    startAngle = 0,
    endAngle = 360
) {
    const offset = baseOffset //Math.random() * Math.PI * 2
    baseOffset += 5
    for (let i = 0; i < number; i++) {
        const angle = toRad(lerp(startAngle + offset, endAngle + offset, i / (number - 1)) + Math.random() * 10)
        const dx = Math.sin(angle)
        const dy = Math.cos(angle)
        const ex = x + dx * shell
        const ey = y + dy * shell
        sparkOpts.dx = dx
        sparkOpts.dy = dy
        sparkOpts.startSpeed = speed
        sparkOpts.endSpeed = speed
        sparkOpts.life = life
        sparkOpts.startColor = mapToRgb(chroma(color.toString(16)).brighten(1))

        emit(ex, ey, sparkOpts)
    }
}

let otherOffset = 0

export function darkSparks(
    emit,
    x,
    y,
    color,
    number = 6,
    life = 0.5,
    speed = 4,
    shell = 0,
    startAngle = 0,
    endAngle = 360
) {
    const offset = otherOffset //Math.random() * Math.PI * 2
    otherOffset -= 1
    for (let i = 0; i < number; i++) {
        const angle = toRad(lerp(startAngle + offset, endAngle + offset, i / (number - 1)) + Math.random() * 10)
        const dx = Math.sin(angle)
        const dy = Math.cos(angle)
        const ex = x + dx * shell
        const ey = y + dy * shell
        sparkOpts.dx = dx
        sparkOpts.dy = dy
        sparkOpts.startSpeed = speed
        sparkOpts.endSpeed = speed
        sparkOpts.life = life
        sparkOpts.startColor = mapToRgb(chroma(color.toString(16)).darken(1))
        sparkOpts.endColor = 0

        emit(ex, ey, sparkOpts)
    }
}

const smokeOpts = {
    life: 0.0,
    dx: 0.0,
    dy: 0.0,
    startSpeed: 0.0,
    endSpeed: 0.0,
    startScale: 0.1,
    endScale: 3,
    startColor: 0xffffff,
    endColor: 0xffffff,
    startAlpha: 0.27,
    endAlpha: 0,
}

let smokeOffset = 0

export function smoke(emit, x, y, color, number = 2, life = 0.5, speed = 2, shell = 0, startAngle = 0, endAngle = 360) {
    const offset = Math.random() * 360
    smokeOffset += 1.5
    for (let i = 0; i < number; i++) {
        const angle = toRad(lerp(startAngle + offset, endAngle + offset, i / (number - 1)) + Math.random() * 10)
        const dx = Math.sin(angle)
        const dy = Math.cos(angle)
        const ex = x + dx * shell
        const ey = y + dy * shell
        smokeOpts.endScale = Math.random() * 4
        smokeOpts.dx = dx
        smokeOpts.dy = dy
        smokeOpts.startSpeed = speed
        smokeOpts.endSpeed = speed * 0.6
        smokeOpts.life = life
        smokeOpts.startColor = color
        smokeOpts.endColor = mapToRgb(chroma(color.toString(16)).brighten(3))

        emit(ex, ey, smokeOpts)
    }
}
