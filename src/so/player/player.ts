import * as ex from 'excalibur'
import { game } from '../../index'
import {resources } from '../resource/resourceManage'

class Player extends ex.Actor {
  constructor (config?: ex.ActorArgs) {
    super({...config})
    resources[0].load().then(()=>{
      this.graphics.use(ex.Sprite.from(resources[0]))
    })
  }

  onInitialize(_engine: ex.Engine): void {
    this.pos = _engine.screen.center
  }
}
export const player = new Player()
