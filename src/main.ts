import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { resources, resourcePaths } from './resource/resources'
import { sprites, enemy1 } from './resource/spriteManage'
import Worker from './worker/worker1?worker'
import shipPng from './asset/ship.png'
import { input, Direction } from './input/input'
import { numberOfEnemy1, numberOfEnemy1double } from './type/const'
import sabWorker1 from './worker/sabManage'
import { SceneManager } from "pixi-scenegraph.js"
import { MyScene } from './scene/s1'
import * as Comlink from 'comlink'

const worker1 = new Worker()

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
PIXI.utils.skipHello()
export const app = new PIXI.Application({
  resizeTo: window,
  antialias: false
})

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view)

export const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: 1000,
  worldHeight: 1000,
  interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
})

//const scm = new SceneManager({
//  width: 800,
//  height: 400,
//  backgroundColor: 0x1099bb,
//});
//
//const myScene = new MyScene();
//scm.AddScene(myScene);
//scm.ActivateScene(myScene); // or by name scm.ActivateScene('scene_name')
//
//const container = new PIXI.Container();
//
//const texture = PIXI.Texture.from(
//  "https://pixijs.io/examples/examples/assets/bunny.png"
//);
//const bunny = new PIXI.Sprite(texture);
//bunny.interactive = true;
//bunny.position.set(50, 50);
//bunny.on("pointerdown", () => console.log("ponter down!"));
//container.addChild(bunny);
//
//scm.MasterHudOverlay = container;
//document.body.appendChild(scm.Application.view);



//document.addEventListener('resize', (evt)=>{
//  viewport.screenWidth = window.innerWidth
//  viewport.screenHeight = window.innerHeight
//})

const enemy1ships = [] as PIXI.Sprite[]
let indexDouble

app.loader.add(resources).load(() => {
  const tilingSprite = new PIXI.TilingSprite(sprites.bg.texture, 5000, 5000)
  tilingSprite.scale.x = 0.1
  tilingSprite.scale.y = 0.1

  //viewport.addChild(tilingSprite);

  sprites.ship.x = 100
  sprites.ship.y = 100

  sprites.ship.anchor.x = 0.5
  sprites.ship.anchor.y = 0.5

  sprites.ship.scale.x = 0.1
  sprites.ship.scale.y = 0.1

  sprites.ship2.x = app.renderer.width / 2
  sprites.ship2.y = app.renderer.height / 2

  sprites.ship2.anchor.x = 0.5
  sprites.ship2.anchor.y = 0.5

  viewport.addChild(sprites.ship);
  viewport.addChild(sprites.ship2).position.x = 300;

  app.stage.addChild(viewport)
  viewport.pinch().wheel().setZoom(0.1).
    clampZoom({ minScale: 0.01, maxScale: 6 }).follow(sprites.ship)

  input.init()

  for (let i = 0; i < numberOfEnemy1; i++) {
    enemy1ships[i] = new PIXI.Sprite(enemy1)

    enemy1ships[i].scale.x = 0.2
    enemy1ships[i].scale.y = 0.2

    enemy1ships[i].anchor.set(0.5)
    enemy1ships[i].x = 0
    enemy1ships[i].y = 0
    viewport.addChild(enemy1ships[i])
  }

  // Listen for frame updates
  app.ticker.add((delta: number) => {

    //enemy1 position update
    for (let i = 1; i < numberOfEnemy1; i++) {
      indexDouble = i * 2
      enemy1ships[i].x = sabWorker1.enemy1PositionsArr[indexDouble]
      enemy1ships[i].y = sabWorker1.enemy1PositionsArr[indexDouble + 1]
    }

    input.update()

    sprites.ship.rotation += 0.01
    sprites.ship2.rotation -= 0.01

    if (input.isDirectionPressed(Direction.Up)) {
      sprites.ship.y -= 0.3 * delta
    }
    if (input.isDirectionPressed(Direction.Down)) {
      sprites.ship.y += 0.3 * delta
    }
    if (input.isDirectionPressed(Direction.Left)) {
      sprites.ship.x -= 0.3 * delta
    }
    if (input.isDirectionPressed(Direction.Right)) {
      sprites.ship.x += 0.3 * delta
    }
    sabWorker1.playerPositionArr[0] = sprites.ship.x
    sabWorker1.playerPositionArr[1] = sprites.ship.y
  })
})

setTimeout(() => {
  worker1.postMessage({
    playerPositionSab: sabWorker1.playerPosition,
    enemy1PositionsSab: sabWorker1.enemy1Positions,
    enemy1EnabledSab: sabWorker1.enemy1Enabled,
  })

  worker1.postMessage({
    playerPositionSab: sabWorker1.playerPosition,
    enemy1PositionsSab: sabWorker1.enemy1Positions,
    enemy1EnabledSab: sabWorker1.enemy1Enabled,
  })
}, 300)
