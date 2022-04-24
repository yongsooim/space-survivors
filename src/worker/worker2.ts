import Box2DFactory from "box2d-wasm"; // ....
import { enemy1Speed, numberOfAutoAttack1, numberOfEnemy1, worker2Interval } from "../type/const";

import sabWorker1 from "./sabManage";

enum BoxCategory {
  Enemy1 = 0x0001,
  AutoAttack1 = 0x0002,
  //  ENEMY_SHIP =        0x0004,
  //  FRIENDLY_AIRCRAFT = 0x0008,
  //  ENEMY_AIRCRAFT =    0x0010,
  //  FRIENDLY_TOWER =    0x0020,
  //  RADAR_SENSOR =      0x0040,
}

let autoAttack1Positions: Float64Array;
let enemy1Positions: Float64Array;
let enemy1Hps: Float64Array;

onmessage = (evt) => {
  console.log(evt.data[1]);
  autoAttack1Positions = new Float64Array(evt.data[0]);
  enemy1Positions = new Float64Array(evt.data[1]);
  enemy1Hps = new Float64Array(evt.data[2]);
};

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  ///
  // By default, this looks for Box2D.wasm relative to public/build/bundle.js:
  // @example (url, scriptDirectory) => `${scriptDirectory}${url}`
  // But we want to look for Box2D.wasm relative to public/index.html instead.
  //
  locateFile: (url, scriptDirectory) => {
    // console.log('url in main  :  ' + url)
    // console.log('scriptDirectory in main  :  ' + scriptDirectory)
    // console.log('findng at in main  :  ./assets/' + url)
    //return './' + url  // for build, dist
    // console.log(scriptDirectory)
    return "/assets/" + url; // for dev
  },
});
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World, b2TestOverlap, b2AABB } = box2D;
// in metres per second squared
const zero = new b2Vec2(0, 0);
const gravity = zero;
const world = new b2World(gravity); // zero gravity

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);

const square = new b2PolygonShape();
let boxSideLength = 0.8;
square.SetAsBox(boxSideLength, boxSideLength);
const enemy1BodyPool = new Array<Box2D.b2Body>(numberOfEnemy1);
const autoAttack1BodyPool = new Array<Box2D.b2Body>(numberOfAutoAttack1);
const enemy1aabbs = new Array<Box2D.b2AABB>(numberOfEnemy1);
const autoAttack1aabbs = new Array<Box2D.b2AABB>(numberOfAutoAttack1);

let tempVector = zero;

// creating boxes
for (let i = 0; i < numberOfEnemy1; i++) {
  enemy1BodyPool[i] = world.CreateBody(bd);
  enemy1BodyPool[i].CreateFixture(square, 1).SetFriction(1);
  enemy1BodyPool[i].GetFixtureList().SetRestitution(0);
  enemy1BodyPool[i].GetFixtureList().SetSensor(true);
  enemy1BodyPool[i].GetFixtureList().SetFilterData(BoxCategory.Enemy1);
  enemy1BodyPool[i].SetEnabled(false);

  autoAttack1BodyPool[i] = world.CreateBody(bd);
  autoAttack1BodyPool[i].CreateFixture(square, 1).SetFriction(1);
  autoAttack1BodyPool[i].GetFixtureList().SetRestitution(0);
  autoAttack1BodyPool[i].GetFixtureList().SetSensor(true);
  autoAttack1BodyPool[i].GetFixtureList().SetFilterData(BoxCategory.AutoAttack1);
  autoAttack1BodyPool[i].SetEnabled(false);
}

let tempEnemyPos = zero;
let diffX: number;
let diffY: number;
let diffXSquare: number;
let diffYSquare: number;
let tempPlayerPosX: number;
let tempPlayerPosY: number;
let indexDouble;
let tempIterator;
let length;
let tempForVectorSetting = new b2Vec2(0, 0);

let numberOfDivide = 15;
let divideTable = new Array<number>(numberOfDivide + 1);

for (let i = 0; i < numberOfDivide + 1; i++) {
  divideTable[i] = Math.floor(i * (numberOfEnemy1 / numberOfDivide));
}

let counter = 0;
let start = 0;
let end = 0;
let lastExecuted = Date.now();
let delta = 0;
let now = 0;
let stepTime = 0;

let loop = () => {};
loop = () => {
  counter++;
  if (counter === numberOfDivide) {
    counter = 0;
  }

  start = divideTable[counter];
  end = divideTable[counter + 1];

  // update positions
  let tempVec = new b2Vec2(0, 0);
  tempIterator = numberOfEnemy1;
  while (tempIterator--) {
    indexDouble = tempIterator * 2;
    tempVec.x = enemy1Positions[indexDouble];
    tempVec.y = enemy1Positions[indexDouble + 1];
    enemy1BodyPool[tempIterator].SetTransform(tempVec, 0);
    square.ComputeAABB(enemy1aabbs[tempIterator], enemy1BodyPool[tempIterator].GetTransform(), 0);
  }

  tempIterator = numberOfAutoAttack1;
  while (tempIterator--) {
    indexDouble = tempIterator * 2;
    tempVec.x = autoAttack1Positions[indexDouble];
    tempVec.y = autoAttack1Positions[indexDouble + 1];
    autoAttack1BodyPool[tempIterator].SetTransform(tempVec, 0);
  }

  tempIterator = numberOfEnemy1;
  let tempIterator2 = numberOfAutoAttack1;
  //while (tempIterator--) {
  //  while (tempIterator2--) {
  //    if(b2TestOverlap(
  //      enemy1BodyPool[tempIterator].GetFixtureList().GetAABB(0),
  //      autoAttack1BodyPool[tempIterator2].GetFixtureList().GetAABB(0))) {
  //      //console.log('collide')
  //    }
  //  }
  //}

  now = Date.now();
  delta = now - lastExecuted;
  lastExecuted = now;

  if (delta > worker2Interval + 3) {
    if (delta > 500) {
      stepTime = 500;
    } else {
      stepTime = delta;
    }
  } else {
    stepTime = worker2Interval;
  }
  world.Step(stepTime, 8, 3);
};
setTimeout(() => {
  setInterval(loop, worker2Interval);
}, 500);

setInterval(() => {
  //console.log(enemy1Hps);
  console.log(enemy1aabbs[0]);
  //console.log(enemy1Positions)
}, 500);

export default Worker;
