import {Surface} from '../cells/surface'
import React, {useEffect, useRef} from 'react'
import {element, SurfaceContext, useTimeout} from '../lib'
import {GAME_HEIGHT, GAME_WIDTH} from '../constants'
import {Container, Text} from '@inlet/react-pixi'
import {textures} from '../cells/sprites'
import {callFunction, types} from '../cells/types'
import {updateSprite} from '../cells/process'
import {getStructures} from '../data'
import {Launcher} from '../cells/launcher'
import {handle, raise} from 'common/events'
import {useRefresh} from 'common/useRefresh'
import {useLocalEvent} from 'common/use-event'
import * as PIXI from 'pixi.js'

element(ParticleSurface)

const BASE_X = -GAME_WIDTH / 2
const BASE_Y = -GAME_HEIGHT / 2
const GAME_LENGTH = 75000

function getStructure(id) {
    const info = {structure: null, id}
    raise('get-structure', info)
    return info.structure || getStructures()[0]
}

handle('get-structure', info => {
    info.structure = info.structure || getStructures().find(i => i.id === info.id)
})

function ParticleSurface({structure}) {
    const {id = 0} = window.routeParams
    const surface = useRef(new Surface(GAME_WIDTH, GAME_HEIGHT))
    structure = structure || getStructure(id)
    let ok = true
    if (!structure) {
        ok = false
    }
    const budget = useRef(ok && (structure.parts.reduce((c, p) => c + (types[p.type].cost || 0), 0) * 2.5) | 0)
    const start = useRef(Date.now() + GAME_LENGTH)
    const score = useRef(0)
    window.score = 0
    const list = []
    surface.current.paused = true
    ok && raise('particle-surface', surface.current, structure)
    const parts = structure.parts
    useEffect(() => {
        if (!ok) return
        const particles = surface.current.particles
        particles.startParticles()
        for (let part of parts) {
            let p = particles.getParticle()
            p.x = part.x
            p.y = part.y
            p.type = part.type
            const typeDef = types[p.type]
            p.life = typeDef.life
            p.sprite.texture = textures[typeDef.sprite]
            p.sprite.alpha = 1
            updateSprite(p)
            p.sprite.scale.set(.7)
            callFunction(p.type, 'init', p)
        }
        raise('additional-particles', particles, surface)
        surface.current.refresh()
    }, [parts, structure.id])

    useLocalEvent('particle-destroyed', checkForDone)
    useLocalEvent('spend', checkForBudget)
    useLocalEvent('timeout', () => gameOver('timeout'))
    if (!ok) {
        window.location.href = '/'
        return null
    }
    return (
        <SurfaceContext.Provider value={surface.current}>
            <Container x={GAME_WIDTH / 2} y={GAME_HEIGHT / 2}>
                <surface.current.Render/>
                <Launcher budgetRef={budget} x={BASE_X + (GAME_WIDTH * 1) / 14} y={BASE_Y + (GAME_HEIGHT * 2) / 12}/>
                <Launcher budgetRef={budget} x={BASE_X + (GAME_WIDTH * 1) / 14} y={BASE_Y + (GAME_HEIGHT * 6) / 12}/>
                <Launcher budgetRef={budget} x={BASE_X + (GAME_WIDTH * 1) / 14} y={BASE_Y + (GAME_HEIGHT * 10) / 12}/>
                <Launcher budgetRef={budget} x={BASE_X + (GAME_WIDTH * 13) / 14} y={BASE_Y + (GAME_HEIGHT * 2) / 12}/>
                <Launcher budgetRef={budget} x={BASE_X + (GAME_WIDTH * 13) / 14} y={BASE_Y + (GAME_HEIGHT * 6) / 12}/>
                <Launcher budgetRef={budget} x={BASE_X + (GAME_WIDTH * 13) / 14} y={BASE_Y + (GAME_HEIGHT * 10) / 12}/>
                <Budget/>
                <Time/>
                <Score/>
            </Container>
        </SurfaceContext.Provider>

    )


    function checkForBudget(amount) {
    }


    function checkForDone() {
        const particles = surface.current.particles
        particles.getParticles(list)
        for (let p of list) {
            const typeDef = types[p.type]
            if (typeDef && typeDef.good && p.alive) {
                return
            }
        }
        gameOver('done')
    }

    function Time() {
        const refresh = useRefresh()
        useTimeout(refresh, 1000)
        if (surface.current.paused) {
            start.current = Date.now() + GAME_LENGTH + 1000
        }
        if (start.current - Date.now() < 0) {
            raise('timeout')
        }
        return (
            <>
                <Text
                    isSprite={false}
                    text={Math.max(0, ((start.current - Date.now()) / 1000) | 0)
                        .toString()
                        .padLeft(2, '0')}
                    anchor={0.5}
                    y={BASE_Y + 120}
                    x={0}
                    style={
                        new PIXI.TextStyle({
                            align: 'center',
                            fontFamily: '"Roboto", Helvetica, sans-serif',
                            fontSize: 92,
                            fontWeight: 500,
                            fill: '#ffffff',
                            stroke: '#802000',
                            strokeThickness: 4,
                        })
                    }
                />
            </>
        )
    }

    function Score() {
        const refresh = useRefresh()
        useLocalEvent('particle-destroyed', addScore)
        return (
            <>
                <Text
                    isSprite={false}
                    text={score.current.toString().padLeft(6, 0)}
                    anchor={0.5}
                    y={BASE_Y + 174}
                    x={0}
                    style={
                        new PIXI.TextStyle({
                            align: 'center',
                            fontFamily: '"Roboto", Helvetica, sans-serif',
                            fontSize: 28,
                            fontWeight: 500,
                            fill: 'gold',
                            strokeThickness: 0
                        })
                    }
                />
            </>
        )

        function addScore(target) {
            window.score = score.current += types[target.type].score || 100
            refresh()
        }
    }

    function Budget() {
        const refresh = useRefresh()
        useLocalEvent('spend', refresh)
        return (
            <>
                <Text
                    isSprite={false}
                    text={budget.current.toString().padLeft(4, 0)}
                    anchor={0.5}
                    y={BASE_Y + 40}
                    x={0}
                    style={
                        new PIXI.TextStyle({
                            align: 'center',
                            fontFamily: '"Roboto", Helvetica, sans-serif',
                            fontSize: 40,
                            fontWeight: 500,
                            fill: '#ffffff',
                            stroke: '#01d27e',
                            strokeThickness: 0,
                        })
                    }
                />
                <Text
                    isSprite={true}
                    text={'CREDITS'}
                    anchor={0.5}
                    y={BASE_Y + 72}
                    x={0}
                    style={
                        new PIXI.TextStyle({
                            align: 'center',
                            fontFamily: '"Roboto", Helvetica, sans-serif',
                            fontSize: 22,
                            fontWeight: 500,
                            fill: '#ffffff',
                            stroke: '#01d27e',
                            strokeThickness: 0,
                        })
                    }
                />
            </>
        )
    }
}

function gameOver(reason) {
    raise('game-over', reason)
}
