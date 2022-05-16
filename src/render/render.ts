import * as PIXI from 'pixi.js'
import { app } from '../main'
import { aa1Texture, enemy1, enemy2, fireTexture } from '../resource/spriteManage'
import consts from '../type/const'
import { viewportContainer } from '../viewport/viewport'
import sab from '../worker/sabManage'

let tempIterator = 0

const enemy1container = new PIXI.ParticleContainer(
  consts.numberOfEnemy1,
  {
    vertices: false,
    rotation: false,
    uvs: false,
    tint: false,
    alpha: false,
    scale: false,
    position: true
  },
  consts.numberOfEnemy1,
  true
)

const enemy2container = new PIXI.ParticleContainer(
  consts.numberOfEnemy2,
  {
    vertices: false,
    rotation: false,
    uvs: false,
    tint: false,
    alpha: false,
    scale: false,
    position: true
  },
  consts.numberOfEnemy2,
  true
)

const enemy3container = new PIXI.ParticleContainer(
  consts.numberOfEnemy3,
  {
    vertices: false,
    rotation: false,
    uvs: false,
    tint: false,
    alpha: true,
    scale: false,
    position: true
  },
  consts.numberOfEnemy3,
  true
)
const autoAttack1container = new PIXI.ParticleContainer(
  consts.numberOfAutoAttack1,
  {
    vertices: false,
    rotation: false,
    uvs: false,
    tint: false,
    alpha: true,
    scale: false,
    position: true
  },
  consts.numberOfAutoAttack1,
  true
)

const flame1container = new PIXI.ParticleContainer(
  consts.numberOfFlame1,
  {
    vertices: false,
    rotation: true,
    uvs: false,
    tint: false,
    alpha: false,
    scale: false,
    position: true
  },
  consts.numberOfFlame1,
  true
)

const missile1container = new PIXI.ParticleContainer(
  consts.numberOfMissile1,
  {
    vertices: false,
    rotation: true,
    uvs: false,
    tint: false,
    alpha: false,
    scale: false,
    position: true
  },
  consts.numberOfMissile1,
  true
)

let tempSprite

enemy1container.interactiveChildren = false
enemy1container.sortableChildren = false
enemy1container.interactive = false
tempIterator = consts.numberOfEnemy1
while (tempIterator--) {
  sab.enemy1HpsArr[tempIterator] = 0
  tempSprite = new PIXI.Sprite(enemy1)
  tempSprite.scale.set(0.2)
  tempSprite.anchor.set(0.5)
  tempSprite.position.set(consts.nowhere)
  tempSprite.alpha = 0.8
  tempSprite.cacheAsBitmapResolution = 1
  tempSprite.cacheAsBitmap = false
  enemy1container.addChild(tempSprite)
}

enemy2container.interactiveChildren = false
enemy2container.sortableChildren = false
enemy2container.interactive = false
tempIterator = consts.numberOfEnemy2
while (tempIterator--) {
  sab.enemy2HpsArr[tempIterator] = 0
  tempSprite = new PIXI.Sprite(enemy2)
  tempSprite.scale.set(0.2)
  tempSprite.anchor.set(0.5)
  tempSprite.position.set(consts.nowhere)
  tempSprite.alpha = 0.8
  tempSprite.cacheAsBitmapResolution = 1
  tempSprite.cacheAsBitmap = false
  enemy2container.addChild(tempSprite)
}

enemy3container.interactiveChildren = false
enemy3container.sortableChildren = false
enemy3container.interactive = false
tempIterator = consts.numberOfEnemy2
while (tempIterator--) {
  sab.enemy2HpsArr[tempIterator] = 0
  tempSprite = new PIXI.Sprite(enemy2)
  tempSprite.scale.set(0.2)
  tempSprite.anchor.set(0.5)
  tempSprite.position.set(consts.nowhere)
  tempSprite.alpha = 0.8
  tempSprite.cacheAsBitmapResolution = 1
  tempSprite.cacheAsBitmap = false
  enemy3container.addChild(tempSprite)
}

autoAttack1container.interactiveChildren = false
autoAttack1container.sortableChildren = false
autoAttack1container.interactive = false
tempIterator = consts.numberOfAutoAttack1
while (tempIterator--) {
  sab.autoAttack1RemainTimesArr[tempIterator] = 0
  tempSprite = new PIXI.Sprite(aa1Texture)
  tempSprite.scale.set(0.2)
  tempSprite.anchor.set(0.5)
  tempSprite.position.set(0)
  tempSprite.alpha = 0

  tempSprite.cacheAsBitmapResolution = 1
  tempSprite.cacheAsBitmap = false
  autoAttack1container.addChild(tempSprite)
}

