import * as PIXI from 'pixi.js'
import { resourcePaths } from './resources'
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

export let baseTextures = {
  ship: new PIXI.BaseTexture(resourcePaths.shipPng),
  bg: new PIXI.BaseTexture(resourcePaths.bgPng),
  misc: new PIXI.BaseTexture(resourcePaths.miscPng),
  proj: new PIXI.BaseTexture(resourcePaths.projPng),
  ui: new PIXI.BaseTexture(resourcePaths.uiPng),
  char: new PIXI.BaseTexture(resourcePaths.charPng),
}

export let textures = {
  ship1 : new PIXI.Texture(baseTextures.ship, new PIXI.Rectangle(4 * 8, 8 * 8, 16, 16))
}

export const enemy1 = new PIXI.Texture(baseTextures.ship, new PIXI.Rectangle(9 * 8, 0 * 8, 8, 8))

export const aa1Texture = new PIXI.Texture(baseTextures.proj, new PIXI.Rectangle(4 * 8, 0 * 8, 8, 8))

const bgBase = new PIXI.BaseTexture(resourcePaths.bgPng)
const bg = new PIXI.Texture(bgBase)

const proj = new PIXI.BaseTexture(resourcePaths.projPng)
export const aa = new PIXI.Texture(proj, new PIXI.Rectangle(4 * 8, 0 * 8, 8, 8))

export const sprites = {
  playerSprite: new PIXI.Sprite(textures.ship1),
  ship2: new PIXI.Sprite(textures.ship1),
  bg: new PIXI.Sprite(bg),
  autoAttack: new PIXI.Sprite(aa)
}
