import { autoAttackLifeTime, numberOfAutoAttack, autoAttackLifeTimeBulletSpeed, enemyGenInterval, numberOfEnemy1 } from "../type/const";
import { shipSprites8, projSprites } from "../resource/resources";
import { Actor, vec, Engine, Sprite, ActorArgs, CollisionType, Entity } from "excalibur";
import { player } from "../player/player";
import { enemyGroup } from "../collisionGroups";
import safeStringify from "fast-safe-stringify";

import stringify from 'fast-safe-stringify'

import Worker from '../worker/enemy1Worker?worker';

import Box2DFactory from 'box2d-wasm';


const enemyWorker = new Worker()


enemyWorker.onmessage = (event) => {
  try {
    let obj = JSON.parse(event.data)
    for (let i = 0; i < 300; i++) {
      ep.enemyPool[i].pos.x = obj[i].x
      ep.enemyPool[i].pos.y = obj[i].y
      
    }

  } catch {
    console.log(' no json ')
    for (let i = 0; i < 300; i++) {
      ep.enemyPool[i].pos.x = event.data.x
      ep.enemyPool[i].pos.y = event.data.y
    }
  }
}


const enemySprite = shipSprites8.getSprite(9, 0) as Sprite

const speed = 1200
let initialCounter = 0

export class Enemy extends Actor {
  constructor() {
    // super()
    super({
      width: 8,
      height: 8,
      collisionType: CollisionType.PreventCollision
    })
    this.counter = initialCounter++
    if (initialCounter === 120) {
      initialCounter = 0
    }

    this.graphics.use(enemySprite)
    this.scale = vec(20, 20)
    //this.actions.meet(player, speed);
    // this.actions.moveTo(player.pos, speed);
    this.body.bounciness = 0
    this.body.friction = 0
  }

  type = 'enemy1';

  counter = 0;

  onInitialize() {
    //this.actions.meet(player, speed)
    //this.on('precollision', () => {
    //  this.body.collisionType = CollisionType.Active
    //})
  }
}

export class EnemyPool extends Entity {
  enemyPool = new Array<Enemy>(numberOfEnemy1);

  _cursor = 0;
  set cursor(v: number) {
    if (v >= numberOfEnemy1) {
      this._cursor = 0
    } else {
      this._cursor = v
    }
  }

  get cursor() {
    return this._cursor
  }

  constructor() {
    super()
    for (let i = 0; i < numberOfEnemy1; i++) {
      this.enemyPool[i] = new Enemy()
    }
  }

  come(game: Engine) {
    // this.enemyPool[0].pos.x = globalX
    // this.enemyPool[0].pos.y = globalY

    if (this.cursor % 100 === 0) console.log(this.cursor)
    game.add(this.enemyPool[this.cursor])
    this.enemyPool[this.cursor].pos = game.screenToWorldCoordinates(
      vec(10, 10)
    )
    this.cursor++

    /** for worker test */
    const trans = new TextEncoder().encode(
      stringify(this.enemyPool.map((v) => v.pos))
    )
    const u8arr = new Uint8Array(trans)

    //enemyWorker.postMessage(stringify(this.enemyPool.map((v) => v.pos)))

    /** ***** */
  }

  counter = 0;
  enemyGenCounter = enemyGenInterval;
  update(game: Engine, delta: number): void {
    this.counter++

    if(this.counter % 100 == 0){ console.log(this.counter)}
    this.enemyGenCounter -= delta

    if (this.enemyGenCounter < 0) {
      // temp.pos = player.pos.add(vec(-20, -20))
      this.enemyGenCounter = enemyGenInterval
      this.come(game)
      
    }
    enemyWorker.postMessage(JSON.stringify({
      x: player.pos.x,
      y: player.pos.y
    }))
  }
  
}

export const ep = new EnemyPool()
