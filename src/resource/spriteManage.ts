import * as PIXI from 'pixi.js'
import { resourcePaths, resources } from './resources'
import { app } from '../main'
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST


export const baseTextures = {
  ship: new PIXI.BaseTexture(resourcePaths.shipPng),
  bg: new PIXI.BaseTexture(resourcePaths.bgPng),
  misc: new PIXI.BaseTexture(resourcePaths.miscPng),
  proj: new PIXI.BaseTexture(resourcePaths.projPng),
  ui: new PIXI.BaseTexture(resourcePaths.uiPng),
  char: new PIXI.BaseTexture(resourcePaths.charPng),
  particle: new PIXI.BaseTexture(resourcePaths.particlePng),
  particles: new PIXI.BaseTexture(resourcePaths.particlesPng),
  fire: new PIXI.BaseTexture(resourcePaths.firePng)
}

export const enemy1 = new PIXI.Texture(baseTextures.ship, new PIXI.Rectangle(9 * 8, 0 * 8, 8, 8))
export const enemy2 = new PIXI.Texture(baseTextures.ship, new PIXI.Rectangle(8 * 8, 0 * 8, 8, 8))
export const enemy3 = new PIXI.Texture(baseTextures.ship, new PIXI.Rectangle(7 * 8, 0 * 8, 8, 8))

export const aa1Texture = new PIXI.Texture(baseTextures.proj, new PIXI.Rectangle(4 * 8, 0 * 8, 8, 8))
export const fireTexture = new PIXI.Texture(baseTextures.fire)

const bgBase = new PIXI.BaseTexture(resourcePaths.bgPng)
const bg = new PIXI.Texture(bgBase)
const bg2 = new PIXI.Texture(bgBase, new PIXI.Rectangle(0 * 32, 0 * 64, 32, 64))

const proj = new PIXI.BaseTexture(resourcePaths.projPng)
export const aa = new PIXI.Texture(proj, new PIXI.Rectangle(4 * 8, 0 * 8, 8, 8))

export const textures = {
  ship1: new PIXI.Texture(baseTextures.ship, new PIXI.Rectangle(1 * 8, 2 * 8, 8, 8)),
  ship1Left: new PIXI.Texture(baseTextures.ship, new PIXI.Rectangle(0 * 8, 2 * 8, 8, 8)),
  ship1Right: new PIXI.Texture(baseTextures.ship, new PIXI.Rectangle(2 * 8, 2 * 8, 8, 8)),
  particle: new PIXI.Texture(baseTextures.particle),
  particles: [
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 0, 256 * 0, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 1, 256 * 0, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 2, 256 * 0, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 3, 256 * 0, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 4, 256 * 0, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 0, 256 * 1, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 1, 256 * 1, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 2, 256 * 1, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 3, 256 * 1, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 4, 256 * 1, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 0, 256 * 2, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 1, 256 * 2, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 2, 256 * 2, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 3, 256 * 2, 256, 256)),
    new PIXI.Texture(baseTextures.particles, new PIXI.Rectangle(256 * 4, 256 * 2, 256, 256))
  ],
  resource2: new PIXI.Texture(baseTextures.misc, new PIXI.Rectangle(0 * 8, 0 * 8, 8, 8)),
  char1: new PIXI.Texture(baseTextures.char, new PIXI.Rectangle(0 * 8, 0 * 8, 8, 8)),

  ui1: new PIXI.Texture(baseTextures.ui, new PIXI.Rectangle(11 * 8, 0 * 8, 13, 13)),
  fire: new PIXI.Texture(baseTextures.fire),

  bgs: [
    new PIXI.Texture(baseTextures.bg, new PIXI.Rectangle(126 * 0, 256 * 0, 128, 256)),
    new PIXI.Texture(baseTextures.bg, new PIXI.Rectangle(126 * 1, 256 * 0, 128, 256)),
    new PIXI.Texture(baseTextures.bg, new PIXI.Rectangle(126 * 2, 256 * 0, 128, 256)),
    new PIXI.Texture(baseTextures.bg, new PIXI.Rectangle(126 * 1, 256 * 1, 128, 256)),
    new PIXI.Texture(baseTextures.bg, new PIXI.Rectangle(126 * 2, 256 * 1, 128, 256))
  ]
}

export const sprites = {
  playerSprite: new PIXI.Sprite(textures.ship1),
  ship2: new PIXI.Sprite(textures.ship1),
  bg: new PIXI.Sprite(bg),
  autoAttack: new PIXI.Sprite(aa)
}
