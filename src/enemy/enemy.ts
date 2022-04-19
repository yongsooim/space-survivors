import { autoAttackLifeTime, numberOfAutoAttack, autoAttackLifeTimeBulletSpeed } from '../type/const'
import { shipSprites8, projSprites } from '../resource/resources'
import { Actor, vec, Engine, Sprite, ActorArgs, CollisionType, Entity } from 'excalibur'
import { player } from '../player/player'
import { enemyGroup } from '../collisionGroups'

import Worker from '../worker/enemyCollide?worker'

import Box2DFactory from 'box2d-wasm'

const enemyWorker = new Worker()

const enemySprite = shipSprites8.getSprite(9, 0) as Sprite

const speed = 1200
let initialCounter = 0

export class Enemy extends Actor {
  constructor () {
    // super()
    super({
      width: 8,
      height: 4,
      collisionType: CollisionType.Active
    })
    this.counter = initialCounter++
    if (initialCounter == 120) {
      initialCounter = 0
    }

    this.graphics.use(enemySprite)
    this.scale = vec(20, 20)
    // this.actions.meet(player, speed);
    // this.actions.moveTo(player.pos, speed);
    this.body.bounciness = 0
    this.body.friction = 0
  }

  type = 'enemy1';

  counter = 0;

  onInitialize () {
    this.actions.meet(player, speed)
    this.on('precollision', () => {
      this.collider.useBoxCollider
      this.body.collisionType = CollisionType.Active
    })
  }
}

const numberOfMaximumEnemy = 1000
export class EnemyPool {
  enemyPool = new Array<Enemy>(numberOfMaximumEnemy)

  _cursor = 0;
  set cursor (v: number) {
    if (v >= numberOfMaximumEnemy) {
      this._cursor = 0
    } else {
      this._cursor = v
    }
  }

  get cursor () {
    return this._cursor
  }

  constructor () {
    for (let i = 0; i < numberOfMaximumEnemy; i++) {
      this.enemyPool[i] = new Enemy()
    }
  }

  come (game: Engine) {
    // this.enemyPool[0].pos.x = globalX
    // this.enemyPool[0].pos.y = globalY

    game.add(this.enemyPool[this.cursor])
    this.enemyPool[this.cursor].pos = game.screenToWorldCoordinates(
      vec(10, 10)
    )
    this.cursor++

    /** for worker test */
    const trans = new TextEncoder().encode(JSON.stringify(this.enemyPool.map(v => v.pos)))
    const u8arr = new Uint8Array(trans)

    /** ***** */
  }
}

export const ep = new EnemyPool()
