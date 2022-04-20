import Box2DFactory from 'box2d-wasm' // ....
import safeStringify from 'fast-safe-stringify'
import { numberOfEnemy1 } from '../type/const'
import { isPressed } from './inputWorker'
//import { mainPlayerPos } from './playerWorker'

console.log('worker loaded')

// what if assuming 10 pixel is 1 meter ...  let's see
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
    console.log(scriptDirectory)
    return '/assets/' + url // for dev
  }
})
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = box2D
// in metres per second squared
const zero = new b2Vec2(0, 0)
const gravity = zero
const world = new b2World(gravity) // zero gravity

const sideLengthMetres = 16

const bd = new b2BodyDef()
bd.set_type(b2_dynamicBody)
bd.set_position(new b2Vec2(Math.random() * 10, Math.random() * 10))

const square = new b2PolygonShape()
square.SetAsBox(sideLengthMetres, sideLengthMetres)

const enemyBodyPool = new Array<Box2D.b2Body>(numberOfEnemy1)

for (let i = 0; i < numberOfEnemy1; i++) {
  enemyBodyPool[i] = world.CreateBody(bd)
  enemyBodyPool[i].CreateFixture(square, 1)
  //enemyBodyPool[i].SetTransform(new b2Vec2(0, i * 4), 0)
  enemyBodyPool[i].SetTransform(new b2Vec2(Math.random() * 10, Math.random() * 10), 0)
  enemyBodyPool[i].SetFixedRotation(true)
  enemyBodyPool[i].SetLinearVelocity(zero)
  enemyBodyPool[i].SetAwake(false)
  enemyBodyPool[i].SetEnabled(false)
  //enemyBodyPool[i].ApplyForce(0, 0, false)
}

let count = 0

let counter = 0
let mainPlayerPos = {x:0, y:0}
let receivedObj : any
onmessage = (ev) => { 
  if(ev.data === 'gen'){
    if(counter === numberOfEnemy1) counter = 0
    enemyBodyPool[counter++].SetEnabled(true)

  } else {
    mainPlayerPos.x = JSON.parse(ev.data).x
    mainPlayerPos.y = JSON.parse(ev.data).y
  
  }
}

/* onmessage = event => {
  //receivedObj = JSON.parse(new TextDecoder().decode())

  //console.log((enemyBodyPool.map(v => v.GetPosition())))
  if (event.data) {
    try {
      // console.log(JSON.parse(new TextDecoder().decode(event.data)))

      JSON.parse(event.data)
      enemyBodyPool[count].SetEnabled(true)
      count++

    } catch {
      console.log('no json')
      console.log(event.data)
    }
  }
} */

setInterval(() => {
  postMessage(
    safeStringify(enemyBodyPool.map(v => {
      return {
        x: v.GetPosition().x,
        y: v.GetPosition().y
      }
    }))
  )
  world.Step(16.666666, 2, 2)

  for(let i = 0 ; i < numberOfEnemy1 ; i++){
    let temp = new b2Vec2(mainPlayerPos.x - enemyBodyPool[i].GetPosition().x, mainPlayerPos.y - enemyBodyPool[i].GetPosition().y)
    temp.Normalize()
    temp.op_mul(50)
    //enemyBodyPool[i].ApplyForce(temp)
    enemyBodyPool[i].SetLinearVelocity(temp)
    enemyBodyPool[i].ApplyForce(temp, 0, true)

  }
}, 16.666666)
