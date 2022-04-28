import * as PIXI from "pixi.js";
import { numberOfFlame } from "../type/const";
import * as particles from '@pixi/particle-emitter'
import firePng from '../asset/fire.png'
import particlePng from '../asset/particle.png'
import { viewportContainer } from "../viewport/viewport";
import { player } from "../player/player";



class Flame {
  fired = false;
  remainTime = 0;
  cursor = 0;

  objectPool = [] as any[]


  flame(x: number, y: number) {
    this.cursor++
    if (this.cursor === numberOfFlame) {
      this.cursor = 0
    }
    this.objectPool[this.cursor].fired = true
    this.objectPool[this.cursor].x = x
    this.objectPool[this.cursor].y = y + 0.7
    this.objectPool[this.cursor].remainTime = 100

    this.emitter.spawnPos = player.position
    this.emitter.emitNow()
    
  }

  emitter = new particles.Emitter(viewportContainer, {
    lifetime: {
      min: 0.035,
      max: 0.05
    },
    frequency: 0.0005,
    emitterLifetime: 0.5,
    maxParticles: 1000,
    addAtBack: false,
    pos: {
      x: 0,
      y: 0.7
    },
    behaviors: [
      {
        type: 'alpha',
        config: {
          alpha: {
            list: [
              {
                time: 0,
                value: 0.82
              },
              {
                time: 1,
                value: 0
              }
            ]
          }
        }
      },
      {
        type: 'moveSpeedStatic',
        config: {
          min: 40,
          max: 40
        }
      },
      {
        type: 'scale',
        config: {
          scale: {
            list: [
              {
                time: 0,
                value: 0.008
              },
              {
                time: 1,
                value: 0.0001
              },
              {
                time: 2,
                value: 0.2
              }
            ]
          },
          minMult: 0.5
        }
      },
      {
        type: 'color',
        config: {
          color: {
            list: [
              {
                time: 0,
                value: 'ffa171'
              },
              {
                time: 1,
                value: 'ff120c'
              }
            ]
          }
        }
      },
      {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: -50,
          maxSpeed: -50,
          minStart: -269,
          maxStart: -271
        }
      },
      {
        type: 'textureRandom',
        config: {
          textures: [particlePng, firePng]
        }
      },
      {
        type: 'spawnShape',
        config: {
          type: 'torus',
          data: {
            x: 0,
            y: 0,
            radius: 0.2,
            innerRadius: 0,
            affectRotation: false
          }
        }
      }
    ]
  })
}

const flame = new Flame()