import React, {useEffect, useRef, useState} from 'react'
import {register} from 'game'
import MUIContainer from '@material-ui/core/Container'
import {Box} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import {getStructures, saveStructures} from '../data'
import {useRefresh} from 'common/useRefresh'
import {Sized, StructureContext, useLocalRefresh, useStructure} from '../lib'
import {bind} from 'common/set-from-event'
import TextField from '@material-ui/core/TextField'
import {Structures} from './components/structures'
import {Container, Stage, TilingSprite, useTick} from '@inlet/react-pixi'
import {Surface} from '../cells/surface'
import grid from '../cells/sprites/grid.png'
import {types} from '../cells/types'
import Typography from '@material-ui/core/Typography'
import {textures} from '../cells/sprites'
import {updateSprite} from '../cells/process'
import {CellSelector} from './components/cell-selector'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'

register('design', { Page })

function Page() {
    const [current, setCurrent] = useState(null)
    const structures = useRef(getStructures())
    const refresh = useRefresh(save)
    return (
        <StructureContext.Provider value={{ setCurrent, current, refresh, save, structures: structures.current }}>
            <MUIContainer>
                <Grid container spacing={2} alignItems={'stretch'}>
                    <Grid item xs={12}>
                        <Box height={1} clone>
                            <Structures />
                        </Box>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Design current={current} />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Preview current={current} />
                    </Grid>
                </Grid>
            </MUIContainer>
        </StructureContext.Provider>
    )

    function save() {
        if (current) {
            current.modified = Date.now()
        }
        saveStructures(structures.current)
    }
}

function Design({ current }) {
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
        setOuterScale(Math.min(10, outerScale + 1))
    }
    function zoomOut() {
        setOuterScale(Math.max(4, outerScale - 1))
    }
}
function Preview({ current }) {
    const { refresh } = useStructure()
    const localRefresh = useLocalRefresh()

    return (
        <Box height={1} display={'flex'} flexDirection={'column'} clone>
            <Card>
                <CardHeader title={'Preview'} />
                {current && (
                    <Box flexGrow={1} display={'flex'} flexDirection={'column'} minHeight={280} clone>
                        <CardContent>
                            <Sized w={1} flexGrow={1}>
                                {(size) => {
                                    return <Previewer structure={current} size={size} height={size.height} />
                                }}
                            </Sized>
                        </CardContent>
                    </Box>
                )}

                {current && (
                    <CardActions>
                        <Button onClick={localRefresh} color={'primary'}>
                            Restart
                        </Button>
                    </CardActions>
                )}
            </Card>
        </Box>
    )
}

function Previewer({ size, height = 300, structure }) {
    const background = useRef()
    const [surface, setSurface] = useState(() => new Surface(size.width, height, 0, false))
    surface.track = true

    const { particles } = surface
    const scale = 0.2
    useEffect(() => {
        if (surface.height !== height || surface.width !== size.width) {
            setTimeout(() => setSurface(new Surface(size.width, height, 0, false), 50))
        }

        surface.background = background.current
    })
    return (
        <>
            <Box height={height}>
                <Stage
                    width={size.width}
                    height={height}
                    options={{ resolution: window.devicePixelRatio, autoDensity: true, transparent: true }}
                >
                    <TilingSprite
                        ref={background}
                        x={size.width / 2}
                        y={height / 2}
                        scale={scale}
                        alpha={0.07}
                        width={size.width * 20}
                        anchor={0.5}
                        height={height * 20}
                        image={grid}
                    />
                    <Update />
                </Stage>
            </Box>
        </>
    )

    function Update() {
        let cache = ''
        useTick(() => {
            const key = JSON.stringify(structure.parts)
            if (key !== cache) {
                particles.startParticles()
                for (let part of structure.parts) {
                    let p = particles.getParticle()
                    p.x = part.x
                    p.y = part.y
                    p.type = part.type
                    p.sprite.texture = textures[types[p.type].sprite]
                    p.sprite.alpha = 1
                    updateSprite(p)
                }
                cache = key
                surface.refresh()
            }
        })
        return <surface.Render />
    }
}

function Editor({ size, height = 300, structure, outerScale = 1 }) {
    const refresh = useLocalRefresh()
    const [surface] = useState(() => new Surface(size.width, height, 0, false, Container))
    surface.particles.startParticles()
    const [cell, setCell] = useState()
    const { particles } = surface
    surface.rate = 0
    const scale = 0.2

    const cost = structure.parts.reduce((c, n) => c + types[n.type].cost || 0, 0)

    return (
        <>
            <Box height={height}>
                <Stage
                    width={size.width}
                    height={height}
                    options={{ resolution: window.devicePixelRatio, autoDensity: true, transparent: true }}
                >
                    <Container anchor={0.5} interactive={true} scale={outerScale}>
                        <TilingSprite
                            x={size.width / 2 / outerScale}
                            y={height / 2 / outerScale}
                            interactive={true}
                            pointerdown={addItem}
                            scale={scale}
                            alpha={0.2}
                            width={size.width / scale / outerScale}
                            anchor={0.5}
                            height={height / scale / outerScale}
                            image={grid}
                        />
                        <Update />
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

    function Update() {
        let count = 0
        useTick(() => {
            particles.startParticles()
            for (let part of structure.parts) {
                let p = particles.getParticle()
                p.x = part.x + Math.floor(size.width / 2) / outerScale
                p.y = part.y + Math.floor(height / 2) / outerScale
                p.type = part.type
                p.sprite.texture = textures[types[p.type].sprite]
                p.sprite.alpha = 1
                p.sprite.interactive = true
                p.sprite.pointerdown = clickCell(part, p)
                p.sprite.pointermove = moveCell(part, p)
                p.sprite.pointerup = movedCell(part, p)
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
            x: (point.x - size.width / 2) / outerScale,
            y: (point.y - height / 2) / outerScale,
            type: cell.key,
        })
        refresh()
    }
}
