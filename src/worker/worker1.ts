// this worker calculates enemy1's collision and its resolving

import Box2DFactory from "box2d-wasm"; // ....
import consts from "../type/const";
import { createEnemy1Pool, Enemy1Pool } from "./enemy1";

// Shared Aray Buffer setting
export let playerPosition: Float64Array;
export let enemy1positions: Float64Array;
export let enemy1directions: Float64Array;
export let enemy1Hps: Int32Array;
export let autoAttack1Positions: Float64Array;
export let autoAttack1Enabled: Int32Array;
export let flame1Positions: Float64Array;
export let flame1Enabled: Int32Array;
export let kills: Int32Array;
export let port: MessagePort;
export let lock: Int32Array;

let loopInterval: number;
let running = false;

let enemy1pool : Enemy1Pool

onmessage = (ev) => {
  if (ev.data.cmd === "stop") {
    running = false;
    // pause
  } else if (ev.data.cmd === "start") {
    running = true;
    loopInterval = setInterval(loop, consts.worker1interval);
  } else if (ev.data.cmd === "close") {
    running = false;
    clearInterval(loopInterval);
    playerPosition = new Float64Array();
    enemy1positions = new Float64Array();
    enemy1Hps = new Int32Array();
    self.close();
  } else if (ev.data.cmd === "fire") {
    fire();
  } else if (ev.data.cmd === "flame") {
    flame();
  } else if (ev.data.cmd === "init") {
    playerPosition = new Float64Array(ev.data.sab.playerPosition);
    enemy1positions = new Float64Array(ev.data.sab.enemy1Positions);
    enemy1directions = new Float64Array(ev.data.sab.enemy1Directions);
    enemy1Hps = new Int32Array(ev.data.sab.enemy1Hps);
    autoAttack1Positions = new Float64Array(ev.data.sab.autoAttack1Positions);
    autoAttack1Enabled = new Int32Array(ev.data.sab.autoAttack1Enabled);
    flame1Positions = new Float64Array(ev.data.sab.flame1Positions);
    flame1Enabled = new Int32Array(ev.data.sab.flame1Enabled);
    kills = new Int32Array(ev.data.sab.killSab);
    port = ev.ports[0];

    enemy1pool = createEnemy1Pool(box2D, world, playerPosition, autoAttack1Enabled, enemy1filter, enemy1positions, enemy1directions, enemy1Hps, kills)

    postMessage({ cmd: "ready" });
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
    //return './' + url  // for build, dist
    // console.log(scriptDirectory)
    return "/assets/" + url; // for dev
  },
});
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World, JSContactListener, wrapPointer, getPointer, b2Filter, b2Contact } = box2D;
// in metres per second squared
const zero = new b2Vec2(0, 0);
const center = new b2Vec2(0.5, 0.5);
const gravity = zero;
export const world = new b2World(gravity); // zero gravity


const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);

const square = new b2PolygonShape();
//const enemy1pool = new Array<Box2D.b2Body>(consts.numberOfEnemy1);
const autoAttack1BodyPool = new Array<Box2D.b2Body>(consts.numberOfAutoAttack1);
const flame1BodyPool = new Array<Box2D.b2Body>(consts.numberOfFlame1);

const tempVec = new b2Vec2(0, 0);

export enum Filter {
  Enemy1 = 0x0001,
  AutoAttack1 = 0x0002,
  Player = 0x0004,
  Flame = 0x0008,
}

export let enemy1filter = new b2Filter();
enemy1filter.categoryBits = Filter.Enemy1;
enemy1filter.maskBits = Filter.AutoAttack1 | Filter.Enemy1 | Filter.Player;
enemy1filter.groupIndex = 0;

export let autoAttack1filter = new b2Filter();
autoAttack1filter.categoryBits = Filter.AutoAttack1;
autoAttack1filter.maskBits = Filter.Enemy1;
autoAttack1filter.groupIndex = 0;

export let usedBulletFilter = new b2Filter();
usedBulletFilter.categoryBits = Filter.AutoAttack1;
usedBulletFilter.maskBits = 0;
usedBulletFilter.groupIndex = 0;

export let flameFilter = new b2Filter();
flameFilter.categoryBits = Filter.Flame;
flameFilter.maskBits = Filter.Enemy1;
flameFilter.groupIndex = 0;

