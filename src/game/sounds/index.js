import playMusic from './PLAYMODEMUSIC.mp3'
import drop from './DROP.mp3'
import homeMusic from './HOMEMUSIC.mp3'
import sound from 'pixi-sound'
import mutate from './MUTATE.mp3'
import beam from './BEAM.mp3'
import hit from './HIT.mp3'

export {homeMusic}


export function playHome() {
    setTimeout(() => {
        stopAll()
        play('home', true)
    }, 500)
}

sound.add('play', {url: playMusic, preload: true, volume: .5})
sound.add('drop', {url: drop, preload: true})
sound.add('home', {url: homeMusic, preload: true})
sound.add('mutate', {url: mutate, preload: true})
sound.add('beam', {url: beam, preload: true})
sound.add('hit', {url: hit, preload: true})

const last = {}

export function play(name, loop) {
    setTimeout(() => {
        if (Date.now() - last[name] < 250) return
        last[name] = Date.now()
        try {
            sound.play(name, {loop})
        } catch (e) {

        }
    })
}


export function stopAll() {
    sound.stopAll()
}
