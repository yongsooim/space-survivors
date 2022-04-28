import * as PIXI from 'pixi.js'
import { Container } from 'pixi.js'
import { sprites } from '../resource/spriteManage'
import { viewport, viewportContainer } from '../viewport/viewport'

export const bgContainer = new Container()

export const bgInit = () => {
  viewportContainer.addChild(bgContainer)
}
