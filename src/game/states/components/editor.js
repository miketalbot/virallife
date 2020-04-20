import {Sized, useLocalRefresh, useStructure} from '../../lib'
import React, {useRef, useState} from 'react'
import {Box} from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import {bind} from 'common/set-from-event'
import {Surface} from '../../cells/surface'
import {GAME_HEIGHT, GAME_WIDTH} from '../../constants'
import {Container, Stage, TilingSprite} from '@inlet/react-pixi'
import {types} from '../../cells/types'
import grid from '../../cells/sprites/grid.png'
import Typography from '@material-ui/core/Typography'
import {CellSelector} from './cell-selector'
import {textures} from '../../cells/sprites'
import {updateSprite} from '../../cells/process'
import {useLocalEvent} from 'common/use-event'

export function Design({ current }) {
    const { refresh } = useStructure()
    const localRefresh = useLocalRefresh()
    const [outerScale, setOuterScale] = useState(10)
    return (
        <Box height={1} clone>
            <Card>
                <CardHeader
                    title={'Design'}
                    action={
                        current && (
                            <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                <Box>
                                    <IconButton onClick={zoomIn} color={'primary'}>
                                        +
                                    </IconButton>
                                </Box>
                                <Box>
                                    <IconButton onClick={zoomOut} color={'primary'}>
                                        -
                                    </IconButton>
                                </Box>
                            </Box>
                        )
                    }
                />
                {current && (
                    <CardContent>
                        <Sized w={1}>
                            {(size) => {
                                return <Editor outerScale={outerScale / 10} structure={current} size={size} />
                            }}
                        </Sized>
                    </CardContent>
                )}

                {current && (
                    <CardActions>
                        <TextField fullWidth onBlur={refresh} label={'Name'} {...bind(current, 'name', localRefresh)} />
                    </CardActions>
                )}
            </Card>
        </Box>
    )

    function zoomIn() {
        setOuterScale(Math.min(10, outerScale + 0.5))
    }

    function zoomOut() {
        setOuterScale(Math.max(2, outerScale - 0.5))
    }
}

function Editor({ size, height = 300, structure, outerScale = 1 }) {
    const refresh = useLocalRefresh()
    const [surface] = useState(() => new Surface(GAME_WIDTH, GAME_HEIGHT, 0, false, Container))
    surface.particles.startParticles()
    const [cell, setCell] = useState()
    const { particles } = surface
    surface.rate = 0
    const scale = 0.2
    const scrollPoint = useRef({ x: 0, y: 0 })
    const cost = structure.parts.reduce((c, n) => c + types[n.type].cost || 0, 0)
    let dragTime = 0
    let dragging = false
    let wasDown = false
    let dragPt
    const container = useRef()
    return (
        <>
            <Box height={height}>
                <Stage
                    width={size.width}
                    height={height}
                    options={{ resolution: window.devicePixelRatio, autoDensity: true, transparent: true }}
                >
                    <Container
                        ref={container}
                        scale={outerScale}
                        x={size.width / 2 - scrollPoint.current.x}
                        y={height / 2 - scrollPoint.current.y}
                    >
                        <Container interactive={true}>
                            <TilingSprite
                                x={-(surface.width / 2)}
                                y={-(surface.height / 2)}
                                interactive={true}
                                pointerdown={startDrag}
                                pointerup={stopDrag}
                                pointerupoutside={stopDrag}
                                pointermove={drag}
                                scale={scale}
                                alpha={0.2}
                                width={(surface.width * 20) / scale}
                                anchor={0.5}
                                height={(surface.height * 20) / scale}
                                image={grid}
                            />
                            <Update />
                        </Container>
                    </Container>
                </Stage>
            </Box>
            <Box mt={1}>
                <Typography color={'secondary'}> {cost} credits</Typography>
            </Box>
            <Box mt={1}>
                <CellSelector good={true} value={cell} onChange={setCell} />
            </Box>
        </>
    )

    function startDrag({ data: { global } }) {
        wasDown = true
        dragTime = Date.now()
        dragPt = { ...global }
        dragging = false
    }

    function drag({ data: { global } }) {
        if (wasDown && !dragging && Date.now() - dragTime < 300) {
            let dx = global.x - dragPt.x
            let dy = global.y - dragPt.y
            dragging = dx * dx + dy * dy > 8
        }
        if (dragging) {
            let dx = global.x - dragPt.x
            let dy = global.y - dragPt.y
            dragPt = { ...global }
            scrollPoint.current.x -= dx
            scrollPoint.current.y -= dy
            container.current.x = size.width / 2 - scrollPoint.current.x
            container.current.y = height / 2 - scrollPoint.current.y
        }
    }

    function stopDrag(event) {
        wasDown = false
        if (!dragging && Date.now() - dragTime < 1000) {
            addItem(event)
        }
        dragging = false
    }

    function Update() {
        let count = 0
        useLocalEvent('tick', () => {
            particles.startParticles()
            for (let part of structure.parts) {
                let p = particles.getParticle()
                p.x = part.x
                p.y = part.y
                p.type = part.type
                p.sprite.texture = textures[types[p.type].sprite]
                p.sprite.alpha = 1
                p.sprite.interactive = true
                p.sprite.pointerdown = clickCell(part, p)
                p.sprite.pointermove = moveCell(part, p)
                p.sprite.pointerup = movedCell(part, p)
                p.sprite.pointerupoutside = movedCell(part, p)
                surface.boundaryCheck(p)
                updateSprite(p)
            }
            if (structure.parts.length !== count) {
                count = structure.parts.length
                surface.refresh()
            }
        })
        return <surface.Render />
    }

    function moveCell(part, p) {
        return function({ data: { global: point } }) {
            if (p.dragging) {
                let dx = (point.x - p.startPt.x) / outerScale
                let dy = (point.y - p.startPt.y) / outerScale
                part.x += dx
                part.y += dy
                p.startPt = { ...point }
            }
        }
    }

    function movedCell(part, p) {
        return function() {
            p.dragging = false
        }
    }

    function clickCell(part, p) {
        return function(event) {
            if (part.fixed) return
            p.startPt = { ...event.data.global }
            if (Date.now() - p.lastClick < 400) {
                structure.parts.splice(structure.parts.indexOf(part), 1)
                refresh()
            } else {
                p.dragging = true
            }
            p.lastClick = Date.now()
        }
    }

    function addItem(event) {
        if (!cell) return
        const point = event.data.global
        structure.parts.push({
            x: (point.x + scrollPoint.current.x - size.width / 2) / outerScale,
            y: (point.y + scrollPoint.current.y - height / 2) / outerScale,
            type: cell.key,
        })
        refresh()
    }
}
