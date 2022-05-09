// this worker calculates enemy1's collision and its resolving

import Box2DFactory from 'box2d-wasm' // ....
import consts from '../type/const'
import { createEnemy1Pool, Enemy1Pool } from './enemy1'
import { createEnemy2Pool, Enemy2Pool } from './enemy2'
import { createEnemy3Pool, Enemy3Pool } from './enemy3'
import { createAutoAttack1Pool, AutoAttack1Pool } from './autoAttack1'
import { createFlame1Pool, Flame1Pool } from './flame1'
import { SabSet } from './sabManage'
import { Isa, Filter } from './workerGlobal'
import { enemy1 } from '../resource/spriteManage'
import { ptrToInfo } from './ptrToInfo'
import { worker1check } from './worker1master'

/** shared arrays in worker1 */

/** shared arrays */
let sa: Isa
export let port: MessagePort

let loopInterval: number
let loaded = false
let running = false

let enemy1Pool: Enemy1Pool
let enemy2Pool: Enemy2Pool
let enemy3Pool: Enemy3Pool
let autoAttack1Pool: AutoAttack1Pool
let flame1Pool: Flame1Pool
let missile1Pool: Flame1Pool


export interface Info {
  category : string,
  type : string, 
  attribute : string, 
  damage? : number
}


onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    clearInterval(loopInterval)
    running = false

    // pause
  } else if (ev.data.cmd === 'start') {
    loopInterval = setInterval(loop, consts.worker1Interval)
    lastExecuted = Date.now()
    running = true
  } else if (ev.data.cmd === 'close') {
    running = false
    clearInterval(loopInterval)
    sa.playerPosition = { x: new Float64Array(), y: new Float64Array() }
    sa.enemy1Hps = new Int32Array()
    self.close()
  } else if (ev.data.cmd === 'fire') {
    autoAttack1Pool.fire()
    // fire()
  } else if (ev.data.cmd === 'flame') {
    flame1Pool.fire()
  } else if (ev.data.cmd === 'missile') {
    //missile1Pool.fire()
  } else if (ev.data.cmd === 'init') {
    const tempSab = ev.data.sab as SabSet

    sa = {
      // setting shared arrays
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

      enemy2Positions: {
        x: new Float64Array(tempSab.enemy2Positions.x),
        y: new Float64Array(tempSab.enemy2Positions.y)
      },
      enemy2Directions: {
        x: new Float64Array(tempSab.enemy2Directions.x),
        y: new Float64Array(tempSab.enemy2Directions.y)
      },
      enemy2Hps: new Int32Array(tempSab.enemy2Hps),

      enemy3Positions: {
        x: new Float64Array(tempSab.enemy3Positions.x),
        y: new Float64Array(tempSab.enemy3Positions.y)
      },
      enemy3Directions: {
        x: new Float64Array(tempSab.enemy3Directions.x),
        y: new Float64Array(tempSab.enemy3Directions.y)
      },
      enemy3Hps: new Int32Array(tempSab.enemy3Hps),

      autoAttack1Positions: {
        x: new Float64Array(tempSab.autoAttack1Positions.x),
        y: new Float64Array(tempSab.autoAttack1Positions.y)
      },
      autoAttack1RemainTimes: new Int32Array(tempSab.autoAttack1RemainTimes),

      flame1Positions: {
        x: new Float64Array(tempSab.flame1Positions.x),
        y: new Float64Array(tempSab.flame1Positions.y)
      },
      flame1RemainTimes: new Int32Array(tempSab.flame1RemainTimes),

      missile1Positions: {
        x: new Float64Array(tempSab.missile1Positions.x),
        y: new Float64Array(tempSab.missile1Positions.y)
      },

      missile1RemainTimes: new Int32Array(tempSab.missile1RemainTimes),
      kills: new Int32Array(tempSab.kills)
    }

    port = ev.ports[0]
    enemy1Pool = createEnemy1Pool(box2D, world, sa)
    enemy2Pool = createEnemy2Pool(box2D, world, sa)
    enemy3Pool = createEnemy3Pool(box2D, world, sa)
    autoAttack1Pool = createAutoAttack1Pool(box2D, world, sa)
    //missile1Pool = createmissile1Pool(box2D, world, sa)
    flame1Pool = createFlame1Pool(box2D, world, sa)

    postMessage({ cmd: 'ready' })
  }
}

