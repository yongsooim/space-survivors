import * as particles from '@pixi/particle-emitter'
import firePng from '../asset/fire.png'
import particlePng from '../asset/particle.png'
import { viewport, viewportContainer, viewportEmitterContainer } from '../viewport/viewport'
import { player } from './player'

export let emitter : particles.Emitter
export const initEmitter = () => {
  emitter = new particles.Emitter(viewportEmitterContainer, {
    lifetime: {
      min: 0.05,
      max: 0.1
    },
    frequency: 0.001,
    emitterLifetime: 0,
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
          min: 18,
          max: 20
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

  // Calculate the current time
  let elapsed = Date.now()

  // Update function every frame
  const update = function () {
    // Update the next frame
    requestAnimationFrame(update)

    emitter.updateOwnerPos(player.x, player.y)

    const now = Date.now()

    // The emitter requires the elapsed
    // number of seconds since the last update
    emitter.update((now - elapsed) * 0.001)
    elapsed = now
    // console.log(emitter.particleCount)
  }

  // Start emitting
  emitter.emit = true

  // Start the update
  update()
}
