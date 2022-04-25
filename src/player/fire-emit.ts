import * as particles from "@pixi/particle-emitter";
import firePng from "../asset/fire.png";
import particlePng from "../asset/particle.png";
import { player } from "./player";

export let emitter = new particles.Emitter(
    player,
      {
        "lifetime": {
          "min": 0.1,
          "max": 0.75
        },
        "frequency": 0.005,
        "emitterLifetime": 0,
        "maxParticles": 1000,
        "addAtBack": true,
        "pos": {
          "x": 0,
          "y": 0.8
        },
        "behaviors": [
          {
            "type": "alpha",
            "config": {
              "alpha": {
                "list": [
                  {
                    "time": 0,
                    "value": 0.62
                  },
                  {
                    "time": 1,
                    "value": 0
                  }
                ]
              }
            }
          },
          {
            "type": "moveSpeedStatic",
            "config": {
              "min": 5,
              "max": 5
            }
          },
          {
            "type": "scale",
            "config": {
              "scale": {
                "list": [
                  {
                    "time": 0,
                    "value": 0.01
                  },
                  {
                    "time": 1,
                    "value": 0.0001
                  }
                ]
              },
              "minMult": 0.5
            }
          },
          {
            "type": "color",
            "config": {
              "color": {
                "list": [
                  {
                    "time": 0,
                    "value": "fff191"
                  },
                  {
                    "time": 1,
                    "value": "ff622c"
                  }
                ]
              }
            }
          },
          {
            "type": "rotation",
            "config": {
              "accel": 0,
              "minSpeed": -50,
              "maxSpeed": -50,
              "minStart": -265,
              "maxStart": -275
            }
          },
          {
            "type": "textureRandom",
            "config": {
              "textures": [
                particlePng,
                firePng
              ]
            }
          },
          {
            "type": "spawnShape",
            "config": {
              "type": "torus",
              "data": {
                "x": 0,
                "y": 0,
                "radius": 0.2,
                "innerRadius": 0,
                "affectRotation": false
              }
            }
          }
        ]
      });
  
  // Calculate the current time
  var elapsed = Date.now();
  
  // Update function every frame
  var update = function () {
    // Update the next frame
    requestAnimationFrame(update);
  
    var now = Date.now();
  
    // The emitter requires the elapsed
    // number of seconds since the last update
    emitter.update((now - elapsed) * 0.001);
    elapsed = now;
  };
  
  // Start emitting
  emitter.emit = true;
  
  // Start the update
  update();
  