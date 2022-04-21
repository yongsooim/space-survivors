import Box2DFactory from "box2d-wasm"; // ....
import { Buffer } from "pixi.js";
import { numberOfEnemy1 } from "../type/const";
import sabWorker1 from "./sabManage";

onmessage = (ev) => {
  sabWorker1.arrOfBox2D = new Float64Array(ev.data);
};

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
let length = 0.8;
square.SetAsBox(length, length);
const enemy1BodyPool = new Array<Box2D.b2Body>(numberOfEnemy1);

for (let i = 0; i < numberOfEnemy1; i++) {
  enemy1BodyPool[i] = world.CreateBody(bd);
  enemy1BodyPool[i].CreateFixture(square, 1).SetFriction(0);
  // enemyBodyPool[i].SetTransform(new b2Vec2(0, i * 4), 0)
  enemy1BodyPool[i].SetTransform(
    new b2Vec2(Math.random() * 200, Math.random() * 200),
    0
  );
  enemy1BodyPool[i].SetFixedRotation(false);
  enemy1BodyPool[i].SetAwake(true);
  enemy1BodyPool[i].SetEnabled(true);
}

let tempDirectionVec = zero;
let tempEnemyPositionVec = zero;

let counter = 0;
setInterval(() => {
  world.Step(1000/60, 2, 4);
  counter++;
  
  for (let i = 0; i < numberOfEnemy1; i++) {
    let diffX = sabWorker1.arrOfBox2D[0] - enemy1BodyPool[i].GetPosition().x;
    let diffY = sabWorker1.arrOfBox2D[1] - enemy1BodyPool[i].GetPosition().y;
    let length = Math.sqrt(diffX * diffX + diffY * diffY);
    tempDirectionVec = new b2Vec2(
      (diffX * 0.005) / length,
      (diffY * 0.005) / length
    );

    enemy1BodyPool[i].GetLinearVelocity().__destroy__();
    enemy1BodyPool[i].SetLinearVelocity(tempDirectionVec);

    tempDirectionVec.__destroy__()
  }
  for (let i = 0; i < numberOfEnemy1; i++) {
    tempEnemyPositionVec = enemy1BodyPool[i].GetPosition();
    //tempEnemyPositionVec.__destroy__()
    sabWorker1.arrToPixi[0][i * 2] = tempEnemyPositionVec.x;
    sabWorker1.arrToPixi[0][i * 2 + 1] = tempEnemyPositionVec.y;
  }
}, 1000/60);

setTimeout(()=>{postMessage(sabWorker1.sabToPixi[0])}, 300)
