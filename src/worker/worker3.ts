// resources?

import Box2DFactory from "box2d-wasm"; // ....
import { numberOfResource1, worker3interval } from "../type/const";

let playerPosition: Float64Array;
let resource1positions: Float64Array;
let resource1remainTimes: Int32Array;
let resource1Collected: Int32Array;

// timer for loop
let loopInterval = 0;

onmessage = (ev) => {
  if (ev.data.cmd === "stop") {
    // pause
  } else if (ev.data.cmd === "close") {
  } else if (ev.data.cmd === "generate") {
    //ev.data.x
    //ev.data.y
    //ev.data.amount
  } else {
    playerPosition = new Float64Array(ev.data[0]);
    resource1positions = new Float64Array(ev.data[1]);
    resource1remainTimes = new Int32Array(ev.data[2]);
    resource1Collected = new Int32Array(ev.data[3]);
  }
};

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  locateFile: (url) => {
    return "/assets/" + url; // for dev
  },
});
const { b2BodyDef, b2_dynamicBody, b2CircleShape, b2Vec2, b2World } = box2D;

const zero = new b2Vec2(0, 0);
const gravity = zero;
const world = new b2World(gravity); // zero gravity

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);

const circle = new b2CircleShape();
circle.set_m_radius(0.05);

const resourceBodyPool = new Array<Box2D.b2Body>(numberOfResource1);

let tempVector = zero;

// creating circles
for (let i = 0; i < numberOfResource1; i++) {
  resourceBodyPool[i] = world.CreateBody(bd);
  resourceBodyPool[i].CreateFixture(circle, 1).SetFriction(0.5);
  resourceBodyPool[i].GetFixtureList().SetRestitution(0);
  resourceBodyPool[i].SetLinearDamping(0.5);
  resourceBodyPool[i].SetAngularDamping(0);
  resourceBodyPool[i].SetSleepingAllowed(false);
  tempVector.Set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
  resourceBodyPool[i].SetTransform(tempVector, 0);
  resourceBodyPool[i].SetFixedRotation(true);
  resourceBodyPool[i].SetAwake(true);
  resourceBodyPool[i].SetEnabled(true);
  resourceBodyPool[i].SetLinearVelocity(zero);
}

let tempResourcePos = zero;
let indexDouble;
let tempIterator;

let counter = 0;
let lastExecuted = Date.now();
let delta = 0;
let now = 0;
let stepTime = 0;

let tempCalcVector = new b2Vec2(0, 0);

let tempPlayerPosX = 0;
let tempPlayerPosY = 0;

let loop = () => {
  now = Date.now();
  delta = now - lastExecuted;

  for (tempIterator = counter; tempIterator < numberOfResource1; tempIterator++) {
    if(resourceBodyPool[tempIterator].IsEnabled() === false) continue
    tempPlayerPosX = playerPosition[0];
    tempPlayerPosY = playerPosition[1];

    tempCalcVector.Set(tempPlayerPosX, tempPlayerPosY);

    tempCalcVector.op_sub(resourceBodyPool[tempIterator].GetPosition());

    let length = tempCalcVector.Length();

    let magnetRange = 10
    if (length < magnetRange) {
      if (length < 0.4) {
        resourceBodyPool[tempIterator].SetEnabled(false);
        Atomics.store(resource1remainTimes, tempIterator, 0);
        Atomics.add(resource1Collected, 0, 1)
      } else {
        tempCalcVector.Normalize();
        tempCalcVector.op_mul(0.04 * (magnetRange + 0.1 - length));
        resourceBodyPool[tempIterator].SetLinearVelocity(tempCalcVector);
      }
    }

    //tempCalcVector.Normalize()
    //tempCalcVector.op_mul(0.1)
    //resourceBodyPool[tempIterator].SetLinearVelocity(tempCalcVector)
  }

  // update shared memory buffer
  tempIterator = numberOfResource1;
  while (tempIterator--) {
    if (resource1remainTimes[tempIterator] < 0) {
      continue;
    }
    Atomics.sub(resource1remainTimes, tempIterator, delta);

    if (resourceBodyPool[tempIterator].IsEnabled() == false) {
      continue;
    }
    if (resource1remainTimes[tempIterator] === 0) {
      resourceBodyPool[tempIterator].SetEnabled(false);
      continue;
    }
    tempResourcePos = resourceBodyPool[tempIterator].GetPosition();
    indexDouble = tempIterator * 2;
    resource1positions[indexDouble] = tempResourcePos.x;
    resource1positions[indexDouble + 1] = tempResourcePos.y;
  }

  lastExecuted = now;

  if (delta > worker3interval + 5) {
    if (delta > 500) {
      stepTime = 500;
    } else {
      stepTime = delta;
    }
  } else {
    stepTime = worker3interval;
  }

  world.Step(stepTime, 3, 8);
};

setTimeout(() => {
  loopInterval = setInterval(loop, worker3interval);
}, 1000);

export default Worker;
