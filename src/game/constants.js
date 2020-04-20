import {MersenneTwister19937, Random} from 'random-js'

export const GAME_WIDTH = 2048
export const GAME_HEIGHT = 1024

export const RADIUS = 10
export const DIAMETER = 2.0 * RADIUS
export const presets = {
    Balanced: {
        population: [9, 400],
        seed: [-0.02, 0.06, 0.0, 20.0, 20.0, 70.0, 0.05, false],
    },
    Chaos: {
        population: [6, 400],
        seed: [0.02, 0.04, 0.0, 30.0, 30.0, 100.0, 0.01, false],
    },
    Diversity: {
        population: [12, 400],
        seed: [-0.01, 0.04, 0.0, 20.0, 10.0, 60.0, 0.05, true],
    },
    Frictionless: {
        population: [6, 300],
        seed: [0.01, 0.005, 10.0, 10.0, 10.0, 60.0, 0.0, true],
    },
    Gliders: {
        population: [6, 400],
        seed: [0.0, 0.06, 0.0, 20.0, 10.0, 50.0, 0.1, true],
    },
    Homogeneity: {
        population: [4, 400],
        seed: [0.0, 0.04, 10.0, 10.0, 10.0, 80.0, 0.05, true],
    },
    'Large Clusters': {
        population: [6, 400],
        seed: [0.025, 0.02, 0.0, 30.0, 30.0, 100.0, 0.2, false],
    },
    'Medium Clusters': {
        population: [6, 400],
        seed: [0.02, 0.05, 0.0, 20.0, 20.0, 50.0, 0.05, false],
    },
    Quiescence: {
        population: [6, 300],
        seed: [-0.02, 0.1, 10.0, 20.0, 20.0, 60.0, 0.2, false],
    },
    'Small Clusters': {
        population: [6, 600],
        seed: [-0.005, 0.01, 10.0, 10.0, 20.0, 50.0, 0.01, false],
    },
}
export const CELL_SIZE = 80
export const VELOCITY_MULT = 0.2
export const randGen = new Random(MersenneTwister19937.seed(Date.now())).next
export const R_SMOOTH = .3
