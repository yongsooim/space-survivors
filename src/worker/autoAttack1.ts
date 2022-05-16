import consts from '../type/const'
import { ptrToInfo } from './ptrToInfo'
import { Filter, Isa } from './workerGlobal'

export declare class AutoAttack1Pool {
  cursor: number
  pool: Box2D.b2Body[]
  ptrToIdx: number[]
  update(): void
  disableByPtr(ptr: number): void
  fire(): void
}

export const createAutoAttack1Pool = (box2D: typeof Box2D & EmscriptenModule, world: Box2D.b2World, sa: Isa) => {
  const { b2_dynamicBody, b2BodyDef, b2PolygonShape, b2Vec2, getPointer, b2Filter } = box2D

  const autoAttack1Filter = new b2Filter()
  autoAttack1Filter.categoryBits = Filter.AutoAttack1
  autoAttack1Filter.maskBits = Filter.Enemy1 | Filter.Enemy2

  const square = new b2PolygonShape()
  square.SetAsBox(0.8, 0.6)

  const bd = new b2BodyDef()
  bd.set_type(b2_dynamicBody)

  let tempIterator = 0
  const tempVec = new b2Vec2(0, 0)

  class AutoAttack1Pool {
    cursor = 0
    pool = new Array<Box2D.b2Body>(consts.numberOfAutoAttack1)
    ptrToIdx: number[] = []

    constructor () {
      // creating boxes
      for (let i = 0; i < consts.numberOfAutoAttack1; i++) {
        this.pool[i] = world.CreateBody(bd)
        this.pool[i].CreateFixture(square, 1).SetFriction(0)
        this.pool[i].GetFixtureList().SetRestitution(0)
        this.pool[i].GetFixtureList().SetFilterData(autoAttack1Filter)
        this.pool[i].GetFixtureList().SetSensor(true)

        this.pool[i].SetLinearDamping(0)
        this.pool[i].SetAngularDamping(0)
        this.pool[i].SetSleepingAllowed(false)
        tempVec.Set((Math.random() - 0.5) * consts.spawnSize, (Math.random() - 0.5) * consts.spawnSize)
        this.pool[i].SetTransform(tempVec, 0)
        this.pool[i].SetFixedRotation(true)
        this.pool[i].SetAwake(true)
        this.pool[i].SetEnabled(false)

        this.ptrToIdx[getPointer(this.pool[i])] = i
        ptrToInfo[getPointer(this.pool[i])] = {
          category: 'weapon',
          type: 'autoAttack1',
          attribute: 'bullet',
          damage: 5
        }
      }
    }

    update () {
      tempIterator = consts.numberOfAutoAttack1
      while (tempIterator--) {
        if (this.pool[tempIterator].IsEnabled() === false) continue // skip dead
        if (sa.autoAttack1RemainTimes[tempIterator] <= 0) {
          this.pool[tempIterator].SetEnabled(false)
          continue
        }

        sa.autoAttack1Positions.x[tempIterator] = this.pool[tempIterator].GetPosition().x
        sa.autoAttack1Positions.y[tempIterator] = this.pool[tempIterator].GetPosition().y
      }
    }

    disableByPtr (ptr: number) {
      sa.autoAttack1RemainTimes[this.ptrToIdx[ptr]] = 0
      this.pool[this.ptrToIdx[ptr]].SetEnabled(false)
    }

    fire () {
      this.cursor++
      if (this.cursor >= consts.numberOfAutoAttack1) {
        this.cursor = 0
      }

      tempVec.x = sa.playerPosition.x[0] - 0.1
      tempVec.y = sa.playerPosition.y[0] - 1
      sa.autoAttack1Positions.x[this.cursor] = sa.playerPosition.x[0] - 0.1
      sa.autoAttack1Positions.y[this.cursor] = sa.playerPosition.y[0] - 1
      this.pool[this.cursor].SetTransform(tempVec, 0)
      sa.autoAttack1RemainTimes[this.cursor] = 2000

      tempVec.x = 0
      tempVec.y = -consts.autoAttack1Speed
      this.pool[this.cursor].SetLinearVelocity(tempVec)
      this.pool[this.cursor].SetEnabled(true)
      this.pool[this.cursor].GetFixtureList().SetFilterData(autoAttack1Filter)
    }
  }

  const autoAttack1pool = new AutoAttack1Pool()
  return autoAttack1pool
}
