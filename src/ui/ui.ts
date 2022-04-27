import * as PIXI from 'pixi.js'
import { app } from '../main';
import { viewport, viewportContainer } from '../viewport/viewport'
import sabWorker1 from '../worker/sabManage'
import { sprites, textures } from '../resource/spriteManage'


let resourceText = new PIXI.Text('Time: 0 \nKilled : 0, Collected : 0',{fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'});

let char1 = new PIXI.Sprite(textures.char1)
char1.scale.set(8)
char1.anchor.set(0, 1)

let ui1 = new PIXI.Sprite(textures.ui1)
ui1.scale.set(5)
ui1.anchor.set(1, 1)
ui1.interactive = true
char1.interactive = true

ui1.on('pointerdown', ()=>{
    console.log('clicked')
})

export let addText = () => {

    sabWorker1.lifeArr[0] = 100000
    app.stage.addChild(resourceText)
    app.stage.addChild(char1)
    app.stage.addChild(ui1)

    resourceText.tint = 0xffffff
    resourceText.anchor.set(0.5, 0)
    resourceText.position.set(app.view.width/2, 30)
    
    app.ticker.add(()=>{
        resourceText.text = (`Time: ${sabWorker1.timerArr[0]}, Life: ${sabWorker1.lifeArr[0]} \nKilled :${sabWorker1.killArr[0]}, Collected : ${sabWorker1.resourceCollectedArr[0]}`)
        resourceText.position.set(app.view.width/2, 10)
        char1.position.set(0, app.view.height)
        ui1.position.set(app.view.width, app.view.height)

    })
    


}
