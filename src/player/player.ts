import { Container } from "pixi.js";
import { textures } from "../resource/spriteManage";
import * as PIXI from "pixi.js";
import { input } from "../input/input";
import { Direction } from "../type/type";
import { playerSpeed } from "../type/const";
import sabWorker1 from "../worker/sabManage";
import { Vector } from "../class/Vector";
import { keyboard, Keys } from "../input/keyboard";
import { viewport } from "../viewport/viewport";
import { aaPool } from "../weapon/autoAttack1";
import { emitter } from './fire-emit'
class Player extends Container {
  speed = 350;
  vector = new Vector(0, 0);
  positionVector = new Vector(0, 0);
  emitter = emitter

  playerSprite = new PIXI.Sprite(textures.ship1);
  constructor() {
    super();
    this.x = 100;
    this.y = 100;
    this.playerSprite.x = 0;
    this.playerSprite.y = 0;
    this.playerSprite.scale.x = 0.1;
    this.playerSprite.scale.y = 0.1;
    this.playerSprite.rotation = Math.PI;
    this.playerSprite.cacheAsBitmap = true;
    this.playerSprite.anchor.x = 0.5;
    this.playerSprite.anchor.y = 0.5;
    this.addChild(this.playerSprite);
  }

  update(delta: number) {
    if (input.vector.x === 0 && input.vector.y === 0) {
      // keyboard
      this.vector.x = 0;
      this.vector.y = 0;
      if (input.isDirectionPressed(Direction.Up)) {
        this.vector.y += 1;
      }
      if (input.isDirectionPressed(Direction.Down)) {
        this.vector.y -= 1;
      }
      if (input.isDirectionPressed(Direction.Left)) {
        this.vector.x -= 1;
      }
      if (input.isDirectionPressed(Direction.Right)) {
        this.vector.x += 1;
      }
      if (input.isDirectionPressed(Direction.UpLeft)) {
        this.vector.y += 1;
        this.vector.x -= 1;
      }
      if (input.isDirectionPressed(Direction.UpRight)) {
        this.vector.y += 1;
        this.vector.x += 1;
      }
      if (input.isDirectionPressed(Direction.DownLeft)) {
        this.vector.y -= 1;
        this.vector.x -= 1;
      }
      if (input.isDirectionPressed(Direction.DownRight)) {
        this.vector.y -= 1;
        this.vector.x += 1;
      }

      if (this.vector.x !== 0 || this.vector.y !== 0) {
        this.vector = this.vector.normalize();
      }
    } else {
      // touch
      this.vector.x = input.vector.x;
      this.vector.y = input.vector.y;
    }

    this.position.x += this.vector.x * delta * playerSpeed;
    this.position.y -= this.vector.y * delta * playerSpeed;

    sabWorker1.playerPositionArr[0] = this.x;
    sabWorker1.playerPositionArr[1] = this.y;


    if(this.emitter){
      this.emitter.updateSpawnPos(this.x, this.y)
    }
  }

  fire() {
    aaPool.fire(this.x, this.y);
  }
}

export const player = new Player();
