import React, {useRef, useState} from 'react'
import {DIAMETER, GAME_HEIGHT, GAME_WIDTH} from '../constants'
import {Container, Graphics, Sprite, Text} from '@inlet/react-pixi'
import * as PIXI from 'pixi.js'
import {useLocalEvent} from 'common/use-event'
import {raise} from 'common/events'
import {callFunction, types} from './types'
import {deepOrange} from '@material-ui/core/colors'
import {lerp, useScale, useSurface} from '../lib'
import {updateSprite} from './process'
import {textures} from './sprites'

const launcherArea = new PIXI.Circle(0, 0, DIAMETER * 5)
const typeList = ['phage', 'toxin', 'virus']
let baseType = 0

export function Launcher({x, y, budgetRef}) {
    const [type, setType] = useState(baseType++ % 3)
    const [mode, setMode] = useState('off')
    const scale = useScale()
    const surface = useSurface()
    useLocalEvent('unselect-launcher', setOff)
    useLocalEvent('additional-particles', (particles) => {
        let p = particles.getParticle()
        p.x = x
        p.y = y
        p.tick = 'write'
        p.collide = 'noop'
        p.type = 'repel'
        p.sprite.alpha = 0
    })
    return (
        <Container x={x} y={y} interactive={true}>
            <Graphics
                pointertap={activate}
                interactive={true}
                hitArea={launcherArea}
                preventRedraw={false}
                draw={drawLauncher}
            />
            {['on'].includes(mode) && <Enemy/>}
        </Container>
    )

    function drawLauncher(g) {
        let color = 0xffd900
        let alpha = 0.4
        let width = DIAMETER / 2
        switch (mode) {
            case 'off':
                color = 0xffffff
                alpha = 0.2
                width = DIAMETER / 4
                break
        }

        g.clear()
        g.lineStyle(width, color, alpha)
        g.drawCircle(0, 0, DIAMETER * 5)
    }

    function setOff() {
        setMode('off')
    }

    function activate() {
        switch (mode) {
            case 'off':
                raise('unselect-launcher')
                setMode('on')
                break
        }
    }

    function Enemy() {
        const currentType = types[typeList[type]]
        let mode = 'pulse'
        const ref = useRef()
        let scaleMod = 0
        let targetPt = {x: 0, y: 0}
        let p = 0
        let start = 0
        let last = {x: 0, y: 0}
        useLocalEvent('tick', () => {
            p += 0.1
            let cell = ref.current
            scaleMod = Math.sin(p) * 0.1
            cell.angle = p * 2
            cell.angle = p * 2
            cell.x = lerp(cell.x, targetPt.x, 0.2)
            cell.y = lerp(cell.y, targetPt.y, 0.2)
            switch (mode) {
                case 'follow':
                    cell.scale.set(lerp(cell.scale.x, 0.7 + scaleMod, 0.1))
                    const d2 = cell.x * cell.x + cell.y * cell.y
                    if (d2 > 10000) {
                        if (budgetRef.current < currentType.cost) {
                            raise('over-spend', budgetRef.current)
                            return
                        }
                        budgetRef.current -= currentType.cost
                        raise('spend', budgetRef.current, currentType.cost)
                        let dx = targetPt.x - last.x
                        let dy = targetPt.y - last.y
                        let size = Math.sqrt(dx * dx + dy * dy) * 3.5
                        dx /= size
                        dy /= size
                        size = Math.max(4, Math.min(270, size))
                        start = 0
                        unpress()
                        const p = surface.particles.getParticle()
                        p.type = typeList[type]
                        p.x = cell.x + x
                        p.y = cell.y + y
                        p.vx = dx * size
                        p.vy = dy * size
                        p.life = currentType.life
                        p.sprite.alpha = 1
                        p.sprite.scale = 1
                        p.sprite.texture = textures[currentType.sprite]
                        callFunction(p.type, 'init', p)
                        surface.refresh()
                        updateSprite(p)
                    }
                    break
                default:
                    cell.scale.set(lerp(cell.scale.x, 1.5 + scaleMod, 0.1))
                    break
            }
        })
        return (
            <>
                <Text
                    isSprite={true}
                    text={currentType.name}
                    anchor={0.5}
                    y={-135}
                    style={
                        new PIXI.TextStyle({
                            align: 'center',
                            fontFamily: '"Roboto", Helvetica, sans-serif',
                            fontSize: 35,
                            fontWeight: 500,
                            fill: '#ffffff',
                            stroke: '#01d27e',
                            strokeThickness: 0,
                        })
                    }
                />
                <Text
                    isSprite={true}
                    text={`${currentType.cost} credits`}
                    anchor={0.5}
                    y={130}
                    style={
                        new PIXI.TextStyle({
                            align: 'center',
                            fontFamily: '"Roboto", Helvetica, sans-serif',
                            fontSize: 25,
                            fontWeight: 300,
                            fill: deepOrange['500'],
                            stroke: '#01d27e',
                            strokeThickness: 0,
                        })
                    }
                />
                <Sprite
                    ref={ref}
                    interactive={true}
                    anchor={0.5}
                    scale={1.5}
                    pointerdown={press}
                    pointermove={move}
                    pointerup={unpress}
                    pointerupoutside={unpress}
                    texture={textures[currentType.sprite]}
                />
            </>
        )

        function move(event) {
            last.x = targetPt.x
            last.y = targetPt.y
            switch (mode) {
                case 'follow':
                    targetPt = {...event.data.global}
                    targetPt.x = targetPt.x / scale - GAME_WIDTH / 2 - x
                    targetPt.y = targetPt.y / scale - y - GAME_HEIGHT / 2

                    break
            }
        }

        function press(event) {
            start = Date.now()
            mode = 'follow'
            targetPt = {...event.data.global}
            targetPt.x = targetPt.x / scale - GAME_WIDTH / 2 - x
            targetPt.y = targetPt.y / scale - y - GAME_HEIGHT / 2

        }

        function unpress() {
            if (Date.now() - start < 100) {
                nextType()
            }
            mode = 'pulse'
            targetPt.x = 0
            targetPt.y = 0
        }
    }

    function nextType() {
        setType((type + 1) % typeList.length)
    }
}
