import Worker from "./worker1?worker";
import sab from "./sabManage";
import * as PIXI from "pixi.js";
import { viewport, viewportContainer } from "../viewport/viewport";
import { numberOfAutoAttack1, numberOfEnemy1 } from "../type/const";
import { aa1Texture, enemy1, sprites } from "../resource/spriteManage";
import { Sprite } from "pixi.js";
import { player } from "../player/player";
import { app } from "../main";
import { sound } from "@pixi/sound";
import { damageTextPool } from '../ui/damageText'


const worker1 = new Worker();

let tempIterator = 0;
let indexDouble = 0;

const enemy1container = new PIXI.ParticleContainer(
  numberOfEnemy1,
  {
    vertices: false,
    rotation: false,
    uvs: false,
    tint: false,
    alpha: true,
    scale: false,
    position: true,
  },
  numberOfEnemy1,
  true
);

const autoAttack1container = new PIXI.ParticleContainer(
  numberOfAutoAttack1,
  {
    vertices: false,
    rotation: false,
    uvs: false,
    tint: false,
    alpha: true,
    scale: false,
    position: true,
  },
  numberOfAutoAttack1,
  true
);

let tempSprite;
export async function worker1init() {
  worker1.postMessage(sab);

  tempIterator = numberOfEnemy1;
  while (tempIterator--) {
    sab.enemy1HpsArr[tempIterator] = 10;
    tempSprite = new PIXI.Sprite(enemy1);
    tempSprite.scale.set(0.2);
    tempSprite.anchor.set(0.5);
    tempSprite.position.set(9999);
    tempSprite.alpha = 0.8;
    tempSprite.cacheAsBitmapResolution = 1;
    tempSprite.cacheAsBitmap = true;
    enemy1container.addChild(tempSprite);
  }

  tempIterator = numberOfAutoAttack1;
  while (tempIterator--) {
    sab.autoAttack1EnabledArr[tempIterator] = 0;
    tempSprite = new PIXI.Sprite(aa1Texture);
    tempSprite.scale.set(0.2);
    tempSprite.anchor.set(0.5);
    tempSprite.position.set(9999);
    tempSprite.alpha = 0;
    tempSprite.cacheAsBitmapResolution = 1;
    tempSprite.cacheAsBitmap = true;
    autoAttack1container.addChild(tempSprite);
  }

  viewportContainer.addChild(enemy1container);
  viewportContainer.addChild(autoAttack1container);


  setTimeout(() => {
    worker1.postMessage({ cmd: 'start' })
  }, 200)
  sab.lockArr[0] = 0
}

export function enemy1update() {
  while (Atomics.load(sab.lockArr, 0) != 0){}
  Atomics.store(sab.lockArr, 0, 1)
  tempIterator = numberOfEnemy1;
  while (tempIterator--) {
    if (sab.enemy1HpsArr[tempIterator] <= 0) {
      enemy1container.children[tempIterator].alpha = 0;
      continue;
    }
    indexDouble = tempIterator * 2;
    enemy1container.children[tempIterator].x = sab.enemy1PositionsArr[indexDouble];
    enemy1container.children[tempIterator].y = sab.enemy1PositionsArr[indexDouble + 1];
  }

  tempIterator = numberOfAutoAttack1;
  while (tempIterator--) {
    if (sab.autoAttack1EnabledArr[tempIterator] <= 0) {
      autoAttack1container.getChildAt(tempIterator).alpha = 0;
      continue
    }
    indexDouble = tempIterator * 2;
    autoAttack1container.children[tempIterator].x = sab.autoAttack1PositionsArr[indexDouble];
    autoAttack1container.children[tempIterator].y = sab.autoAttack1PositionsArr[indexDouble + 1];
    autoAttack1container.getChildAt(tempIterator).alpha = 1;
  }
  Atomics.store(sab.lockArr, 0, 0)
}

worker1.onmessage = (ev: any) => {
  damageTextPool.show(ev.data.x, ev.data.y, ev.data.dmg)
}

window.onbeforeunload = () => {
  location.reload();
  document.location.reload();
  worker1.postMessage({ cmd: "close" });
  worker1.terminate();
  PIXI.utils.clearTextureCache();
};

// window.onblur = (e) => {
//  worker1.postMessage({ cmd: 'stop' })
// }

window.onclose = () => {
  worker1.postMessage({ cmd: "close" });
  worker1.terminate();
  PIXI.utils.clearTextureCache();
};

window.document.addEventListener("beforeunload", () => {
  worker1.terminate();
  worker1.postMessage("");
  PIXI.utils.clearTextureCache();
});

export function worker1fire() {
  sound.volume('shot', 0.3)
  sound.play('shot')

  worker1.postMessage({ cmd: "fire" });
}

export function worker1flame() {

  worker1.postMessage({ cmd: "flame" });
}

export { };
