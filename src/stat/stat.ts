
import Stats from '../../node_modules/stats.js/src/Stats.js'

export function initStat () {
  const stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)

  function statAnimate () {
    stats.begin()
    stats.end()
    requestAnimationFrame(statAnimate)
  }

  requestAnimationFrame(statAnimate)
}
