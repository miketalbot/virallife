import {DIAMETER, R_SMOOTH} from '../constants'
import {types} from './types'

export const particleFunctions = {
    move,
    collide,
}

function move(delta, p) {
    p.rotation += p.speed * delta
    p.x += p.vx * delta
    p.y += p.vy * delta
    if (p.x < DIAMETER) {
        p.vx = -p.vx
        p.x = DIAMETER
    } else if (p.x >= this.width - DIAMETER) {
        p.vx = -p.vx
        p.x = this.width - DIAMETER
    }

    if (p.y < DIAMETER) {
        p.vy = -p.vy
        p.y = DIAMETER
    } else if (p.y >= this.height - DIAMETER) {
        p.vy = -p.vy
        p.y = this.height - DIAMETER
    }
    p.vx *= 1.0 - this.friction * delta
    p.vy *= 1.0 - this.friction * delta
    this.collision.write(p.x, p.y, p)
}

function collide(p, q) {
    let dx = q.x - p.x
    let dy = q.y - p.y

    // Get distance squared
    const r2 = dx * dx + dy * dy
    let type = types[p.type]
    const minR = type.minR[q.type]
    const maxR = type.maxR[q.type]

    if (r2 > maxR * maxR || r2 < 0.01) {
        return
    }

    // Normalize displacement
    const r = Math.sqrt(r2)
    dx /= r
    dy /= r

    // Calculate force
    let f
    if (r > minR) {
        const n = 2.0 * Math.abs(r - 0.5 * (maxR + minR))
        const d = maxR - minR
        f = type.attract[q.type] * (1.0 - n / d)
    } else {
        f = R_SMOOTH * minR * (1.0 / (minR + R_SMOOTH) - 1.0 / (r + R_SMOOTH))
    }

    p.vx += f * dx
    p.vy += f * dy
}
