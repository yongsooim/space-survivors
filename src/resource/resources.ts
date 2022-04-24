import shipPng from '../asset/ship.png'
import bgPng from '../asset/bg.png'
import miscPng from '../asset/misc.png'
import projPng from '../asset/proj.png'
import uiPng from '../asset/ui.png'
import charPng from '../asset/char.png'
import fireWav from '../asset/Laser_Shoot9.wav'
import kick from '../asset/kick.wav'
import hihat from '../asset/hihat_close.wav'
import snare from '../asset/snare.wav'
import loop from '../asset/loop.wav'
import bass from '../asset/bass.wav'
import * as PIXI from 'pixi.js'
import { Sound, sound, webaudio } from '@pixi/sound';


sound.add('kick', kick)
sound.add('hihat_close', hihat)
sound.add('loop', loop)
sound.add('snare', snare)
sound.add('bass', bass)

export let kickSound = Sound.from(kick)
export let hihatSound = Sound.from(hihat)
export let loopSound  = Sound.from(loop)
export let snareSound  = Sound.from(snare)
export let bassSound  = Sound.from(bass)


export const resourcePaths = {
  shipPng,
  bgPng,
  miscPng,
  projPng,
  uiPng,
  charPng,
  fireWav
}

export const resources: PIXI.IAddOptions[] = [
  { name: 'ship', url: shipPng, loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE },
  { name: 'bg', url: bgPng },
  { name: 'misc', url: miscPng },
  { name: 'proj', url: projPng },
  { name: 'ui', url: uiPng },
  { name: 'char', url: charPng },
  { name: 'fire', url: fireWav }
]

/*

const Resources = {
  ship: new ImageSource(ship),
  bg: new ImageSource(bg),
  misc: new ImageSource(misc),
  proj: new ImageSource(proj),
  ui: new ImageSource(ui),
  char: new ImageSource(char),
  fire: new Sound(fireOggPath)
}

const bgSheet = SpriteSheet.fromImageSource({
  image: Resources.bg,
  grid: {
    rows: 2,
    columns: 3,
    spriteHeight: 256,
    spriteWidth: 128
  },
  spacing: {
    margin: {
      x: 1,
      y: 1
    }
  }
})

// Create a tilemap
export const tilemap = new TileMap({
  x: 0,
  y: 0,
  rows: 10,
  cols: 10,
  cellWidth: 16,
  cellHeight: 16
})

// loop through tilemap cells
for (const cell of tilemap.data) {
  const sprite = bgSheet.getSprite(0, 0)
  if (sprite) {
    cell.addGraphic(sprite)
  }
}

const shipSprites16 = SpriteSheet.fromImageSource({
  image: Resources.ship,
  grid: {
    rows: 5,
    columns: 5,
    spriteWidth: 16,
    spriteHeight: 16
  }
})

const shipSprites8 = SpriteSheet.fromImageSource({
  image: Resources.ship,
  grid: {
    rows: 10,
    columns: 10,
    spriteWidth: 8,
    spriteHeight: 8
  }
})

const projSprites = SpriteSheet.fromImageSource({
  image: Resources.proj,
  grid: {
    rows: 10,
    columns: 6,
    spriteWidth: 8,
    spriteHeight: 8
  }
})

const miscSprites8 = SpriteSheet.fromImageSource({
  image: Resources.misc,
  grid: {
    rows: 8,
    columns: 13,
    spriteWidth: 8,
    spriteHeight: 8
  }
})

export { Resources, shipSprites16, shipSprites8, projSprites, miscSprites8 }
 */
