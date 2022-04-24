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
let autoAttack1Enabled: Float64Array;
let enemy1Positions: Float64Array;
let enemy1Hps: Int32Array;

let autoAttack1RemainTimesOld = new Float64Array(numberOfAutoAttack1);

let loopInterval : number

onmessage = (ev) => {
  if (ev.data.cmd === "close") {
    clearInterval(loopInterval)
    loop = () => {};
    autoAttack1Positions = new Float64Array();
    autoAttack1Enabled = new Float64Array();
    enemy1Positions = new Float64Array();
    enemy1Hps = new Int32Array();
    self.close();
  } else {
    autoAttack1Positions = new Float64Array(ev.data[0]);
    autoAttack1Enabled = new Float64Array(ev.data[1]);
    enemy1Positions = new Float64Array(ev.data[2]);
    enemy1Hps = new Int32Array(ev.data[3]);
    console.log(enemy1Hps);
  }
};
postMessage("");

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
let boxSideLength = 0.6;
square.SetAsBox(boxSideLength, boxSideLength);
const enemy1BodyPool = new Array<Box2D.b2Body>(numberOfEnemy1);
const autoAttack1BodyPool = new Array<Box2D.b2Body>(numberOfAutoAttack1);
const enemy1aabbs = new Array<Box2D.b2AABB>(numberOfEnemy1);
const autoAttack1aabbs = new Array<Box2D.b2AABB>(numberOfAutoAttack1);

// creating boxes
for (let i = 0; i < numberOfEnemy1; i++) {
  enemy1BodyPool[i] = world.CreateBody(bd);
  enemy1BodyPool[i].CreateFixture(square, 1).SetFriction(1);
  enemy1BodyPool[i].GetFixtureList().SetRestitution(0);
  enemy1BodyPool[i].GetFixtureList().SetSensor(true);
  enemy1BodyPool[i].GetFixtureList().SetFilterData(BoxCategory.Enemy1);
  enemy1BodyPool[i].SetFixedRotation(true);
  enemy1BodyPool[i].SetEnabled(false);

  autoAttack1BodyPool[i] = world.CreateBody(bd);
  autoAttack1BodyPool[i].CreateFixture(square, 1).SetFriction(1);
  autoAttack1BodyPool[i].GetFixtureList().SetRestitution(0);
  autoAttack1BodyPool[i].GetFixtureList().SetSensor(true);
  autoAttack1BodyPool[i].GetFixtureList().SetFilterData(BoxCategory.AutoAttack1);
  autoAttack1BodyPool[i].SetFixedRotation(true);
  autoAttack1BodyPool[i].SetEnabled(false);

  enemy1aabbs[i] = new b2AABB();
}

for (let i = 0; i < numberOfAutoAttack1; i++) {
  autoAttack1aabbs[i] = new b2AABB();
}

let indexDouble;
let tempIterator;
let tempIterator2;

let numberOfDivide = 15;
let divideTable = new Array<number>(numberOfDivide + 1);

for (let i = 0; i < numberOfDivide + 1; i++) {
  divideTable[i] = Math.floor(i * (numberOfEnemy1 / numberOfDivide));
}

let counter = 0;
let start = 0;
let end = 0;
let tempVec = new b2Vec2(0, 0);
let loop = () => {};
loop = () => {
  counter++;
  if (counter === numberOfDivide) {
    counter = 0;
  }

  start = divideTable[counter];
  end = divideTable[counter + 1];

  // update positions
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
    square.ComputeAABB(autoAttack1aabbs[tempIterator], autoAttack1BodyPool[tempIterator].GetTransform(), 0);
  }
  tempVec.__destroy__()

  tempIterator = numberOfEnemy1;
  while (tempIterator--) {
    if (enemy1Hps[tempIterator] === 0) {
      continue;
    }
    tempIterator2 = numberOfAutoAttack1;
    while (tempIterator2--) {
      if(autoAttack1Enabled[tempIterator2] == 0){
        continue
      }
      if (b2TestOverlap(enemy1aabbs[tempIterator], autoAttack1aabbs[tempIterator2])) {
        Atomics.sub(enemy1Hps, tempIterator, 1)
        //postMessage(tempIterator2)
        autoAttack1Enabled[tempIterator2] = 0
      }
    }
  }
};

setTimeout(() => {
  loopInterval = setInterval(loop, worker2Interval);
}, 1000);
