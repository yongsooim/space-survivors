import * as PIXI from "pixi.js";
import Worker from "./worker3?worker";
import { numberOfResource1 } from "../type/const";
import { viewport } from "../viewport/viewport";
import particlePng from "../asset/particle.png";
import { player } from "../player/player";
import sabWorker1 from './sabManage'

import { textures } from "../resource/spriteManage";
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

export async function worker3init() {
  let resource1sprites;
  viewport.addChild(resource1container);
  tempIterator = numberOfResource1;
  while (tempIterator--) {
    resource1sprites = new PIXI.Sprite(textures.particle);

    resource1sprites.scale.x = 0.06;
    resource1sprites.scale.y = 0.06;

    resource1sprites.tint = 0x964b00;
    resource1sprites.alpha = 0.5;

    resource1sprites.anchor.x = 0.5;
    resource1sprites.anchor.y = 0.5;

    resource1sprites.anchor.set(0.5);
    resource1sprites.x = Math.random() * 100 - 50;
    resource1sprites.y = Math.random() * 100 - 50;
    resource1sprites.cacheAsBitmapResolution = 1;
    resource1sprites.cacheAsBitmap = true;
    resource1container.addChild(resource1sprites);
  }

  viewport.addChild(resource1container);
}
