import Prob from 'prob.js'
import {fromHSV, mapToRgb, resizeArray} from '../lib'
import {DIAMETER, presets, randGen} from '../constants'
import cell from './sprites/red_cell.png'
import nucleus from './sprites/good_cell01.png'
import {bad1, bad3, images, virus} from './sprites'
import {noop} from 'common/noop'
import {darkSparks, explode, smoke, sparks} from './explode'
import chroma from 'chroma-js'
import {raise} from 'common/events'

const scale = chroma.scale()

export const types = {
    nucleus: {
        good: true,
        name: 'Nucleus',
        cost: 600,
        life: 150,
        description: 'The core of your structure',
        color: 0xffd990,
        sprite: nucleus,
        attract: {
            nucleus: -4.5,
            defender: 0.03,
            repel: -5,
            virus: -0.4,
            phage: -0.25,
            toxin: -1
        },
        minR: {
            nucleus: DIAMETER * 4,
            defender: DIAMETER * 2,
            repel: DIAMETER * 6,
            virus: DIAMETER * 0.9,
            phage: DIAMETER,
            toxin: DIAMETER
        },
        maxR: {
            nucleus: DIAMETER * 9,
            defender: DIAMETER * 4,
            repel: DIAMETER * 8,
            virus: DIAMETER * 2,
            phage: DIAMETER * 4,
            toxin: DIAMETER * 8
        },
        hit(surface, nucleus, points, source) {
            if (source.type !== 'virus') return
            nucleus.life -= points
            if (nucleus.life <= 0) {
                nucleus.alive = false
                explode(surface.spawn, nucleus.x, nucleus.y, 0x605020, 40, 2.8, 3, 10)
                raise('particle-destroyed', nucleus)
                source.ticks = 100000000
            }
        },
        after(surface, nucleus) {
            nucleus.sprite.tint = mapToRgb(scale(0.7 - nucleus.life / types.nucleus.life))
        },
    },
    defender: {
        name: 'Shield',
        good: true,
        description: 'Shields a nucleus',
        cost: 20,
        life: 30,
        color: 0xff0000,
        sprite: cell,
        hit(surface, defender, points) {
            defender.life -= points
            if (defender.life <= 0) {
                explode(surface.spawn, defender.x, defender.y, types.defender.color)
                defender.alive = false
                raise('particle-destroyed', defender)
            }
        },
        attract: {
            nucleus: 1.72,
            defender: -0.22,
            repel: -0.32,
            virus: 2.85,
            phage: -1,
            toxin: -.5
        },
        minR: {
            nucleus: DIAMETER * 1.2,
            defender: DIAMETER,
            repel: DIAMETER * 6,
            virus: DIAMETER,
            phage: DIAMETER,
            toxin: DIAMETER
        },
        maxR: {
            nucleus: DIAMETER * 9,
            defender: DIAMETER * 5,
            repel: DIAMETER * 8,
            virus: DIAMETER * 6,
            phage: DIAMETER * 4,
            toxin: DIAMETER * 3
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
            nucleus: 3.4,
            defender: 0.225,
            repel: -0.32,
            virus: -2,
            phage: 0.03,
            toxin: 0.05
        },
        minR: {
            nucleus: DIAMETER * 0.9,
            defender: DIAMETER,
            repel: DIAMETER * 6,
            virus: DIAMETER,
            phage: DIAMETER,
            toxin: DIAMETER
        },
        maxR: {
            nucleus: DIAMETER * 14,
            defender: DIAMETER * 5,
            repel: DIAMETER * 6,
            virus: DIAMETER * 2,
            phage: DIAMETER * 4,
            toxin: DIAMETER * 4
        },
        collide: {
            nucleus({source, target, r, dx, dy, surface}) {
                if (r < DIAMETER * 1.5) {
                    callFunction(target.type, 'hit', surface, target, 1, source)
                    darkSparks(surface.spawn, source.x + (dx * r) / 2, source.y + (dy * r) / 2, 0x404040, 10, 0.8, 6)
                }
            },
        },
        after(surface, virus) {
            virus.ticks--
            if (virus.ticks < 0) {
                explode(surface.spawn, virus.x, virus.y, 0x605020, 20, 1.2, 3, 5)
                virus.alive = false
            }
        },
        init(virus) {
            virus.ticks = 800
        },
    },
    phage: {
        name: 'Phage',
        description: 'Tries to kill shields',
        cost: 100,
        life: 100,
        color: 0xf200ff,
        sprite: bad1,
        earlyUpdate(surface, phage) {
            phage.proximal = 0
        },
        hit(surface, phage, points) {
            phage.life -= points

            if (phage.life <= 0) {
                phage.alive = false
                explode(surface.spawn, phage.x, phage.y, types.phage.color)
            }
        },
        after(surface, phage) {
            if (phage.proximal > 1) {
                callFunction('phage', 'hit', surface, phage, phage.proximal - 1)
            }
            phage.ticks--
            if (phage.ticks <= 0) {
                callFunction('phage', 'hit', surface, phage, 1000)
            }
        },
        collide: {
            defender({source, target, r, dx, dy, surface}) {
                if (r < DIAMETER * 1.7) {
                    source.proximal++
                }
                if (r < DIAMETER * 1.2) {
                    callFunction(target.type, 'hit', surface, target, 1)
                    sparks(
                        surface.spawn,
                        source.x + (dx * r) / 2,
                        source.y + (dy * r) / 2,
                        types[target.type].color,
                        8,
                        0.3,
                        5
                    )
                }
            },
        },
        attract: {
            nucleus: 0.3,
            defender: 1.2,
            repel: -0.32,
            virus: -0.35,
            phage: -0.9,
            toxin: -1.3
        },
        minR: {
            nucleus: DIAMETER * 1.2,
            defender: DIAMETER,
            repel: DIAMETER * 6,
            virus: DIAMETER,
            phage: DIAMETER,
            toxin: DIAMETER
        },
        maxR: {
            nucleus: DIAMETER * 9,
            defender: DIAMETER * 5,
            repel: DIAMETER * 6,
            virus: DIAMETER * 2,
            phage: DIAMETER * 6,
            toxin: DIAMETER * 7
        },
        init(phage) {
            phage.ticks = 500
        },
    },
    toxin: {
        name: 'Toxin',
        description: 'Releases a dose of poison killing surrounding cells',
        cost: 250,
        life: 120,
        color: 0xa6ef00,
        sprite: bad3,
        earlyUpdate(surface, toxin) {
            toxin.proximal = toxin.proximal || []
            toxin.proximal.length = 0
            smoke(surface.spawn, toxin.x, toxin.y, types.toxin.color)
        },
        hit(surface, toxin, points) {
            toxin.life -= points

            if (toxin.life <= 0) {
                toxin.alive = false
                explode(surface.spawn, toxin.x, toxin.y, types.toxin.color)
                for (let target of toxin.proximal) {
                    explode(surface.spawn, target.x, target.y, types.toxin.color)
                    callFunction(target.type, 'hit', surface, target, 350, toxin)
                }
            }
        },
        after(surface, toxin) {
            if (toxin.proximal.length > 6) {
                callFunction('toxin', 'hit', surface, toxin, 20)
            } else if (toxin.proximal.length > 2) {
                callFunction('toxin', 'hit', surface, toxin, 2)
            }
            toxin.ticks--
            if (toxin.ticks <= 0) {
                callFunction('toxin', 'hit', surface, toxin, 1000)
            }
        },
        collide: {
            defender({source, target, r, dx, dy, surface}) {
                if (r < DIAMETER * 3) {
                    source.proximal.push(target)
                }
            },
        },
        attract: {
            nucleus: 0.3,
            defender: 0.32,
            repel: -0.32,
            virus: -2.35,
            toxin: -3.9,
            phage: -4
        },
        minR: {
            nucleus: DIAMETER * 1.2,
            defender: DIAMETER,
            repel: DIAMETER * 6,
            virus: DIAMETER,
            phage: DIAMETER,
            toxin: DIAMETER
        },
        maxR: {
            nucleus: DIAMETER * 7,
            defender: DIAMETER * 14,
            repel: DIAMETER * 6,
            virus: DIAMETER * 2,
            phage: DIAMETER * 6,
            toxin: DIAMETER * 10
        },
        init(phage) {
            phage.ticks = 500
        },
    },
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
