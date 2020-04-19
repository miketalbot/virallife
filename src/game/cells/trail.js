import React, {useState} from 'react'
import {Sprite} from 'pixi.js'
import {circle, textures} from './sprites'
import {ParticleContainer, useTick} from '@inlet/react-pixi'

export function Trail({ api, speed = 2.5 / 60, size = 2000 }) {
    let next = 0
    const [particles] = useState(() =>
        Array.from({ length: size }, () => {
            let sprite = new Sprite(textures[circle])
            sprite.scale.set(1)
            sprite.alpha = 0
            sprite.anchor.set(0.5)
            return sprite
        })
    )
    useTick((delta) => {
        let i = 0
        for (let particle of particles) {
            if (particle.t > 0.04) {
                particle.t -= speed * delta
            } else {
                particle.t = 0
            }
            particle.alpha *= 0.95
            particle.scale.set(particle.t * 0.85)
        }
    })
    api.current = emit
    return (
        <ParticleContainer
            maxSize={size}
            ref={add()}
            properties={{
                scale: true,
                position: true,
                rotation: false,
                alpha: true,
                uvs: false,
            }}
        />
    )

    function emit(x, y, lx, ly, steps = 1, color = 0xffffff, alpha = 0.9) {
        const dx = (x - lx) / steps
        const dy = (y - ly) / steps
        for (let i = 0; i < steps; i++) {
            let particle = particles[next++ % size]
            particle.x = lx
            particle.y = ly
            particle.t = 1
            particle.scale.set(1)
            particle.alpha = 0.02 * alpha
            particle.tint = color
            lx += dx
            ly += dy
        }
    }

    function add() {
        return function(container) {
            particles.forEach((p) => container.addChild(p))
        }
    }
}
