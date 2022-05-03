// this worker calculates enemy1's collision and its resolving

import Box2DFactory from 'box2d-wasm' // ....
import consts from '../type/const'
import { createEnemy1Pool, Enemy1Pool } from './enemy1'
import { createAutoAttack1Pool, AutoAttack1Pool } from './autoAttack1'
import { createFlame1Pool, Flame1Pool } from './flame1'
import { SabSet } from './sabManage'
/** shared arrays in worker1 */
export declare interface Isa {
  playerPosition: { x: Float64Array, y: Float64Array, }
  enemy1Positions: { x: Float64Array, y: Float64Array, }
  enemy1Directions: { x: Float64Array, y: Float64Array, }
  autoAttack1Positions: { x: Float64Array, y: Float64Array, }
  flame1Positions: { x: Float64Array, y: Float64Array, }
  enemy1Hps: Int32Array,
  autoAttack1Enabled: Int32Array, 
  flame1Enabled: Int32Array,
  kills: Int32Array,
}

/** shared arrays */
export let sa: Isa

export let port: MessagePort

let loopInterval: number
let running = false

let enemy1Pool: Enemy1Pool
let autoAttack1Pool: AutoAttack1Pool
let flame1Pool: Flame1Pool

onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    running = false
    // pause
  } else if (ev.data.cmd === 'start') {
    running = true
    loopInterval = setInterval(loop, consts.worker1Interval)
  } else if (ev.data.cmd === 'close') {
    running = false
    clearInterval(loopInterval)
    sa.playerPosition = { x: new Float64Array(), y: new Float64Array() }
    sa.enemy1Positions = { x: new Float64Array(), y: new Float64Array() }
    sa.enemy1Hps = new Int32Array()
    self.close()
  } else if (ev.data.cmd === 'fire') {
    autoAttack1Pool.fire()
    // fire();
  } else if (ev.data.cmd === 'flame') {
    flame1Pool.fire()
  } else if (ev.data.cmd === 'init') {
    const tempSab = ev.data.sab as SabSet

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
      flame1Positions: {
        x: new Float64Array(tempSab.flame1Positions.x),
        y: new Float64Array(tempSab.flame1Positions.y)
      },
      flame1Enabled: new Int32Array(tempSab.flame1Enabled),
      kills: new Int32Array(tempSab.kills)
    }

    port = ev.ports[0]
    enemy1Pool = createEnemy1Pool(box2D, world, sa)
    autoAttack1Pool = createAutoAttack1Pool(box2D, world, sa)
    flame1Pool = createFlame1Pool(box2D, world, sa)
    postMessage({ cmd: 'ready' })
  }
}

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
    return '/assets/' + url // for dev
  }
})
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World, JSContactListener, wrapPointer, getPointer, b2Filter, b2Contact } = box2D

export enum Filter {
  Enemy1 = 0x0001,
  AutoAttack1 = 0x0002,
  Player = 0x0004,
  Flame = 0x0008,
}

const zero = new b2Vec2(0, 0)
const center = new b2Vec2(0.5, 0.5)
const gravity = zero
export const world = new b2World(gravity) // zero gravity

const bd = new b2BodyDef()
bd.set_type(b2_dynamicBody)

const square = new b2PolygonShape()

const tempVec = new b2Vec2(0, 0)

export const autoAttack1Filter = new b2Filter()
autoAttack1Filter.categoryBits = Filter.AutoAttack1
autoAttack1Filter.maskBits = Filter.Enemy1

export const usedBulletFilter = new b2Filter()
usedBulletFilter.categoryBits = Filter.AutoAttack1
usedBulletFilter.maskBits = 0

export const playerFilter = new b2Filter()
playerFilter.categoryBits = Filter.Player
playerFilter.maskBits = Filter.Enemy1

