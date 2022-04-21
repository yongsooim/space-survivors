import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";
import { PI_2 } from "pixi.js";
import { resources, resourcePaths } from "./resource/resources";
import { sprites, enemy1 } from "./resource/spriteManage";
import Worker from "./worker/worker1?worker";
import shipPng from "./asset/ship.png";
import { input, Direction } from "./input/input";
import { numberOfEnemy1 } from "./type/const";

let sab = new SharedArrayBuffer(300);

const myWorker = new Worker();

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
PIXI.utils.skipHello();
export const app = new PIXI.Application({
  resizeTo: window,
  antialias: false,
});

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: 1000,
  worldHeight: 1000,

  interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
});
let ship = [] as PIXI.Sprite[];

app.loader.add(resources).load(() => {
  const tilingSprite = new PIXI.TilingSprite(sprites.bg.texture, 5000, 5000);

//  viewport.addChild(tilingSprite);

  sprites.ship.x = app.renderer.width / 2;
  sprites.ship.y = app.renderer.height / 2;

  sprites.ship.anchor.x = 0.5;
  sprites.ship.anchor.y = 0.5;

  sprites.ship2.x = app.renderer.width / 2;
  sprites.ship2.y = app.renderer.height / 2;

  sprites.ship2.anchor.x = 0.5;
  sprites.ship2.anchor.y = 0.5;

//  viewport.addChild(sprites.ship);
//  viewport.addChild(sprites.ship2).position.x = 300;

//  const sprite = viewport.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
//  sprite.tint = 0xff0000;
//  sprite.width = sprite.height = 100;
//  sprite.position.set(100, 100);
//  sprite.anchor.x = 0.3;
//  sprite.anchor.y = 0.3;

  app.stage.addChild(viewport);
  viewport
    .drag()
    .pinch()
    .wheel()
    .follow(sprites.ship, { speed: 10, acceleration: 25 })
    .decelerate()
    .setZoom(4)

  input.init();

  let counter = 0;
  let i = 0;

  // Listen for frame updates
  app.ticker.add((delta: number) => {
    if(counter < 1000) counter++;
    if (counter % 1 == 0) {
      ship[i] = new PIXI.Sprite(enemy1);

      ship[i].x = app.renderer.width / 2 + Math.random() * 2000;
      ship[i].y = app.renderer.height / 2 + Math.random() * 2000;

      ship[i].scale.x = 1;
      ship[i].scale.y = 1;

      ship[i].anchor.x = 0.5;
      ship[i].anchor.y = 0.5;
      viewport.addChild(ship[i]);

      i++;
      if (i % 500 == 0) {
        console.log(i);
        console.log(delta);
      }
    }
    input.update();

    sprites.ship.rotation += 0.01;
    sprites.ship2.rotation -= 0.01;

    if (input.isDirectionPressed(Direction.Up)) {
      sprites.ship.y -= 10;
    }
    if (input.isDirectionPressed(Direction.Down)) {
      sprites.ship.y += 10;
    }
    if (input.isDirectionPressed(Direction.Left)) {
      sprites.ship.x -= 10;
    }
    if (input.isDirectionPressed(Direction.Right)) {
      sprites.ship.x += 10;
    }

  ship[0].position.y += 1
    myWorker.postMessage([sprites.ship.x, sprites.ship.y])
  });
});

let ticker = PIXI.Ticker.shared;

let counter = 0
let isFirst = true
let arr : Float64Array
myWorker.onmessage = (ev) => {
  //console.log(new Float64Array(ev.data))

  if(isFirst) { 
    arr = new Float64Array(ev.data) 
    isFirst = false}
  //let obj = JSON.parse(new TextDecoder().decode(ev.data))
  for(let i = 1 ; i < numberOfEnemy1 ; i++){
    if(ship[i]){
      ship[i].x  = arr[i * 2]
      ship[i].y  = arr[i * 2 + 1]
    }
  }
}
