import * as particles from '@pixi/particle-emitter';
import firePng from '../asset/fire.png';
import particlePng from '../asset/particle.png';
import consts from '../type/const';
import { viewport, viewportContainer } from '../viewport/viewport';
import { player } from './player';

export let explosion = new particles.Emitter(viewportContainer, {
  autoUpdate: true,
  lifetime: {
    min: 0.2,
    max: 0.2,
  },
  frequency: 0.008,
  emitterLifetime: 0.31,
  maxParticles: 1000,
  addAtBack: false,
  pos: {
    x: 0,
    y: 0,
  },
  behaviors: [
    {
      type: 'alpha',
      config: {
        alpha: {
          list: [
            {
              time: 0,
              value: 0.8,
            },
            {
              time: 1,
              value: 0.1,
            },
          ],
        },
      },
    },
    {
      type: 'moveSpeed',
      config: {
        speed: {
          list: [
            {
              time: 0,
              value: 10,
            },
            {
              time: 1,
              value: 5,
            },
          ],
        },
      },
    },
    {
      type: 'scale',
      config: {
        scale: {
          list: [
            {
              time: 0,
              value: 0.01,
            },
            {
              time: 1,
              value: 0.03,
            },
          ],
        },
        minMult: 1,
      },
    },
    {
      type: 'color',
      config: {
        color: {
          list: [
            {
              time: 0,
              value: 'fb1010',
            },
            {
              time: 1,
              value: 'f5b830',
            },
          ],
        },
      },
    },
    {
      type: 'rotationStatic',
      config: {
        min: 0,
        max: 360,
      },
    },
    {
      type: 'textureRandom',
      config: {
        textures: [particlePng],
      },
    },
    {
      type: 'spawnShape',
      config: {
        type: 'torus',
        data: {
          x: 0,
          y: 0,
          radius: 0.1,
          innerRadius: 0,
          affectRotation: false,
        },
      },
    },
  ],
});

class ExplosionPool {

  pool = new Array<particles.Emitter>(consts.numberOfEnemy1)
  cursor = 0

  constructor() {
    for (let i = 0; i < consts.numberOfExplosion; i++) {
      this.pool[i] = new particles.Emitter(viewportContainer, {
        autoUpdate: true,
        lifetime: {
          min: 0.2,
          max: 0.2,
        },
        frequency: 0.008,
        emitterLifetime: 0.31,
        maxParticles: 1000,
        addAtBack: false,
        pos: {
          x: 0,
          y: 0,
        },
        behaviors: [
          {
            type: 'alpha',
            config: {
              alpha: {
                list: [
                  {
                    time: 0,
                    value: 0.8,
                  },
                  {
                    time: 1,
                    value: 0.1,
                  },
                ],
              },
            },
          },
          {
            type: 'moveSpeed',
            config: {
              speed: {
                list: [
                  {
                    time: 0,
                    value: 10,
                  },
                  {
                    time: 1,
                    value: 5,
                  },
                ],
              },
            },
          },
          {
            type: 'scale',
            config: {
              scale: {
                list: [
                  {
                    time: 0,
                    value: 0.01,
                  },
                  {
                    time: 1,
                    value: 0.03,
                  },
                ],
              },
              minMult: 1,
            },
          },
          {
            type: 'color',
            config: {
              color: {
                list: [
                  {
                    time: 0,
                    value: 'fb1010',
                  },
                  {
                    time: 1,
                    value: 'f5b830',
                  },
                ],
              },
            },
          },
          {
            type: 'rotationStatic',
            config: {
              min: 0,
              max: 360,
            },
          },
          {
            type: 'textureRandom',
            config: {
              textures: [particlePng],
            },
          },
          {
            type: 'spawnShape',
            config: {
              type: 'torus',
              data: {
                x: 0,
                y: 0,
                radius: 0.1,
                innerRadius: 0,
                affectRotation: false,
              },
            },
          },
        ],
      });
    }
  }

  show(x: number, y: number) {
    this.cursor++
    if(this.cursor >= consts.numberOfExplosion){
      this.cursor = 0
    }
    this.pool[this.cursor].spawnPos.set(x - player.position.x, y - player.position.y)
    this.pool[this.cursor].playOnce()
  }
}

export let explosionShow = (x: number, y: number) => {
  //explosion.spawnPos.set(x - player.position.x, y - player.position.y)
  explosion.spawnPos.set(x - player.position.x, y - player.position.y)
  explosion.playOnce()
}

export const explosionPool = new ExplosionPool()