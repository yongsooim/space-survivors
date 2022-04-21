import Box2DFactory from "box2d-wasm"; // ....
import safeStringify from "fast-safe-stringify";
import { Buffer } from "pixi.js";
import { numberOfEnemy1 } from "../type/const";

console.log("worker loaded");

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
    //console.log(scriptDirectory)
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
square.SetAsBox(5, 5);
const enemyBodyPool = new Array<Box2D.b2Body>(numberOfEnemy1);

for (let i = 0; i < numberOfEnemy1; i++) {
  enemyBodyPool[i] = world.CreateBody(bd);
  enemyBodyPool[i].CreateFixture(square, 0.2).SetFriction(0);
  //enemyBodyPool[i].SetTransform(new b2Vec2(0, i * 4), 0)
  enemyBodyPool[i].SetTransform(
    new b2Vec2(Math.random() * 200, Math.random() * 200),
    0
  );
  enemyBodyPool[i].SetFixedRotation(true);
  enemyBodyPool[i].SetLinearVelocity(zero);
  enemyBodyPool[i].SetAwake(false);
  enemyBodyPool[i].SetEnabled(true);
  //enemyBodyPool[i].ApplyForce(0, 0, false)
}

let count = 0;

let counter = 0;
let mainPlayerPos = { x: 0, y: 0 };
let receivedObj: any;
onmessage = (ev) => {
  //console.log(ev.data);
  /* 
  if(ev.data === 'gen'){
    if(counter === numberOfEnemy1) counter = 0
    enemyBodyPool[counter++].SetEnabled(true)

  } else {
    mainPlayerPos.x = JSON.parse(ev.data).x
    mainPlayerPos.y = JSON.parse(ev.data).y
  
  } */
  mainPlayerPos.x = ev.data[0]
  mainPlayerPos.y = ev.data[1]
  
};

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

const fromWorker = [] as SharedArrayBuffer[];
fromWorker[0] = new SharedArrayBuffer(1000);
fromWorker[1] = new SharedArrayBuffer(1000);

const view = [] as Float64Array[];
view[0] = new Float64Array(fromWorker[0]);
view[1] = new Float64Array(fromWorker[1]);

view[0][0] = 0.3;

let isA = 0;

let isFirst = true
const sab = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * 2 * numberOfEnemy1)
setInterval(() => {
  isA = isA === 0 ? 1 : 0; //toggling
  //postMessage(view[isA])
  // postMessage(
  //   JSON.stringify(enemyBodyPool.map(v => {
  //     return {
  //       x: v.GetPosition().x,
  //       y: v.GetPosition().y
  //     }
  //   }))
  // )
  world.Step(33, 2, 4);

  for (let i = 0; i < numberOfEnemy1; i++) {
    let temp = new b2Vec2(
      mainPlayerPos.x - enemyBodyPool[i].GetPosition().x,
      mainPlayerPos.y - enemyBodyPool[i].GetPosition().y
    );
    temp.Normalize();
    temp.op_mul(50);
    //enemyBodyPool[i].ApplyForce(temp)
    enemyBodyPool[i].SetLinearVelocity(temp);
    enemyBodyPool[i].ApplyForce(temp, 0, true);

    let arrSab = new Float64Array(sab)

    for(let i = 0; i < numberOfEnemy1 ; i++) {
      arrSab[i * 2] = enemyBodyPool[i].GetPosition().x
      arrSab[i * 2 + 1] = enemyBodyPool[i].GetPosition().y
    }

    //let arr = JSON.stringify(enemyBodyPool)

    //let buf = new TextEncoder().encode(arr);
    if(isFirst){
            postMessage(sab)
            isFirst = false
    } else {
      postMessage('a')
    }
  }
}, 33);

export default Worker;
