import consts from '../type/const'
import { ptrToInfo } from './ptrToInfo'
import { Filter, Isa } from './workerGlobal'

export declare class Flame1Pool {
  cursor: number
  pool: Box2D.b2Body[]
  ptrToIdx: number[]
  update(): void
  disableByPtr(ptr: number): void
  fire(): void
}
let tempIterator = 0
export const createFlame1Pool = (box2D: typeof Box2D & EmscriptenModule, world: Box2D.b2World, sa: Isa) => {
  const { b2_dynamicBody, b2BodyDef, b2PolygonShape, b2Vec2, getPointer, b2Filter } = box2D

  const flame1Filter = new b2Filter()
  flame1Filter.categoryBits = Filter.Flame
  flame1Filter.maskBits = Filter.Enemy1 | Filter.Enemy2
  flame1Filter.groupIndex = 0

  const square = new b2PolygonShape()
  square.SetAsBox(0.6, 0.8)

  const bd = new b2BodyDef()
  bd.set_type(b2_dynamicBody)

  const tempVec = new b2Vec2(0, 0)

  class Flame1Pool {
    cursor = 0;
    pool = new Array<Box2D.b2Body>(consts.numberOfFlame1)
    ptrToIdx: number[] = []

    constructor () {
      // creating boxes

      for (let i = 0; i < consts.numberOfFlame1; i++) {
        this.pool[i] = world.CreateBody(bd)
        this.pool[i].CreateFixture(square, 1).SetFriction(0)
        this.pool[i].GetFixtureList().SetRestitution(0)
        this.pool[i].GetFixtureList().SetFilterData(flame1Filter)
        this.pool[i].GetFixtureList().SetSensor(true)

        this.pool[i].SetLinearDamping(0)
        this.pool[i].SetAngularDamping(0)
        this.pool[i].SetSleepingAllowed(false)
        this.pool[i].SetTransform(tempVec, 0)
        this.pool[i].SetFixedRotation(true)
        this.pool[i].SetAwake(true)
        this.pool[i].SetEnabled(false)

        this.ptrToIdx[getPointer(this.pool[i])] = i
        ptrToInfo[getPointer(this.pool[i])] = {
          category: 'weapon',
          type: 'flame1',
          attribute: 'splash',
          damage: 8
        }
      }
    }

    update () {
      tempIterator = 0

      tempIterator = consts.numberOfFlame1
      while (tempIterator--) {
        if (this.pool[tempIterator].IsEnabled() === false) continue // skip dead
        if (sa.flame1RemainTimes[tempIterator] <= 0) {
          this.pool[tempIterator].SetEnabled(false)
          continue
        }
        sa.flame1Positions.x[tempIterator] = this.pool[tempIterator].GetPosition().x
        sa.flame1Positions.y[tempIterator] = this.pool[tempIterator].GetPosition().y
      }
    }

    disableByPtr (ptr: number) {
      sa.flame1RemainTimes[this.ptrToIdx[ptr]] = 0
      this.pool[this.ptrToIdx[ptr]].SetEnabled(false)
    }

    fire () {
      this.cursor++
      if (this.cursor >= consts.numberOfFlame1) {
        this.cursor = 0
      }

      const tempPlayerPosX = sa.playerPosition.x[0]
      const tempPlayerPosY = sa.playerPosition.y[0]

      tempVec.Set(tempPlayerPosX - 0.1, tempPlayerPosY + 0.5)
      this.pool[this.cursor].SetTransform(tempVec, 0)
      sa.flame1Positions.x[this.cursor] = tempPlayerPosX
      sa.flame1Positions.y[this.cursor] = tempPlayerPosY
      this.pool[this.cursor].SetTransform(tempVec, 0)
      sa.flame1RemainTimes[this.cursor] = 400

      tempVec.Set(0, consts.flame1Speed)
      this.pool[this.cursor].SetLinearVelocity(tempVec)
      this.pool[this.cursor].GetFixtureList().SetFilterData(flame1Filter)
      this.pool[this.cursor].SetEnabled(true)
    }
  }

  const flame1pool = new Flame1Pool()
  return flame1pool
}
