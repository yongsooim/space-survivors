import { Engine, Physics, Loader, Color, DisplayMode, vec, CollisionSystem, CollisionResolutionStrategy } from 'excalibur'
import { input } from './input/input'
import { player } from './player/player'
import { Resources, tilemap } from './resource/resources'
import { DevTool } from '@excaliburjs/dev-tools'
import { Enemy } from './enemy/enemy'



Physics.collisionResolutionStrategy = CollisionResolutionStrategy.Arcade;

Physics.enabled = true

/**
* Amount of overlap to tolerate in pixels
*/
Physics.slop = 0;

/**
 * Amount of positional overlap correction to apply each position iteration of the solver
 * O - meaning no correction, 1 - meaning correct all overlap
 */
Physics.steeringFactor = 0;

/**
* Warm start set to true re-uses impulses from previous frames back in the solver
*/
Physics.warmStart = true;

/**
* By default bodies do not sleep
*/
Physics.bodiesCanSleepByDefault = true;

/**
* Surface epsilon is used to help deal with surface penetration
*/
Physics.surfaceEpsilon = 0.5;
Physics.sleepEpsilon = 0.7;
Physics.wakeThreshold = Physics.sleepEpsilon * 3;
Physics.sleepBias = 2;

/**
 * Enable fast moving body checking, this enables checking for collision pairs via raycast for fast moving objects to prevent
 * bodies from tunneling through one another.
 */
Physics.checkForFastBodies = false;

class Game extends Engine {
  constructor() {
    super({
      width: 1280,
      height: 960,
      antialiasing: false,
      backgroundColor: Color.Black,
      suppressConsoleBootMessage: true,
      displayMode: DisplayMode.FitScreen,
      maxFps: 60
    })
  }

  initialize() {
    const loader = new Loader(Object.values(Resources))

    loader.backgroundColor = '#000000'
    // white dot string
    loader.logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjiJu+4D8ABYEClcC+vtcAAAAASUVORK5CYII='
    loader.logoWidth = game.screen.viewport.width / 2
    loader.logoPosition = vec(game.screen.viewport.width * 45 / 100, game.screen.viewport.height * 2 / 5)
    loader.loadingBarPosition = vec(game.screen.viewport.width / 4, game.screen.viewport.height * 4 / 5)

    loader.startButtonFactory = () => {
      game.screen.applyResolutionAndViewport()
      let buttonElement: HTMLButtonElement = document.getElementById('fsbPlay') as HTMLButtonElement
      if (!buttonElement) {
        buttonElement = document.createElement('button')
      }

      buttonElement.id = 'fsbPlay'
      //buttonElement.textContent = '시작'
       buttonElement.textContent = 's'
      return buttonElement
    }

    tilemap.scale = vec(10, 10)
    this.start(loader)
    game.add(tilemap)
    game.add(player)
    game.currentScene.add(input)
    this.currentScene.camera.zoom = 0.3
    // this.currentScene.camera.strategy.lockToActor(player)
    this.currentScene.camera.strategy.elasticToActor(player, 0.6, 0.8)
  }
}

export const game = new Game()
game.initialize()

//let devtool = new DevTool(game)
