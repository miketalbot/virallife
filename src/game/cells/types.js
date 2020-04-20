import Prob from 'prob.js'
import {fromHSV, resizeArray} from '../lib'
import {DIAMETER, presets, randGen} from '../constants'
import cell from './sprites/red_cell.png'
import nucleus from './sprites/good_cell01.png'
import {bad1, images, virus} from './sprites'

export const types = {
    nucleus: {
        good: true,
        name: 'Nucleus',
        cost: 600,
        description: 'The core of your structure',
        color: 0xffd990,
        sprite: nucleus,
        attract: {
            nucleus: -4.5,
            defender: 0.4,
            repel: -5,
            virus: -0.1,
            phage: -0.25,
        },
        minR: {
            nucleus: DIAMETER * 4,
            defender: DIAMETER * 2,
            repel: DIAMETER * 6,
            virus: DIAMETER,
            phage: DIAMETER,
        },
        maxR: {
            nucleus: DIAMETER * 9,
            defender: DIAMETER * 4,
            repel: DIAMETER * 8,
            virus: DIAMETER * 2,
            phage: DIAMETER * 4,
        },
    },
    defender: {
        name: 'Shield',
        good: true,
        description: 'Shields a nucleus',
        cost: 20,
        color: 0xff0000,
        sprite: cell,
        attract: {
            nucleus: 1.72,
            defender: -0.22,
            repel: -0.32,
            virus: 2.5,
            phage: -1,
        },
        minR: {
            nucleus: DIAMETER * 1.2,
            defender: DIAMETER,
            repel: DIAMETER * 6,
            virus: DIAMETER,
            phage: DIAMETER,
        },
        maxR: {
            nucleus: DIAMETER * 9,
            defender: DIAMETER * 5,
            repel: DIAMETER * 8,
            virus: DIAMETER * 3,
            phage: DIAMETER * 4,
        },
    },
    repel: {
        sprite: 'none',
    },
    virus: {
        name: 'Virus',
        description: 'Tries to infect a nucleus',
        cost: 400,
        life: 60 * 10,
        color: 0x544622,
        sprite: virus,
        attract: {
            nucleus: 2.72,
            defender: -0.42,
            repel: -0.32,
            virus: -2,
            phage: 0.23,
        },
        minR: {
            nucleus: DIAMETER * 1.2,
            defender: DIAMETER,
            repel: DIAMETER * 6,
            virus: DIAMETER,
            phage: DIAMETER,
        },
        maxR: {
            nucleus: DIAMETER * 9,
            defender: DIAMETER * 5,
            repel: DIAMETER * 6,
            virus: DIAMETER * 2,
            phage: DIAMETER * 4,
        },
    },
    phage: {
        name: 'Phage',
        description: 'Tries to kill shields',
        cost: 100,
        life: 60 * 10,
        color: 0xf200ff,
        sprite: bad1,
        attract: {
            nucleus: 0.3,
            defender: 1.2,
            repel: -0.32,
            virus: -0.5,
            phage: -0.9,
        },
        minR: {
            nucleus: DIAMETER * 1.2,
            defender: DIAMETER,
            repel: DIAMETER * 6,
            virus: DIAMETER,
            phage: DIAMETER,
        },
        maxR: {
            nucleus: DIAMETER * 9,
            defender: DIAMETER * 5,
            repel: DIAMETER * 6,
            virus: DIAMETER * 2,
            phage: DIAMETER * 6,
        },
    },
}
export const typeIds = getTypeIds(types)
export const allTypes = Object.entries(types).map(([key, v]) => ({...v, key}))

function getTypeIds(types) {
    const result = {}
    let i = 0
    for (let key of Object.keys(types)) {
        result[key] = i++
    }
    return result
}

export class ParticleTypes {
    constructor(size = 0) {
        this.colour = Array.from({ length: size }, () => ({ r: 0, g: 0, b: 0, a: 0 }))
        this.sprite = Array.from({ length: size }, (c, index) => images[index % images.length])
        this.attract = Array(size * size).fill(0)
        this.minR = Array(size * size).fill(0)
        this.maxR = Array(size * size).fill(0)
        this.getMaxR = this.getMaxR.bind(this)
        this.getMinR = this.getMinR.bind(this)
        this.getAttract = this.getAttract.bind(this)
    }

