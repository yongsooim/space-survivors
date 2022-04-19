import Box2DFactory from 'box2d-wasm' // ....
import safeStringify from 'fast-safe-stringify'
import { numberOfEnemy1 } from '../type/const'

console.log('worker loaded')

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  ///
  // By default, this looks for Box2D.wasm relative to public/build/bundle.js:
  // @example (url, scriptDirectory) => `${scriptDirectory}${url}`
  // But we want to look for Box2D.wasm relative to public/index.html instead.
  //
  locateFile: (url, scriptDirectory) => {
    //console.log('url in main  :  ' + url)
    //console.log('scriptDirectory in main  :  ' + scriptDirectory)
    //console.log('findng at in main  :  ./assets/' + url)
    //return './' + url  // for build, dist
    return '/assets/' + url  // for dev
  }
})
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = box2D
// in metres per second squared
const gravity = new b2Vec2(0, 0)
const world = new b2World(gravity)

const sideLengthMetres = 8
const square = new b2PolygonShape()
square.SetAsBox(sideLengthMetres , sideLengthMetres)

const zero = new b2Vec2(0, 0)

const bd = new b2BodyDef()
bd.set_type(b2_dynamicBody)
bd.set_position(zero)

const enemyBodyPool = new Array<Box2D.b2Body> (numberOfEnemy1) 

for ( let i = 0 ; i < numberOfEnemy1 ; i++){
  enemyBodyPool[i] = world.CreateBody(bd)
  enemyBodyPool[i].CreateFixture(square, 1)
  enemyBodyPool[i].SetTransform(new b2Vec2(0, i * 4), 0)
  //enemyBodyPool[i].SetTransform(zero, 0)
  enemyBodyPool[i].SetFixedRotation(true)
  enemyBodyPool[i].SetLinearVelocity(zero)
  enemyBodyPool[i].SetAwake(true)
  enemyBodyPool[i].SetEnabled(false)
}


let playerBody = world.CreateBody(bd)


let count = 0

postMessage('enemy worker done')
onmessage = event => {
  console.log((enemyBodyPool.map(v=>v.GetPosition())))
  if (event.data) {
    try {
      //console.log(JSON.parse(new TextDecoder().decode(event.data)))

      JSON.parse(new TextDecoder().decode(event.data))
      enemyBodyPool[count].SetEnabled(true)
      count++

      world.Step(16, 3, 8)
    } catch {
      //console.log('no json')
      console.log(event.data)
    }
  }
}


 setInterval(()=>{

  postMessage(enemyBodyPool.map(v=>{
    return {
      x: v.GetPosition().x,
      y: v.GetPosition().y
  }})
  )
 })