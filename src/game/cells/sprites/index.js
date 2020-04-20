import virusSprite from './mainvirus_bad.2.png'
import cell1 from './red_cell.png'
import nucleusSprite from './good_cell01.png'
import cell2 from './good_cell02.png'
import cell3 from './good_cell03.png'
import bad1 from './bad_cell01.png'
import bad2 from './bad_cell02.png'
import bad3 from './bad_cell03.png'
import white from './white_cell.png'
import circle from './circle.png'
import bg_cell1 from './cell_1.png'
import bg_cell2 from './cell_2.png'
import bg_cell3 from './cell_3.png'
import {Texture} from 'pixi.js'

export const images = [virusSprite, bad1, bad2, bad3, cell1, cell2, cell3, nucleusSprite, circle, bg_cell1, bg_cell2, bg_cell3, white]
export {virusSprite, cell1, nucleusSprite, circle, bg_cell1, bg_cell2, bg_cell3, bad1, bad2, bad3, cell2, cell3, white}

export const textures = images.reduce((o, image) => ({...o, [image]: Texture.from(image)}), {})
