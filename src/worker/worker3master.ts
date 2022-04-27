import * as PIXI from "pixi.js";
import Worker from "./worker3?worker";
import { numberOfResource1 } from "../type/const";
import { viewport } from "../viewport/viewport";
import particlePng from "../asset/particle.png";
import { player } from "../player/player";
import sabWorker1 from './sabManage'

import { textures } from "../resource/spriteManage";
import sabManage from "./sabManage";
import { app } from "../main";
const worker3 = new Worker();

const resource1container = new PIXI.ParticleContainer(
  numberOfResource1,
  {
    alpha: true,
    position: true,
  },
  numberOfResource1,
  false
);

let tempIterator = 0;
let indexDouble = 0

export async function worker3init() {
  let resource1sprites;
  viewport.addChild(resource1container);
  tempIterator = numberOfResource1;
  while (tempIterator--) {
    resource1sprites = new PIXI.Sprite(textures.particle);

    resource1sprites.scale.set(0.06)
    resource1sprites.anchor.set(0.5);
    resource1sprites.tint = 0x964b00;
    resource1sprites.alpha = 0.5;
    resource1sprites.x = Math.random() * 100 - 50;
    resource1sprites.y = Math.random() * 100 - 50;
    resource1container.addChild(resource1sprites);

    sabWorker1.resource1RemainTimesArr[tempIterator] = 100000
  }

  viewport.addChild(resource1container);

  worker3.postMessage([
    sabManage.resource1Positions,
    sabManage.resource1Positions,
    sabManage.resource1RemainTimes,

  ])

  app.ticker.add(()=>{
    tempIterator = numberOfResource1;
    while (tempIterator--) {
      if (sabWorker1.resource1RemainTimesArr[tempIterator] <= 0) {
        resource1container.children[tempIterator].alpha = 0;
        continue;
      }
      indexDouble = tempIterator * 2;
  
      resource1container.children[tempIterator].x = sabWorker1.resource1PositionsArr[indexDouble];
      resource1container.children[tempIterator].y = sabWorker1.resource1PositionsArr[indexDouble + 1];
    }  
  })
}
