import * as PIXI from 'pixi.js'
import { Sprite } from 'pixi.js'
import { app } from '../main'
import { baseTextures, sprites, textures } from '../resource/spriteManage'
import { viewport, viewportContainer } from '../viewport/viewport'
import { bgContainer } from './background'

export const tileInit = () => {
  const tilingSprite = new PIXI.TilingSprite(sprites.bg.texture, 10000, 10000)
  tilingSprite.scale.x = 0.1
  tilingSprite.scale.y = 0.1
  tilingSprite.anchor.x = 0.5
  tilingSprite.anchor.y = 0.5
  tilingSprite.alpha = 1
  tilingSprite.zIndex = -999


  const background = new PIXI.ParticleContainer(
    10000,
    {
      vertices: false,
      position: false,
      rotation: false,
      uvs: false,
      tint: false,
      alpha: false,
      scale: false,
    }
  )
  for (let i = -50; i < 50; i++) {
    for (let j = -50; j < 50; j++) {
      let tempSprite = PIXI.Sprite.from(textures.bgs[Math.floor(Math.random() * 4.99999)]);
      tempSprite.scale.set(0.1);
      tempSprite.anchor.set(0.5);
      tempSprite.x = j * 12.8;
      tempSprite.y = i * 25.6;
      background.addChild(tempSprite);
    }
  }
  



  //bgContainer.addChild(tilingSprite)
  //bgContainer.addChild(background)
  bgContainer.addChild(background)
  //app.stage.addChild(background)

}
