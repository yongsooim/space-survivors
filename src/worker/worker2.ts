// this worker calculates collision between enemyt1 and autoAttack1

import Box2DFactory from 'box2d-wasm' // ....
import { numberOfAutoAttack1, numberOfEnemy1, worker2interval } from '../type/const'

let playerPosition: Float64Array
let enemy1Positions: Float64Array
let enemy1Hps: Int32Array

let lastExecuted = Date.now()
let delta = 0
let now = 0
let stepTime = 0

let loopInterval: number

let running = false
onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    running = false
  } else if (ev.data.cmd === 'start') {
    running = true
  } else if (ev.data.cmd === 'close') {
    running = false
    clearInterval(loopInterval)
    loop = () => {}
    self.close()
  } else {
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
    // console.log('finding at in main  :  ./assets/' + url)
    // return './' + url  // for build, dist
    // console.log(scriptDirectory)
    return '/assets/' + url // for dev
  }
})
const { b2BodyDef, b2_dynamicBody,b2QueryCallback, b2PolygonShape, b2Vec2, b2World, b2TestOverlap, b2AABB } = box2D
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
  if(running === false) return
  // update positions ships
  tempIterator = numberOfEnemy1
  while (tempIterator--) {
    indexDouble = tempIterator * 2
    tempVec.Set(enemy1Positions[indexDouble], enemy1Positions[indexDouble + 1])
    enemy1BodyPool[tempIterator].SetTransform(tempVec, 0)
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
