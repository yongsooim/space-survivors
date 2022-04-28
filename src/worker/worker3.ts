// this worker calculates the interaction between resource and player

import Box2DFactory from 'box2d-wasm' // ....
import { magnetRange, numberOfResource1, numberOfResource2, worker3interval } from '../type/const'

let playerPosition: Float64Array
let resource1positions: Float64Array
let resource1remainTimes: Int32Array
let resource2positions: Float64Array
let resource2remainTimes: Int32Array
let resource1Collected: Int32Array

// timer for loop
let loopInterval = 0

onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    // pause
  } else if (ev.data.cmd === 'close') {
    self.close()
  } else if (ev.data.cmd === 'generate') {
    // ev.data.x
    // ev.data.y
    // ev.data.amount
  } else {
    playerPosition = new Float64Array(ev.data[0])
    resource1positions = new Float64Array(ev.data[1])
    resource1remainTimes = new Int32Array(ev.data[2])
    resource2positions = new Float64Array(ev.data[3])
    resource2remainTimes = new Int32Array(ev.data[4])
    resource1Collected = new Int32Array(ev.data[5])
  }
}

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  locateFile: (url) => {
    return '/assets/' + url // for dev
  }
})
const { b2BodyDef, b2_dynamicBody, b2CircleShape, b2Vec2, b2World, b2Filter } = box2D

const zero = new b2Vec2(0, 0)
const gravity = zero
const world = new b2World(gravity) // zero gravity

const bd = new b2BodyDef()
bd.set_type(b2_dynamicBody)

const circle = new b2CircleShape()
circle.set_m_radius(0.4)

const resource1BodyPool = new Array<Box2D.b2Body>(numberOfResource1)
const resource2BodyPool = new Array<Box2D.b2Body>(numberOfResource2)

const tempVector = zero


enum Filter {
  Resource1 = 0x00000001,
  Resource2 = 0x00000002
}

let resource1filter = new b2Filter()
resource1filter.categoryBits = Filter.Resource1
resource1filter.maskBits = Filter.Resource2

let resource2filter = new b2Filter()
resource2filter.categoryBits = Filter.Resource2
resource2filter.maskBits = Filter.Resource1


// creating circles
for (let i = 0; i < numberOfResource1; i++) {
  resource1BodyPool[i] = world.CreateBody(bd)
  resource1BodyPool[i].CreateFixture(circle, 0.5).SetFriction(0.1)
  resource1BodyPool[i].GetFixtureList().SetRestitution(0)
  resource1BodyPool[i].GetFixtureList().SetFilterData(resource1filter)
  resource1BodyPool[i].SetLinearDamping(0.2)
  resource1BodyPool[i].SetAngularDamping(0)
  resource1BodyPool[i].SetSleepingAllowed(true)
  tempVector.Set((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200)
  resource1BodyPool[i].SetTransform(tempVector, 0)
  resource1BodyPool[i].SetFixedRotation(true)
  resource1BodyPool[i].SetEnabled(true)
  resource1BodyPool[i].SetLinearVelocity(zero)
}

for (let i = 0; i < numberOfResource2; i++) {
  resource2BodyPool[i] = world.CreateBody(bd)
  resource2BodyPool[i].CreateFixture(circle, 0.5).SetFriction(0.1)
  resource2BodyPool[i].GetFixtureList().SetRestitution(0)
  resource2BodyPool[i].GetFixtureList().SetFilterData(resource2filter)
  resource2BodyPool[i].SetLinearDamping(0.2)
  resource2BodyPool[i].SetAngularDamping(0)
  resource2BodyPool[i].SetSleepingAllowed(true)
  tempVector.Set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100)
  resource2BodyPool[i].SetTransform(tempVector, 0)
  resource2BodyPool[i].SetFixedRotation(true)
  resource2BodyPool[i].SetEnabled(true)
  resource2BodyPool[i].SetLinearVelocity(zero)
}

let tempResourcePos = zero
let indexDouble
let tempIterator

const counter = 0
let lastExecuted = Date.now()
let delta = 0
let now = 0
let stepTime = 0

const tempCalcVector = new b2Vec2(0, 0)

let tempPlayerPosX = 0
let tempPlayerPosY = 0

