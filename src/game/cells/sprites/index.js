import virus from './mainvirus_bad.2.png'
import cell from './red_cell.png'
import nucleus from './good_cell01.png'
import circle from './circle.png'
import {Loader} from 'pixi.js'

export const images = [virus, cell, nucleus, circle]
export { virus, cell, nucleus, circle }

images.forEach((image) => {
    Loader.shared.add(image, image)
})
