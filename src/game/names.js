import {adjectives, animals, names, uniqueNamesGenerator} from 'unique-names-generator'

const types = [
    'An investigation into the',
    'The mystery of the',
    'The strange case of the',
    'A story about the',
    'Your nightmare about the',
    'An exploration of the',
    'The discovery of the',
]

const virals = [
    'virus',
    'bacteria',
    'bacteriophage',
    'infection',
    'pestilence',
    'plague',
    'disease',
    'infestation',
    'pandemic',
    'epidemic',
]

const config = {
    dictionaries: [types, adjectives, animals, virals],
    separator: ' ',
    length: 4,
}
const nameConfig = {
    dictionaries: [names],
    length: 1,
}

export function createName() {
    return `${uniqueNamesGenerator(config).titleize()}`
}
