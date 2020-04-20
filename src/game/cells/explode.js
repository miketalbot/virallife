import {lerp, mapToRgb, toRad} from '../lib'
import chroma from 'chroma-js'

const explodeOpts = {
    life: 0.0,
    dx: 0.0,
    dy: 0.0,
    startSpeed: 0.0,
    endSpeed: 0.0,
    startScale: .6,
    endScale: 3,
    startColor: 0,
    endColor: 0,
    startAlpha: 0.8,
    endAlpha: .000001
}

export function explode(emit, x, y, color, number = 6, life = 0.5, speed = 4, shell = 0, startAngle = 0, endAngle = 360) {
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

const sparkOpts = {
    life: 0.0,
    dx: 0.0,
    dy: 0.0,
    startSpeed: 0.0,
    endSpeed: 0.0,
    startScale: .6,
    endScale: .1,
    startColor: 0xFFFFFF,
    endColor: 0xFFFFFF,
    startAlpha: 0.6,
    endAlpha: 0
}

let baseOffset = 0

export function sparks(emit, x, y, color, number = 6, life = 0.5, speed = 4, shell = 0, startAngle = 0, endAngle = 360) {
    const offset = baseOffset//Math.random() * Math.PI * 2
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

export function darkSparks(emit, x, y, color, number = 6, life = 0.5, speed = 4, shell = 0, startAngle = 0, endAngle = 360) {
    const offset = otherOffset//Math.random() * Math.PI * 2
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
    startScale: .1,
    endScale: 3,
    startColor: 0xFFFFFF,
    endColor: 0xFFFFFF,
    startAlpha: 0.27,
    endAlpha: 0
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
        smokeOpts.endSpeed = speed * .6
        smokeOpts.life = life
        smokeOpts.startColor = color
        smokeOpts.endColor = mapToRgb(chroma(color.toString(16)).brighten(3))

        emit(ex, ey, smokeOpts)

    }


}
