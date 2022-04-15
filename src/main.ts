import { Engine, Loader, Color, DisplayMode, vec } from 'excalibur'
import { Player } from './player/player'
import { Resources } from './resources'

class Game extends Engine {
  constructor () {
    super({
      width: 1280,
      height: 960,
      antialiasing: false,
      backgroundColor: Color.Black,
      suppressConsoleBootMessage: true,
      displayMode: DisplayMode.FitScreen
    })
  }

  initialize () {
    const player = new Player()
    this.add(player)

    const loader = new Loader([Resources.Sword])

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
      buttonElement.textContent = '시작'
      // buttonElement.textContent = 's'
      return buttonElement
    }

    this.start(loader)
  }
}

export const game = new Game()
game.initialize()
