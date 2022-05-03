import Worker from "./worker1?worker";
import sab from "./sabManage";
import * as PIXI from "pixi.js";
import { viewport, viewportContainer } from "../viewport/viewport";
import consts from "../type/const";
import { aa1Texture, enemy1, fireTexture, sprites } from "../resource/spriteManage";
import { app } from "../main";
import { sound } from "@pixi/sound";
import { damageTextPool } from "../ui/damageText";
import { channel12 } from "./channel";
import { isMobile } from "pixi.js";
import firePng from "../asset/fire.png";
import { explosion, explosionPool } from "../player/explosion";

const worker1 = new Worker();

let tempIterator = 0;

let tempSprite;
let alreadySent = false;
export let worker1Ready = false;
worker1.onmessage = (ev: any) => {
  if (ev.data.cmd === "loaded") {
    if (alreadySent === false) {
      alreadySent = true
      worker1.postMessage({ cmd: "init", sab: sab }, [channel12.port1]);
      channel12.port1.onmessage = () => {
        channel12.port2.postMessage(0);
      };
    }
  } else if (ev.data.cmd === "ready") {
    worker1Ready = true;
    worker1.postMessage({ cmd: "start" });
  } else if (ev.data.cmd === "damage") {
    damageTextPool.show((ev.data.x + ev.data.enemyX) / 2, (ev.data.y + ev.data.enemyY) / 2, 5);
    explosionPool.show(ev.data.enemyX, ev.data.enemyY);
  }
};

export function worker1init() {
  // calc request

  worker1start();
}

export function worker1start() {}

window.onbeforeunload = () => {
  location.reload();
  document.location.reload();
  worker1.postMessage({ cmd: "close" });
  worker1.terminate();
  PIXI.utils.clearTextureCache();
};

window.onclose = () => {
  worker1.postMessage({ cmd: "close" });
  worker1.terminate();
  PIXI.utils.clearTextureCache();
};

window.document.addEventListener("beforeunload", () => {
  worker1.terminate();
  worker1.postMessage("");
  PIXI.utils.clearTextureCache();
});

export function worker1fire() {
  sound.volume("shot", 0.3);
  sound.play("shot");

  worker1.postMessage({ cmd: "fire" });
}

export function worker1flame() {
  worker1.postMessage({ cmd: "flame" });
}

export async function worker1check() {
  worker1.postMessage({ cmd: "check" });
}

export {};
