import * as PIXI from 'pixi.js'
import { app } from '../main'

PIXI.utils.skipHello()

class MainMenu extends PIXI.Container {
  count = 0
  resourceText = new PIXI.Text('Press Any to Start', { fontFamily: 'Consolas', fontSize: 10, fill: 0xffffff, align: 'center' })
  init () {
    const bgSprite = new PIXI.Sprite()
    this.resourceText.anchor.set(0.5)
    this.resourceText.scale.set(10)
    this.resourceText.position.set(app.view.width / 2, app.view.height / 2)
    this.addChild(bgSprite)
    this.addChild(this.resourceText)
  }

  functionToTicker(delta: number){
    this.count += delta
    if (this.count >= 1000) {
      this.count = 0
      this.resourceText.visible = !this.resourceText.visible
    }
  }
}

export const mainMenu = new MainMenu()
