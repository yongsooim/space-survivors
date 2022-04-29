// this worker calculates enemy1's collision and its resolving

import Box2DFactory from "box2d-wasm"; // ....
import Worker from "./calcDirectionWorker?worker"; // ....
import { autoAttack1Speed, enemy1speed, numberOfAutoAttack1, numberOfEnemy1, numberOfEnemy1double, spawnSize, worker1interval } from "../type/const";

// Shared Aray Buffer setting
let playerPosition: Float64Array;
let enemy1positions: Float64Array;
let enemy1Hps: Int32Array;
let life: Int32Array;
let autoAttack1Positions: Float64Array;
let autoAttack1Enabled: Int32Array;
let kills: Int32Array;
let lock: Int32Array;

let enemy1direction = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfEnemy1double);
let enemy1directionArr = new Float64Array(enemy1direction);

const enemy1HpsOld = new Float64Array(numberOfEnemy1);
const disabledQueue = [] as number[]

let calcDirectionWorker = new Worker();
let loop = () => { };
let loopInterval: number;
let running = false

onmessage = (ev) => {
  if (ev.data.cmd === "stop") {
    running = false
    // pause
  } else if (ev.data.cmd === "start") {
    running = true
    setTimeout(() => {
      loopInterval = setInterval(loop, worker1interval);
    }, 1000);
  } else if (ev.data.cmd === "close") {
    running = false
    loop = () => { };
    clearInterval(loopInterval);
    playerPosition = new Float64Array();
    enemy1positions = new Float64Array();
    enemy1Hps = new Int32Array();
    self.close();
  } else if (ev.data.cmd === "fire") {
    fire();
  } else if (ev.data.cmd === "flame") {
    flame();
  } else {
    playerPosition = new Float64Array(ev.data.playerPosition);
    enemy1positions = new Float64Array(ev.data.enemy1Positions);
    enemy1Hps = new Int32Array(ev.data.enemy1Hps,);
    life = new Int32Array(ev.data.lifeSab);
    autoAttack1Positions = new Float64Array(ev.data.autoAttack1Positions);
    autoAttack1Enabled = new Int32Array(ev.data.autoAttack1Enabled);
    kills = new Int32Array(ev.data.killSab)
    lock = new Int32Array(ev.data.lockSab)

    calcDirectionWorker.postMessage([ev.data, enemy1direction]); //playerPosition, enemy1 position
  }
};

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
    // return './' + url  // for build, dist
    // console.log(scriptDirectory)
    return "/assets/" + url; // for dev
  },
});
const {
  b2BodyDef,
  b2_dynamicBody,
  b2Body,
  b2PolygonShape,
  b2Vec2,
  b2World,
  JSContactListener,
  wrapPointer,
  b2Filter,
  b2Contact,
} = box2D;
// in metres per second squared
const zero = new b2Vec2(0, 0);
const gravity = zero;
const world = new b2World(gravity); // zero gravity

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);

const square = new b2PolygonShape();
const enemy1BodyPool = new Array<Box2D.b2Body>(numberOfEnemy1);
const autoAttack1BodyPool = new Array<Box2D.b2Body>(numberOfAutoAttack1);

const tempVec = new b2Vec2(0, 0);

enum Filter {
  Enemy1 = 0x0001,
  AutoAttack1 = 0x0002,
  Player = 0x0004,
}

let enemy1filter = new b2Filter();
enemy1filter.categoryBits = Filter.Enemy1;
enemy1filter.maskBits = Filter.AutoAttack1 | Filter.Enemy1 | Filter.Player;
enemy1filter.groupIndex = 0;

let autoAttack1filter = new b2Filter();
autoAttack1filter.categoryBits = Filter.AutoAttack1;
autoAttack1filter.maskBits = Filter.Enemy1;
autoAttack1filter.groupIndex = 0;

let playerFilter = new b2Filter();
playerFilter.categoryBits = Filter.Player;
playerFilter.maskBits = Filter.Enemy1;
playerFilter.groupIndex = 0;

square.SetAsBox(0.6, 0.6);
const playerBody = world.CreateBody(bd);
playerBody.CreateFixture(square, 1).SetFriction(0);
playerBody.GetFixtureList().SetRestitution(0);
playerBody.GetFixtureList().SetFilterData(playerFilter);

playerBody.SetLinearDamping(0);
playerBody.SetAngularDamping(0);
playerBody.SetSleepingAllowed(false);
playerBody.SetEnabled(true);

square.SetAsBox(0.8, 0.6);

let ptrToEnemyBodyIndex = {} as any;
let ptrToAutoAttackBodyIndex = {} as any;

