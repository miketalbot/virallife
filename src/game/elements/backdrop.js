import React, {useState} from 'react'
import {TilingSprite, useTick} from '@inlet/react-pixi'
import backdrop from 'game/images/background_life.jpg'
import {element} from 'game/lib'

element(Backdrop)

function Backdrop() {
    const [x, setX] = useState(0)
    useTick((delta) => {
        setX((x - delta) % 4096)
    })
    return <TilingSprite image={backdrop} width={8102} height={512} tileScale={0.5} x={x} />
}
