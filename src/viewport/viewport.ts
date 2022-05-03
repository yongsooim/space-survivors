import { Viewport } from 'pixi-viewport'
import { player } from '../player/player'
import { app } from '../main'
import { keyboard, Keys } from '../input/keyboard'
import { Container } from 'pixi.js'

// app.stage <- viewport <- viewportContainer

export let viewport: Viewport
export const viewportContainer = new Container()
viewportContainer.zIndex = 999
export function initViewport () {
  viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    disableOnContextMenu: true,
    divWheel: document.getElementById('pixi') as HTMLElement
  })
  // viewport
  //  .pinch({ noDrag: true })
  //  .wheel({ percent: 0, smooth: 10, trackpadPinch: true })
  //  .setZoom(20)
  //  .clampZoom({ minScale: 1, maxScale: 500 })
  //  .follow(player)

  window.addEventListener('resize', () => {
    viewport.resize(window.innerWidth, window.innerHeight)
  })

  viewport.addChild(viewportContainer)
  app.stage.addChild(viewport)

  app.ticker.add((delta) => {
    if (keyboard.isHeld(Keys.Equal) === true || keyboard.isHeld(Keys.PageUp) === true) {
      viewport.zoomPercent(0.02 * delta, true)
    }
    if (keyboard.isHeld(Keys.Minus) === true || keyboard.isHeld(Keys.PageDown) === true) {
      viewport.zoomPercent(-0.02 * delta, true)
    }
  })
}
