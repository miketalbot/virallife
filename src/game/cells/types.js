import {noop} from 'common/noop'
import {repel} from './types/repel'
import {virus} from './types/virus'
import {tcell, white} from './types/tcell'
import {nucleus} from './types/nucleus'
import {defender} from './types/defender'
import {phage} from './types/phage'
import {toxin} from './types/toxin'

export const types = {
    nucleus,
    defender,
    tcell,
    repel,
    virus,
    phage,
    toxin,
    white

}
export const typeIds = getTypeIds(types)
export const allTypes = Object.entries(types).map(([key, v]) => ({...v, key}))

const DUMMY = {}

export function callFunctionSpecificToOtherType(type, otherType, fn, ...params) {
    const typeDef = types[type] || DUMMY
    const callSite = typeDef[fn] || DUMMY
    const toCall = callSite[otherType] || callSite.default || noop
    toCall(...params)
}

export function callFunction(type, fn, ...params) {
    const typeDef = types[type] || DUMMY
    const toCall = typeDef[fn] || noop
    toCall(...params)
}

function getTypeIds(types) {
    const result = {}
    let i = 0
    for (let key of Object.keys(types)) {
        result[key] = i++
    }
    return result
}