export const box2D = await Box2DFactory({
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


const zero = new b2Vec2(0, 0)
const center = new b2Vec2(0.5, 0.5)
const gravity = zero
export const world = new b2World(gravity) // zero gravity

const bd = new b2BodyDef()
bd.set_type(b2_dynamicBody)

const square = new b2PolygonShape()

const tempVec = new b2Vec2(0, 0)

export const playerFilter = new b2Filter()
playerFilter.categoryBits = Filter.Player
playerFilter.maskBits = Filter.Enemy1 | Filter.Enemy2

square.SetAsBox(0.6, 0.6)
const playerBody = world.CreateBody(bd)
playerBody.CreateFixture(square, 1).SetFriction(0)
playerBody.GetFixtureList().SetRestitution(0)
playerBody.GetFixtureList().SetFilterData(playerFilter)

playerBody.SetLinearDamping(0)
playerBody.SetAngularDamping(0)
playerBody.SetSleepingAllowed(false)
playerBody.SetEnabled(true)

const usedBulletFilter = new b2Filter()
usedBulletFilter.categoryBits = Filter.AutoAttack1
usedBulletFilter.maskBits = 0

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
  const bodyA = fixA.GetBody()
  const bodyB = fixB.GetBody()
  const ptrA = getPointer(bodyA)
  const ptrB = getPointer(bodyB)
  const infoA = ptrToInfo[ptrA]
  const infoB = ptrToInfo[ptrB]

  let bodyWeapon
  let bodyEnemy
  let infoWeapon 
  let infoEnemy 

  if (infoA.category === "weapon" && infoB.category === "enemy") {
    bodyWeapon = bodyA;
    bodyEnemy = bodyB;
    infoWeapon = infoA
    infoEnemy = infoB
  } else if (infoA.category === "enemy" && infoB.category === "weapon") {
    bodyWeapon = bodyB;
    bodyEnemy = bodyA;
    infoWeapon = infoB
    infoEnemy = infoA
  } else {
    return
  }

  if(infoWeapon.attribute === 'bullet') {
    bodyWeapon.GetFixtureList().SetFilterData(usedBulletFilter)
    disableRequest.push(bodyWeapon)
  }

  let enemyDirectionsX
  let enemyDirectionsY
  let enemyHps
  let tempIndex

  if(infoEnemy.type === 'enemy1'){
    enemyDirectionsX = sa.enemy1Directions.x
    enemyDirectionsY = sa.enemy1Directions.y
    enemyHps = sa.enemy1Hps
    tempIndex = enemy1Pool.ptrToIdx[getPointer(bodyEnemy)]
  } else if (infoEnemy.type === 'enemy2'){
    enemyDirectionsX = sa.enemy2Directions.x
    enemyDirectionsY = sa.enemy2Directions.y
    enemyHps = sa.enemy2Hps
    tempIndex = enemy2Pool.ptrToIdx[getPointer(bodyEnemy)]
  } else {
    return
  }

    if (enemyHps[tempIndex] > 0) {
      // knock back
      if(infoWeapon.attribute === 'bullet') {
        tempVec.Set(-30 * enemyDirectionsX[tempIndex], -30 * enemyDirectionsY[tempIndex]);
        bodyEnemy.ApplyLinearImpulse(tempVec, center, true);
        // bodyEnemy.ApplyForce(tempVec, center, false)
      }

      Atomics.sub(enemyHps, tempIndex, infoWeapon.damage?infoWeapon.damage:0) // damage dealt
      postMessage({
        cmd: 'damage',
        x: bodyWeapon.GetPosition().x,
        y: bodyWeapon.GetPosition().y,
        enemyX: bodyEnemy.GetPosition().x,
        enemyY: bodyEnemy.GetPosition().y,
        damage: infoWeapon.damage?infoWeapon.damage:0
      })
  
      if(enemyHps[tempIndex] <= 0){ // check dead
        postMessage({
          cmd: 'dead',
          enemyX: bodyEnemy.GetPosition().x,
          enemyY: bodyEnemy.GetPosition().y,
        })  
      }
    }
  }




contactListener.EndContact = () => { }
contactListener.PostSolve = () => { }
contactListener.PreSolve = () => { }

world.SetContactListener(contactListener)

const sum = 0
const count = 0

let counter = 0

function loop() {
  if (running === false) return
  counter++

  tempVec.Set(sa.playerPosition.x[0], sa.playerPosition.y[0])
  playerBody.SetTransform(tempVec, 0)
  ptrToInfo[getPointer(playerBody)] = {
    category : 'player'
  }


  // update shared memory buffer
  enemy1Pool.update()
  enemy2Pool.update()
  enemy3Pool.update()
  autoAttack1Pool.update()
  flame1Pool.update()
  //missile1Pool.update()


  world.Step(consts.worker1Interval, 8, 3)

  for (let i = 0; i < disableRequest.length; i++) {
    if (disableRequest[i].GetFixtureList().GetFilterData().categoryBits === Filter.AutoAttack1) {
      autoAttack1Pool.disableByPtr(getPointer(disableRequest[i]))
      sa.autoAttack1RemainTimes[autoAttack1Pool.ptrToIdx[getPointer(disableRequest[i])]] = 0
    }
  }
  disableRequest = []

  port.postMessage(0)

  // request for calculate to worker2
  // maybe try async calculation...

  // calculate elapsed and determine the interval to next step
  //now = Date.now()
  //delta = now - lastExecuted
  //lastExecuted = now
//
  //if (delta > consts.worker1Interval + 5) {
  //  if (delta > 500) {
  //    stepTime = 500
  //  } else {
  //    stepTime = delta
  //  }
  //} else {
  //  stepTime = consts.worker1Interval
  //}

  if (counter % 10 === 0) {
    enemy1Pool.gen()
    enemy2Pool.gen()
  }
}

postMessage({ cmd: 'loaded' })
loaded = true