export let playerFilter = new b2Filter();
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

let ptrToAutoAttackBodyIndex = [] as number[];
let ptrToFlameBodyIndex = [] as number[];

let disabledEnemy1list = [] as number[];

for (let i = 0; i < consts.numberOfEnemy1; i++) {
  disabledEnemy1list[i] = i;
}

// creating boxes
//for (let i = 0; i < consts.numberOfEnemy1; i++) {
//  enemy1pool[i] = world.CreateBody(bd);
//  enemy1pool[i].CreateFixture(square, 1).SetFriction(0);
//  enemy1pool[i].GetFixtureList().SetRestitution(0);
//  enemy1pool[i].GetFixtureList().SetFilterData(enemy1filter);
//
//  enemy1pool[i].SetLinearDamping(0);
//  enemy1pool[i].SetAngularDamping(0);
//  enemy1pool[i].SetSleepingAllowed(false);
//  tempVec.Set((Math.random() - 0.5) * consts.spawnSize, (Math.random() - 0.5) * consts.spawnSize);
//  enemy1pool[i].SetTransform(tempVec, 0);
//  enemy1pool[i].SetFixedRotation(true);
//  enemy1pool[i].SetAwake(true);
//  enemy1pool[i].SetEnabled(false);
//
//  ptrToEnemyBodyIndex[getPointer(enemy1pool[i])] = i;
//}

square.SetAsBox(0.4, 0.4);
for (let i = 0; i < consts.numberOfAutoAttack1; i++) {
  autoAttack1BodyPool[i] = world.CreateBody(bd);
  autoAttack1BodyPool[i].CreateFixture(square, 5).SetFriction(0);
  autoAttack1BodyPool[i].GetFixtureList().SetRestitution(0);
  autoAttack1BodyPool[i].GetFixtureList().SetFilterData(autoAttack1filter);
  autoAttack1BodyPool[i].GetFixtureList().SetSensor(true);

  autoAttack1BodyPool[i].SetLinearDamping(0);
  autoAttack1BodyPool[i].SetAngularDamping(0);
  autoAttack1BodyPool[i].SetSleepingAllowed(false);
  autoAttack1BodyPool[i].SetFixedRotation(false);
  autoAttack1BodyPool[i].SetAwake(true);
  autoAttack1BodyPool[i].SetBullet(true);
  autoAttack1BodyPool[i].SetEnabled(false);

  ptrToAutoAttackBodyIndex[getPointer(autoAttack1BodyPool[i])] = i;
}

