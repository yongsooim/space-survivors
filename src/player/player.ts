import { Container } from "pixi.js";
import { textures } from "../resource/spriteManage";
import * as PIXI from "pixi.js";
import { input } from "../input/input";
import { Direction } from "../type/type";
import consts from "../type/const";
import sab from "../worker/sabManage";
import { Vector } from "../class/Vector";
import { keyboard, Keys } from "../input/keyboard";
import { viewport } from "../viewport/viewport";
import { aaPool } from "../weapon/autoAttack1";
import { initEmitter, emitter } from "./fire-emit";
import { worker1fire, worker1flame } from "../worker/worker1master";
import { explosion } from "./explosion";

class Player extends Container {
  level = 0;
  speed = 350;
  vector = new Vector(0, 0);
  positionVector = new Vector(0, 0);

  playerSprite = new PIXI.Sprite(textures.ship1);
  constructor() {
    super();
    this.position.set(0);
    this.playerSprite.position.set(0);
    this.playerSprite.scale.set(0.2, 0.2);
    //this.playerSprite.rotation = Math.PI;
    //this.playerSprite.cacheAsBitmap = true;
    this.playerSprite.anchor.set(0.5);
    this.playerSprite.zIndex = 999;
    this.addChild(this.playerSprite);
  }

  init() {
    initEmitter();
    //explosion.init;
  }
  update(delta: number) {
    this.checkInput(delta);

    if (this.vector.size >= 0.3) {
      if ((Math.PI * 7) / 8 <= this.vector.toAngle() && this.vector.toAngle() < (Math.PI * 9) / 8) {
        //console.log("left rotate wing");
      } else if (this.vector.toAngle() <= Math.PI / 8 || this.vector.toAngle() > (Math.PI * 15) / 8) {
        //console.log("right rotate wing");
      }
    }
  }

  fire() {
    //aaPool.fire(this.x, this.y)
    worker1fire();
  }

  flame() {
    worker1flame();
    emitter.maxLifetime = 0.5;
    setTimeout(() => {
      emitter.maxLifetime = 0.1;
    }, 250);
  }
  hit() {
    this.playerSprite.tint = 0xff0000;
    setTimeout(() => {
      this.playerSprite.tint = 0xffffff;
    }, 350);
  }

  checkInput(delta: number) {
    if (input.vector.x === 0 && input.vector.y === 0) { // if no touch input
      // keyboard
      this.vector.x = 0;
      this.vector.y = 0;
      if (input.isDirectionPressed(Direction.Up)) {
        this.vector.y -= 1;
      }
      if (input.isDirectionPressed(Direction.Down)) {
        this.vector.y += 1;
      }
      if (input.isDirectionPressed(Direction.Left)) {
        this.vector.x -= 1;
      }
      if (input.isDirectionPressed(Direction.Right)) {
        this.vector.x += 1;
      }
      if (input.isDirectionPressed(Direction.UpLeft)) {
        this.vector.y -= 1;
        this.vector.x -= 1;
      }
      if (input.isDirectionPressed(Direction.UpRight)) {
        this.vector.y -= 1;
        this.vector.x += 1;
      }
      if (input.isDirectionPressed(Direction.DownLeft)) {
        this.vector.y += 1;
        this.vector.x -= 1;
      }
      if (input.isDirectionPressed(Direction.DownRight)) {
        this.vector.y += 1;
        this.vector.x += 1;
      }

      if (this.vector.x !== 0 || this.vector.y !== 0) {
        this.vector = this.vector.normalize();
      }
    } else {
      // touch
      this.vector.x = input.vector.x;
      this.vector.y = -input.vector.y;
    }

    this.position.x += this.vector.x * delta * consts.playerSpeed;
    this.position.y += this.vector.y * delta * consts.playerSpeed;

    sab.playerPositionArr[0] = this.x;
    sab.playerPositionArr[1] = this.y;
  }
}

export const player = new Player();
