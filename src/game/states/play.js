import React, {useEffect, useRef, useState} from 'react'
import {register} from 'game'
import MUIContainer from '@material-ui/core/Container'
import {Box} from '@material-ui/core'
import {Container, Stage} from '@inlet/react-pixi'
import {raise} from 'common/events'

register('play', { Page })

function Page() {
    return (
        <MUIContainer>
            <Box>Pixi Goes Below</Box>
            <GameRender />
        </MUIContainer>
    )
}

function GameRender() {
    const [ready, setReady] = useState(false)
    const stage = useRef()
    useEffect(() => setReady(true), [])
    return (
        <Stage
            ref={stage}
            width={Math.min(1280, window.innerWidth - 50)}
            height={500}
            options={{ resolution: window.devicePixelRatio, autoDensity: true }}
        >
            {ready && <Parts />}
        </Stage>
    )
}
function Parts() {
    const items = raise('game-elements', [])
    return (
        <Container>
            {items.map((Item, index) => (
                <Item key={index} />
            ))}
        </Container>
    )
}
