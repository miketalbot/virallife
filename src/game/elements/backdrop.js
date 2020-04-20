import React, {useRef, useState} from 'react'
import {ParticleContainer, Sprite, TilingSprite} from '@inlet/react-pixi'
import backdrop from 'game/images/background_life.jpg'
import {element} from 'game/lib'
import {GAME_HEIGHT, GAME_WIDTH} from '../constants'
import {cell1, cell2, cell3} from '../cells/sprites/index.js'
import {useLocalEvent} from 'common/use-event'

element(Backdrop)

function Backdrop() {
    const sprite = useRef()
    const [x, setX] = useState(0)
    useLocalEvent('tick', () => {
        sprite.current.x = (sprite.current.x - 1) % sprite.current.texture.width
    })
    const cells = Array.from({length: 400})
    return (
        <>
            <TilingSprite
                ref={sprite}
                image={backdrop}
                width={GAME_WIDTH * 6}
                height={GAME_HEIGHT}
                tileScale={1}
                x={x}
            />
            <ParticleContainer>
                {cells.map((c, index) => (
                    <Cell key={index}/>
                ))}
            </ParticleContainer>
        </>
    )
}

let next = 0
const images = [cell1, cell2, cell3]

function Cell() {
    const ref = useRef()
    const speed = Math.random() * 6 + 0.3
    const red = Math.random() < 0.8
    useLocalEvent('tick', () => {
        ref.current.x -= speed
        if (ref.current.x < -70) {
            ref.current.x = GAME_WIDTH + 100
            ref.current.y = Math.random() * GAME_HEIGHT
        }
    })
    let scale = Math.random() * 1.3 + 0.2
    return (
        <Sprite
            ref={ref}
            image={images[next++ % 3]}
            alpha={Math.max(0.15, Math.random() * 1.4 + 0.1 - scale)}
            scale={scale}
            tint={red ? 0xff0000 : 0xffffff}
            y={Math.random() * GAME_HEIGHT}
            x={Math.random() * GAME_WIDTH * 2}
        />
    )
}
