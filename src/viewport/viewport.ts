import { Viewport } from 'pixi-viewport'
import { player } from '../player/player'
import { app } from '../main'
import { keyboard, Keys } from '../input/keyboard'

export let viewport: Viewport

export function initViewport() {
  viewport = new Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    disableOnContextMenu: true,
    divWheel: document.getElementById('pixi') as HTMLElement
  })

  viewport
    .pinch({ noDrag: true })
    .wheel({ percent: 0, smooth: 10, trackpadPinch: true })
    .setZoom(0.05)
    .clampZoom({ minScale: 0.05, maxScale: 1000 })
    .follow(player)
    
  window.addEventListener('resize', () => {
    viewport.resize(window.innerWidth, window.innerHeight)
  })

  app.stage.addChild(viewport)
}

export const viewportUpdate = (delta: number) => {
  //viewport.update(delta)
  if (keyboard.isHeld(Keys.Equal) === true || keyboard.isHeld(Keys.PageUp) === true) {
    viewport.zoomPercent(0.02 * delta, true);
  }
  if (keyboard.isHeld(Keys.Minus) === true || keyboard.isHeld(Keys.PageDown) === true) {
    viewport.zoomPercent(-0.02 * delta, true);
  }
}