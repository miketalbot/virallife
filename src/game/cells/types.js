import Prob from 'prob.js'
import {fromHSV, resizeArray} from '../lib'
import {DIAMETER, presets, randGen} from '../constants'

export class ParticleTypes {
    constructor(size = 0) {
        this.col = Array.from({ length: size }, () => ({ r: 0, g: 0, b: 0, a: 0 }))
        this.attract = Array(size * size).fill(0)
        this.minR = Array(size * size).fill(0)
        this.maxR = Array(size * size).fill(0)
    }

    resize(size) {
        resizeArray(this.col, size, { r: 0, g: 0, b: 0, a: 0 })
        resizeArray(this.attract, size * size, 0)
        resizeArray(this.minR, size * size, 0)
        resizeArray(this.maxR, size * size, 0)
    }

    size() {
        return this.col.length
    }

    getColor(i) {
        return this.col[i]
    }

    setColor(i, value) {
        this.col[i] = value
    }

    getAttract(i, j) {
        return this.attract[i * this.col.length + j]
    }

    setAttract(i, j, value) {
        this.attract[i * this.col.length + j] = value
    }

    getMinR(i, j) {
        return this.minR[i * this.col.length + j]
    }

    setMinR(i, j, value) {
        this.minR[i * this.col.length + j] = value
    }

    getMaxR(i, j) {
        return this.maxR[i * this.col.length + j]
    }

    setMaxR(i, j, value) {
        this.maxR[i * this.col.length + j] = value
    }

    setRandomTypes({ attractMean, attractStd, minRLower, minRUpper, maxRLower, maxRUpper }, random = randGen) {
        const randAttr = Prob.normal(attractMean, attractStd)
        const randMinR = Prob.uniform(minRLower, minRUpper)
        const randMaxR = Prob.uniform(maxRLower, maxRUpper)

        for (let i = 0; i < this.size(); ++i) {
            this.setColor(i, fromHSV(i / this.size(), 1, (i % 2) * 0.5 + 0.5))

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
