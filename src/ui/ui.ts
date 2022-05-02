import * as PIXI from 'pixi.js'
import { app } from '../main'
import { viewport, viewportContainer } from '../viewport/viewport'
import sab from '../worker/sabManage'
import { sprites, textures } from '../resource/spriteManage'

const resourceText = new PIXI.Text('', { fontFamily: 'Consolas', fontSize: 20, fill: 0xffffff, align: 'center' })
const infoText = new PIXI.Text('', { fontFamily: 'Consolas', fontSize: 20, fill: 0xffffff, align: 'center' })

const uiScale = 1

const char1 = new PIXI.Sprite(textures.char1)
char1.scale.set(10 * uiScale)
char1.anchor.set(0, 1)

const ui1 = new PIXI.Sprite(textures.ui1)
ui1.scale.set(6 * uiScale)
ui1.anchor.set(1, 1)
ui1.interactive = true
ui1.buttonMode = true
char1.interactive = true

char1.on('pointerdown', () => {
  infoText.text = 'hi'
})

ui1.on('pointerdown', () => {
  infoText.text = 'bye'
})

export const addText = () => {
  const ui = new PIXI.Container()

  resourceText.scale.set(1.2 * uiScale)
  resourceText.anchor.set(0.5, 0)
  resourceText.position.set(app.view.width / 2, 10)

  infoText.scale.set(1.5 * uiScale)
  infoText.anchor.set(0.5, 1)
  infoText.position.set(app.view.width / 2, app.view.height - 10)

  Atomics.store(sab.lifeArr, 0, 10000)

  ui.addChild(char1)
  ui.addChild(ui1)
  ui.addChild(resourceText)
  ui.addChild(infoText)

  app.stage.addChild(ui)

  app.ticker.add(() => {
    resourceText.text = (`Killed :${sab.killArr[0]}, Exp : ${sab.expArr[0]}/100\nTime: ${sab.timerArr[0]}, Life: ${sab.lifeArr[0]}`)
    resourceText.position.set(app.view.width / 2, 30)
    infoText.position.set(app.view.width / 2, app.view.height - 30)
    char1.position.set(0, app.view.height)
    ui1.position.set(app.view.width, app.view.height)
  })
}
