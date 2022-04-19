import { Actor, vec, Engine, Sprite, ActorArgs, CollisionType, CollisionGroup, CollisionGroupManager, Text, Animation, AnimationStrategy } from 'excalibur'
import { miscSprites8, shipSprites16, projSprites } from '../resource/resources'
import { Direction, input } from '../input/input'
import { game } from '../main'
import { AutoAttackPool } from './autoAttack'
import { Enemy, EnemyPool, ep } from '../enemy/enemy'
import { playersCanCollideWith, playerGroup } from '../collisionGroups'

const boom = new Animation({
  frames: [
    { graphic: miscSprites8.getSprite(10, 6) as Sprite, duration: 150 },
    { graphic: miscSprites8.getSprite(11, 6) as Sprite, duration: 150 },
    { graphic: miscSprites8.getSprite(12, 6) as Sprite, duration: 150 }
  ],
  strategy: AnimationStrategy.End
})

boom.scale = vec(3, 3)
boom.opacity = 0.7

export class Player extends Actor {
  public hp = 100;
  public speed = 100;
  public ship = 'frigate';
  public direction = Direction.Up;
  public autoAttackInterval = 400; // ms
  public autoAttackCounter = this.autoAttackInterval;
  public enemyGenInterval = 1;
  public enemyGenCounter = this.enemyGenInterval;

  constructor () {
    super({
      pos: vec(150, 150),
      width: 12,
      height: 12,
      collisionType: CollisionType.Passive,
      collisionGroup: playersCanCollideWith,
      scale: vec(10, 10)
    })
    // this.scale = vec(2, 2)
  }

  onInitialize () {
    this.graphics.layers.create({ name: 'boom', order: 10 })
    const myShip = shipSprites16.getSprite(2, 4) as Sprite
    this.graphics.use(myShip)
    this.on('pointerup', () => {
      alert('yo')
    })
    this.rotation = Math.PI

    this.on('precollision', (evt) => {
      if ((evt.other as Enemy).type === 'enemy1') {
        boom.reset()
        this.graphics.layers.get('boom').use(boom).reset()
        evt.other.kill()
      }
    })
  }

  public targetRotation = 0;
  public oldDelta = 0;
  public aap = new AutoAttackPool();

  update (game: Engine, delta: number) {
    if (this.oldDelta !== delta) {
      console.log(this.oldDelta)
      this.oldDelta = delta
    }

    this.autoAttackCounter -= delta
    if (this.autoAttackCounter < 0) {
      this.aap.fire(game, this)
      this.autoAttackCounter += this.autoAttackInterval
    }

    this.vel = vec(0, 0)

    if (
      input.isDirectionPressed(Direction.Up) ||
      input.isDirectionPressed(Direction.UpLeft) ||
      input.isDirectionPressed(Direction.UpRight)
    ) {
      this.vel.y -= this.speed * delta
    }
    if (
      input.isDirectionPressed(Direction.Down) ||
      input.isDirectionPressed(Direction.DownLeft) ||
      input.isDirectionPressed(Direction.DownRight)
    ) {
      this.vel.y += this.speed * delta
    }
    if (
      input.isDirectionPressed(Direction.Left) ||
      input.isDirectionPressed(Direction.UpLeft) ||
      input.isDirectionPressed(Direction.DownLeft)
    ) {
      this.vel.x -= this.speed * delta
    }
    if (
      input.isDirectionPressed(Direction.Right) ||
      input.isDirectionPressed(Direction.UpRight) ||
      input.isDirectionPressed(Direction.DownRight)
    ) {
      this.vel.x += this.speed * delta
    }

    this.enemyGenCounter -= delta

    if (this.enemyGenCounter < 0) {
      // temp.pos = player.pos.add(vec(-20, -20))
      this.enemyGenCounter = this.enemyGenInterval
      ep.come(game)
    }
  }

  counter = 0
}

export const player = new Player()

const hpBar = new Text({ text: 'hp : 100' })
