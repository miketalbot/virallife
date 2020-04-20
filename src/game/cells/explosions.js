import React, {useState} from 'react'
import {Sprite} from 'pixi.js'
import {circle, textures} from './sprites'
import {ParticleContainer} from '@inlet/react-pixi'
import {useLocalEvent} from 'common/use-event'
import chroma from 'chroma-js'
import {lerp} from '../lib'
import {noop} from 'common/noop'

function mapToRgb(c) {
    return (c[0] << 16) + (c[1] << 8) + c[0]
}

export function Explosions({api, size = 16384}) {
    let next = 0
    const [particles] = useState(() =>
        Array.from({length: size}, () => {
            let sprite = new Sprite(textures[circle])
            sprite.scale.set(1)
            sprite.alpha = 0
            sprite.anchor.set(0.5)
            return sprite
        })
    )
    useLocalEvent('tick', (delta) => {
        for (let particle of particles) {
            if (particle.alive) {
                particle.t += (delta * 1) / 60
                if (particle.t > particle.life) {
                    particle.alive = false
                    particle.alpha = 0
                } else {
                    let t = particle.t / particle.life
                    particle.alpha = lerp(particle.startAlpha, particle.endAlpha, t)
                    particle.scale.set(lerp(particle.startScale, particle.endScale, t))
                    if (particle.startColor !== particle.endColor) {
                        particle.tint = mapToRgb(particle.chroma(t).rgb())
                    }
                    let speed = lerp(particle.startSpeed, particle.endSpeed, t)
                    particle.x += particle.dx * speed
                    particle.y += particle.dy * speed
                    particle.tick(particle)
                }
            }
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

    function emit(x, y, opts = {}) {
        let particle = particles[next++ % size]
        particle.x = x
        particle.y = y
        particle.life = 0.5
        particle.t = 0
        particle.scale.set(1)
        particle.alpha = 1
        particle.alive = true
        particle.startAlpha = 1
        particle.endAlpha = 0
        particle.startSpeed = 0
        particle.endSpeed = 0
        particle.dx = 1
        particle.dy = 0
        particle.startScale = 1
        particle.endScale = 1
        particle.startColor = 0xffffff
        particle.endColor = 0xffffff
        particle.tick = noop

        Object.assign(particle, opts)
        particle.chroma = chroma.scale(`${particle.startColor}`, `${particle.endColor}`).mode('lrgb')
        particle.tint = particle.startColor
        return particle
    }

    function add() {
        return function (container) {
            if (!container) return
            particles.forEach((p) => container.addChild(p))
        }
    }
}