// creating boxes
for (let i = 0; i < numberOfEnemy1; i++) {
  enemy1BodyPool[i] = world.CreateBody(bd);
  enemy1BodyPool[i].CreateFixture(square, 1).SetFriction(0);
  enemy1BodyPool[i].GetFixtureList().SetRestitution(0);
  enemy1BodyPool[i].GetFixtureList().SetFilterData(enemy1filter);

  enemy1BodyPool[i].SetLinearDamping(0);
  enemy1BodyPool[i].SetAngularDamping(0);
  enemy1BodyPool[i].SetSleepingAllowed(false);
  tempVec.Set((Math.random() - 0.5) * spawnSize, (Math.random() - 0.5) * spawnSize);
  enemy1BodyPool[i].SetTransform(tempVec, 0);
  enemy1BodyPool[i].SetFixedRotation(false);
  enemy1BodyPool[i].SetAwake(true);
  enemy1BodyPool[i].SetEnabled(true);

  //@ts-ignore
  ptrToEnemyBodyIndex[enemy1BodyPool[i].Zu as any] = i;
}

square.SetAsBox(0.2, 0.2);
for (let i = 0; i < numberOfAutoAttack1; i++) {
  autoAttack1BodyPool[i] = world.CreateBody(bd);
  autoAttack1BodyPool[i].CreateFixture(square, 1).SetFriction(0);
  autoAttack1BodyPool[i].GetFixtureList().SetRestitution(0);
  autoAttack1BodyPool[i].GetFixtureList().SetFilterData(autoAttack1filter);
  //autoAttack1BodyPool[i].GetFixtureList().SetSensor(true);

  autoAttack1BodyPool[i].SetLinearDamping(0);
  autoAttack1BodyPool[i].SetAngularDamping(0);
  autoAttack1BodyPool[i].SetSleepingAllowed(false);
  autoAttack1BodyPool[i].SetFixedRotation(false);
  autoAttack1BodyPool[i].SetAwake(true);
  autoAttack1BodyPool[i].SetEnabled(false);

  //@ts-ignore
  ptrToAutoAttackBodyIndex[autoAttack1BodyPool[i].Zu as any] = i;
}

let indexDouble;
let tempIterator;

let lastExecuted = Date.now();
let delta = 0;
let now = 0;
let stepTime = 0;

let contactListener = new JSContactListener();
let fixA;
let fixB;

let bodyBullet
let bodyEnemy

let disableRequest = [] as Box2D.b2Body[];

contactListener.BeginContact = (contact) => { };
contactListener.EndContact = () => { };
contactListener.PostSolve = (contact) => {
  contact = wrapPointer(contact as number, b2Contact);
  fixA = contact.GetFixtureA();
  fixB = contact.GetFixtureB();

  if (fixA.GetFilterData().categoryBits === Filter.AutoAttack1) {
    bodyBullet = fixA.GetBody()
    bodyEnemy = fixB.GetBody()
    fixA.GetFilterData().set_maskBits(0) // no more collision listener for this 
  } else if (fixB.GetFilterData().categoryBits === Filter.AutoAttack1) {
    bodyEnemy = fixA.GetBody()
    bodyBullet = fixB.GetBody()
    fixB.GetFilterData().set_maskBits(0) // no more collision listener for this 
  } else {
    return
  }

  disableRequest.push(bodyBullet);

  //@ts-ignore
  if (enemy1Hps[ptrToEnemyBodyIndex[bodyEnemy.Zu]] >= 0) {
    //@ts-ignore
    Atomics.sub(enemy1Hps, ptrToEnemyBodyIndex[bodyEnemy.Zu], 5) // damage dealt
    postMessage({
      x: (bodyBullet.GetPosition().x + bodyEnemy.GetPosition().x) / 2,
      y: (bodyBullet.GetPosition().y + bodyEnemy.GetPosition().y) / 2,
      dmg: 5
    })
  }
}

contactListener.PreSolve = () => { };

