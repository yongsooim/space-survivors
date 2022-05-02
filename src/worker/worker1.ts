// this worker calculates enemy1's collision and its resolving

import Box2DFactory from 'box2d-wasm'; // ....
import consts from '../type/const';
import { createAutoAttack1Pool } from './autoAttack1'
import { createFlame1Pool } from './flame1'
import { createEnemy1Pool } from './enemy1'

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

onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    running = false;
    // pause
  } else if (ev.data.cmd === 'start') {
    running = true;
    loopInterval = setInterval(loop, consts.worker1interval);
  } else if (ev.data.cmd === 'close') {
    running = false;
    clearInterval(loopInterval);
    playerPosition = new Float64Array();
    enemy1positions = new Float64Array();
    enemy1Hps = new Int32Array();
    self.close();
  } else if (ev.data.cmd === 'fire') {
    aa1pool.fire();
  } else if (ev.data.cmd === 'flame') {
    flame1pool.fire();
  } else if (ev.data.cmd === 'init') {
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
    postMessage({ cmd: 'ready' });
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
    //return './' + url  // for build, dist
    return '/assets/' + url; // for dev
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

export let flame1Filter = new b2Filter();
flame1Filter.categoryBits = Filter.Flame;
flame1Filter.maskBits = Filter.Enemy1;
flame1Filter.groupIndex = 0;

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

const enemy1pool = createEnemy1Pool()
const aa1pool = createAutoAttack1Pool()
const flame1pool = createFlame1Pool()

let lastExecuted = Date.now();
let delta = 0;
let now = 0;
let stepTime = 0;

let contactListener = new JSContactListener();
let fixtureA;
let fixtureB;

let bodyBullet;
let bodyEnemy;

let disableRequest = [] as Box2D.b2Body[];

contactListener.BeginContact = (contact) => {
  contact = wrapPointer(contact as number, b2Contact);
  fixtureA = contact.GetFixtureA();
  fixtureB = contact.GetFixtureB();

  if (fixtureA.GetFilterData().categoryBits === Filter.AutoAttack1 || fixtureB.GetFilterData().categoryBits === Filter.AutoAttack1) {
    if (fixtureA.GetFilterData().categoryBits === Filter.AutoAttack1) {
      bodyBullet = fixtureA.GetBody();
      bodyEnemy = fixtureB.GetBody();
    } else if (fixtureB.GetFilterData().categoryBits === Filter.AutoAttack1) {
      bodyBullet = fixtureB.GetBody();
      bodyEnemy = fixtureA.GetBody();
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
        cmd: 'damage',
        x: (bodyBullet.GetPosition().x + bodyEnemy.GetPosition().x) / 2,
        y: (bodyBullet.GetPosition().y + bodyEnemy.GetPosition().y) / 2,
        dmg: 5,
      });
    }
  }
  if (fixtureA.GetFilterData().categoryBits === Filter.Flame || fixtureB.GetFilterData().categoryBits === Filter.Flame) {
    console.log('hit')
  }
}
contactListener.EndContact = () => { };
contactListener.PostSolve = () => { };
contactListener.PreSolve = () => { };

world.SetContactListener(contactListener);

let counter = 0;
function loop() {
  if (running === false) return;
  counter++;

  tempVec.x = playerPosition[0];
  tempVec.y = playerPosition[1];

  playerBody.SetTransform(tempVec, 0);

  enemy1pool.checkDead()

  aa1pool.updateSabPosition()
  enemy1pool.updateSabPosition()
  flame1pool.updateSabPosition()

  // update shared memory buffer
  enemy1pool.updateVelocity()

  // STEP
  world.Step(stepTime, 8, 3);

  // calc enemy -> player direction
  port.postMessage(0);

  for (let i = 0; i < disableRequest.length; i++) {
    if (disableRequest[i].GetFixtureList().GetFilterData().categoryBits === Filter.AutoAttack1) {
      aa1pool.disableByPtr(getPointer(disableRequest[i]))
    }
  }

  disableRequest = [];

  // calculate elapsed and determine the interval to next step
  now = Date.now();
  delta = now - lastExecuted;
  lastExecuted = now;

  if (delta > 500) { // maximum step time
    stepTime = 500;
  } else if (delta > consts.worker1interval + 5) { // tolerant step time : 5ms
    stepTime = delta;
  } else {
    stepTime = consts.worker1interval;
  }

  if (counter % 5 === 0) {
    enemy1pool.gen()
  }
}

export default Worker;
