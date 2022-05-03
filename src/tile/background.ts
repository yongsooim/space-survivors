import * as PIXI from 'pixi.js'
import { Container } from 'pixi.js'
import { sprites } from '../resource/spriteManage'
import { viewport, viewportContainer, viewportContainerBg } from '../viewport/viewport'
import { tileInit } from './tile'

export const bgContainer = new Container()

export const bgInit = () => {
  tileInit()

  viewportContainerBg.addChild(bgContainer)
}
