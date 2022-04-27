// this worker calculates enemy1's collision and its resolving

import Box2DFactory from 'box2d-wasm' // ....
import { enemy1speed, numberOfEnemy1, spawnSize, worker1interval as worker1interval } from '../type/const'

// Shared Aray Buffer setting
let playerPosition: Float64Array
let enemy1positions: Float64Array
let enemy1Hps: Int32Array
let life: Int32Array

const enemy1HpsOld = new Float64Array(numberOfEnemy1)

let loop = () => { }
let loopInterval: number

onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    // pause
  } else if (ev.data.cmd === 'close') {
    loop = () => { }
    clearInterval(loopInterval)
    playerPosition = new Float64Array()
    enemy1positions = new Float64Array()
    enemy1Hps = new Int32Array()
    self.close()
  } else {
    playerPosition = new Float64Array(ev.data[0])
    enemy1positions = new Float64Array(ev.data[1])
    enemy1Hps = new Int32Array(ev.data[2])
    life = new Int32Array(ev.data[3])
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
    // console.log(scriptDirectory)
    return '/assets/' + url // for dev
  }
})
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = box2D
// in metres per second squared
const zero = new b2Vec2(0, 0)
const gravity = zero
const world = new b2World(gravity) // zero gravity

const bd = new b2BodyDef()
bd.set_type(b2_dynamicBody)

const square = new b2PolygonShape()
const boxSideLength = 0.8
square.SetAsBox(boxSideLength, boxSideLength)
const enemy1BodyPool = new Array<Box2D.b2Body>(numberOfEnemy1)

const tempVector = zero

square.SetAsBox(0.7, 0.7)
const playerBody = world.CreateBody(bd)
playerBody.CreateFixture(square, 1).SetFriction(0)
playerBody.GetFixtureList().SetRestitution(0)
playerBody.SetLinearDamping(0)
playerBody.SetAngularDamping(0)
playerBody.SetSleepingAllowed(false)
playerBody.SetEnabled(true)

square.SetAsBox(boxSideLength, boxSideLength)

// creating boxes
for (let i = 0; i < numberOfEnemy1; i++) {
  enemy1BodyPool[i] = world.CreateBody(bd)
  enemy1BodyPool[i].CreateFixture(square, 1).SetFriction(0)
  enemy1BodyPool[i].GetFixtureList().SetRestitution(0)


  enemy1BodyPool[i].SetLinearDamping(0)
  enemy1BodyPool[i].SetAngularDamping(0)
  enemy1BodyPool[i].SetSleepingAllowed(false)
  tempVector.Set((Math.random() - 0.5) * spawnSize, (Math.random() - 0.5) * spawnSize)
  enemy1BodyPool[i].SetTransform(tempVector, 0)
  enemy1BodyPool[i].SetFixedRotation(false)
  enemy1BodyPool[i].SetAwake(true)
  enemy1BodyPool[i].SetEnabled(true)
}

let tempEnemyPos = zero
let tempPlayerPosX: number
let tempPlayerPosY: number
let indexDouble
let tempIterator

const numberOfDivide = 15

let counter = 0
let lastExecuted = Date.now()
let delta = 0
let now = 0
let stepTime = 0

let tempCalcVector = new b2Vec2(0, 0)

loop = () => {
  if (++counter === numberOfDivide) {
    counter = 0
  }

  tempPlayerPosX = playerPosition[0]
  tempPlayerPosY = playerPosition[1]

  tempCalcVector.Set(tempPlayerPosX, tempPlayerPosY)
  
  playerBody.SetTransform(tempCalcVector, 0)

  // partial calc vector to player
  for (tempIterator = counter; tempIterator < numberOfEnemy1; tempIterator += numberOfDivide) {
    if(enemy1BodyPool[tempIterator].IsEnabled() === false) {
      continue
    }
    
    tempCalcVector.Set(tempPlayerPosX, tempPlayerPosY)
    tempCalcVector.op_sub(enemy1BodyPool[tempIterator].GetPosition())

    if(tempCalcVector.Length() < 2){ // player hit
      //enemy1BodyPool[tempIterator].SetEnabled(false)
      console.log('player hit')
      Atomics.sub(life, 0, 1)
      
    }

    tempCalcVector.Normalize()
    tempCalcVector.op_mul(enemy1speed)
    enemy1BodyPool[tempIterator].SetLinearVelocity(tempCalcVector)
  }

  // update shared memory buffer
  tempIterator = numberOfEnemy1
  while (tempIterator--) {
    if (enemy1BodyPool[tempIterator].IsEnabled() == false) {
      continue
    }
    if (enemy1Hps[tempIterator] === 0) {
      enemy1BodyPool[tempIterator].SetEnabled(false)
      continue
    }
    tempEnemyPos = enemy1BodyPool[tempIterator].GetPosition()
    indexDouble = tempIterator * 2
    enemy1positions[indexDouble] = tempEnemyPos.x
    enemy1positions[indexDouble + 1] = tempEnemyPos.y
  }

  // calculate elapsed and determine the interval to next step
  now = Date.now()
  delta = now - lastExecuted
  lastExecuted = now

  if (delta > worker1interval + 5) {
    if (delta > 500) {
      stepTime = 500
    } else {
      stepTime = delta
    }
  } else {
    stepTime = worker1interval
  }

  world.Step(stepTime, 8, 3)
}

setTimeout(() => {
  loopInterval = setInterval(loop, worker1interval)
}, 1000)