const loop = () => {
  for (tempIterator = counter; tempIterator < numberOfResource1; tempIterator++) {
    if (resource1BodyPool[tempIterator].IsEnabled() === false) continue
    tempPlayerPosX = playerPosition[0]
    tempPlayerPosY = playerPosition[1]

    tempCalcVector.Set(tempPlayerPosX, tempPlayerPosY)

    tempCalcVector.op_sub(resource1BodyPool[tempIterator].GetPosition())

    const length = tempCalcVector.Length()

    if (length < magnetRange) {
      if (length < 0.4) {
        resource1BodyPool[tempIterator].SetEnabled(false)
        Atomics.store(resource1remainTimes, tempIterator, 0)
        Atomics.add(resource1Collected, 0, 1)
      } else {
        tempCalcVector.Normalize()
        tempCalcVector.op_mul(0.04 * (magnetRange + 0.1 - length))
        resource1BodyPool[tempIterator].SetLinearVelocity(tempCalcVector)
      }
    }

    // tempCalcVector.Normalize()
    // tempCalcVector.op_mul(0.1)
    // resourceBodyPool[tempIterator].SetLinearVelocity(tempCalcVector)
  }

  for (tempIterator = counter; tempIterator < numberOfResource2; tempIterator++) {
    if (resource2BodyPool[tempIterator].IsEnabled() === false) continue
    tempPlayerPosX = playerPosition[0]
    tempPlayerPosY = playerPosition[1]

    tempCalcVector.Set(tempPlayerPosX, tempPlayerPosY)

    tempCalcVector.op_sub(resource2BodyPool[tempIterator].GetPosition())

    const length = tempCalcVector.Length()

    if (length < magnetRange) {
      if (length < 0.6) {
        resource2BodyPool[tempIterator].SetEnabled(false)
        Atomics.store(resource2remainTimes, tempIterator, 0)
        Atomics.add(resource1Collected, 0, 3)
      } else {
        tempCalcVector.Normalize()
        tempCalcVector.op_mul(0.03 * (magnetRange + 0.1 - length))
        resource2BodyPool[tempIterator].SetLinearVelocity(tempCalcVector)
      }
    }

    // tempCalcVector.Normalize()
    // tempCalcVector.op_mul(0.1)
    // resourceBodyPool[tempIterator].SetLinearVelocity(tempCalcVector)
  }

  // update shared memory buffer
  tempIterator = numberOfResource1
  while (tempIterator--) {
    if (resource1remainTimes[tempIterator] < 0) {
      continue
    }
    Atomics.sub(resource1remainTimes, tempIterator, delta)

    if (resource1BodyPool[tempIterator].IsEnabled() === false) {
      continue
    }
    if (resource1remainTimes[tempIterator] === 0) {
      resource1BodyPool[tempIterator].SetEnabled(false)
      continue
    }
    tempResourcePos = resource1BodyPool[tempIterator].GetPosition()
    indexDouble = tempIterator * 2
    resource1positions[indexDouble] = tempResourcePos.x
    resource1positions[indexDouble + 1] = tempResourcePos.y
  }

  tempIterator = numberOfResource2
  while (tempIterator--) {
    if (resource2remainTimes[tempIterator] < 0) {
      continue
    }
    Atomics.sub(resource2remainTimes, tempIterator, delta)

    if (resource2BodyPool[tempIterator].IsEnabled() === false) {
      continue
    }
    if (resource2remainTimes[tempIterator] === 0) {
      resource2BodyPool[tempIterator].SetEnabled(false)
      continue
    }
    tempResourcePos = resource2BodyPool[tempIterator].GetPosition()
    indexDouble = tempIterator * 2
    resource2positions[indexDouble] = tempResourcePos.x
    resource2positions[indexDouble + 1] = tempResourcePos.y
  }

  now = Date.now()
  delta = now - lastExecuted

  if (delta > worker3interval + 5) {
    if (delta > 500) {
      stepTime = 500
    } else {
      stepTime = delta
    }
  } else {
    stepTime = worker3interval
  }

  world.Step(stepTime, 3, 8)

  lastExecuted = now
}

setTimeout(() => {
  loopInterval = setInterval(loop, worker3interval)
}, 1000)

export default Worker
