import * as PIXI from "pixi.js";
import { app } from "../main";
import { aa1Texture, enemy1, fireTexture } from "../resource/spriteManage";
import consts from "../type/const";
import { viewportContainer } from "../viewport/viewport";
import sab from "../worker/sabManage";

let tempIterator = 0;

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

tempIterator = consts.numberOfEnemy1;
while (tempIterator--) {
  sab.enemy1HpsArr[tempIterator] = 0;
  tempSprite = new PIXI.Sprite(enemy1);
  tempSprite.scale.set(0.2);
  tempSprite.anchor.set(0.5);
  tempSprite.position.set(9999);
  tempSprite.alpha = 0;
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
  tempSprite.tint = 0xff0000;

  tempSprite.scale.set(0.02);
  tempSprite.rotation = Math.PI / 2;
  tempSprite.anchor.set(0.5);
  tempSprite.position.set(9999);
  tempSprite.alpha = 0;
  tempSprite.cacheAsBitmapResolution = 1;
  tempSprite.cacheAsBitmap = true;
  flame1container.addChild(tempSprite);
}

viewportContainer.addChild(enemy1container);
viewportContainer.addChild(autoAttack1container);
viewportContainer.addChild(flame1container);

export const renderUpdate = () => {
  tempIterator = consts.numberOfEnemy1;
  while (tempIterator--) {
    if (sab.enemy1HpsArr[tempIterator] <= 0) {
      enemy1container.children[tempIterator].alpha = 0;
    } else {
      enemy1container.children[tempIterator].x = sab.enemy1PositionsArr.x[tempIterator];
      enemy1container.children[tempIterator].y = sab.enemy1PositionsArr.y[tempIterator];
      if (enemy1container.children[tempIterator].x === 0 || enemy1container.children[tempIterator].y === 0) {
        console.log(sab.enemy1PositionsArr.x[tempIterator], sab.enemy1PositionsArr.y[tempIterator], tempIterator);
      }
      enemy1container.children[tempIterator].alpha = 0.8;
    }
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
};
