import * as ex from 'excalibur'
import { DevTool } from '@excaliburjs/dev-tools'
import { resources } from './so/resource/resourceManage'
import { player } from './so/player/player'

export const game = new ex.Engine({
  width: 1600,
  height: 900,
  antialiasing: false,
  maxFps: 60,
  backgroundColor: ex.Color.Black,
  suppressConsoleBootMessage: true,
  displayMode: ex.DisplayMode.FitScreen
})

game.screen.antialiasing = true
game.setAntialiasing(false)
game.screen.applyResolutionAndViewport()

//let devtool = new DevTool(game) 



const loader = new ex.Loader(resources)

loader.startButtonFactory = () => {
  game.screen.applyResolutionAndViewport()
  let buttonElement: HTMLButtonElement = document.getElementById('soPlay') as HTMLButtonElement
  if (!buttonElement) {
    buttonElement = document.createElement('button')
  }

  buttonElement.id = 'soPlay'
  buttonElement.textContent = 'click to start'
  return buttonElement
}

loader.backgroundColor = '#000000'
loader.logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjiJu+4D8ABYEClcC+vtcAAAAASUVORK5CYII='
loader.logoPosition = ex.vec(game.screen.viewport.width * 45 / 100, game.screen.viewport.height * 2 / 5)
loader.loadingBarPosition = ex.vec(game.screen.viewport.width / 4, game.screen.viewport.height * 4 / 5)
loader.logoWidth = game.screen.viewport.width / 2
loader.logoHeight = game.screen.viewport.height / 2


game.start(loader).then(()=>{

  let bg = new ex.Actor({pos: game.screen.center})
  bg.graphics.use(ex.Sprite.from(resources[1]))


  //game.currentScene.add(bg)
  game.currentScene.add(player)

})
