import { autoAttackLifeTime, numberOfAutoAttack, autoAttackLifeTimeBulletSpeed } from '../type/const'
import { shipSprites16, projSprites, Resources } from '../resource/resources'
import { Actor, vec, Engine, Sprite, ActorArgs, CollisionType } from 'excalibur'
import { player } from './player'
import { Enemy } from '../enemy/enemy'
import { weaponCanCollideWith, weaponGroup } from '../collisionGroups'

const lv1autoAttack = projSprites.getSprite(4, 0) as Sprite
class AutoAttackBullet extends Actor {
  remainLifeTime = 0;
  constructor () {
    super({
      width: 4,
      height: 4,
      collisionType: CollisionType.Passive,
      collisionGroup: weaponGroup,
      scale: vec(10, 10)
    })
    //    this.collider.useCircleCollider(4)
  }

  onInitialize () {
    this.on('precollision', (evt) => {
      if ((evt.other as Enemy).type == 'enemy1') {
        evt.other.kill()
        this.kill()
      }
    })
  }

  fire (game: Engine) {
    this.remainLifeTime = autoAttackLifeTime
    this.pos = player.pos.add(vec(0, -4))
    // this.graphics.use(lv1autoAttack)
    game.add(this)
  }

  update (game: Engine, delta: number) {
    this.remainLifeTime -= delta
    if (this.remainLifeTime < 0) {
      this.kill()
    }
  }
}

export class AutoAttackPool {
  public autoAttackPoolArr = [] as AutoAttackBullet[];
  private _poolQuePointer = 0;
  get poolQuePointer () {
    return this._poolQuePointer
  }

  set poolQuePointer (v: number) {
    if (v >= 0 && v < numberOfAutoAttack) {
      this._poolQuePointer = v
    } else {
      this._poolQuePointer = 0
    }
  }

  constructor () {
    for (let i = 0; i < numberOfAutoAttack; i++) {
      this.autoAttackPoolArr[i] = new AutoAttackBullet()
      this.autoAttackPoolArr[i].graphics.use(lv1autoAttack)
      this.autoAttackPoolArr[i].vel = vec(0, -autoAttackLifeTimeBulletSpeed)
    }
  }

  fire (game: Engine, ship: Actor) {
    // game.add(this.autoAttackPoolArr[this._poolQuePointer++]);
    this.poolQuePointer++
    this.autoAttackPoolArr[this.poolQuePointer].fire(game)
    Resources.fire.volume = 0.01
    Resources.fire.play()
  }
}