    resize(size) {
        resizeArray(this.colour, size, { r: 0, g: 0, b: 0, a: 0 })
        resizeArray(this.attract, size * size, 0)
        resizeArray(this.minR, size * size, 0)
        resizeArray(this.maxR, size * size, 0)
    }

    size() {
        return this.colour.length
    }

    getColor(i) {
        return this.colour[i]
    }

    setColor(i, value) {
        this.colour[i] = (value.r << 16) + (value.g << 8) + value.b
    }

    getAttract(i, j) {
        return this.attract[i * this.colour.length + j]
    }

    setAttract(i, j, value) {
        this.attract[i * this.colour.length + j] = value
    }

    getMinR(i, j) {
        return this.minR[i * this.colour.length + j]
    }

    setMinR(i, j, value) {
        this.minR[i * this.colour.length + j] = value
    }

    getMaxR(i, j) {
        return this.maxR[i * this.colour.length + j]
    }

    setMaxR(i, j, value) {
        this.maxR[i * this.colour.length + j] = value
    }

    setRandomTypes({ attractMean, attractStd, minRLower, minRUpper, maxRLower, maxRUpper }, random = randGen) {
        const randAttr = Prob.normal(attractMean, attractStd)
        const randMinR = Prob.uniform(minRLower, minRUpper)
        const randMaxR = Prob.uniform(maxRLower, maxRUpper)

        for (let i = 0; i < this.size(); ++i) {
            this.setColor(i, fromHSV(i / this.size(), 1, (i % 2) * 0.5 + 0.5))
            this.sprite[i] = images[i % images.length]
            for (let j = 0; j < this.size(); ++j) {
                if (i === j) {
                    this.setAttract(i, j, -Math.abs(randAttr(random)))
                    this.setMinR(i, j, DIAMETER)
                } else {
                    this.setAttract(i, j, randAttr(random))
                    this.setMinR(i, j, Math.max(randMinR(random), DIAMETER))
                }

                this.setMaxR(i, j, Math.max(randMaxR(random), this.getMinR(i, j)))

                // Keep radii symmetric
                this.setMaxR(j, i, this.getMaxR(i, j))
                this.setMinR(j, i, this.getMinR(i, j))
            }
        }
        console.log(this.sprite)
    }
}

export function getSettingsForPreset(preset) {
    const { population, seed } = presets[preset]
    const [numTypes, numParticles] = population
    const [attractMean, attractStd, minRLower, minRUpper, maxRLower, maxRUpper, friction, flatForce] = seed

    return {
        numTypes,
        numParticles,
        attractMean,
        attractStd,
        minRLower,
        minRUpper,
        maxRLower,
        maxRUpper,
        friction,
        flatForce,
    }
}

export function setRandomTypes(
    types,
    { attractMean, attractStd, minRLower, minRUpper, maxRLower, maxRUpper },
    random = randGen
) {
    const randAttr = Prob.normal(attractMean, attractStd)
    const randMinR = Prob.uniform(minRLower, minRUpper)
    const randMaxR = Prob.uniform(maxRLower, maxRUpper)

    for (let i = 0; i < types.size(); ++i) {
        types.setColor(i, fromHSV(i / types.size(), 1, (i % 2) * 0.5 + 0.5))

        for (let j = 0; j < types.size(); ++j) {
            if (i === j) {
                types.setAttract(i, j, -Math.abs(randAttr(random)))
                types.setMinR(i, j, DIAMETER)
            } else {
                types.setAttract(i, j, randAttr(random))
                types.setMinR(i, j, Math.max(randMinR(random), DIAMETER))
            }

            types.setMaxR(i, j, Math.max(randMaxR(random), types.getMinR(i, j)))

            // Keep radii symmetric
            types.setMaxR(j, i, types.getMaxR(i, j))
            types.setMinR(j, i, types.getMinR(i, j))
        }
    }
}
