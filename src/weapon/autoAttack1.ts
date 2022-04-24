import { Actor } from "../class/Actor";
import * as PIXI from "pixi.js";
import { numberOfAutoAttack1, numberOfEnemy1 } from "../type/const";
import { aa1Texture } from "../resource/spriteManage";
import sabWorker1 from "../worker/sabManage";
import { sprites } from "../resource/spriteManage";
import { viewport } from "../main";
import '../worker/worker2Master'
class AutoAttack1 extends PIXI.Sprite {
  remainTime = 0; // delta 1 : 1000/60s
  constructor() {
    super(aa1Texture);
  }
  enabled = false;
  update(delta: number) {
    this.y -= 0.4 * delta;
  }
  kill() {}
}

let tempIterator = 0
let iteratorDouble = 0
class AutoAttack1Pool {
  cursor = 0;
  public objectPool = new Array<AutoAttack1>(numberOfAutoAttack1);
  constructor() {
    for (let i = 0; i < numberOfAutoAttack1; i++) {
      this.objectPool[i] = new AutoAttack1();
      this.objectPool[i].anchor.x = 0.5;
      this.objectPool[i].anchor.y = 0.5;
      this.objectPool[i].scale.x = 0.2;
      this.objectPool[i].scale.y = 0.2;
    }
  }

  fire(x: number, y: number) {
    this.cursor++;
    if (this.cursor === numberOfAutoAttack1) {
      this.cursor = 0;
    }
    this.objectPool[this.cursor].remainTime = 1000 / 60 
    this.objectPool[this.cursor].x = x - 0.1;
    this.objectPool[this.cursor].y = y - 0.7;

    viewport.addChild(this.objectPool[this.cursor]);
  }

  kill() {}
  update(delta: number) {
    this.objectPool.forEach((v) => v.update(delta));
    
    tempIterator = numberOfAutoAttack1
    while(tempIterator--){
        iteratorDouble = tempIterator * 2
        sabWorker1.autoAttack1PositionsArr[iteratorDouble] = this.objectPool[tempIterator].x
        sabWorker1.autoAttack1PositionsArr[iteratorDouble + 1] = this.objectPool[tempIterator].y
    }
  }
}

export const aaPool = new AutoAttack1Pool();
