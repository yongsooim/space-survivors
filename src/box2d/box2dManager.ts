import Box2DFactory from 'box2d-wasm'
import { Engine, Entity } from 'excalibur'

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  ///
  // By default, this looks for Box2D.wasm relative to public/build/bundle.js:
  // @example (url, scriptDirectory) => `${scriptDirectory}${url}`
  // But we want to look for Box2D.wasm relative to public/index.html instead.
  //
  locateFile: (url, scriptDirectory) => {
    console.log('in main : ' + url)
    console.log('in main : ' + scriptDirectory)
    console.log('im main : ./assets/' + url)
    return './assets/' + url
  }
})

const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = box2D

// in metres per second squared
const gravity = new b2Vec2(0, 10)
const world = new b2World(gravity)

const sideLengthMetres = 10
const square = new b2PolygonShape()
square.SetAsBox(sideLengthMetres / 2, sideLengthMetres / 2)

const zero = new b2Vec2(0, 0)

const bd = new b2BodyDef()
bd.set_type(b2_dynamicBody)
bd.set_position(zero)

const body = world.CreateBody(bd)
body.CreateFixture(square, 1)
body.SetTransform(zero, 0)
body.SetLinearVelocity(zero)
body.SetAwake(true)
body.SetEnabled(true)

// calculate no more than a 60th of a second during one world.Step() call
const maxTimeStepMs = 1 / 60 * 1000
const velocityIterations = 1
const positionIterations = 1

/**
 * Advances the world's physics by the requested number of milliseconds
 * @param {number} deltaMs
 */
const step = (deltaMs: number) => {
  const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs)
  world.Step(clampedDeltaMs / 1000, velocityIterations, positionIterations)
}

/**
 * Prints out the vertical position of our falling square
 * (this is easier than writing a full renderer)
 */

let globalX: number
let globalY: number

const whereIsOurSquare = () => {
  {
    // const {x, y} = body.GetLinearVelocity();
    // console.log("Square's velocity is:", x, y);
  }
  {
    const { x, y } = body.GetPosition()
    // console.log("Square's position is:", x, y);
    // ep.enemyPool[0].pos.x = x
    // ep.enemyPool[0].pos.y = y
    globalX = x
    globalY = y
  }
}

/** @type {number} you can use this handle to cancel the callback via cancelAnimationFrame */
let handle;
(function loop (prevMs) {
  const nowMs = window.performance.now()
  handle = requestAnimationFrame(loop.bind(null, nowMs))
  const deltaMs = nowMs - prevMs
  step(deltaMs)
  whereIsOurSquare()
}(window.performance.now()))

class Box2DManager extends Entity {
  update (game: Engine, delta: number) {

  }
}
