import consts from '../type/const'
import { ptrToInfo } from './ptrToInfo'
import { Isa, Filter } from './workerGlobal'

export declare class Enemy1Pool {
  // for alias
  cursor: number
  pool: Box2D.b2Body[]
  ptrToIdx: number[]
  disabledList: number[]
  update(): void
  disableByPtr(ptr: number): void
  getIndex(body: Box2D.b2Body): number
  gen(): void
}
let tempIterator = 0
export const createEnemy1Pool = (box2D: typeof Box2D & EmscriptenModule, world: Box2D.b2World, sa: Isa) => {
  const { b2_dynamicBody, b2BodyDef, b2PolygonShape, b2Vec2, getPointer, b2Filter } = box2D

  const square = new b2PolygonShape()
  square.SetAsBox(0.8, 0.6)

  const bd = new b2BodyDef()
  bd.set_type(b2_dynamicBody)

  const tempVec = new b2Vec2(0, 0)
  let currentBody : Box2D.b2Body

  class Enemy1Pool {
    defaultFilter = new b2Filter();

    cursor = 0
    pool = new Array<Box2D.b2Body>(consts.numberOfEnemy1)
    ptrToIdx: number[] = []
    disabledList: number[] = []
    counter = 0
    divide = 30

    constructor () {
      this.defaultFilter.categoryBits = Filter.Enemy1
      this.defaultFilter.maskBits = Filter.AutoAttack1 | Filter.Enemy1 | Filter.Player | Filter.Flame | Filter.Enemy2

      // creating boxes
      for (let i = 0; i < consts.numberOfEnemy1; i++) {
        this.pool[i] = world.CreateBody(bd)
        this.pool[i].CreateFixture(square, 1).SetFriction(0)
        this.pool[i].GetFixtureList().SetRestitution(0)
        this.pool[i].GetFixtureList().SetFilterData(this.defaultFilter)

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
          category: 'enemy',
          type: 'enemy1'
        }
        this.disabledList.push(i)
      }
    }

    update () {
      tempIterator = consts.numberOfEnemy1
      while (tempIterator--) {
        currentBody = this.pool[tempIterator]
        if (currentBody.IsEnabled() === false) continue // skip already dead

        if (sa.enemy1Hps[tempIterator] <= 0) { // check dead
          Atomics.add(sa.kills, 0, 1)
          currentBody.SetEnabled(false)
          this.disabledList.push(tempIterator)
          continue
        }

        // update position in sab of alives
        sa.enemy1Positions.x[tempIterator] = currentBody.GetPosition().x
        sa.enemy1Positions.y[tempIterator] = currentBody.GetPosition().y

        // update direction of enemy towards player
        tempVec.Set(sa.enemy1Directions.x[tempIterator], sa.enemy1Directions.y[tempIterator])
        currentBody.SetLinearVelocity(tempVec)
      }
    }

    disableByPtr (ptr: number) {
      sa.autoAttack1RemainTimes[this.ptrToIdx[ptr]] = 0 // only substraction could be in race condition with this... need atomics?
      this.pool[this.ptrToIdx[ptr]].SetEnabled(false)
    }

    getIndex (body: Box2D.b2Body) {
      return this.ptrToIdx[getPointer(body)]
    }

    gen () {
      if (this.disabledList.length > 0) {
        const genIndex = this.disabledList.pop() as number
        const spawnDistance = Math.random() * 30 + consts.spawnSize / 2
        const spawnAngle = Math.random() * Math.PI * 2
        const spawnDiffX = Math.cos(spawnAngle) * spawnDistance
        const spawnDiffY = Math.sin(spawnAngle) * spawnDistance

        tempVec.Set(sa.playerPosition.x[0] + spawnDiffX, sa.playerPosition.y[0] + spawnDiffY)
        sa.enemy1Positions.x[genIndex] = tempVec.x
        sa.enemy1Positions.y[genIndex] = tempVec.y

        this.pool[genIndex].SetTransform(tempVec, 0)
        this.pool[genIndex].SetEnabled(true)
        sa.enemy1Hps[genIndex] = 10
      }
    }
  }

  const enemy1pool = new Enemy1Pool()
  return enemy1pool
}
