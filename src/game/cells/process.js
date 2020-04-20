import {R_SMOOTH} from '../constants'
import {types} from './types'

export const particleFunctions = {
    move,
    collide,
}

function move(delta, p) {
    p.rotation += p.speed * delta
    let lx = p.x
    let ly = p.y
    p.x += p.vx * delta
    p.y += p.vy * delta
    this.boundaryCheck(p)
    p.vx = p.vx * (1.0 - this.friction * delta)
    p.vy = p.vy * (1.0 - this.friction * delta)
    this.collision.write(p.x, p.y, p)
    if (this.trail) {
        const f = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (f > 2) this.emit(p.x, p.y, lx, ly, f / 3, types[p.type].color, f * 0.85)
    }
    updateSprite(p)
}

function collide(p, q) {
    let dx = (q.x - p.x) | 0
    let dy = (q.y - p.y) | 0

    // Get distance squared
    const r2 = dx * dx + dy * dy
    let type = types[p.type]
    const minR = type.minR[q.type]
    const maxR = type.maxR[q.type]

    if (r2 > maxR * maxR) {
        return
    }

    // Normalize displacement
    const r = Math.sqrt(r2)
    dx = dx / r
    dy = dy / r

    // Calculate force
    let f
    if (r > minR) {
        const n = 2.0 * Math.abs(r - 0.5 * (maxR + minR))
        const d = maxR - minR
        f = type.attract[q.type] * (1.0 - n / d)
    } else {
        f = R_SMOOTH * minR * (1.0 / (minR + R_SMOOTH) - 1.0 / (r + R_SMOOTH))
    }
    p.vx = p.vx + f * dx
    p.vy = p.vy + f * dy
}

export function updateSprite(p) {
    p.sprite.x = p.x
    p.sprite.y = p.y
    p.sprite.scale.set(0.7)
    p.sprite.angle = p.rotation
}
