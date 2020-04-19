import {adjectives, animals, names, uniqueNamesGenerator} from 'unique-names-generator'

const config = {
    dictionaries: [adjectives, animals],
    separator: ' ',
    length: 2,
}
const nameConfig = {
    dictionaries: [names],
    length: 1,
}

export function createName() {
    return `${uniqueNamesGenerator(nameConfig)} the ${uniqueNamesGenerator(config)}`
}
