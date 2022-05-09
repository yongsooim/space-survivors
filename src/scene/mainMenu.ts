import { Scene } from 'pixi-scenegraph'
import * as PIXI from 'pixi.js'
import { app } from '../main'
import { viewportContainer } from '../viewport/viewport'

class MainMenu extends PIXI.Container {
  count = 0;
  titleText = new PIXI.Text('Space Survivors 2022', { fontFamily: 'Consolas', fontSize: 26, fill: 0xffffff, align: 'center' });
  pressText = new PIXI.Text('Press Any to Start', { fontFamily: 'Consolas', fontSize: 20, fill: 0xffffff, align: 'center' });

  init () {
    this.position.set(0)

    this.titleText.anchor.set(0.5)
    this.titleText.scale.set(1.5)
    this.titleText.position.set(0, -100)

    this.pressText.anchor.set(0.5)
    this.pressText.scale.set(1.5)
    this.pressText.position.set(0, 20)

    this.pressText.text = 'Loading...'
    this.addChild(this.titleText)
    this.addChild(this.pressText)

    this.position.set(app.view.width / 2, app.view.height / 2 + 40)

    app.ticker.add(this.update)
  }

  update = (delta: number) => {
    this.count += delta
    if (this.count >= 60) {
      this.count = 0
      this.pressText.visible = !this.pressText.visible
    }

    // check loading
  };

  exit = () => {
    viewportContainer.removeChild(this)
    app.ticker.remove(this.update)
  }
}

export const mainMenu = new MainMenu()
