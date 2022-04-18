 import { autoAttackLifeTime,  numberOfAutoAttack,  autoAttackLifeTimeBulletSpeed } from "../type/const";
import { shipSprites8, projSprites } from "../resource/resources";
import { Actor, vec, Engine, Sprite, ActorArgs, CollisionType } from "excalibur";
import { player } from "../player/player";
import { enemyGroup } from "../collisionGroups";

import SharedWorker from '../worker/enemyCollide?sharedworker'

import Box2DFactory from 'box2d-wasm'

const enemyWorker = new SharedWorker()

const box2D: typeof Box2D & EmscriptenModule = await Box2DFactory({
  ///
   //By default, this looks for Box2D.wasm relative to public/build/bundle.js:
   //@example (url, scriptDirectory) => `${scriptDirectory}${url}`
   //But we want to look for Box2D.wasm relative to public/index.html instead.
   //
   locateFile: (url, scriptDirectory) => {
     console.log('in main : ' + url)
     console.log('in main : ' + scriptDirectory)
     console.log('im main : ./assets/' + url)
    return './assets/' + url
    }
});


const { b2BodyDef, b2_dynamicBody, b2PolygonShape, b2Vec2, b2World } = box2D;

// in metres per second squared
const gravity = new b2Vec2(0, 10);
const world = new b2World(gravity);

const sideLengthMetres = 50;
const square = new b2PolygonShape();
square.SetAsBox(sideLengthMetres/2, sideLengthMetres/2);

const zero = new b2Vec2(0, 0);

const bd = new b2BodyDef();
bd.set_type(b2_dynamicBody);
bd.set_position(zero);

const body = world.CreateBody(bd);
body.CreateFixture(square, 1);
body.SetTransform(zero, 0);
body.SetLinearVelocity(zero);
body.SetAwake(true);
body.SetEnabled(true);

// calculate no more than a 60th of a second during one world.Step() call
const maxTimeStepMs = 1/60*1000;
const velocityIterations = 1;
const positionIterations = 1;

/**
 * Advances the world's physics by the requested number of milliseconds
 * @param {number} deltaMs
 */
const step = (deltaMs : number) => {
  const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
  world.Step(clampedDeltaMs/1000, velocityIterations, positionIterations);
};

/**
 * Prints out the vertical position of our falling square
 * (this is easier than writing a full renderer)
 */

let globalX : number
let globalY : number
const whereIsOurSquare = () => {
  {
    //const {x, y} = body.GetLinearVelocity();
    //console.log("Square's velocity is:", x, y);
  }
  {
    const {x, y} = body.GetPosition();
    //console.log("Square's position is:", x, y);
    //ep.enemyPool[0].pos.x = x
    //ep.enemyPool[0].pos.y = y
    globalX = x 
globalY =y
  }
};

/** @type {number} you can use this handle to cancel the callback via cancelAnimationFrame */
let handle;
(function loop(prevMs) {
  const nowMs = window.performance.now();
  handle = requestAnimationFrame(loop.bind(null, nowMs));
  const deltaMs = nowMs-prevMs;
  step(deltaMs);
  whereIsOurSquare();
}(window.performance.now()));




let enemySprite = shipSprites8.getSprite(9, 0) as Sprite;

const speed = 1200;
let initialCounter = 0;

export class Enemy extends Actor {
  constructor() {
    //super()
    super({
      width: 8,
      height: 4,
      collisionType: CollisionType.Active,
    });
    this.counter = initialCounter++;
    if (initialCounter == 120) {
      initialCounter = 0;
    }

    this.graphics.use(enemySprite);
    this.scale = vec(20, 20);
    //this.actions.meet(player, speed);
    //this.actions.moveTo(player.pos, speed);
    this.body.bounciness = 0;
    this.body.friction = 0;
  }
  type = "enemy1";

  counter = 0;

  onInitialize() {
    this.actions.meet(player, speed);
    this.on("precollision", () => {
      this.collider.useBoxCollider;
      this.body.collisionType = CollisionType.Active;
    });
  }
}

const numberOfMaximumEnemy = 1000;
export class EnemyPool {
  enemyPool = new Array<Enemy>(numberOfMaximumEnemy)

  _cursor = 0;
  set cursor(v: number) {
    if (v >= numberOfMaximumEnemy) {
      this._cursor = 0;
    } else {
      this._cursor = v;
    }
  }
  get cursor() {
    return this._cursor;
  }

  constructor() {
    for (let i = 0; i < numberOfMaximumEnemy; i++) {
      this.enemyPool[i] = new Enemy();
    }
  }

  
  come(game: Engine) {
    this.enemyPool[0].pos.x = globalX 
    this.enemyPool[0].pos.y = globalY
    
    game.add(this.enemyPool[this.cursor]);
    this.enemyPool[this.cursor].pos = game.screenToWorldCoordinates(
      vec(10, 10)
    );
    this.cursor++;

    /** for worker test */
    let trans = new TextEncoder().encode(JSON.stringify(this.enemyPool.map(v => v.pos)))
    let u8arr = new Uint8Array(trans)

    /******* */
  }
}

export let ep = new EnemyPool();
