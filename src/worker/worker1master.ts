import Worker from "./worker1?worker";
import sab from "./sabManage";
import * as PIXI from "pixi.js";
import { viewport, viewportContainer } from "../viewport/viewport";
import consts from "../type/const";
import { aa1Texture, enemy1, fireTexture, sprites } from "../resource/spriteManage";
import { app } from "../main";
import { sound } from "@pixi/sound";
import { damageTextPool } from "../ui/damageText";
import { channel12 } from "./channel";
import { isMobile } from "pixi.js";
import firePng from '../asset/fire.png'
import { explosion, explosionPool } from "../player/explosion";

const worker1 = new Worker();

let tempIterator = 0;
let indexDouble = 0;

const enemy1container = new PIXI.ParticleContainer(
  consts.numberOfEnemy1,
  {
    vertices: false,
    rotation: false,
    uvs: false,
    tint: false,
    alpha: true,
    scale: false,
    position: true,
  },
  consts.numberOfEnemy1,
  true
);

const autoAttack1container = new PIXI.ParticleContainer(
  consts.numberOfAutoAttack1,
  {
    vertices: false,
    rotation: false,
    uvs: false,
    tint: false,
    alpha: true,
    scale: false,
    position: true,
  },
  consts.numberOfAutoAttack1,
  true
);

const flame1container = new PIXI.ParticleContainer(
  consts.numberOfFlame1,
  {
    vertices: false,
    rotation: true,
    uvs: false,
    tint: false,
    alpha: true,
    scale: false,
    position: true,
  },
  consts.numberOfFlame1,
  true
);


let tempSprite;
export let worker1Ready = false;
worker1.onmessage = (ev: any) => {
  if (ev.data.cmd === "ready") {
    worker1Ready = true;
  } else if (ev.data.cmd === "damage") {
    damageTextPool.show((ev.data.x + ev.data.enemyX)/2, (ev.data.y + ev.data.enemyY)/2, 5);
    explosionPool.show(ev.data.enemyX, ev.data.enemyY)
  }
};

export function worker1init() {
  worker1.postMessage({ cmd: "init", sab: sab }, [channel12.port1]);

  //calc request
  channel12.port1.onmessage = () => {
    channel12.port2.postMessage(0);
  };

  tempIterator = consts.numberOfEnemy1;
  while (tempIterator--) {
    sab.enemy1HpsArr[tempIterator] = 0;
    tempSprite = new PIXI.Sprite(enemy1);
    tempSprite.scale.set(0.2)
    tempSprite.anchor.set(0.5);
    tempSprite.position.set(9999);
    tempSprite.alpha = 0.8;
    tempSprite.cacheAsBitmapResolution = 1;
    tempSprite.cacheAsBitmap = true;
    enemy1container.addChild(tempSprite);
  }

  tempIterator = consts.numberOfAutoAttack1;
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


  tempIterator = consts.numberOfFlame1;
  while (tempIterator--) {
    sab.flame1EnabledArr[tempIterator] = 0;
    tempSprite = new PIXI.Sprite(fireTexture);
    tempSprite.tint = 0xff0000

    tempSprite.scale.set(0.02);
    tempSprite.rotation = Math.PI / 2
    tempSprite.anchor.set(0.5);
    tempSprite.position.set(9999);
    tempSprite.alpha = 0;
    tempSprite.cacheAsBitmapResolution = 1;
    tempSprite.cacheAsBitmap = true;
    flame1container.addChild(tempSprite);
  }


  setTimeout(() => {
    viewportContainer.addChild(enemy1container);
    viewportContainer.addChild(autoAttack1container);
    viewportContainer.addChild(flame1container);
  }, 400);

  app.ticker.add(() => {
    tempIterator = consts.numberOfEnemy1;
    while (tempIterator--) {
      if (sab.enemy1HpsArr[tempIterator] <= 0) {
        enemy1container.children[tempIterator].alpha = 0;
        continue;
      }
      enemy1container.children[tempIterator].alpha = 1
      enemy1container.children[tempIterator].x = sab.enemy1PositionsArr.x[tempIterator];
      enemy1container.children[tempIterator].y = sab.enemy1PositionsArr.y[tempIterator];
    }

    tempIterator = consts.numberOfAutoAttack1;
    while (tempIterator--) {
      if (sab.autoAttack1EnabledArr[tempIterator] <= 0) {
        autoAttack1container.getChildAt(tempIterator).alpha = 0;
        continue;
      }
      autoAttack1container.children[tempIterator].x = sab.autoAttack1PositionsArr.x[tempIterator];
      autoAttack1container.children[tempIterator].y = sab.autoAttack1PositionsArr.y[tempIterator];
      autoAttack1container.getChildAt(tempIterator).alpha = 1;
    }

    tempIterator = consts.numberOfFlame1;
    while (tempIterator--) {
      if (sab.flame1EnabledArr[tempIterator] <= 0) {
        flame1container.getChildAt(tempIterator).alpha = 0;
        continue;
      }
      flame1container.children[tempIterator].x = sab.flame1PositionsArr.x[tempIterator];
      flame1container.children[tempIterator].y = sab.flame1PositionsArr.y[tempIterator];
      flame1container.getChildAt(tempIterator).alpha = 1;
    }
  });
  worker1start();
}

export function worker1start() {
  worker1.postMessage({ cmd: "start" });
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
  sound.volume("shot", 0.3);
  sound.play("shot");

  worker1.postMessage({ cmd: "fire" });
}

export function worker1flame() {
  worker1.postMessage({ cmd: "flame" });
}

export async function worker1check() {
  worker1.postMessage({ cmd: "check" });
}

export { };
