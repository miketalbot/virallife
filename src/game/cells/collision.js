import {CELL_SIZE} from '../constants'

export class Collision {
    collisionList = []
    length = 0
    grid = {}
    matrix = {}

    constructor(cellSize = CELL_SIZE) {
        this.cellSize = cellSize
        this.cellHalfSize = cellSize / 2
    }

    startCollision() {
        this.length = 0
        const grid = this.grid
        const matrix = this.matrix
        for (let key in grid) {
            const item = grid[key]
            const seen = item.seen
            item.length = 0
            for (let other in seen) {
                seen[other] = false
            }
        }
        for (let key in matrix) {
            matrix[key] = false
        }
    }
    getCollisionItem() {
        let item = this.collisionList[this.length]
        if (!item) {
            item = this.collisionList[this.length] = { p1: null, p2: null }
        }
        this.length++
        return item
    }
    getCell(x, y) {
        let key = `${x}:${y}`
        let item = this.grid[key]
        if (!item) {
            item = this.grid[key] = { length: 0, items: [], seen: {} }
        }
        return item
    }
    push(x, y, item, cb) {
        const cell = this.getCell(x, y)
        const matrix = this.matrix
        const items = cell.items
        const seen = cell.seen
        const id = item.id
        if (!seen[id]) {
            const length = cell.length
            for (let i = 0; i < length; i++) {
                const other = items[i]
                const otherId = other.id
                let swap = otherId < id
                const key = swap ? `${otherId}:${id}` : `${id}:${otherId}`
                if (!matrix[key]) {
                    matrix[key] = true
                    const collisionItem = this.getCollisionItem()
                    collisionItem.p1 = swap ? other : item
                    collisionItem.p2 = swap ? item : other
                }
            }

            items[cell.length++] = item
            seen[id] = true
        }
    }
    write(x, y, item) {
        const sx = ((x - this.cellHalfSize) / this.cellSize) | 0
        const sy = ((y - this.cellHalfSize) / this.cellSize) | 0
        this.push(sx, sy, item)
        this.push(sx + 1, sy + 1, item)
        this.push(sx, sy + 1, item)
        this.push(sx + 1, sy + 1, item)
    }
    collisions(cb) {
        const collisionList = this.collisionList
        for (let i = 0, l = this.length; i < l; i++) {
            const item = collisionList[i]
            cb(item.p1, item.p2)
            cb(item.p2, item.p1)
        }
    }
}
