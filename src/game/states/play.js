import React, {useEffect, useRef, useState} from 'react'
import {register} from 'game'
import MUIContainer from '@material-ui/core/Container'
import {Box} from '@material-ui/core'
import {Container, Stage} from '@inlet/react-pixi'
import {raise} from 'common/events'
import {Sized} from '../lib'
import {GAME_HEIGHT, GAME_WIDTH} from '../constants'

register('play', { Page })

function Page() {
    return (
        <MUIContainer>
            <Box>Pixi Goes Below</Box>
            <Box w={1}>
                <Sized>
                    {(sizes) => {
                        let ratio = sizes.width / GAME_WIDTH
                        return <GameRender width={sizes.width} height={ratio * GAME_HEIGHT} scale={ratio} />
                    }}
                </Sized>
            </Box>
        </MUIContainer>
    )
}

function Player({ width, height, scale }) {
    return (
        <Box width={width} height={height}>
            Hello
        </Box>
    )
}

function GameRender({ width, height, scale }) {
    const [ready, setReady] = useState(false)
    const stage = useRef()
    useEffect(() => setReady(true), [])
    return (
        <Stage
            ref={stage}
            width={width}
            height={height}
            options={{ resolution: window.devicePixelRatio, autoDensity: true }}
        >
            {ready && <Parts scale={scale} />}
        </Stage>
    )
}
function Parts({ scale }) {
    const items = raise('game-elements', [])
    return (
        <Container scale={scale}>
            {items.map((Item, index) => (
                <Item key={index} />
            ))}
        </Container>
    )
}
