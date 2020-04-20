import Sugar from 'sugar'
import {handle, raise} from 'common/events'
import {Emitter as PixiEmitter} from 'pixi-particles'
import * as PIXI from 'pixi.js'
import {PixiComponent} from '@inlet/react-pixi'
import React, {createContext, useContext, useEffect, useRef} from 'react'
import useMeasure from 'use-measure'
import Box from '@material-ui/core/Box'
import {useRefresh} from 'common/useRefresh'
import {noop} from 'common/noop'
import Button from '@material-ui/core/Button'

export const ScaleContext = React.createContext(1)
export const SurfaceContext = React.createContext(null)
export const RouteContext = React.createContext({})

export function useScale() {
    return useContext(ScaleContext)
}

export function useRouteContext() {
    return useContext(RouteContext)
}

export function useSurface() {
    return useContext(SurfaceContext)
}

PIXI.Ticker.shared.add((delta) => {
    raise('tick', delta)
})

export function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

export const Emitter = PixiComponent('Emitter', {
    create() {
        return new PIXI.Container()
    },
    applyProps(instance, oldProps, newProps) {
        const {image, config} = newProps

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

export function prevent(fn) {
    return function(event, ...params) {
        event.preventDefault()
        event.stopPropagation()
        return fn(event, ...params)
    }
}

export function Sized({ children, ...props }) {
    const ref = useRef()
    const measure = useMeasure(ref)

    return (
        <Box ref={ref} {...props}>
            {!!measure && !!measure.width && children(measure)}
        </Box>
    )
}

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

const roundingFactor = 100

export function uniform(n) {
    return Math.round(n * roundingFactor) / roundingFactor
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

export const StructureContext = createContext({ current: null })

export function useStructure() {
    return useContext(StructureContext)
}

export function useLocalRefresh() {
    const { save } = useStructure()
    return useRefresh(save)
}

export function useInterval(fn, interval) {
    useEffect(() => {
        let id = setInterval(fn, interval)
        return () => {
            clearInterval(id)
        }
    })
}

export function useTimeout(fn, timeout) {
    useEffect(() => {
        let id = setTimeout(fn, timeout)
        return () => {
            clearTimeout(id)
        }
    })
}

export function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t
}

export function toRad(deg) {
    return (deg / 180) * Math.PI
}

export function mapToRgb(color) {
    const c = color.rgb()
    return (c[0] << 16) + (c[1] << 8) + c[2]
}

export function downloadObject(object, filename = 'file.json') {
    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(object))
    var dlAnchorElem = document.createElement('a')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', filename)
    dlAnchorElem.click()
}

export function UploadButton({onFile = noop, onRaw = noop, Component = Button, accept = '*', children, ...props}) {
    return (
        <Component {...props} onClick={prevent(selectFile)}>
            {children}
        </Component>
    )

    async function gotFile(e) {
        const {target: {files: [file] = []} = {}} = e
        if (file) {
            if (onRaw(file)) {
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => onFile(JSON.parse(e.target.result))
            reader.readAsText(file, 'utf8')
        }
    }

    function selectFile() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = accept
        input.style.display = 'none'
        input.onchange = gotFile
        document.body.append(input)
        setTimeout(() => {
            input.click()
            input.remove()
        }, 200)
    }
}
