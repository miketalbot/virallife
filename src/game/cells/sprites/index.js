import virus from './mainvirus_bad.2.png'
import cell from './red_cell.png'
import nucleus from './good_cell01.png'
import circle from './circle.png'
import {Texture} from 'pixi.js'

export const images = [virus, cell, nucleus, circle]
export { virus, cell, nucleus, circle }

export const textures = images.reduce((o, image) => ({ ...o, [image]: Texture.from(image) }), {})
