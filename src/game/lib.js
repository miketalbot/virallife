import Sugar from 'sugar'
import {handle} from 'common/events'
import {Emitter as PixiEmitter} from 'pixi-particles'
import * as PIXI from 'pixi.js'
import {PixiComponent} from '@inlet/react-pixi'

export const Emitter = PixiComponent('Emitter', {
    create() {
        return new PIXI.Container()
    },
    applyProps(instance, oldProps, newProps) {
        const { image, config } = newProps

        if (!this._emitter) {
            this._emitter = new PixiEmitter(instance, [PIXI.Texture.from(image)], config)

            let elapsed = Date.now()

            const t = () => {
                this._emitter.raf = requestAnimationFrame(t)
                const now = Date.now()

                this._emitter.update((now - elapsed) * 0.001)

                elapsed = now
            }

            this._emitter.emit = true
            t()
        }
    },
    willUnmount() {
        if (this._emitter) {
            this._emitter.emit = false
            cancelAnimationFrame(this._emitter.raf)
        }
    },
})

Sugar.extend()
export let game = {
    states: {},
}

export function element(handler) {
    handle('game-elements', function(elements) {
        elements.push(handler)
    })
}

export function particle(handler) {
    handle('particle-elements', function(elements) {
        elements.push(handler)
    })
}

export function rand(value = 1) {
    return Math.random() * value
}

export function randUniform(min, max) {
    return Math.round(rand() * (max - min)) + min
}

export function fromHSV(h, s, v) {
    const i = Math.round(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)

    let r
    let g
    let b
    switch (i % 6) {
        case 0:
            r = v
            g = t
            b = p
            break
        case 1:
            r = q
            g = v
            b = p
            break
        case 2:
            r = p
            g = v
            b = t
            break
        case 3:
            r = p
            g = q
            b = v
            break
        case 4:
            r = t
            g = p
            b = v
            break
        default:
            r = v
            g = p
            b = q
            break
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    }
}

export function resizeArray(array, size, defaultValue) {
    let delta = array.length - size

    if (delta > 0) {
        array.length = size
    } else {
        while (delta++ < 0) {
            array.push(defaultValue)
        }
    }

    return array
}
