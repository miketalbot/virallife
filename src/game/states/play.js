import React, {useEffect, useRef, useState} from 'react'
import {register} from 'game'
import {Box} from '@material-ui/core'
import {Container, Stage} from '@inlet/react-pixi'
import {raise} from 'common/events'
import {delay, ScaleContext, Sized} from '../lib'
import {GAME_HEIGHT, GAME_WIDTH} from '../constants'
import {useLocalEvent} from 'common/use-event'
import {useAsync} from 'common/use-async'
import {makeStyles} from '@material-ui/core/styles'
import blackStar from './black_star.png'
import goldStar from './gold_star.png'
import {types} from '../cells/types'
import {play, stopAll} from '../sounds'
import {useHistory} from 'react-router-dom'

register('play', {Page})

function Page() {
    return (

        <Box w={1}>
            <Sized>
                {(sizes) => {
                    let ratio = sizes.width / GAME_WIDTH
                    return <GameRender width={sizes.width} height={ratio * GAME_HEIGHT} scale={ratio}/>
                }}
            </Sized>
        </Box>

    )
}

const useStyles = makeStyles(() => {
    return {
        center: {
            transform: 'translate3d(-50%,-50%,0)',
            fontSize: '6vw',
            fontStyle: 'italic',
            textShadow: '0 0 22px black',
        },
    }
})

function GameRender({width, height, scale}) {
    const classes = useStyles()
    const [ready, setReady] = useState(false)
    const stage = useRef()
    const surface = useRef()
    const structure = useRef()
    const history = useHistory()
    useLocalEvent('particle-surface', setSurface)
    useEffect(() => setReady(true), [])
    return (
        ready && (
            <Box position={'relative'}>
                <Stage
                    ref={stage}
                    width={width}
                    height={height}
                    options={{resolution: window.devicePixelRatio, autoDensity: true}}
                >
                    <Parts scale={scale}/>
                </Stage>
                <Start/>
                <Tutorial/>
                <GameComplete surfaceRef={surface}/>
            </Box>
        )
    )

    function setSurface(newSurface, newStructure) {
        surface.current = newSurface
        structure.current = newStructure
    }

    function Start() {
        const [mode, setMode] = useState('ready')
        const [count, setCount] = useState(3)
        useAsync(countDown)
        switch (mode) {
            case 'ready':
                return (
                    <Box position={'absolute'} top={0} left={0} width={1} height={1}>
                        <Box position={'absolute'} left={'50%'} top={'50%'} className={classes.center}>
                            GET READY
                        </Box>
                    </Box>
                )
            case 'count':
                return (
                    <Box position={'absolute'} top={0} left={0} width={1} height={1}>
                        <Box position={'absolute'} left={'50%'} top={'50%'} className={classes.center}>
                            {count}
                        </Box>
                    </Box>
                )
            default:
                surface.current.paused = false
                return null
        }

        async function countDown() {
            stopAll()
            await delay(1000)
            setMode('count')
            await delay(750)
            setCount(2)
            play('play', true)
            await delay(750)
            setCount(1)
            await delay(500)
            setMode('play')

        }
    }

    function GameComplete({surfaceRef}) {
        const [mode, setMode] = useState('normal')
        const [step, setStep] = useState(null)
        useLocalEvent('reset', reset)
        useLocalEvent('game-over', over)
        switch (mode) {
            case 'gameOver':
                return (
                    <Box position={'absolute'} top={0} left={0} width={1} height={1}>
                        <Box position={'absolute'} left={'50%'} top={'50%'} className={classes.center}>
                            {step}
                        </Box>
                    </Box>
                )
            default:
                return null
        }

        function reset() {
            setMode('normal')
            setStep(null)
        }

        async function over(reason) {
            setMode('gameOver')
            surfaceRef.current.paused = true
            setStep(<Box>Game Over</Box>)
            await delay(1000)
            switch (reason) {
                case 'budget':
                    setStep(<Box>Out of Funds</Box>)
                    break
                case 'timeout':
                    setStep(<Box>Out of Time</Box>)
                    break
                default:
                    setStep(<Box>YOU WON!!!</Box>)
                    break
            }
            await delay(1400)

            const list = surfaceRef.current.particles.getParticles()
            let killedNucleus = false
            let livingNucleus = false
            let anyAlive = false
            for (let p of list) {
                if (types[p.type].good && p.alive) anyAlive = true
                if (p.type === 'nucleus') {
                    if (p.alive) {
                        livingNucleus = true
                    } else {
                        killedNucleus = true
                    }
                }
            }
            let stars = (killedNucleus ? 1 : 0) + (!livingNucleus ? 1 : 0) + (!anyAlive ? 1 : 0)

            setStep(
                <>
                    <Box display={'flex'} w={1} flexWrap={false} justifyContent={'center'}>
                        {Array.from({length: 3}).map((_, index) => {
                            return (
                                <Box key={index} position={'relative'}>
                                    <img src={blackStar} width={90} height={90}/>
                                    {index < stars && (
                                        <Box
                                            position={'absolute'}
                                            left={0}
                                            top={0}
                                            w={1}
                                            h={1}
                                            style={{transform: 'scale(0.8)', transformOrigin: '50% 50%'}}
                                        >
                                            <img src={goldStar} width={90} height={90}/>
                                        </Box>
                                    )}
                                </Box>
                            )
                        })}
                    </Box>
                    <Box w={1} textAlign={'center'}>
                        {window.score.toString().padLeft(6, '0')}
                    </Box>
                </>
            )
            await delay(3000)
            setStep(null)
            raise('game-over-complete', window.score, stars, structure.current, surface.current)
            history.push('/ld46/')
        }
    }

    function Tutorial() {
        return null
    }
}

function Parts({scale}) {
    const items = raise('game-elements', [])
    return (
        <Container scale={scale}>
            <ScaleContext.Provider value={scale}>
                {items.map((Item, index) => (
                    <Item key={index}/>
                ))}
            </ScaleContext.Provider>
        </Container>
    )
}
