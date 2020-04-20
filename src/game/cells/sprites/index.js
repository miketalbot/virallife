import virus from './mainvirus_bad.2.png'
import cell from './red_cell.png'
import nucleus from './good_cell01.png'
import circle from './circle.png'
import cell1 from './cell_1.png'
import cell2 from './cell_2.png'
import cell3 from './cell_3.png'
import {Texture} from 'pixi.js'

export const images = [virus, cell, nucleus, circle, cell1, cell2, cell3]
export {virus, cell, nucleus, circle, cell1, cell2, cell3}

export const textures = images.reduce((o, image) => ({...o, [image]: Texture.from(image)}), {})
