import Sugar from 'sugar'
import { handle } from 'common/events'
Sugar.extend()
export let game = {
    states: {},
}

export function element(handler) {
    handle('game-elements', function(elements) {
        elements.push(handler)
    })
}

export function particle(handler) {
    handle('particle-elements', function(elements) {
        elements.push(handler)
    })
}
