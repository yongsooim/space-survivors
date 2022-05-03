// this worker calculates the interaction between resource and player

import Box2DFactory from "box2d-wasm"; // ....
import consts from "../type/const";
import { SabSet } from "./sabManage";

// timer for loop
let loopInterval = 0;

let running = false;

export declare interface Isa {
  playerPosition: {
    x: Float64Array,
    y: Float64Array,
  }
  resource1positions: {
    x: Float64Array,
    y: Float64Array,
  }
  resource1remainTimes: Int32Array,
  resource2positions: {
    x: Float64Array,
    y: Float64Array,
  }
  resource2remainTimes: Int32Array,
  exp: Int32Array,
}
export let sa: Isa

onmessage = (ev) => {
  if (ev.data.cmd === "stop") {
    running = false;
    // pause
  } else if (ev.data.cmd === "start") {
    running = true;
  } else if (ev.data.cmd === "close") {
    running = false;
    self.close();
  } else if (ev.data.cmd === "generate") {

  } else {
    let sab = ev.data.sab as SabSet
    sa = {
      playerPosition: {
        x: new Float64Array(sab.playerPosition.x),
        y: new Float64Array(sab.playerPosition.y),
      },
      resource1positions: {
        x: new Float64Array(sab.resource1Positions.x),
        y: new Float64Array(sab.resource1Positions.y),
      },
      resource1remainTimes: new Int32Array(sab.resource1RemainTimes),
      resource2positions: {
        x: new Float64Array(sab.playerPosition.x),
        y: new Float64Array(sab.playerPosition.y),
      },
      resource2remainTimes: new Int32Array(sab.resource2RemainTimes),
      exp: new Int32Array(sab.expSab),
    }
  }
};

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  locateFile: (url) => {
    // console.log('url in main  :  ' + url)
    // console.log('scriptDirectory in main  :  ' + scriptDirectory)
    // console.log('findng at in main  :  ./assets/' + url)
    //return './' + url  // for build, dist
    // console.log(scriptDirectory)\
    return "/assets/" + url; // for dev
  },
});

const { b2BodyDef, b2_dynamicBody, b2CircleShape, b2Vec2, b2World, b2Filter } = box2D;

const zero = new b2Vec2(0, 0);
const gravity = zero;
const world = new b2World(gravity); // zero gravity

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);

const circle = new b2CircleShape();
circle.set_m_radius(0.4);

const resource1BodyPool = new Array<Box2D.b2Body>(consts.numberOfResource1);
const resource2BodyPool = new Array<Box2D.b2Body>(consts.numberOfResource2);

const tempVector = zero;

enum Filter {
  Resource1 = 0x00000001,
  Resource2 = 0x00000002,
}

let resource1filter = new b2Filter();
resource1filter.categoryBits = Filter.Resource1;
resource1filter.maskBits = Filter.Resource2;

let resource2filter = new b2Filter();
resource2filter.categoryBits = Filter.Resource2;
resource2filter.maskBits = Filter.Resource1;

// creating circles
for (let i = 0; i < consts.numberOfResource1; i++) {
  resource1BodyPool[i] = world.CreateBody(bd);
  resource1BodyPool[i].CreateFixture(circle, 0.5).SetFriction(0.1);
  resource1BodyPool[i].GetFixtureList().SetRestitution(0);
  resource1BodyPool[i].GetFixtureList().SetFilterData(resource1filter);
  resource1BodyPool[i].SetLinearDamping(0.2);
  resource1BodyPool[i].SetAngularDamping(0);
  resource1BodyPool[i].SetSleepingAllowed(true);
  tempVector.Set((Math.random() - 0.5) * consts.spawnSize, (Math.random() - 0.5) * consts.spawnSize);
  resource1BodyPool[i].SetTransform(tempVector, 0);
  resource1BodyPool[i].SetFixedRotation(true);
  resource1BodyPool[i].SetEnabled(true);
  resource1BodyPool[i].SetLinearVelocity(zero);
}

for (let i = 0; i < consts.numberOfResource2; i++) {
  resource2BodyPool[i] = world.CreateBody(bd);
  resource2BodyPool[i].CreateFixture(circle, 0.5).SetFriction(0.1);
  resource2BodyPool[i].GetFixtureList().SetRestitution(0);
  resource2BodyPool[i].GetFixtureList().SetFilterData(resource2filter);
  resource2BodyPool[i].SetLinearDamping(0.2);
  resource2BodyPool[i].SetAngularDamping(0);
  resource2BodyPool[i].SetSleepingAllowed(true);
  tempVector.Set((Math.random() - 0.5) * consts.spawnSize, (Math.random() - 0.5) * consts.spawnSize);
  resource2BodyPool[i].SetTransform(tempVector, 0);
  resource2BodyPool[i].SetFixedRotation(true);
  resource2BodyPool[i].SetEnabled(true);
  resource2BodyPool[i].SetLinearVelocity(zero);
}

