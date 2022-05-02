
import Box2DFactory from 'box2d-wasm'; // ....
import consts from '../type/const';
import { world, Filter, playerPosition, autoAttack1Positions, autoAttack1Enabled, autoAttack1filter } from './worker1'

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  locateFile: (url) => {
    return '/assets/' + url; // for dev
  },
});

const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, getPointer, b2Filter } = box2D;

const zero = new b2Vec2(0, 0);
const center = new b2Vec2(0.5, 0.5);
const square = new b2PolygonShape();
square.SetAsBox(0.8, 0.6);

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);

let tempIterator = 0
let indexDouble = 0
let tempVec = new b2Vec2(0, 0)

class AutoAttack1Pool {
  cursor = 0
  pool = new Array<Box2D.b2Body>(consts.numberOfAutoAttack1);
  ptrToIdx = {} as any;

  constructor() {
    //creating boxes
    square.SetAsBox(0.4, 0.4);
    for (let i = 0; i < consts.numberOfAutoAttack1; i++) {
      this.pool[i] = world.CreateBody(bd);
      this.pool[i].CreateFixture(square, 5).SetFriction(0);
      this.pool[i].GetFixtureList().SetRestitution(0);
      this.pool[i].GetFixtureList().SetFilterData(autoAttack1filter);
      this.pool[i].GetFixtureList().SetSensor(true);

      this.pool[i].SetLinearDamping(0);
      this.pool[i].SetAngularDamping(0);
      this.pool[i].SetSleepingAllowed(false);
      this.pool[i].SetFixedRotation(false);
      this.pool[i].SetAwake(true);
      this.pool[i].SetBullet(true);
      this.pool[i].SetEnabled(false);

      this.ptrToIdx[getPointer(this.pool[i])] = i;
    }
  }

  updateSabPosition() { // position to render in sab
    tempIterator = consts.numberOfAutoAttack1;
    while (tempIterator--) {
      if (autoAttack1Enabled[tempIterator] === 0) continue; // skip disabled

      indexDouble = tempIterator * 2;
      autoAttack1Positions[indexDouble] = this.pool[tempIterator].GetPosition().x;
      autoAttack1Positions[indexDouble + 1] = this.pool[tempIterator].GetPosition().y;
    }
  }

  fire() {
    this.cursor++;
    if (this.cursor === consts.numberOfAutoAttack1) {
      this.cursor = 0;
    }

    // add sab to render
    autoAttack1Positions[this.cursor * 2] = playerPosition[0] - 0.1;
    autoAttack1Positions[this.cursor * 2 + 1] = tempVec.y - 1

    // update body
    this.pool[this.cursor].SetTransform(tempVec, 0);

    // set speed
    tempVec.x = 0;
    tempVec.y = -consts.autoAttack1Speed;
    this.pool[this.cursor].SetLinearVelocity(tempVec);

    // enable
    autoAttack1Enabled[this.cursor] = 1;
    this.pool[this.cursor].SetEnabled(true);
    this.pool[this.cursor].GetFixtureList().SetFilterData(autoAttack1filter);
  }
  disableByPtr(ptr: number) {
    autoAttack1Enabled[this.ptrToIdx[ptr]] = 0;
    this.pool[this.ptrToIdx[ptr]].SetEnabled(false);
  }
}

export function createAutoAttack1Pool() {
  return new AutoAttack1Pool()
}
