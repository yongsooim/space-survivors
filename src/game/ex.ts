import * as ex from 'excalibur'

export const game = new ex.Engine({
  width: 1600,
  height: 900,
  antialiasing: false,
  maxFps: 60,
  backgroundColor: ex.Color.Black,
  suppressConsoleBootMessage: true,
  displayMode: ex.DisplayMode.FillScreen
})

game.screen.antialiasing = true
game.setAntialiasing(false)
game.screen.applyResolutionAndViewport()

//let devtool = new DevTool(game) // dev tools 사용 안하려면 주석처리

const loader = new ex.Loader([])

loader.startButtonFactory = () => {
  game.screen.applyResolutionAndViewport()
  let buttonElement: HTMLButtonElement = document.getElementById('fsbPlay') as HTMLButtonElement;
  if (!buttonElement) {
    buttonElement = document.createElement('button');
  }

  buttonElement.id = 'fsbPlay';
  buttonElement.textContent = 'click to start';
  //buttonElement.textContent = '시작';
  return buttonElement;
};

loader.backgroundColor = '#000000'
loader.logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjiJu+4D8ABYEClcC+vtcAAAAASUVORK5CYII='
loader.logoPosition = ex.vec(game.screen.viewport.width * 45/ 100, game.screen.viewport.height * 2 / 5)
loader.loadingBarPosition = ex.vec(game.screen.viewport.width / 4, game.screen.viewport.height * 4 / 5)
loader.logoWidth = game.screen.viewport.width / 2
loader.playButtonPosition = ex.vec(game.screen.viewport.width / 4, game.screen.viewport.height * 4 / 5)


game.start(loader).then(async () => {
})
