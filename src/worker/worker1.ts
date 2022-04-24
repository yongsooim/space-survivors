import Box2DFactory from "box2d-wasm"; // ....
import { Buffer } from "pixi.js";
import { enemy1Speed, numberOfEnemy1, worker1Interval } from "../type/const";

// Shared Aray Buffer setting
let playerPosition : Float64Array
let enemy1positions : Float64Array
let enemy1Hps : Int32Array

const enemy1HpsOld = new Float64Array(numberOfEnemy1)

let loop = () => {};

onmessage = (ev) => {
  if (ev.data.cmd === "close") {
    playerPosition = new Float64Array();
    enemy1positions = new Float64Array();
    enemy1Hps = new Int32Array();
    self.close();
    loop = () => {};
  } else {
    playerPosition = new Float64Array(ev.data[0]);
    enemy1positions = new Float64Array(ev.data[1]);
    enemy1Hps = new Int32Array(ev.data[2]);
  }
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
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = box2D;
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

let tempVector = zero;

// creating boxes
for (let i = 0; i < numberOfEnemy1; i++) {
  enemy1BodyPool[i] = world.CreateBody(bd);
  enemy1BodyPool[i].CreateFixture(square, 1).SetFriction(1);
  enemy1BodyPool[i].GetFixtureList().SetRestitution(0);
  enemy1BodyPool[i].SetLinearDamping(0);
  enemy1BodyPool[i].SetAngularDamping(0);
  enemy1BodyPool[i].SetSleepingAllowed(false);
  tempVector.x = (Math.random() - 0.5) * 150;
  tempVector.y = (Math.random() - 0.5) * 150;
  enemy1BodyPool[i].SetTransform(tempVector, 0);
  enemy1BodyPool[i].SetFixedRotation(false);
  enemy1BodyPool[i].SetAwake(true);
  enemy1BodyPool[i].SetEnabled(true);
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

loop = () => {
  counter++;
  if (counter === numberOfDivide) {
    counter = 0;
  }

  start = divideTable[counter];
  end = divideTable[counter + 1];

  tempPlayerPosX = playerPosition[0];
  tempPlayerPosY = playerPosition[1];

  // partial calc vector to player
  for (tempIterator = start; tempIterator < end; tempIterator++) {
    if(enemy1Hps[tempIterator] === 0){
      enemy1BodyPool[tempIterator].SetEnabled(false)
      continue
    }
    tempEnemyPos = enemy1BodyPool[tempIterator].GetPosition();
    diffX = tempPlayerPosX - tempEnemyPos.x;
    diffY = tempPlayerPosY - tempEnemyPos.y;
    diffXSquare = diffX * diffX;
    diffYSquare = diffY * diffY;
    length = Math.sqrt(diffXSquare + diffYSquare);
    tempForVectorSetting.x = enemy1Speed * diffX / length;
    tempForVectorSetting.y = enemy1Speed * diffY / length;
    enemy1BodyPool[tempIterator].SetLinearVelocity(tempForVectorSetting);
    //console.log(tempForVectorSetting)
  }

  // update shared memory buffer
  tempIterator = numberOfEnemy1;
  while (tempIterator--) {
    if(enemy1Hps[tempIterator] === 0){
      continue
    }
    tempEnemyPos = enemy1BodyPool[tempIterator].GetPosition();
    indexDouble = tempIterator * 2;
    enemy1positions[indexDouble] = tempEnemyPos.x;
    enemy1positions[indexDouble + 1] = tempEnemyPos.y;
  }

  now = Date.now();
  delta = now - lastExecuted;
  lastExecuted = now;

  if (delta > worker1Interval + 3) {
    if (delta > 500) {
      stepTime = 500;
    } else {
      stepTime = delta;
    }
  } else {
    stepTime = worker1Interval;
  }

  enemy1HpsOld.set(enemy1Hps)
  world.Step(stepTime, 8, 3);
};
setTimeout(()=>{
  setInterval(loop, worker1Interval);
}, 500)
