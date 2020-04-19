import React from 'react'
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
    const items = raise('game-elements', [])
    const particles = raise('particle-elements', [])
    return (
        <Stage
            width={Math.min(1280, window.innerWidth - 50)}
            height={500}
            options={{ resolution: window.devicePixelRatio, autoDensity: true }}
        >
            <Container>
                {items.map((Item, index) => (
                    <Item key={index} />
                ))}
            </Container>
        </Stage>
    )
}
