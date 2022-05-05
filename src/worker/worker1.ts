// this worker calculates enemy1's collision and its resolving

import Box2DFactory from "box2d-wasm"; // ....
import consts from "../type/const";
import { createEnemy1Pool, Enemy1Pool } from "./enemy1";
import { createAutoAttack1Pool, AutoAttack1Pool } from "./autoAttack1";
import { createFlame1Pool, Flame1Pool } from "./flame1";
import { SabSet } from "./sabManage";
import { Isa, Filter } from './workerGlobal'
/** shared arrays in worker1 */

/** shared arrays */
export let sa: Isa;
export let port: MessagePort;

let loopInterval: number;
let loaded = false
let running = false;

let enemy1Pool: Enemy1Pool;
let autoAttack1Pool: AutoAttack1Pool;
let flame1Pool: Flame1Pool;

console.log('?')
onmessage = (ev) => {
  if (ev.data.cmd === "stop") {
    clearInterval(loopInterval);
    running = false;

    // pause
  } else if (ev.data.cmd === "start") {
    loopInterval = setInterval(loop, consts.worker1Interval);
    lastExecuted = Date.now()
    running = true;
  } else if (ev.data.cmd === "close") {
    running = false;
    clearInterval(loopInterval);
    sa.playerPosition = { x: new Float64Array(), y: new Float64Array() };
    sa.enemy1Hps = new Int32Array();
    self.close();
  } else if (ev.data.cmd === "fire") {
    autoAttack1Pool.fire();
    // fire();
  } else if (ev.data.cmd === "flame") {
    flame1Pool.fire();
  } else if (ev.data.cmd === "init") {
    const tempSab = ev.data.sab as SabSet;

    sa = {
      // setting shared arrays
      playerPosition: {
        x: new Float64Array(tempSab.playerPosition.x),
        y: new Float64Array(tempSab.playerPosition.y),
      },
      enemy1Positions: {
        x: new Float64Array(tempSab.enemy1Positions.x),
        y: new Float64Array(tempSab.enemy1Positions.y),
      },
      enemy1Directions: {
        x: new Float64Array(tempSab.enemy1Directions.x),
        y: new Float64Array(tempSab.enemy1Directions.y),
      },
      enemy1Hps: new Int32Array(tempSab.enemy1Hps),
      autoAttack1Positions: {
        x: new Float64Array(tempSab.autoAttack1Positions.x),
        y: new Float64Array(tempSab.autoAttack1Positions.y),
      },
      autoAttack1Enabled: new Int32Array(tempSab.autoAttack1Enabled),
      flame1Positions: {
        x: new Float64Array(tempSab.flame1Positions.x),
        y: new Float64Array(tempSab.flame1Positions.y),
      },
      flame1Enabled: new Int32Array(tempSab.flame1Enabled),
      kills: new Int32Array(tempSab.kills),
    };

    port = ev.ports[0];
    enemy1Pool = createEnemy1Pool(box2D, world, sa);
    autoAttack1Pool = createAutoAttack1Pool(box2D, world, sa);
    flame1Pool = createFlame1Pool(box2D, world, sa);
    postMessage({ cmd: "ready" });
  }
};

export const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
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
    return "/assets/" + url; // for dev
  },
});

const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World, JSContactListener, wrapPointer, getPointer, b2Filter, b2Contact } = box2D;


const zero = new b2Vec2(0, 0);
const center = new b2Vec2(0.5, 0.5);
const gravity = zero;
export const world = new b2World(gravity); // zero gravity

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);

const square = new b2PolygonShape();

const tempVec = new b2Vec2(0, 0);


export const playerFilter = new b2Filter();
playerFilter.categoryBits = Filter.Player;
playerFilter.maskBits = Filter.Enemy1;

square.SetAsBox(0.6, 0.6);
const playerBody = world.CreateBody(bd);
playerBody.CreateFixture(square, 1).SetFriction(0);
playerBody.GetFixtureList().SetRestitution(0);
playerBody.GetFixtureList().SetFilterData(playerFilter);

playerBody.SetLinearDamping(0);
playerBody.SetAngularDamping(0);
playerBody.SetSleepingAllowed(false);
playerBody.SetEnabled(true);

