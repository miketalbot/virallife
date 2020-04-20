import {lerp, Sized, useLocalRefresh} from '../../lib'
import {Box} from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import React, {useEffect, useRef, useState} from 'react'
import {Surface} from '../../cells/surface'
import {GAME_HEIGHT, GAME_WIDTH} from '../../constants'
import {Container, Stage, TilingSprite} from '@inlet/react-pixi'
import grid from '../../cells/sprites/grid.png'
import {textures} from '../../cells/sprites'
import {types} from '../../cells/types'
import {updateSprite} from '../../cells/process'
import {useLocalEvent} from 'common/use-event'

export function Preview({ current }) {
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

function Previewer({ size, height = 300, structure, outerScale = 1 }) {
    const background = useRef()
    const [surface] = useState(() => new Surface(GAME_WIDTH, GAME_HEIGHT, 0, false))
    surface.track = true
    const container = useRef()
    const scaleContainer = useRef()
    const { particles } = surface
    const scale = 0.2
    useEffect(() => {
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
                    <Container ref={scaleContainer} scale={outerScale} x={size.width / 2} y={height / 2}>
                        <Container ref={container} interactive={true}>
                            <TilingSprite
                                x={-(surface.width / 2)}
                                y={-(surface.height / 2)}
                                interactive={true}
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
        </>
    )

    function Update() {
        let cache = ''
        const list = []
        useLocalEvent('tick', () => {
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
            let x = 0
            let y = 0
            let c = 0
            let minX = Infinity,
                minY = Infinity,
                maxX = -Infinity,
                maxY = -Infinity
            for (let item of surface.particles.getParticles(list)) {
                minX = Math.min(minX, item.x)
                minY = Math.min(minY, item.y)
                maxX = Math.max(maxX, item.x)
                maxY = Math.max(maxY, item.y)
                if (item.type === 'nucleus') {
                    x += item.x
                    y += item.y
                    c++
                }
            }
            x /= c
            y /= c
            if (container.current) {
                container.current.x = lerp(container.current.x, -x, 0.03)
                container.current.y = lerp(container.current.y, -y, 0.03)
                const xDisp = Math.max(1 / 1.4, (maxX - minX + 50) / size.width)
                const yDisp = Math.max(1 / 1.4, (maxY - minY + 50) / height)
                let d = Math.max(xDisp, yDisp)
                scaleContainer.current.scale.set(lerp(scaleContainer.current.scale.x, 1 / (d * 1.4), 0.3))
            }
        })
        return <surface.Render />
    }
}
