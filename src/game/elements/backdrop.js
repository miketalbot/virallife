import React, { useState } from 'react'
import { TilingSprite, useTick } from '@inlet/react-pixi'
import backdrop from 'game/images/backdrop.jpg'
import { element } from 'game/lib'

element(Backdrop)

function Backdrop() {
    const [x, setX] = useState(0)
    useTick((delta) => {
        setX(x - delta * 0.1)
    })
    return <TilingSprite image={backdrop} width={2048} height={500} tileScale={0.5} x={x} />
}
