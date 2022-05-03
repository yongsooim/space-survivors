import consts from "../type/const";

export declare class Enemy1Pool { // for alias
  cursor: number
  pool: Box2D.b2Body[]
  ptrToIdx: number[]
  disabledList: number[]
  checkDead(): void
  updateSabPosition(): void
  updateSabPosition(): void
  updateVelocity(): void
  disableByPtr(ptr: number): void
  gen(): void
}

export const createEnemy1Pool = (
  box2D: typeof Box2D & EmscriptenModule,
  world: Box2D.b2World,
  playerPosition: Float64Array,
  autoAttack1Enabled: Int32Array,
  enemy1filter: Box2D.b2Filter,
  enemy1positions: Float64Array,
  enemy1directions: Float64Array,
  enemy1Hps: Int32Array,
  kills: Int32Array
) => {
  const { b2_dynamicBody, b2BodyDef, b2PolygonShape, b2Vec2, getPointer } = box2D;

  const square = new b2PolygonShape();
  square.SetAsBox(0.8, 0.6);

  const bd = new b2BodyDef();
  bd.set_type(b2_dynamicBody);

  let tempIterator = 0;
  let indexDouble = 0;
  let tempVec = new b2Vec2(0, 0);

  class Enemy1Pool {
    cursor = 0;
    pool = new Array<Box2D.b2Body>(consts.numberOfEnemy1);
    ptrToIdx: number[] = []
    disabledList: number[] = []

    constructor() {
      //creating boxes
      for (let i = 0; i < consts.numberOfEnemy1; i++) {
        this.pool[i] = world.CreateBody(bd);
        this.pool[i].CreateFixture(square, 1).SetFriction(0);
        this.pool[i].GetFixtureList().SetRestitution(0);
        this.pool[i].GetFixtureList().SetFilterData(enemy1filter);

        this.pool[i].SetLinearDamping(0);
        this.pool[i].SetAngularDamping(0);
        this.pool[i].SetSleepingAllowed(false);
        tempVec.Set((Math.random() - 0.5) * consts.spawnSize, (Math.random() - 0.5) * consts.spawnSize);
        this.pool[i].SetTransform(tempVec, 0);
        this.pool[i].SetFixedRotation(true);
        this.pool[i].SetAwake(true);
        this.pool[i].SetEnabled(false);

        this.ptrToIdx[getPointer(this.pool[i])] = i;

        this.disabledList.push(i)
      }
    }

    checkDead() {
      tempIterator = consts.numberOfEnemy1;
      while (tempIterator--) {
        if (this.pool[tempIterator].IsEnabled() === false) continue; // skip already dead

        if (enemy1Hps[tempIterator] <= 0) {
          // check enemy dead
          Atomics.add(kills, 0, 1);
          this.pool[tempIterator].SetEnabled(false);
          this.disabledList.push(tempIterator);
        }
      }
    }

    updateSabPosition() {
      // position to render in sab
      // update shared memory buffer
      tempIterator = consts.numberOfEnemy1;
      while (tempIterator--) {
        if (this.pool[tempIterator].IsEnabled() === false) continue; // skip dead
        indexDouble = tempIterator * 2;
        enemy1positions[indexDouble] = this.pool[tempIterator].GetPosition().x;
        enemy1positions[indexDouble + 1] = this.pool[tempIterator].GetPosition().y;
      }
    }

    updateVelocity() {
      // position to render in sab
      // update shared memory buffer
      tempIterator = consts.numberOfEnemy1;
      while (tempIterator--) {
        indexDouble = tempIterator * 2;
        tempVec.set_x(enemy1directions[indexDouble]);
        tempVec.set_y(enemy1directions[indexDouble + 1]);
        this.pool[tempIterator].SetLinearVelocity(tempVec);
      }
    }

    disableByPtr(ptr: number) {
      autoAttack1Enabled[this.ptrToIdx[ptr]] = 0;
      this.pool[this.ptrToIdx[ptr]].SetEnabled(false);
    }

    gen() {
      if (this.disabledList.length > 0) {
        let genIndex = this.disabledList.pop() as number;
        if (enemy1Hps[genIndex] <= 0) {
          let tempDistance = Math.random() * 10 + consts.spawnSize / 2;
          let tempAngle = Math.random() * Math.PI * 2;
          let tempDiffX = Math.cos(tempAngle) * tempDistance;
          let tempDiffY = Math.sin(tempAngle) * tempDistance;

          tempVec.x = playerPosition[0] + tempDiffX;
          tempVec.y = playerPosition[1] + tempDiffY;

          enemy1positions[genIndex * 2] = tempVec.x;
          enemy1positions[genIndex * 2 + 1] = tempVec.y;
          enemy1Hps[genIndex] = 10;

          this.pool[genIndex].SetTransform(tempVec, 0);
          this.pool[genIndex].SetEnabled(true);
        }
      }
    }
  }

  const enemy1pool = new Enemy1Pool();
  return enemy1pool;
};
