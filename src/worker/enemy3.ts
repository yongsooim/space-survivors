import consts from '../type/const'
import { Isa, Filter } from './workerGlobal'

export declare class Enemy3Pool {
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
export const createEnemy3Pool = (box2D: typeof Box2D & EmscriptenModule, world: Box2D.b2World, sa: Isa) => {
  const { b2_dynamicBody, b2BodyDef, b2PolygonShape, b2Vec2, getPointer, b2Filter } = box2D

  const square = new b2PolygonShape()
  square.SetAsBox(0.8, 0.6)

  const bd = new b2BodyDef()
  bd.set_type(b2_dynamicBody)

  const tempVec = new b2Vec2(0, 0)
  let tempBody: Box2D.b2Body

  class Enemy3Pool {
    defaultFilter = new b2Filter();

    cursor = 0
    pool = new Array<Box2D.b2Body>(consts.numberOfEnemy3)
    ptrToIdx: number[] = []
    disabledList: number[] = []

    constructor () {
      this.defaultFilter.categoryBits = Filter.Enemy3
      this.defaultFilter.maskBits = Filter.AutoAttack1 | Filter.Enemy3 | Filter.Player | Filter.Flame | Filter.Enemy1
      this.defaultFilter.groupIndex = 0

      // creating boxes
      for (let i = 0; i < consts.numberOfEnemy3; i++) {
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

        this.disabledList.push(i)
      }
    }

    update () {
      tempIterator = consts.numberOfEnemy3
      while (tempIterator--) {
        tempBody = this.pool[tempIterator]
        if (tempBody.IsEnabled() === false) continue // skip already dead

        if (sa.enemy3Hps[tempIterator] <= 0) { // check dead
          Atomics.add(sa.kills, 0, 1)
          tempBody.SetEnabled(false)
          this.disabledList.push(tempIterator)
          continue
        }

        // update position of alives
        sa.enemy3Positions.x[tempIterator] = tempBody.GetPosition().x
        sa.enemy3Positions.y[tempIterator] = tempBody.GetPosition().y

        // update velocity of alives
        tempVec.Set(sa.enemy3Directions.x[tempIterator], sa.enemy3Directions.y[tempIterator])
        tempBody.SetLinearVelocity(tempVec)
      }
    }

    disableByPtr (ptr: number) {
      sa.autoAttack1RemainTimes[this.ptrToIdx[ptr]] = 0
      this.pool[this.ptrToIdx[ptr]].SetEnabled(false)
    }

    getIndex (body: Box2D.b2Body) {
      return this.ptrToIdx[getPointer(body)]
    }

    gen () {
      if (this.disabledList.length > 0) {
        const genIndex = this.disabledList.pop() as number
        const spawnDistance = Math.random() * 10 + consts.spawnSize / 2
        const spawnAngle = Math.random() * Math.PI * 2
        const spawnDiffX = Math.cos(spawnAngle) * spawnDistance
        const spawnDiffY = Math.sin(spawnAngle) * spawnDistance

        tempVec.x = sa.playerPosition.x[0] + spawnDiffX
        tempVec.y = sa.playerPosition.y[0] + spawnDiffY
        sa.enemy3Positions.x[genIndex] = tempVec.x
        sa.enemy3Positions.y[genIndex] = tempVec.y

        this.pool[genIndex].SetTransform(tempVec, 0)
        this.pool[genIndex].SetEnabled(true)
        sa.enemy3Hps[genIndex] = 10
      }
    }
  }

  const enemy3pool = new Enemy3Pool()
  return enemy3pool
}