square.SetAsBox(0.6, 0.6)
const playerBody = world.CreateBody(bd)
playerBody.CreateFixture(square, 1).SetFriction(0)
playerBody.GetFixtureList().SetRestitution(0)
playerBody.GetFixtureList().SetFilterData(playerFilter)

playerBody.SetLinearDamping(0)
playerBody.SetAngularDamping(0)
playerBody.SetSleepingAllowed(false)
playerBody.SetEnabled(true)

let lastExecuted = Date.now()
let delta = 0
let now = 0
let stepTime = 0

const contactListener = new JSContactListener()
let disableRequest = [] as Box2D.b2Body[]

contactListener.BeginContact = (contact) => {
  contact = wrapPointer(contact as number, b2Contact)
  const fixA = contact.GetFixtureA()
  const fixB = contact.GetFixtureB()
  let bodyBullet
  let bodyEnemy

  if (fixA.GetFilterData().categoryBits === Filter.AutoAttack1 || fixB.GetFilterData().categoryBits === Filter.AutoAttack1) {
    contact.SetEnabled(false)
    if (fixA.GetFilterData().categoryBits === Filter.AutoAttack1) {
      bodyBullet = fixA.GetBody()
      bodyEnemy = fixB.GetBody()
    } else if (fixB.GetFilterData().categoryBits === Filter.AutoAttack1) {
      bodyBullet = fixB.GetBody()
      bodyEnemy = fixA.GetBody()
    } else {
      return
    }

    bodyBullet.GetFixtureList().SetFilterData(usedBulletFilter)
    disableRequest.push(bodyBullet)

    const tempIndex = enemy1Pool.getIndex(bodyEnemy)
    if (sa.enemy1Hps[tempIndex] > 0) {
      // knock back
      tempVec.Set(-4 * sa.enemy1Directions.x[tempIndex], -4 * sa.enemy1Directions.y[tempIndex])
      bodyEnemy.ApplyForce(tempVec, center, false)

      Atomics.sub(sa.enemy1Hps, tempIndex, 5) // damage dealt
      postMessage({
        cmd: 'damage',
        x: bodyBullet.GetPosition().x,
        y: bodyBullet.GetPosition().y,
        enemyX: bodyEnemy.GetPosition().x,
        enemyY: bodyEnemy.GetPosition().y,
        dmg: 5
      })
    }
  }

  if (fixA.GetFilterData().categoryBits === Filter.Flame || fixB.GetFilterData().categoryBits === Filter.Flame) {
    console.log('hit')
  }
}
contactListener.EndContact = () => { }
contactListener.PostSolve = () => { }
contactListener.PreSolve = () => { }

world.SetContactListener(contactListener)

let counter = 0
function loop() {
  if (running === false) return
  counter++

  tempVec.Set(sa.playerPosition.x[0], sa.playerPosition.y[0])
  playerBody.SetTransform(tempVec, 0)

  // update shared memory buffer
  autoAttack1Pool.updateSabPosition()
  flame1Pool.updateSabPosition()
  enemy1Pool.updateSabPosition()
  enemy1Pool.updateVelocity()

  world.Step(stepTime, 8, 3) /** World STEP */

  for (let i = 0; i < disableRequest.length; i++) {
    if (disableRequest[i].GetFixtureList().GetFilterData().categoryBits === Filter.AutoAttack1) {
      autoAttack1Pool.disableByPtr(getPointer(disableRequest[i]))
    }
  }

  disableRequest = []

  // request for calculate to worker2
  // maybe try async calculation...
  port.postMessage(0)

  // calculate elapsed and determine the interval to next step
  now = Date.now()
  delta = now - lastExecuted
  lastExecuted = now

  if (delta > consts.worker1Interval + 5) {
    if (delta > 500) {
      stepTime = 500
    } else {
      stepTime = delta
    }
  } else {
    stepTime = consts.worker1Interval
  }

  if (counter % 10 === 0) {
    enemy1Pool.gen()
  }
}

export default Worker
