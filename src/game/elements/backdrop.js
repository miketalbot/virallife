import React, {useRef, useState} from 'react'
import {TilingSprite, useTick} from '@inlet/react-pixi'
import backdrop from 'game/images/background_life.jpg'
import {element} from 'game/lib'
import {GAME_HEIGHT, GAME_WIDTH} from '../constants'

element(Backdrop)

function Backdrop() {
    const sprite = useRef()
    const [x, setX] = useState(0)
    useTick((delta) => {
        setX((x - delta) % sprite.current.texture.width)
    })
    return (
        <TilingSprite ref={sprite} image={backdrop} width={GAME_WIDTH * 6} height={GAME_HEIGHT} tileScale={1} x={x} />
    )
}
