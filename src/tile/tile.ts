import * as PIXI from 'pixi.js'
import { sprites } from '../resource/spriteManage'
import { viewport, viewportContainer } from '../viewport/viewport'
import { bgContainer } from './background'

export const tileInit = () => {
  const tilingSprite = new PIXI.TilingSprite(sprites.bg.texture, 50000, 50000)
  tilingSprite.scale.x = 0.1
  tilingSprite.scale.y = 0.1
  tilingSprite.anchor.x = 0.5
  tilingSprite.anchor.y = 0.5
  tilingSprite.alpha = 1
  tilingSprite.zIndex = -999
  //bgContainer.addChild(tilingSprite)
  viewportContainer.addChild(tilingSprite)
}
