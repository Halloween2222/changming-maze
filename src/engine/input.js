/**
 * 输入抽象：键盘 + 鼠标。
 * 优先 Pointer Lock；浏览器拒绝时自动退回“按住拖动环视”。
 * 玩家控制器 / 相机 rig 只读这里的结果，不自己绑事件。
 */

const PREVENT_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Space',
])

export function createInput(domElement, options = {}) {
  if (!domElement) throw new Error('createInput: domElement is required')

  const keys = new Set()
  const keyDownHandlers = new Set()
  let mouseDX = 0
  let mouseDY = 0
  let dragging = false
  let pointerLocked = false
  let enabled = true

  const onKeyDown = (event) => {
    if (!enabled) return
    if (PREVENT_KEYS.has(event.code)) event.preventDefault()
    keys.add(event.code)
    for (const handler of keyDownHandlers) handler(event)
  }

  const onKeyUp = (event) => {
    keys.delete(event.code)
  }

  const onBlur = () => {
    keys.clear()
    dragging = false
  }

  const onPointerDown = (event) => {
    if (!enabled) return
    if (event.button !== undefined && event.button !== 0) return
    dragging = true
    domElement.focus?.()
    domElement.setPointerCapture?.(event.pointerId)
    requestPointerLock()
  }

  const onPointerUp = (event) => {
    dragging = false
    domElement.releasePointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!enabled) return
    if (pointerLocked || dragging) {
      mouseDX += event.movementX || 0
      mouseDY += event.movementY || 0
    }
  }

  const onPointerLockChange = () => {
    pointerLocked = document.pointerLockElement === domElement
  }

  const onPointerLockError = () => {
    pointerLocked = false
  }

  function requestPointerLock() {
    if (!domElement.requestPointerLock) return
    try {
      const result = domElement.requestPointerLock()
      if (result && typeof result.catch === 'function') result.catch(() => {})
    } catch {
      // 浏览器拒绝 Pointer Lock 时继续用拖动模式
    }
  }

  function consumeMouseDelta() {
    const delta = { x: mouseDX, y: mouseDY }
    mouseDX = 0
    mouseDY = 0
    return delta
  }

  function isDown(code) {
    return enabled && keys.has(code)
  }

  function onKeyDownEvent(handler) {
    keyDownHandlers.add(handler)
    return () => keyDownHandlers.delete(handler)
  }

  function setEnabled(value) {
    enabled = Boolean(value)
    if (!enabled) {
      keys.clear()
      dragging = false
      mouseDX = 0
      mouseDY = 0
      if (pointerLocked) document.exitPointerLock?.()
    }
  }

  function dispose() {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onBlur)
    domElement.removeEventListener('pointerdown', onPointerDown)
    domElement.removeEventListener('pointerup', onPointerUp)
    domElement.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerlockchange', onPointerLockChange)
    document.removeEventListener('pointerlockerror', onPointerLockError)
    keyDownHandlers.clear()
    keys.clear()
  }

  window.addEventListener('keydown', onKeyDown, { passive: false })
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)
  domElement.addEventListener('pointerdown', onPointerDown)
  domElement.addEventListener('pointerup', onPointerUp)
  domElement.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerlockchange', onPointerLockChange)
  document.addEventListener('pointerlockerror', onPointerLockError)

  // 让 canvas 可以接收键盘焦点
  if (!domElement.hasAttribute('tabindex')) domElement.setAttribute('tabindex', '0')

  return {
    consumeMouseDelta,
    isDown,
    onKeyDown: onKeyDownEvent,
    setEnabled,
    get pointerLocked() {
      return pointerLocked
    },
    dispose,
  }
}