for (let i = 0; i < consts.numberOfFlame1; i++) {
  flame1BodyPool[i] = world.CreateBody(bd);
  flame1BodyPool[i].CreateFixture(square, 5).SetFriction(0);
  flame1BodyPool[i].GetFixtureList().SetRestitution(0);
  flame1BodyPool[i].GetFixtureList().SetSensor(true);
  flame1BodyPool[i].GetFixtureList().SetFilterData(flameFilter);

  flame1BodyPool[i].SetLinearDamping(0);
  flame1BodyPool[i].SetAngularDamping(0);
  flame1BodyPool[i].SetSleepingAllowed(false);
  flame1BodyPool[i].SetFixedRotation(false);
  flame1BodyPool[i].SetAwake(true);
  flame1BodyPool[i].SetEnabled(true);

  ptrToFlameBodyIndex[getPointer(flame1BodyPool[i])] = i;
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

let bodyBullet;
let bodyEnemy;

let disableRequest = [] as Box2D.b2Body[];

contactListener.BeginContact = (contact) => {
  contact = wrapPointer(contact as number, b2Contact);
  fixA = contact.GetFixtureA();
  fixB = contact.GetFixtureB();

  if (fixA.GetFilterData().categoryBits === Filter.AutoAttack1 || fixB.GetFilterData().categoryBits === Filter.AutoAttack1) {
    contact.SetEnabled(false)
    if (fixA.GetFilterData().categoryBits === Filter.AutoAttack1) {
      bodyBullet = fixA.GetBody();
      bodyEnemy = fixB.GetBody();
    } else if (fixB.GetFilterData().categoryBits === Filter.AutoAttack1) {
      bodyBullet = fixB.GetBody();
      bodyEnemy = fixA.GetBody();
    } else {
      return;
    }

    bodyBullet.GetFixtureList().SetFilterData(usedBulletFilter);
    disableRequest.push(bodyBullet);

    if (enemy1Hps[enemy1pool.ptrToIdx[getPointer(bodyEnemy)]] >= 0) {
      //knock back
      tempVec.x = -4 * enemy1directions[enemy1pool.ptrToIdx[getPointer(bodyEnemy)] * 2];
      tempVec.y = -4 * enemy1directions[enemy1pool.ptrToIdx[getPointer(bodyEnemy)] * 2 + 1];
      bodyEnemy.ApplyForce(tempVec, center, false);

      Atomics.sub(enemy1Hps, enemy1pool.ptrToIdx[getPointer(bodyEnemy)], 5); // damage dealt
      postMessage({
        cmd: "damage",
        x: bodyBullet.GetPosition().x,
        y: bodyBullet.GetPosition().y,
        enemyX : bodyEnemy.GetPosition().x,
        enemyY : bodyEnemy.GetPosition().y,
        dmg: 5,
      });
    }
  }


  if (fixA.GetFilterData().categoryBits === Filter.Flame || fixB.GetFilterData().categoryBits === Filter.Flame) {
    console.log('hit')
  }
};
contactListener.EndContact = () => { };
contactListener.PostSolve = () => { };
contactListener.PreSolve = () => { };

world.SetContactListener(contactListener);

let counter = 0;
let cursor = 0;
function loop() {

  if(enemy1pool) {
    //console.log(enemy1pool.pool[0].GetPosition().x, enemy1pool.pool[1].GetPosition().x)
    console.log(enemy1pool.pool[0].IsEnabled(), enemy1pool.pool[1].IsEnabled())
  }
  if (running === false) return;
  counter++;

  tempVec.x = playerPosition[0];
  tempVec.y = playerPosition[1];

  playerBody.SetTransform(tempVec, 0);

  // update shared memory buffer

  enemy1pool.updateSabPosition()


  //tempIterator = consts.numberOfEnemy1;
  //while (tempIterator--) {
  //  // skip dead
  //  if (enemy1pool[tempIterator].IsEnabled() === false) {
  //    continue;
  //  }
  //  if (enemy1Hps[tempIterator] <= 0) {
  //    // check dead
  //    if (enemy1pool[tempIterator].IsEnabled() === true) {
  //      Atomics.add(kills, 0, 1);
  //      enemy1pool[tempIterator].SetEnabled(false);
  //      disabledEnemy1list.push(tempIterator);
  //    }
  //  }
  //  indexDouble = tempIterator * 2;
  //  enemy1positions[indexDouble] = enemy1pool[tempIterator].GetPosition().x;
  //  enemy1positions[indexDouble + 1] = enemy1pool[tempIterator].GetPosition().y;
  //}

  // update shared memory buffer
  tempIterator = consts.numberOfAutoAttack1;
  while (tempIterator--) {
    if (autoAttack1Enabled[tempIterator] === 0) continue; // skip disabled

    indexDouble = tempIterator * 2;
    autoAttack1Positions[indexDouble] = autoAttack1BodyPool[tempIterator].GetPosition().x;
    autoAttack1Positions[indexDouble + 1] = autoAttack1BodyPool[tempIterator].GetPosition().y;
  }

  tempIterator = consts.numberOfFlame1;
  while (tempIterator--) {
    if (flame1Enabled[tempIterator] === 0) continue; // skip disabled

    indexDouble = tempIterator * 2;
    flame1Positions[indexDouble] = flame1BodyPool[tempIterator].GetPosition().x;
    flame1Positions[indexDouble + 1] = flame1BodyPool[tempIterator].GetPosition().y;
  }

  enemy1pool.updateVelocity()
  //tempIterator = consts.numberOfEnemy1;
  //while (tempIterator--) {
  //  tempVec.x = playerPosition[0];
  //  tempVec.y = playerPosition[1];
  //  tempVec.op_sub(enemy1pool[tempIterator].GetPosition());
  //  tempVec.Normalize();
  //  tempVec.op_mul(consts.enemy1speed);
//
  //  //enemy1pool[tempIterator].SetLinearVelocity(tempVec);
  //  indexDouble = tempIterator * 2;
  //  tempVec.set_x(enemy1directions[indexDouble]);
  //  tempVec.set_y(enemy1directions[indexDouble + 1]);
  //  enemy1pool[tempIterator].SetLinearVelocity(tempVec);
  //}

  world.Step(stepTime, 8, 3);
  for (let i = 0; i < disableRequest.length; i++) {
    if (disableRequest[i].GetFixtureList().GetFilterData().categoryBits === Filter.AutoAttack1) {
      autoAttack1Enabled[ptrToAutoAttackBodyIndex[getPointer(disableRequest[i])]] = 0;
      disableRequest[i].SetEnabled(false);
    }
  }

  disableRequest = [];

  // request for calculate to worker2
  port.postMessage(0);

  // calculate elapsed and determine the interval to next step
  now = Date.now();
  delta = now - lastExecuted;
  lastExecuted = now;

  if (delta > consts.worker1interval + 5) {
    if (delta > 500) {
      stepTime = 500;
    } else {
      stepTime = delta;
    }
  } else {
    stepTime = consts.worker1interval;
  }

  if (counter % 5 === 0) {
    //console.log('gen')
    enemy1pool.gen()

    //if (disabledEnemy1list.length > 0) {
    //  let genIndex = disabledEnemy1list.pop() as number;
    //  if (enemy1Hps[genIndex] <= 0) {
    //    let tempDistance = Math.random() * 10 + consts.spawnSize / 2;
    //    let tempAngle = Math.random() * Math.PI * 2;
    //    let tempDiffX = Math.cos(tempAngle) * tempDistance;
    //    let tempDiffY = Math.sin(tempAngle) * tempDistance;
    //    tempVec.x = playerPosition[0] + tempDiffX;
    //    tempVec.y = playerPosition[1] + tempDiffY;
    //    enemy1positions[genIndex * 2] = tempVec.x;
    //    enemy1positions[genIndex * 2 + 1] = tempVec.y;
    //    enemy1pool[genIndex].SetTransform(tempVec, 0);
    //    enemy1Hps[genIndex] = 10;
    //    enemy1pool[genIndex].SetEnabled(true);
    //  }
    //}
  }
}

let autoAttackCounter = 0;
let tempPlayerPosX, tempPlayerPosY;

function fire() {
  autoAttackCounter++;
  if (autoAttackCounter === consts.numberOfAutoAttack1) {
    autoAttackCounter = 0;
  }
  tempPlayerPosX = playerPosition[0];
  tempPlayerPosY = playerPosition[1];

  tempVec.x = tempPlayerPosX - 0.1;
  tempVec.y = tempPlayerPosY - 1;
  autoAttack1Positions[autoAttackCounter * 2] = tempVec.x;
  autoAttack1Positions[autoAttackCounter * 2 + 1] = tempVec.y;

  autoAttack1BodyPool[autoAttackCounter].SetTransform(tempVec, 0);

  tempVec.x = 0;
  tempVec.y = -consts.autoAttack1Speed;
  autoAttack1BodyPool[autoAttackCounter].SetLinearVelocity(tempVec);
  autoAttack1Enabled[autoAttackCounter] = 1;
  autoAttack1BodyPool[autoAttackCounter].SetEnabled(true);
  autoAttack1BodyPool[autoAttackCounter].GetFixtureList().SetFilterData(autoAttack1filter);
}

let flameCounter = 0;
function flame() {
  flameCounter++;
  if (flameCounter === consts.numberOfFlame1) {
    flameCounter = 0;
  }
  tempPlayerPosX = playerPosition[0];
  tempPlayerPosY = playerPosition[1];
  tempVec.x = tempPlayerPosX - 0.1;
  tempVec.y = tempPlayerPosY + 0.5;
  flame1BodyPool[flameCounter].SetTransform(tempVec, 0);
  flame1Positions[flameCounter * 2] = tempPlayerPosX;
  flame1Positions[flameCounter * 2 + 1] = tempPlayerPosY;
  tempVec.x = 0;
  tempVec.y = consts.flame1Speed;
  flame1BodyPool[flameCounter].SetLinearVelocity(tempVec);
  flame1Enabled[flameCounter] = 1;
  flame1BodyPool[flameCounter].SetEnabled(true);
  flame1BodyPool[flameCounter].GetFixtureList().SetSensor(true);
}

export default Worker;
