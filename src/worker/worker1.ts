import Box2DFactory from "box2d-wasm"; // ....
import { Buffer } from "pixi.js";
import { numberOfEnemy1 } from "../type/const";
import * as Comlink from 'comlink'

// Shared Aray Buffer setting
let playerPosition = new Float64Array([0, 0])
let enemy1positions = new Float64Array(numberOfEnemy1 * 2)
let enemy1Enabled = new Float64Array(numberOfEnemy1)

onmessage = (ev)=>{
  playerPosition = new Float64Array(ev.data.playerPositionSab)
  enemy1positions = new Float64Array(ev.data.enemy1PositionsSab)
  enemy1Enabled = new Float64Array(ev.data.enemy1EnabledSab)
}


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
     //return './' + url  // for build, dist
    // console.log(scriptDirectory)
    return "/assets/" + url; // for dev
  },
});
const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = box2D;
// in metres per second squared
const zero = new b2Vec2(0, 0);
const gravity = zero;
const world = new b2World(gravity); // zero gravity

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);
bd.set_position(new b2Vec2(Math.random() * 10, Math.random() * 10));

const square = new b2PolygonShape();
let boxSideLength = 0.8;
square.SetAsBox(boxSideLength, boxSideLength);
const enemy1BodyPool = new Array<Box2D.b2Body>(numberOfEnemy1);

for (let i = 0; i < numberOfEnemy1; i++) {
  enemy1BodyPool[i] = world.CreateBody(bd);
  enemy1BodyPool[i].CreateFixture(square, 1).SetFriction(0);
  enemy1BodyPool[i].SetTransform(new b2Vec2(Math.random() * 200, Math.random() * 200), 0);
  enemy1BodyPool[i].SetFixedRotation(false);
  enemy1BodyPool[i].SetAwake(true);
  enemy1BodyPool[i].SetEnabled(true);
}

let tempDirectionVec = zero;
let tempVec = zero
let counter = 0;
let diffX: number
let diffY: number
let tempPlayerX: number
let tempPlayerY: number
let indexDouble
setInterval(() => {
  world.Step(1000/30, 2, 4);
  counter++;
  
  tempPlayerX = playerPosition[0]
  tempPlayerY = playerPosition[1]
  for (let i = 0; i < numberOfEnemy1; i++) {
    tempVec = enemy1BodyPool[i].GetPosition()

    // update shared array buffer
    indexDouble = i * 2
    enemy1positions[indexDouble] = tempVec.x;
    enemy1positions[indexDouble + 1] = tempVec.y;
    
    diffX = tempPlayerX - tempVec.x;
    diffY = tempPlayerY - tempVec.y;
    let length = Math.sqrt(diffX * diffX + diffY * diffY);
    tempDirectionVec = new b2Vec2(
      (diffX  / length) * 0.005,
      (diffY  / length) * 0.005
    );

    enemy1BodyPool[i].GetLinearVelocity().__destroy__();
    enemy1BodyPool[i].SetLinearVelocity(tempDirectionVec);
    tempDirectionVec.__destroy__()
  }
  
  world.Step(1000/30, 3, 8);
}, 1000/30);