const usedBulletFilter = new b2Filter();
usedBulletFilter.categoryBits = Filter.AutoAttack1;
usedBulletFilter.maskBits = 0;

let lastExecuted = Date.now();
let delta = 0;
let now = 0;
let stepTime = 0;

const contactListener = new JSContactListener();
let disableRequest = [] as Box2D.b2Body[];

contactListener.BeginContact = (contact) => {
  contact = wrapPointer(contact as number, b2Contact);
  const fixA = contact.GetFixtureA();
  const fixB = contact.GetFixtureB();
  let bodyBullet;
  let bodyEnemy;

  if (fixA.GetFilterData().categoryBits === Filter.AutoAttack1 || fixB.GetFilterData().categoryBits === Filter.AutoAttack1) {
    contact.SetEnabled(false);
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

    const tempIndex = enemy1Pool.getIndex(bodyEnemy);
    if (sa.enemy1Hps[tempIndex] > 0) {
      // knock back
      tempVec.Set(-30 * sa.enemy1Directions.x[tempIndex], -30 * sa.enemy1Directions.y[tempIndex]);
      bodyEnemy.ApplyLinearImpulse(tempVec, center, true);
      //bodyEnemy.ApplyForce(tempVec, center, false);

      Atomics.sub(sa.enemy1Hps, tempIndex, 5); // damage dealt
      postMessage({
        cmd: "damage",
        x: bodyBullet.GetPosition().x,
        y: bodyBullet.GetPosition().y,
        enemyX: bodyEnemy.GetPosition().x,
        enemyY: bodyEnemy.GetPosition().y,
        damage: 5,
      });
    }
  }

  if (fixA.GetFilterData().categoryBits === Filter.Flame || fixB.GetFilterData().categoryBits === Filter.Flame) {
    //contact.SetEnabled(false);
    console.log("hit");

    if (fixA.GetFilterData().categoryBits === Filter.Flame) {
      bodyBullet = fixA.GetBody();
      bodyEnemy = fixB.GetBody();
    } else if (fixB.GetFilterData().categoryBits === Filter.Flame) {
      bodyBullet = fixB.GetBody();
      bodyEnemy = fixA.GetBody();
    } else {
      return;
    }
    
    //disableRequest.push(bodyBullet);

    const tempIndex = enemy1Pool.getIndex(bodyEnemy);
    if (sa.enemy1Hps[tempIndex] > 0) {

      Atomics.sub(sa.enemy1Hps, tempIndex, 8); // damage dealt
      postMessage({
        cmd: "damage",
        x: bodyBullet.GetPosition().x,
        y: bodyBullet.GetPosition().y,
        enemyX: bodyEnemy.GetPosition().x,
        enemyY: bodyEnemy.GetPosition().y,
        damage: 8,
      });
    }
  }
};
contactListener.EndContact = () => {};
contactListener.PostSolve = () => {};
contactListener.PreSolve = () => {};

world.SetContactListener(contactListener);


let sum = 0
let count = 0

let counter = 0;

function loop() {
  if (running === false) return;
  counter++;

  tempVec.Set(sa.playerPosition.x[0], sa.playerPosition.y[0]);
  playerBody.SetTransform(tempVec, 0);

  enemy1Pool.checkDead();

  //port.postMessage(0);

  // update shared memory buffer
  autoAttack1Pool.updateSabPosition();
  flame1Pool.updateSabPosition();
  enemy1Pool.updateSabPosition();
  enemy1Pool.updateVelocity();
  
  world.Step(stepTime, 8, 3);

  for (let i = 0; i < disableRequest.length; i++) {
    if (disableRequest[i].GetFixtureList().GetFilterData().categoryBits === Filter.AutoAttack1) {
      autoAttack1Pool.disableByPtr(getPointer(disableRequest[i]));
    }
  }

  disableRequest = [];

  // request for calculate to worker2
  // maybe try async calculation...

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

  if (counter % 1 === 0) {
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
    enemy1Pool.gen();
  }
}

postMessage({ cmd: "loaded" });
loaded = true
