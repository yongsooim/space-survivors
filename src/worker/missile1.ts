import consts from '../type/const'
import { Filter, Isa } from './workerGlobal'

export declare class Missile1Pool {
  cursor: number
  pool: Box2D.b2Body[]
  ptrToIdx: number[]
  updateSabPosition(): void
  disableByPtr(ptr: number): void
  fire(): void
}
let tempIterator = 0
export const createMissile1Pool = (box2D: typeof Box2D & EmscriptenModule, world: Box2D.b2World, sa: Isa) => {
  const { b2_dynamicBody, b2BodyDef, b2PolygonShape, b2Vec2, getPointer, b2Filter } = box2D

  const missile1Filter = new b2Filter()
  missile1Filter.categoryBits = Filter.Missile1
  missile1Filter.maskBits = Filter.Enemy1
  missile1Filter.groupIndex = 0

  const square = new b2PolygonShape()
  square.SetAsBox(0.8, 0.6)

  const bd = new b2BodyDef()
  bd.set_type(b2_dynamicBody)

  const tempVec = new b2Vec2(0, 0)

  class Missile1Pool {
    cursor = 0;
    pool = new Array<Box2D.b2Body>(consts.numberOfMissile1)
    ptrToIdx: number[] = []

    constructor () {
      // creating boxes

      for (let i = 0; i < consts.numberOfMissile1; i++) {
        this.pool[i] = world.CreateBody(bd)
        this.pool[i].CreateFixture(square, 1).SetFriction(0)
        this.pool[i].GetFixtureList().SetRestitution(0)
        this.pool[i].GetFixtureList().SetFilterData(missile1Filter)
        this.pool[i].GetFixtureList().SetSensor(true)

        this.pool[i].SetLinearDamping(0)
        this.pool[i].SetAngularDamping(0)
        this.pool[i].SetSleepingAllowed(false)
        this.pool[i].SetTransform(tempVec, 0)
        this.pool[i].SetFixedRotation(true)
        this.pool[i].SetAwake(true)
        this.pool[i].SetEnabled(false)

        this.ptrToIdx[getPointer(this.pool[i])] = i
      }
    }

    updateSabPosition () {
      tempIterator = 0

      tempIterator = consts.numberOfMissile1
      while (tempIterator--) {
        if (this.pool[tempIterator].IsEnabled() === false) continue // skip dead
        sa.missile1Positions.x[tempIterator] = this.pool[tempIterator].GetPosition().x
        sa.missile1Positions.y[tempIterator] = this.pool[tempIterator].GetPosition().y
      }
    }

    disableByPtr (ptr: number) {
      sa.missile1RemainTimes[this.ptrToIdx[ptr]] = 0
      this.pool[this.ptrToIdx[ptr]].SetEnabled(false)
    }

    fire () {
      this.cursor++
      if (this.cursor >= consts.numberOfMissile1) {
        this.cursor = 0
      }

      const tempPlayerPosX = sa.playerPosition.x[0]
      const tempPlayerPosY = sa.playerPosition.y[0]

      tempVec.Set(tempPlayerPosX - 0.1, tempPlayerPosY + 0.5)
      this.pool[this.cursor].SetTransform(tempVec, 0)
      sa.missile1Positions.x[this.cursor] = tempPlayerPosX
      sa.missile1Positions.y[this.cursor] = tempPlayerPosY
      this.pool[this.cursor].SetTransform(tempVec, 0)
      sa.missile1RemainTimes[this.cursor] = 1

      tempVec.Set(consts.missile1Speed, 0)
      this.pool[this.cursor].SetLinearVelocity(tempVec)
      this.pool[this.cursor].GetFixtureList().SetFilterData(missile1Filter)
      this.pool[this.cursor].SetEnabled(true)
    }
  }

  const missile1pool = new Missile1Pool()
  return missile1pool
}
