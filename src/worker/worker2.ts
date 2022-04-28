// this worker calculates collision between enemyt1 and autoAttack1

import Box2DFactory from 'box2d-wasm' // ....
import { numberOfAutoAttack1, numberOfEnemy1, worker2interval } from '../type/const'

let autoAttack1Positions: Float64Array
let autoAttack1Enabled: Int32Array
let flame1Positions: Float64Array
let flame1Enabled: Int32Array

let enemy1Positions: Float64Array
let enemy1Hps: Int32Array
let killed: Int32Array

let lastExecuted = Date.now()
let delta = 0
let now = 0
let stepTime = 0

let loopInterval: number

onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    // pause
  } else if (ev.data.cmd === 'close') {
    clearInterval(loopInterval)
    loop = () => {}
    autoAttack1Positions = new Float64Array()
    autoAttack1Enabled = new Int32Array()
    enemy1Positions = new Float64Array()
    enemy1Hps = new Int32Array()
    killed = new Int32Array()
    self.close()
  } else {
    autoAttack1Positions = new Float64Array(ev.data[0])
    autoAttack1Enabled = new Int32Array(ev.data[1])
    enemy1Positions = new Float64Array(ev.data[2])
    enemy1Hps = new Int32Array(ev.data[3])
    killed = new Int32Array(ev.data[4])
  }
}
postMessage('')

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
    // return './' + url  // for build, dist
    // console.log(scriptDirectory)
    return '/assets/' + url // for dev
  }
})
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World, b2TestOverlap, b2AABB } = box2D
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

// creating boxes
for (let i = 0; i < numberOfEnemy1; i++) {
  enemy1BodyPool[i] = world.CreateBody(bd)
  enemy1BodyPool[i].CreateFixture(square, 1).SetFriction(1)
  enemy1BodyPool[i].SetFixedRotation(true)
  enemy1BodyPool[i].SetEnabled(true)
}

for (let i = 0; i < numberOfAutoAttack1; i++) {
  square.SetAsBox(0.4, 0.4)
  autoAttack1BodyPool[i] = world.CreateBody(bd)
  autoAttack1BodyPool[i].CreateFixture(square, 1).SetFriction(1)
  autoAttack1BodyPool[i].SetFixedRotation(true)
  autoAttack1BodyPool[i].SetEnabled(true)
}

let indexDouble
let tempIterator
let tempIterator2

const tempVec = new b2Vec2(0, 0)
let loop = () => {}
loop = () => {
  // update positions ships
  tempIterator = numberOfEnemy1
  while (tempIterator--) {
    indexDouble = tempIterator * 2
    tempVec.Set(enemy1Positions[indexDouble], enemy1Positions[indexDouble + 1])
    enemy1BodyPool[tempIterator].SetTransform(tempVec, 0)
  }

  // update positions bullets
  tempIterator = numberOfAutoAttack1
  while (tempIterator--) {
    indexDouble = tempIterator * 2
    tempVec.Set(autoAttack1Positions[indexDouble], autoAttack1Positions[indexDouble + 1])
    autoAttack1BodyPool[tempIterator].SetTransform(tempVec, 0)
  }

  tempIterator2 = numberOfAutoAttack1
  while (tempIterator2--) {
    if (autoAttack1Enabled[tempIterator2] === 0) continue // skip disabled

    tempIterator = numberOfEnemy1
    while (tempIterator--) {
      if (enemy1Hps[tempIterator] === 0) continue // skip hp 0

      if (b2TestOverlap(enemy1BodyPool[tempIterator].GetFixtureList().GetAABB(0), autoAttack1BodyPool[tempIterator2].GetFixtureList().GetAABB(0))) {
        Atomics.sub(enemy1Hps, tempIterator, 1)
        Atomics.store(autoAttack1Enabled, tempIterator2, 0)
        Atomics.add(killed, 0, 1)

        break
      }
    }
  }

  now = Date.now()
  delta = now - lastExecuted

  if (delta > worker2interval + 5) {
    if (delta > 500) {
      stepTime = 500
    } else {
      stepTime = delta
    }
  } else {
    stepTime = worker2interval
  }

  //world.Step(stepTime, 3, 8)

  lastExecuted = now
}

setTimeout(() => {
  loopInterval = setInterval(loop, worker2interval)
}, 1000)
