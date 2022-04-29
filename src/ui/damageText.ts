import * as PIXI from 'pixi.js'
import { numberOfDamageText } from '../type/const'
import { viewportContainer } from '../viewport/viewport'
import { app } from '../main'

class DamageTextPool {
  cursor = 0
  pool: PIXI.Text[] = []

  constructor() {
    for (let i = 0; i < numberOfDamageText; i++) {
      let temp = new PIXI.Text('', { fontFamily: 'Consolas', fontSize: 30, fill: 0xffffff, align: 'center', dropShadow: true })
      temp.scale.set(0.05)
      temp.anchor.set(0.5)
      this.pool.push(temp)
    }
  }

  show(x: number, y: number, damage: number) {
    this.cursor++
    if (this.cursor >= numberOfDamageText) this.cursor = 0
    
    let currentCursor = this.cursor
    this.pool[currentCursor].text = damage.toString()
    this.pool[currentCursor].position.set(x, y)
    viewportContainer.addChild(this.pool[currentCursor])

    let damageTextAnimation = (delta: number) => {
      this.pool[currentCursor].alpha -= 0.01 * delta
      let speed = this.pool[currentCursor].alpha * this.pool[currentCursor].alpha
      if (this.pool[currentCursor].alpha >= 0.9) {
        this.pool[currentCursor].position.y -= 0.01 * speed
      } else {
        this.pool[currentCursor].position.y += 0.02 * speed
      }
    }

    app.ticker.add(damageTextAnimation)

    setTimeout(() => {
      viewportContainer.removeChild(this.pool[currentCursor])
      app.ticker.remove(damageTextAnimation)
    }, 2000)
  }
}

export const damageTextPool = new DamageTextPool()
