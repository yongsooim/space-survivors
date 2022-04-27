import * as PIXI from 'pixi.js'
import { viewport, viewportContainer } from '../viewport/viewport'


let resourceText = new PIXI.Text('d')

resourceText.scale.set(1000)
resourceText.tint = 0xffffff
resourceText.position.set(0)

export let addText = () => {
    viewportContainer.addChild(resourceText)
}