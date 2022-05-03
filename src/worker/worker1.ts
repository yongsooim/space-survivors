// this worker calculates enemy1's collision and its resolving

import Box2DFactory from "box2d-wasm"; // ....
import consts from "../type/const";
import { createEnemy1Pool, Enemy1Pool } from "./enemy1";
import { SabSet } from './sabManage'
/** shared arrays in worker1 */
export declare interface Isa {
  playerPosition: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy1Positions: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy1Directions: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy1Hps: Int32Array,
  autoAttack1Positions: {
    x: Float64Array,
    y: Float64Array,
  }
  autoAttack1Enabled: Int32Array,
  flame1Positions: {
    x: Float64Array,
    y: Float64Array,
  }
  flame1Enabled: Int32Array,
  kills: Int32Array,
}

/** shared arrays */
export let sa: Isa

export let port: MessagePort;

let loopInterval: number;
let running = false;

let enemy1pool: Enemy1Pool

onmessage = (ev) => {
  if (ev.data.cmd === "stop") {
    running = false;
    // pause
  } else if (ev.data.cmd === "start") {
    running = true;
    loopInterval = setInterval(loop, consts.worker1Interval);
  } else if (ev.data.cmd === "close") {
    running = false;
    clearInterval(loopInterval);
    sa.playerPosition = {
      x: new Float64Array(),
      y: new Float64Array()
    }
    sa.enemy1Positions = {
      x: new Float64Array(),
      y: new Float64Array()
    }
    sa.enemy1Hps = new Int32Array();
    self.close();
  } else if (ev.data.cmd === "fire") {
    //autoAttack1Pool.fire()
    //fire();
  } else if (ev.data.cmd === "flame") {
    flame();
  } else if (ev.data.cmd === "init") {
    let tempSab = ev.data.sab as SabSet

    sa = { // setting shared arrays
      playerPosition: {
        x: new Float64Array(tempSab.playerPosition.x),
        y: new Float64Array(tempSab.playerPosition.y)
      },
      enemy1Positions: {
        x: new Float64Array(tempSab.enemy1Positions.x),
        y: new Float64Array(tempSab.enemy1Positions.y)
      },
      enemy1Directions: {
        x: new Float64Array(tempSab.enemy1Directions.x),
        y: new Float64Array(tempSab.enemy1Directions.y)
      },
      enemy1Hps: new Int32Array(tempSab.enemy1Hps),
      autoAttack1Positions: {
        x: new Float64Array(tempSab.autoAttack1Positions.x),
        y: new Float64Array(tempSab.autoAttack1Positions.y)
      },

      autoAttack1Enabled: new Int32Array(tempSab.autoAttack1Enabled),
      flame1Positions:{
        x: new Float64Array(tempSab.flame1Positions.x),
        y: new Float64Array(tempSab.flame1Positions.y),
      } ,
      flame1Enabled: new Int32Array(tempSab.flame1Enabled),
      kills: new Int32Array(tempSab.killSab),
    }

    port = ev.ports[0];
    enemy1pool = createEnemy1Pool(box2D, world, enemy1Filter, sa)
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
let indexDouble;
let tempIterator;

export enum Filter {
  Enemy1 = 0x0001,
  AutoAttack1 = 0x0002,
  Player = 0x0004,
  Flame = 0x0008,
}

export let enemy1Filter = new b2Filter();
enemy1Filter.categoryBits = Filter.Enemy1;
enemy1Filter.maskBits = Filter.AutoAttack1 | Filter.Enemy1 | Filter.Player;
enemy1Filter.groupIndex = 0;

export let autoAttack1Filter = new b2Filter();
autoAttack1Filter.categoryBits = Filter.AutoAttack1;
autoAttack1Filter.maskBits = Filter.Enemy1;
autoAttack1Filter.groupIndex = 0;

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

square.SetAsBox(0.4, 0.4);
for (let i = 0; i < consts.numberOfAutoAttack1; i++) {
  autoAttack1BodyPool[i] = world.CreateBody(bd);
  autoAttack1BodyPool[i].CreateFixture(square, 5).SetFriction(0);
  autoAttack1BodyPool[i].GetFixtureList().SetRestitution(0);
  autoAttack1BodyPool[i].GetFixtureList().SetFilterData(autoAttack1Filter);
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

let lastExecuted = Date.now();
let delta = 0;
let now = 0;
let stepTime = 0;

let contactListener = new JSContactListener();
let disableRequest = [] as Box2D.b2Body[];

contactListener.BeginContact = (contact) => {
  contact = wrapPointer(contact as number, b2Contact);
  let fixA = contact.GetFixtureA();
  let fixB = contact.GetFixtureB();
  let bodyBullet;
  let bodyEnemy;

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

    let tempIndex = enemy1pool.getIndex(bodyEnemy)
    if (sa.enemy1Hps[tempIndex] >= 0) {
      //knock back
      tempVec.x = -4 * sa.enemy1Directions.x[tempIndex];
      tempVec.y = -4 * sa.enemy1Directions.y[tempIndex + 1];
      bodyEnemy.ApplyForce(tempVec, center, false);

      Atomics.sub(sa.enemy1Hps, tempIndex, 5); // damage dealt
      postMessage({
        cmd: "damage",
        x: bodyBullet.GetPosition().x,
        y: bodyBullet.GetPosition().y,
        enemyX: bodyEnemy.GetPosition().x,
        enemyY: bodyEnemy.GetPosition().y,
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
function loop() {
  if (running === false) return;
  counter++;

  tempVec.x = sa.playerPosition.x[0];
  tempVec.y = sa.playerPosition.y[0];

  playerBody.SetTransform(tempVec, 0);


  // update shared memory buffer
  tempIterator = consts.numberOfAutoAttack1;
  while (tempIterator--) {
    if (sa.autoAttack1Enabled[tempIterator] === 0) continue; // skip disabled

    indexDouble = tempIterator * 2;
    sa.autoAttack1Positions.x[tempIterator] = autoAttack1BodyPool[tempIterator].GetPosition().x;
    sa.autoAttack1Positions.y[tempIterator] = autoAttack1BodyPool[tempIterator].GetPosition().y;
  }

  tempIterator = consts.numberOfFlame1;
  while (tempIterator--) {
    if (sa.flame1Enabled[tempIterator] === 0) continue; // skip disabled

    indexDouble = tempIterator * 2;
    sa.flame1Positions.x[tempIterator] = flame1BodyPool[tempIterator].GetPosition().x;
    sa.flame1Positions.y[tempIterator] = flame1BodyPool[tempIterator].GetPosition().y;
  }

  enemy1pool.updateSabPosition()
  enemy1pool.updateVelocity()

  world.Step(stepTime, 8, 3);
  for (let i = 0; i < disableRequest.length; i++) {
    if (disableRequest[i].GetFixtureList().GetFilterData().categoryBits === Filter.AutoAttack1) {
      sa.autoAttack1Enabled[ptrToAutoAttackBodyIndex[getPointer(disableRequest[i])]] = 0;
      disableRequest[i].SetEnabled(false);
    }
  }

  disableRequest = [];

  // request for calculate to worker2
  // try async sometime..
  port.postMessage(0);

  // calculate elapsed and determine the interval to next step
  now = Date.now();
  delta = now - lastExecuted;
  lastExecuted = now;

  if (delta > consts.worker1Interval + 5) {
    if (delta > 500) {
      stepTime = 500;
    } else {
      stepTime = delta;
    }
  } else {
    stepTime = consts.worker1Interval;
  }

  if (counter % 10 === 0) {
    enemy1pool.gen()
  }
}

let autoAttackCounter = 0;
let tempPlayerPosX, tempPlayerPosY;


let flameCounter = 0;
function flame() {
  flameCounter++;
  if (flameCounter === consts.numberOfFlame1) {
    flameCounter = 0;
  }
  tempPlayerPosX = sa.playerPosition.x[0];
  tempPlayerPosY = sa.playerPosition.y[0];
  tempVec.x = tempPlayerPosX - 0.1;
  tempVec.y = tempPlayerPosY + 0.5;
  flame1BodyPool[flameCounter].SetTransform(tempVec, 0);
  sa.flame1Positions.x[flameCounter] = tempPlayerPosX;
  sa.flame1Positions.y[flameCounter + 1] = tempPlayerPosY;
  tempVec.x = 0;
  tempVec.y = consts.flame1Speed;
  flame1BodyPool[flameCounter].SetLinearVelocity(tempVec);
  sa.flame1Enabled[flameCounter] = 1;
  flame1BodyPool[flameCounter].SetEnabled(true);
  flame1BodyPool[flameCounter].GetFixtureList().SetSensor(true);
}

export default Worker;
