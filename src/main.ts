import * as PIXI from "pixi.js";
import { Vector } from "./class/Vector";
import { Viewport } from "pixi-viewport";
import { resources, resourcePaths } from "./resource/resources";
import { sprites, enemy1 } from "./resource/spriteManage";
import Worker from "./worker/worker1?worker";
import shipPng from "./asset/ship.png";
import { playerSpeed, numberOfEnemy1, numberOfEnemy1double } from "./type/const";
import sabWorker1 from "./worker/sabManage";
import { SceneManager, Scene } from "pixi-scenegraph";
import { Direction } from "./type/type";
import { heartbeatInit } from "./timer/heartbeatManage";
import { player } from "./player/player";
import { ObservablePoint, Container, ParticleContainer, Renderer } from "pixi.js";
import { BatchRendererPluginFactory } from "pixi-batch-renderer";
import { DiffGeometryFactory, DiffDrawer } from "@pixi-pbr/diffy";
import { input } from "./input/input";

import Stats from "../node_modules/stats.js/src/Stats.js";
import { aaPool } from "./weapon/autoAttack1";
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

const worker1 = new Worker();

PIXI.utils.skipHello();
PIXI.settings.GC_MAX_CHECK_COUNT = 20000;
PIXI.settings.GC_MAX_IDLE = 80000;
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.LOW;
PIXI.settings.PRECISION_VERTEX = PIXI.PRECISION.LOW;

const app = new PIXI.Application({
  resizeTo: window,
  antialias: false,
  backgroundColor: 0x000000,
});

document.body.appendChild(app.view);

export let viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  disableOnContextMenu: true,
});

input.init();
let enemy1ships = [] as PIXI.Sprite[];
let indexDouble;

window.addEventListener("resize", (evt) => {
  viewport.resize(window.innerWidth, window.innerHeight);
});

sabWorker1.enemy1HpsArr.forEach((v, i, a) => {
  a[i] = 1;
});

let tempIterator: number;
app.loader.add(resources).load(async () => {
  const tilingSprite = new PIXI.TilingSprite(sprites.bg.texture, 50000, 50000);
  tilingSprite.scale.x = 0.1;
  tilingSprite.scale.y = 0.1;
  tilingSprite.anchor.x = 0.5;
  tilingSprite.anchor.y = 0.5;

  viewport.addChild(tilingSprite);
  aaPool.init();

  viewport.center.x = 250;
  viewport.center.y = 250;

  viewport
    .pinch({ noDrag: true })
    .wheel({ percent: 0, smooth: 10, trackpadPinch: true })
    .setZoom(30)
    .clampZoom({ minScale: 0.5, maxScale: 1000 })
    .follow(player);

  sprites.ship2.x = app.renderer.width / 2;
  sprites.ship2.y = app.renderer.height / 2;

  sprites.ship2.anchor.x = 0.5;
  sprites.ship2.anchor.y = 0.5;

  viewport.addChild(sprites.ship2).position.x = 300;

  app.stage.addChild(viewport);

  let enemy1container = new ParticleContainer(
    numberOfEnemy1,
    {
      vertices: false,
      rotation: false,
      uvs: false,
      tint: false,
      alpha: true,
      scale: false,
      position: true,
    },
    numberOfEnemy1,
    false
  );
  viewport.addChild(enemy1container);

  tempIterator = numberOfEnemy1;

  while (tempIterator--) {
    enemy1ships[tempIterator] = new PIXI.Sprite(enemy1);

    enemy1ships[tempIterator].scale.x = 0.2;
    enemy1ships[tempIterator].scale.y = 0.2;

    enemy1ships[tempIterator].anchor.x = 0.5;
    enemy1ships[tempIterator].anchor.y = 0.5;

    enemy1ships[tempIterator].anchor.set(0.5);
    enemy1ships[tempIterator].x = 0;
    enemy1ships[tempIterator].y = 0;
    enemy1ships[tempIterator].cacheAsBitmapResolution = 1;
    enemy1ships[tempIterator].cacheAsBitmap = true;
    enemy1container.addChild(enemy1ships[tempIterator]);
  }

  viewport.addChild(player);

  heartbeatInit();
  // Listen for frame updates
  app.ticker.add((delta: number) => {
    //enemy1 position update
    tempIterator = numberOfEnemy1;
    while (tempIterator--) {
      if (sabWorker1.enemy1HpsArr[tempIterator] <= 0) {
        sabWorker1.enemy1HpsArr[tempIterator] = 0;
        enemy1container.children[tempIterator].alpha = 0;
        continue;
      }
      indexDouble = tempIterator * 2;
      enemy1container.children[tempIterator].x = sabWorker1.enemy1PositionsArr[indexDouble];
      enemy1container.children[tempIterator].y = sabWorker1.enemy1PositionsArr[indexDouble + 1];
    }

    input.update();
    player.update(delta);
    aaPool.update(delta);
    sprites.ship2.rotation -= 0.01;
  });
});

setInterval(() => {
  //console.log(sabWorker1.enemy1HpsArr)
}, 500);

setTimeout(() => {
  worker1.postMessage([sabWorker1.playerPosition, sabWorker1.enemy1Positions, sabWorker1.enemy1Hps]);
}, 1000);

window.onbeforeunload = function (e) {
  location.reload();
  document.location.reload();
  worker1.postMessage({ cmd: "close" });
  worker1.terminate();
  PIXI.utils.clearTextureCache();
};

window.onclose = function (e) {
  worker1.postMessage({ cmd: "close" });
  worker1.terminate();
  PIXI.utils.clearTextureCache();
};

window.document.addEventListener("beforeunload", (e) => {
  worker1.terminate();
  worker1.postMessage("");
  PIXI.utils.clearTextureCache();
});
