import * as PIXI from 'pixi.js'
import { autoAttack1Speed, numberOfAutoAttack1 } from '../type/const'
import { aa1Texture } from '../resource/spriteManage'
import sab from '../worker/sabManage'
import { viewport } from '../viewport/viewport'
import '../worker/worker2master'
class AutoAttack1 extends PIXI.Sprite {
  fired = false;
  remainTime = 0;
  constructor () {
    super(aa1Texture)
  }
}

let tempIterator = 0
let iteratorDouble = 0
class AutoAttack1Pool {
  remainTime = 0;
  cursor = 0;
  public objectPool = new Array<AutoAttack1>(numberOfAutoAttack1);
  constructor () {
    for (let i = 0; i < numberOfAutoAttack1; i++) {
      this.objectPool[i] = new AutoAttack1()
      this.objectPool[i].anchor.x = 0.5
      this.objectPool[i].anchor.y = 0.5
      this.objectPool[i].scale.x = 0.2
      this.objectPool[i].scale.y = 0.2
      this.objectPool[i].visible = false
    }
  }

  init () {
    for (let i = 0; i < numberOfAutoAttack1; i++) {
      viewport.addChild(this.objectPool[i])
    }
  }

  fire (x: number, y: number) {
    this.cursor++
    if (this.cursor === numberOfAutoAttack1) {
      this.cursor = 0
    }
    this.objectPool[this.cursor].visible = true
    this.objectPool[this.cursor].fired = true
    this.objectPool[this.cursor].x = x - 0.1
    this.objectPool[this.cursor].y = y - 0.7
    this.objectPool[this.cursor].remainTime = 1500
  }

  disable (index: number) {
    this.objectPool[index].remainTime = 0
    this.objectPool[index].visible = false
  }

  update (delta: number) {
    tempIterator = numberOfAutoAttack1

    while (tempIterator--) {
      iteratorDouble = tempIterator * 2

      if (this.objectPool[tempIterator].fired === true) { // first update after fired check
        sab.autoAttack1EnabledArr[tempIterator] = 1
        this.objectPool[tempIterator].fired = false
      } else if (sab.autoAttack1EnabledArr[tempIterator] === 0 || this.objectPool[tempIterator].remainTime <= 0) { // skip check
        this.objectPool[tempIterator].visible = false
        continue
      }

      // bullet is not disabled and remain time is not expired
      this.objectPool[tempIterator].remainTime -= (delta * 1000) / 60
      this.objectPool[tempIterator].y -= autoAttack1Speed
      sab.autoAttack1PositionsArr[iteratorDouble] = this.objectPool[tempIterator].x
      sab.autoAttack1PositionsArr[iteratorDouble + 1] = this.objectPool[tempIterator].y
    }
  }
}

export const aaPool = new AutoAttack1Pool()
