import { createEventBus } from './engine/events.js'
import { createGameState } from './engine/state.js'
import { createRenderer } from './engine/renderer.js'
import { createInput } from './engine/input.js'
import { createCameraRig } from './engine/camera-rig.js'
import { createDebugScene } from './engine/debug-scene.js'
import { createDiagnostics } from './engine/diagnostics.js'

const canvas = document.querySelector('#scene')
const placeholder = document.querySelector('.placeholder')

function fail(message, detail) {
  console.error('[changming]', message, detail || '')
  if (placeholder) {
    placeholder.innerHTML = `<h1>长明</h1><p>${message}<br>${detail || '请使用支持 WebGL2 的 Chrome / Edge'}</p>`
  }
  document.body.dataset.ready = 'error'
}

try {
  if (!canvas) throw new Error('找不到 #scene canvas')

  const params = new URLSearchParams(window.location.search)
  const seedParam = Number(params.get('seed'))
  const seed = Number.isFinite(seedParam) && seedParam > 0 ? seedParam : 20261205

  const events = createEventBus()
  const state = createGameState({ seed, quality: 'high' })

  const renderer = createRenderer(canvas, { quality: state.quality })
  const input = createInput(canvas)
  const cameraRig = createCameraRig({ camera: renderer.camera, input })
  const debugScene = createDebugScene({ scene: renderer.scene })

  // 临时：UI 的开始按钮还没接入；先把引擎骨架放到 playing，方便冒烟测试。
  state.phase = 'playing'

  const diagnostics = createDiagnostics({
    state,
    renderer,
    cameraRig,
    events,
  })

  window.addEventListener('resize', () => renderer.resize())

  renderer.start((dt) => {
    cameraRig.update(dt)
    debugScene.update(dt)
  })

  // 方便控制台排查；正式模块接入后可以删。
  window.__changming = { renderer, input, cameraRig, debugScene, events, state, diagnostics }
} catch (error) {
  fail('引擎启动失败', error instanceof Error ? error.message : String(error))
}