let tempResourcePos = zero;
let tempIterator;

const counter = 0;
let lastExecuted = Date.now();
let delta = 0;
let now = 0;
let stepTime = 0;

const tempCalcVector = new b2Vec2(0, 0);

let tempPlayerPosX = 0;
let tempPlayerPosY = 0;

const loop = () => {
  if (running === false) return;
  for (tempIterator = counter; tempIterator < consts.numberOfResource1; tempIterator++) {
    if (resource1BodyPool[tempIterator].IsEnabled() === false) continue;
    tempPlayerPosX = sa.playerPosition.x[0];
    tempPlayerPosY = sa.playerPosition.y[0];

    tempCalcVector.Set(tempPlayerPosX, tempPlayerPosY);

    tempCalcVector.op_sub(resource1BodyPool[tempIterator].GetPosition());

    const length = tempCalcVector.Length();

    if (length < consts.magnetRange) {
      if (length < 0.4) {
        resource1BodyPool[tempIterator].SetEnabled(false);
        Atomics.store(sa.resource1remainTimes, tempIterator, 0);
        Atomics.add(sa.exp, 0, 1);
        postMessage({ cmd: "get" });
      } else {
        tempCalcVector.Normalize();
        tempCalcVector.op_mul(0.04 * (consts.magnetRange + 0.1 - length));
        resource1BodyPool[tempIterator].SetLinearVelocity(tempCalcVector);
      }
    }
  }

  for (tempIterator = counter; tempIterator < consts.numberOfResource2; tempIterator++) {
    if (resource2BodyPool[tempIterator].IsEnabled() === false) continue;
    tempPlayerPosX = sa.playerPosition.x[0];
    tempPlayerPosY = sa.playerPosition.y[0];

    tempCalcVector.Set(tempPlayerPosX, tempPlayerPosY);

    tempCalcVector.op_sub(resource2BodyPool[tempIterator].GetPosition());

    const length = tempCalcVector.Length();

    if (length < consts.magnetRange) {
      if (length < 0.6) {
        resource2BodyPool[tempIterator].SetEnabled(false);
        Atomics.store(sa.resource2remainTimes, tempIterator, 0);
        Atomics.add(sa.exp, 0, 3);
        postMessage({ cmd: "get" });
      } else {
        tempCalcVector.Normalize();
        tempCalcVector.op_mul(0.03 * (consts.magnetRange + 0.1 - length));
        resource2BodyPool[tempIterator].SetLinearVelocity(tempCalcVector);
      }
    }
  }

  // update shared memory buffer
  tempIterator = consts.numberOfResource1;
  while (tempIterator--) {
    if (resource1BodyPool[tempIterator].IsEnabled() === false) {
      continue;
    }
    Atomics.sub(sa.resource1remainTimes, tempIterator, delta);
    if (sa.resource1remainTimes[tempIterator] === 0) {
      resource1BodyPool[tempIterator].SetEnabled(false);
      continue;
    }
    tempResourcePos = resource1BodyPool[tempIterator].GetPosition();
    sa.resource1positions.x[tempIterator] = tempResourcePos.x;
    sa.resource1positions.y[tempIterator] = tempResourcePos.y;
  }

  tempIterator = consts.numberOfResource2;
  while (tempIterator--) {
    if (resource2BodyPool[tempIterator].IsEnabled() === false) {
      continue;
    }
    Atomics.sub(sa.resource2remainTimes, tempIterator, delta);
    if (sa.resource2remainTimes[tempIterator] === 0) {
      resource2BodyPool[tempIterator].SetEnabled(false);
      continue;
    }
    tempResourcePos = resource2BodyPool[tempIterator].GetPosition();
    sa.resource2positions.x[tempIterator] = tempResourcePos.x;
    sa.resource2positions.y[tempIterator] = tempResourcePos.y;
  }

  now = Date.now();
  delta = now - lastExecuted;

  if (delta > consts.worker3Interval + 5) {
    if (delta > 500) {
      stepTime = 500;
    } else {
      stepTime = delta;
    }
  } else {
    stepTime = consts.worker3Interval;
  }

  world.Step(stepTime, 3, 8);

  lastExecuted = now;
};

setTimeout(() => {
  loopInterval = setInterval(loop, consts.worker3Interval);
}, 1000);

postMessage("ready");

export default Worker;
