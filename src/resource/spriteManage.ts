import { resourcePaths } from './resources'
import * as PIXI from 'pixi.js'
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const ships = new PIXI.BaseTexture(resourcePaths.shipPng)
export const ship1 = new PIXI.Texture(ships, new PIXI.Rectangle(4 * 8, 8 * 8, 16, 16))
export const enemy1 = new PIXI.Texture(ships, new PIXI.Rectangle(9 * 8, 0 * 8, 8, 8))

const bgBase = new PIXI.BaseTexture(resourcePaths.bgPng)
const bg = new PIXI.Texture(bgBase)

export const sprites = {
  ship: new PIXI.Sprite(ship1),
  ship2: new PIXI.Sprite(ship1),
  bg: new PIXI.Sprite(bg)

}