world.SetContactListener(contactListener);
loop = () => {
  if (running === false) return
  for (let i = 0; i < disableRequest.length; i++) {
    disableRequest[i].GetFixtureList().SetFilterData(Filter.AutoAttack1)  // solve one time for this 
  }
  world.Step(stepTime, 8, 3);
  for (let i = 0; i < disableRequest.length; i++) {
    if (disableRequest[i].GetFixtureList().GetFilterData().categoryBits === Filter.AutoAttack1) {
      //@ts-ignore
      autoAttack1Enabled[ptrToAutoAttackBodyIndex[disableRequest[i].Zu]] = 0;
      disableRequest[i].SetEnabled(false)
    }
  }

  disableRequest = [];

  tempVec.x = playerPosition[0];
  tempVec.y = playerPosition[1];

  playerBody.SetTransform(tempVec, 0);

  // update enemy direction towards player
  tempIterator = numberOfEnemy1;
  while (tempIterator--) {
    if (enemy1Hps[tempIterator] <= 0) continue; //skip dead enemy
    tempVec.Set(enemy1directionArr[tempIterator * 2], enemy1directionArr[tempIterator * 2 + 1]);
    enemy1BodyPool[tempIterator].SetLinearVelocity(tempVec);
  }

  // update shared memory buffer
  while (Atomics.load(lock, 0) != 0){}
  Atomics.store(lock, 0, 1)

  tempIterator = numberOfEnemy1;
  while (tempIterator--) {
    // skip dead
    if (enemy1BodyPool[tempIterator].IsEnabled() === false) {
      continue;
    }
    if (enemy1Hps[tempIterator] <= 0) {
      // check dead
      if (enemy1BodyPool[tempIterator].IsEnabled() === true) {
        Atomics.add(kills, 0, 1)
        enemy1BodyPool[tempIterator].SetEnabled(false);
      }
    }
    indexDouble = tempIterator * 2;
    enemy1positions[indexDouble] = enemy1BodyPool[tempIterator].GetPosition().x;
    enemy1positions[indexDouble + 1] = enemy1BodyPool[tempIterator].GetPosition().y;
  }

  // calculate next enemy move direction
  calcDirectionWorker.postMessage({ cmd: "calc" });

  // update shared memory buffer
  tempIterator = numberOfAutoAttack1;
  while (tempIterator--) {
    if (autoAttack1Enabled[tempIterator] === 0) continue; // skip disabled

    indexDouble = tempIterator * 2;
    autoAttack1Positions[indexDouble] = autoAttack1BodyPool[tempIterator].GetPosition().x;
    autoAttack1Positions[indexDouble + 1] = autoAttack1BodyPool[tempIterator].GetPosition().y;
  }
  Atomics.store(lock, 0, 0)


  // calculate elapsed and determine the interval to next step
  now = Date.now();
  delta = now - lastExecuted;
  lastExecuted = now;

  if (delta > worker1interval + 5) {
    if (delta > 500) {
      stepTime = 500;
    } else {
      stepTime = delta;
    }
  } else {
    stepTime = worker1interval;
  }
};

let autoAttackCounter = 0;
let tempPlayerPosX, tempPlayerPosY;

function fire() {
  autoAttackCounter++;
  if (autoAttackCounter === numberOfAutoAttack1) {
    autoAttackCounter = 0;
  }
  tempPlayerPosX = playerPosition[0];
  tempPlayerPosY = playerPosition[1];

  tempVec.x = tempPlayerPosX - 0.1;
  tempVec.y = tempPlayerPosY - 0.5;

  autoAttack1BodyPool[autoAttackCounter].SetTransform(tempVec, 0);
  autoAttack1Positions[autoAttackCounter * 2] = tempPlayerPosX;
  autoAttack1Positions[autoAttackCounter * 2 + 1] = tempPlayerPosY;

  tempVec.x = 0;
  tempVec.y = -autoAttack1Speed;
  autoAttack1BodyPool[autoAttackCounter].SetLinearVelocity(tempVec);
  autoAttack1Enabled[autoAttackCounter] = 1;
  autoAttack1BodyPool[autoAttackCounter].SetEnabled(true);
}

function flame() {
  autoAttackCounter++;
  if (autoAttackCounter === numberOfAutoAttack1) {
    autoAttackCounter = 0;
  }
  tempPlayerPosX = playerPosition[0];
  tempPlayerPosY = playerPosition[1];

  tempVec.x = tempPlayerPosX - 0.1;
  tempVec.y = tempPlayerPosY - 0.5;

  autoAttack1BodyPool[autoAttackCounter].SetTransform(tempVec, 0);
  autoAttack1Positions[autoAttackCounter * 2] = tempPlayerPosX;
  autoAttack1Positions[autoAttackCounter * 2 + 1] = tempPlayerPosY;

  tempVec.x = 0;
  tempVec.y = -autoAttack1Speed;
  autoAttack1BodyPool[autoAttackCounter].SetLinearVelocity(tempVec);
  autoAttack1Enabled[autoAttackCounter] = 1;
  autoAttack1BodyPool[autoAttackCounter].SetEnabled(true);
}
