// resources?

import Box2DFactory from 'box2d-wasm' // ....

onmessage = (ev) => {
  if(ev.data.cmd === 'stop'){
    // pause
  } else if (ev.data.cmd === 'close') {

  } else if (ev.data.cmd === 'generate') {
    //ev.data.x
    //ev.data.y
    //ev.data.amount
  } else {
  }
}

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  locateFile: (url) => {
    return '/assets/' + url // for dev
  }
})
const { b2BodyDef, b2_dynamicBody, b2CircleShape, b2Vec2, b2World } = box2D

const zero = new b2Vec2(0, 0)
const gravity = zero
const world = new b2World(gravity) // zero gravity

const bd = new b2BodyDef()
bd.set_type(b2_dynamicBody)

const circle = new b2CircleShape()
circle.m_radius = 0.6

let resource = world.CreateBody(bd)
resource.CreateFixture(circle, 1)
resource.GetFixtureList().SetRestitution(0)
resource.SetLinearDamping(0)
resource.SetAngularDamping(0)
resource.SetSleepingAllowed(false)
resource.SetTransform(0, 0)
resource.SetFixedRotation(false)
resource.SetAwake(true)
resource.SetEnabled(true)

export default Worker
