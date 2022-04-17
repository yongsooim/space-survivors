import { Sprite, ImageSource, Resource, SpriteSheet, TileMap, Sound } from 'excalibur'
import ship from '../asset/ship.png'
import bg from '../asset/bg.png'
import misc from '../asset/misc.png'
import proj from '../asset/proj.png'
import ui from '../asset/ui.png'
import char from '../asset/char.png'
import fireOggPath from '../asset/Laser_Shoot9.wav'

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

export { Resources, shipSprites16, shipSprites8 , projSprites, miscSprites8 }
