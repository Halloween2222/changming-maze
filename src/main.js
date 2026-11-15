// 《长明：雾海迷宫》入口
// 后续在这里接入 three.js 场景、迷宫生成、渲染管线与玩法模块。
// 当前为仓库初始化占位，保持双击 index.html 可打开。

const canvas = document.querySelector('#scene')

if (canvas) {
  const ctx = canvas.getContext('2d')
  const resize = () => {
    canvas.width = window.innerWidth * devicePixelRatio
    canvas.height = window.innerHeight * devicePixelRatio
  }
  resize()
  window.addEventListener('resize', resize)
  if (ctx) {
    ctx.fillStyle = 'rgba(11, 26, 36, 0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}

console.info('[changming] bootstrap placeholder; three.js scene will be wired here.')
