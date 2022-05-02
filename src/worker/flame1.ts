
import Box2DFactory from 'box2d-wasm'; // ....
import consts from '../type/const';
import { world, Filter, playerPosition, flame1Positions, flame1Enabled, flame1Filter } from './worker1'

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  ///
  // By default, this looks for Box2D.wasm relative to public/build/bundle.js:
  // @example (url, scriptDirectory) => `${scriptDirectory}${url}`
  // But we want to look for Box2D.wasm relative to public/index.html instead.
  //
  // locateFile: (url, scriptDirectory) => {
  locateFile: (url) => {
    // console.log('url in main  :  ' + url)
    // console.log('scriptDirectory in main  :  ' + scriptDirectory)
    // console.log('findng at in main  :  ./assets/' + url)
    //return './' + url  // for build, dist
    // console.log(scriptDirectory)
    return '/assets/' + url; // for dev
  },
});

const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, getPointer, b2Filter } = box2D;

const square = new b2PolygonShape();
square.SetAsBox(0.8, 0.6);

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);

let tempIterator = 0
let indexDouble = 0
let tempVec = new b2Vec2(0, 0)

class Flame1Pool {
  cursor = 0
  pool = new Array<Box2D.b2Body>(consts.numberOfFlame1);
  ptrToIdx = {} as any;
  filter = new b2Filter()
  constructor() {
    this.filter.categoryBits = Filter.Flame;
    this.filter.maskBits = Filter.Enemy1;
    this.filter.groupIndex = 0;
    
    //creating boxes
    square.SetAsBox(0.4, 0.4);
    for (let i = 0; i < consts.numberOfFlame1; i++) {
      this.pool[i] = world.CreateBody(bd);
      this.pool[i].CreateFixture(square, 5).SetFriction(0);
      this.pool[i].GetFixtureList().SetRestitution(0);
      this.pool[i].GetFixtureList().SetFilterData(this.filter);
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
    tempIterator = consts.numberOfFlame1;
    while (tempIterator--) {
      if (flame1Enabled[tempIterator] === 0) continue; // skip disabled

      indexDouble = tempIterator * 2;
      flame1Positions[indexDouble] = this.pool[tempIterator].GetPosition().x;
      flame1Positions[indexDouble + 1] = this.pool[tempIterator].GetPosition().y;
    }
  }

  fire() {
    this.cursor++;
    if (this.cursor === consts.numberOfFlame1) {
      this.cursor = 0;
    }

    // add sab to render
    flame1Positions[this.cursor * 2] = playerPosition[0] - 0.1;
    flame1Positions[this.cursor * 2 + 1] = tempVec.y - 1

    // update body
    this.pool[this.cursor].SetTransform(tempVec, 0);

    // set speed
    tempVec.x = 0;
    tempVec.y = consts.flame1Speed;
    this.pool[this.cursor].SetLinearVelocity(tempVec);

    // enable
    flame1Enabled[this.cursor] = 1;
    this.pool[this.cursor].SetEnabled(true);
    this.pool[this.cursor].GetFixtureList().SetFilterData(flame1Filter);
  }
  disableByPtr(ptr: number) {
    flame1Enabled[this.ptrToIdx[ptr]] = 0;
    this.pool[this.ptrToIdx[ptr]].SetEnabled(false);
  }
}

export function createFlame1Pool() {
  return new Flame1Pool()
}