flame1container.interactiveChildren = false
flame1container.sortableChildren = false
flame1container.interactive = false
tempIterator = consts.numberOfFlame1
while (tempIterator--) {
  sab.flame1RemainTimesArr[tempIterator] = 0
  tempSprite = new PIXI.Sprite(fireTexture)
  tempSprite.tint = 0xff0000
  tempSprite.scale.set(0.02)
  tempSprite.rotation = Math.PI / 2
  tempSprite.anchor.set(0.5)
  tempSprite.position.set(0)
  tempSprite.alpha = 0
  tempSprite.cacheAsBitmapResolution = 1
  tempSprite.cacheAsBitmap = false
  flame1container.addChild(tempSprite)
}

missile1container.interactiveChildren = false
missile1container.sortableChildren = false
missile1container.interactive = false
tempIterator = consts.numberOfMissile1
while (tempIterator--) {
  sab.missile1RemainTimesArr[tempIterator] = 0
  tempSprite = new PIXI.Sprite(fireTexture)
  tempSprite.tint = 0xff0000
  tempSprite.scale.set(0.02)
  tempSprite.rotation = Math.PI / 2
  tempSprite.anchor.set(0.5)
  tempSprite.position.set(0)
  tempSprite.alpha = 0
  tempSprite.cacheAsBitmapResolution = 1
  tempSprite.cacheAsBitmap = false
  missile1container.addChild(tempSprite)
}

viewportContainer.addChild(enemy1container)
viewportContainer.addChild(enemy2container)
viewportContainer.addChild(enemy3container)
viewportContainer.addChild(autoAttack1container)
viewportContainer.addChild(flame1container)
viewportContainer.addChild(missile1container)

export const renderUpdate = () => {
  tempIterator = consts.numberOfEnemy1
  while (tempIterator--) {
    if (sab.enemy1HpsArr[tempIterator] <= 0) {
      // enemy1container.children[tempIterator].alpha = 0
    } else {
      enemy1container.children[tempIterator].position.set(sab.enemy1PositionsArr.x[tempIterator], sab.enemy1PositionsArr.y[tempIterator])
      // enemy1container.children[tempIterator].alpha = 0.8
    }
  }

  tempIterator = consts.numberOfEnemy2
  while (tempIterator--) {
    if (sab.enemy2HpsArr[tempIterator] <= 0) {
      // enemy2container.children[tempIterator].alpha = 0
    } else {
      enemy2container.children[tempIterator].position.set(sab.enemy2PositionsArr.x[tempIterator], sab.enemy2PositionsArr.y[tempIterator])
      // enemy2container.children[tempIterator].alpha = 0.8
    }
  }

  tempIterator = consts.numberOfAutoAttack1
  while (tempIterator--) {
    if (sab.autoAttack1RemainTimesArr[tempIterator] <= 0) {
      autoAttack1container.children[tempIterator].alpha = 0
      continue
    }
    autoAttack1container.children[tempIterator].position.set(sab.autoAttack1PositionsArr.x[tempIterator], sab.autoAttack1PositionsArr.y[tempIterator])
    autoAttack1container.children[tempIterator].alpha = 1
  }

  // tempIterator = consts.numberOfFlame1
  // while (tempIterator--) {
  //  if (sab.flame1RemainTimesArr[tempIterator] <= 0) {
  //    flame1container.children[tempIterator].alpha = 0
  //    continue
  //  }
  //  flame1container.children[tempIterator].position.set(sab.flame1PositionsArr.x[tempIterator], sab.flame1PositionsArr.y[tempIterator])
  //  //flame1container.children[tempIterator].alpha = 1
  // }

  tempIterator = consts.numberOfMissile1
  while (tempIterator--) {
    if (sab.missile1RemainTimesArr[tempIterator] <= 0) {
      missile1container.children[tempIterator].alpha = 0
      continue
    }
    missile1container.children[tempIterator].position.set(sab.missile1PositionsArr.x[tempIterator], sab.missile1PositionsArr.y[tempIterator])
    // flame1container.children[tempIterator].alpha = 1
  }
}
