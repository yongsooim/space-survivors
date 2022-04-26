import Worker from "./worker1?worker";
import sabWorker1 from "./sabManage";
import * as PIXI from "pixi.js";
import { viewport, viewportContainer } from "../viewport/viewport";
import { numberOfEnemy1 } from "../type/const";
import { enemy1, sprites } from "../resource/spriteManage";
import { Sprite } from "pixi.js";
import { player } from "../player/player";

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

let tempEnemyShip;
export async function worker1init() {
  tempIterator = numberOfEnemy1;
  while (tempIterator--) {
    sabWorker1.enemy1HpsArr[tempIterator] = 1;
    tempEnemyShip = new PIXI.Sprite(enemy1);
    tempEnemyShip.scale.set(0.2)
    tempEnemyShip.anchor.set(0.5);
    tempEnemyShip.position.set(9999)
    tempEnemyShip.cacheAsBitmapResolution = 1;
    tempEnemyShip.cacheAsBitmap = true;
    enemy1container.addChild(tempEnemyShip);
  }

  viewportContainer.addChild(enemy1container);
}

export function enemy1update() {
  tempIterator = numberOfEnemy1;
  while (tempIterator--) {
    if (sabWorker1.enemy1HpsArr[tempIterator] <= 0) {
      sabWorker1.enemy1HpsArr[tempIterator] = 0;
      enemy1container.children[tempIterator].alpha = 0;
      continue;
    }
    indexDouble = tempIterator * 2;

    enemy1container.children[tempIterator].x = sabWorker1.enemy1PositionsArr[indexDouble];

    enemy1container.children[tempIterator].y = sabWorker1.enemy1PositionsArr[indexDouble + 1];
  }
}

setTimeout(() => {
  worker1.postMessage([sabWorker1.playerPosition, sabWorker1.enemy1Positions, sabWorker1.enemy1Hps]);
}, 1000);

window.onbeforeunload = () => {
  location.reload();
  document.location.reload();
  worker1.postMessage({ cmd: "close" });
  worker1.terminate();
  PIXI.utils.clearTextureCache();
};

//window.onblur = (e) => {
//  worker1.postMessage({ cmd: 'stop' })
//}

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

export {};
