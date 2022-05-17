import { Container } from 'pixi.js'
import { textures } from '../resource/spriteManage'
import * as PIXI from 'pixi.js'
import { input } from '../input/input'
import { Direction } from '../type/type'
import consts from '../type/const'
import sab from '../worker/sabManage'
import { Vector } from '../class/Vector'
import { keyboard, Keys } from '../input/keyboard'
import { viewport } from '../viewport/viewport'
import { initEmitter, emitter } from './fire-emit'
import { worker1fire, worker1flame, worker1missile } from '../worker/worker1master'
import { explosion } from './explosion'
import { sound } from '@pixi/sound'

class Player extends Container {
  level = 0
  speed = 350
  vector = new Vector(0, 0)
  positionVector = new Vector(0, 0)
  life = 10000
  hitRedRemain = 0

  playerSpriteCenter = new PIXI.Sprite(textures.ship1)
  playerSpriteLeft = new PIXI.Sprite(textures.ship1Left)
  playerSpriteRight = new PIXI.Sprite(textures.ship1Right)
  constructor () {
    super()
    this.position.set(0)
    this.playerSpriteCenter.position.set(0)
    this.playerSpriteCenter.scale.set(0.2, 0.2)
    this.playerSpriteCenter.anchor.set(0.5)

    this.playerSpriteLeft.position.set(0)
    this.playerSpriteLeft.scale.set(0.2, 0.2)
    this.playerSpriteLeft.visible = false
    this.playerSpriteLeft.anchor.set(0.5)

    this.playerSpriteRight.position.set(0)
    this.playerSpriteRight.scale.set(0.2, 0.2)
    this.playerSpriteRight.visible = false
    this.playerSpriteRight.anchor.set(0.5)

    // this.playerSprite.rotation = Math.PI
    // this.playerSprite.cacheAsBitmap = false
    this.playerSpriteCenter.zIndex = 999

    this.addChild(this.playerSpriteCenter)
    this.addChild(this.playerSpriteLeft)
    this.addChild(this.playerSpriteRight)
  }

  init () {
    initEmitter()
    // explosion.init
  }

  update (delta: number) {

    this.hitRedRemain -= delta

    if(this.hitRedRemain <= 0) {
      this.hitRedRemain = 0
      this.playerSpriteCenter.tint = 0xffffff
    }

    this.checkInput(delta)

    // if (this.vector.size >= 0.3) {
    //  if ((Math.PI * 7) / 8 <= this.vector.toAngle() && this.vector.toAngle() < (Math.PI * 9) / 8) {
    //    this.playerSpriteLeft.visible = true;
    //    this.playerSpriteCenter.visible = false;
    //    this.playerSpriteRight.visible = false;
    //  } else if (Math.abs(this.vector.toAngle()) <= Math.PI / 8) {
    //    this.playerSpriteLeft.visible = false;
    //    this.playerSpriteCenter.visible = false;
    //    this.playerSpriteRight.visible = true;
    //  } else {
    //    this.playerSpriteLeft.visible = false;
    //    this.playerSpriteCenter.visible = true;
    //    this.playerSpriteRight.visible = false;
    //  }
    // }
  }

  fire () {
    worker1fire()
  }

  flame () {
    worker1flame()
    worker1missile()
    sound.volume('flamewav', 0.4)
    sound.play('flamewav')
    emitter.maxLifetime = 0.5
    setTimeout(() => {
      emitter.maxLifetime = 0.1
    }, 250)
  }

  hit () {
    this.playerSpriteCenter.tint = 0xff0000
    this.hitRedRemain = 30
  }

  checkInput (delta: number) {
    if (input.vector.x === 0 && input.vector.y === 0) { // if no touch input
      // keyboard
      this.vector.x = 0
      this.vector.y = 0
      if (input.isDirectionPressed(Direction.Up)) {
        this.vector.y -= 1
      }
      if (input.isDirectionPressed(Direction.Down)) {
        this.vector.y += 1
      }
      if (input.isDirectionPressed(Direction.Left)) {
        this.vector.x -= 1
      }
      if (input.isDirectionPressed(Direction.Right)) {
        this.vector.x += 1
      }
      if (input.isDirectionPressed(Direction.UpLeft)) {
        this.vector.y -= 1
        this.vector.x -= 1
      }
      if (input.isDirectionPressed(Direction.UpRight)) {
        this.vector.y -= 1
        this.vector.x += 1
      }
      if (input.isDirectionPressed(Direction.DownLeft)) {
        this.vector.y += 1
        this.vector.x -= 1
      }
      if (input.isDirectionPressed(Direction.DownRight)) {
        this.vector.y += 1
        this.vector.x += 1
      }

      if (this.vector.x !== 0 || this.vector.y !== 0) {
        this.vector = this.vector.normalize()
      }
    } else {
      // touch
      this.vector.x = input.vector.x
      this.vector.y = -input.vector.y
    }

    this.position.x += this.vector.x * delta * consts.playerSpeed
    this.position.y += this.vector.y * delta * consts.playerSpeed

    if (this.position.x >= consts.mapSize) {
      this.position.x = consts.mapSize
    } else if (this.position.x <= -consts.mapSize) {
      this.position.x = -consts.mapSize
    }

    if (this.position.y >= consts.mapSize) {
      this.position.y = consts.mapSize
    } else if (this.position.y <= -consts.mapSize) {
      this.position.y = -consts.mapSize
    }

    sab.playerPositionArr.x[0] = this.x
    sab.playerPositionArr.y[0] = this.y
  }
}

export const player = new Player()
