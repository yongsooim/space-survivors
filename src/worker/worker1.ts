// this worker calculates enemy1's collision and its resolving

import Box2DFactory from 'box2d-wasm' // ....
import Worker from './calcDirectionWorker?worker' // ....
import { enemy1speed, numberOfAutoAttack1, numberOfEnemy1, numberOfEnemy1double, spawnSize, worker1interval } from '../type/const'

// Shared Aray Buffer setting
let playerPosition: Float64Array
let enemy1positions: Float64Array
let enemy1Hps: Int32Array
let life: Int32Array
let autoAttack1Positions: Float64Array

let enemy1direction = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfEnemy1double)
let enemy1directionArr = new Float64Array(enemy1direction)

const enemy1HpsOld = new Float64Array(numberOfEnemy1)

let calcDirectionWorker = new Worker()
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
  } else if (ev.data.cmd === 'fire') {

    fire()

  } else {
    playerPosition = new Float64Array(ev.data[0])
    enemy1positions = new Float64Array(ev.data[1])
    enemy1Hps = new Int32Array(ev.data[2])
    life = new Int32Array(ev.data[3])
    autoAttack1Positions = new Float64Array(ev.data[4])

    calcDirectionWorker.postMessage([ev.data[0], ev.data[1], enemy1direction, ev.data[3]]) //playerPosition, enemy1 position
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
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World, JSContactListener, JSContactFilter, JSDestructionListener, b2Filter, b2Contact } = box2D
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
const autoAttack1BodyPool = new Array<Box2D.b2Body>(numberOfAutoAttack1)

const tempVector = zero

enum Filter {
  Enemy1 = 0x0001,
  AutoAttack1 = 0x0002
}

let enemy1filter = new b2Filter()
enemy1filter.categoryBits = Filter.Enemy1
enemy1filter.maskBits = Filter.AutoAttack1 & Filter.Enemy1
enemy1filter.groupIndex = Filter.Enemy1

let autoAttack1filter = new b2Filter()
autoAttack1filter.categoryBits = Filter.AutoAttack1
autoAttack1filter.maskBits = Filter.Enemy1
autoAttack1filter.groupIndex = Filter.AutoAttack1

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
  enemy1BodyPool[i].GetFixtureList().SetFilterData(enemy1filter)

  enemy1BodyPool[i].SetLinearDamping(0)
  enemy1BodyPool[i].SetAngularDamping(0)
  enemy1BodyPool[i].SetSleepingAllowed(false)
  tempVector.Set((Math.random() - 0.5) * spawnSize, (Math.random() - 0.5) * spawnSize)
  enemy1BodyPool[i].SetTransform(tempVector, 0)
  enemy1BodyPool[i].SetFixedRotation(false)
  enemy1BodyPool[i].SetAwake(true)
  enemy1BodyPool[i].SetEnabled(true)
}

for (let i = 0; i < numberOfAutoAttack1; i++) {
  autoAttack1BodyPool[i] = world.CreateBody(bd)
  autoAttack1BodyPool[i].CreateFixture(square, 1).SetFriction(0)
  autoAttack1BodyPool[i].GetFixtureList().SetRestitution(0)
  autoAttack1BodyPool[i].GetFixtureList().SetFilterData(autoAttack1filter)

  autoAttack1BodyPool[i].SetLinearDamping(0)
  autoAttack1BodyPool[i].SetAngularDamping(0)
  autoAttack1BodyPool[i].SetSleepingAllowed(false)
  autoAttack1BodyPool[i].SetFixedRotation(false)
  autoAttack1BodyPool[i].SetAwake(true)
  autoAttack1BodyPool[i].SetEnabled(false)
}

let listener = new JSContactListener()
listener.BeginContact = (contact) => {
  //console.log(contact)
}
listener.EndContact = (contact) => {
  //  console.log(contact)
}
listener.PostSolve = (contact) => {
  //  console.log(contact)
}
listener.PreSolve = (contact) => {
  //  console.log(contact)
}
world.SetContactListener(listener)

let tempEnemyPos = zero
let tempPlayerPosX: number
let tempPlayerPosY: number
let indexDouble
let tempIterator

const numberOfDivide = 12

let counter = 0
let lastExecuted = Date.now()
let delta = 0
let now = 0
let stepTime = 0

const tempCalcVector = new b2Vec2(0, 0)

loop = () => {
  if (++counter === numberOfDivide) {
    counter = 0
  }

  tempPlayerPosX = playerPosition[0]
  tempPlayerPosY = playerPosition[1]

  tempCalcVector.Set(tempPlayerPosX, tempPlayerPosY)

  playerBody.SetTransform(tempCalcVector, 0)

  tempIterator = numberOfEnemy1
  while (tempIterator--) {
    tempVector.Set(enemy1directionArr[tempIterator * 2], enemy1directionArr[tempIterator * 2 + 1])
    enemy1BodyPool[tempIterator].SetLinearVelocity(tempVector)
  }

  world.Step(stepTime, 8, 3)

  // update shared memory buffer
  tempIterator = numberOfEnemy1
  while (tempIterator--) {
    if (enemy1BodyPool[tempIterator].IsEnabled() === false) {
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

  calcDirectionWorker.postMessage({ cmd: 'calc' })

  tempIterator = numberOfAutoAttack1
  while (tempIterator--) {
    let tempAutoAttackPos = autoAttack1BodyPool[tempIterator].GetPosition()
    indexDouble = tempIterator * 2
    autoAttack1Positions[indexDouble] = tempAutoAttackPos.x
    autoAttack1Positions[indexDouble + 1] = tempAutoAttackPos.y
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

}

setTimeout(() => {
  loopInterval = setInterval(loop, worker1interval)
}, 1000)

let autoAttackCounter = 0
function fire() {
  autoAttackCounter++
  if (autoAttackCounter === numberOfAutoAttack1) {
    autoAttackCounter = 0
  }

  let tempVec = new b2Vec2(playerPosition[0], playerPosition[1])
  autoAttack1BodyPool[autoAttackCounter].SetTransform(tempVec, 0)

  tempVec.set_x(0)
  tempVec.set_y(-0.2)
  autoAttack1BodyPool[autoAttackCounter].SetLinearVelocity(tempVec)
  autoAttack1BodyPool[autoAttackCounter].SetEnabled(true)

  tempVec.__destroy__()
}
