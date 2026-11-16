import * as THREE from 'three'

/**
 * 引擎验收用的临时场景：地面、石柱、月光、暖色点光、雾。
 * 只用于验证渲染循环 / 输入 / 阴影 / 诊断；
 * 真正的迷宫与灯塔由 maze/、world/ 模块替换。
 */
export function createDebugScene(options) {
  const { scene } = options
  if (!scene) throw new Error('createDebugScene: scene is required')

  scene.background = new THREE.Color(0x07131a)
  scene.fog = new THREE.FogExp2(0x0b1a24, 0.022)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({
      color: 0x111c21,
      roughness: 0.86,
      metalness: 0.08,
    }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const grid = new THREE.GridHelper(80, 40, 0x2f5a63, 0x163039)
  grid.position.y = 0.01
  grid.material.opacity = 0.35
  grid.material.transparent = true
  scene.add(grid)

  const moon = new THREE.DirectionalLight(0xa7dcff, 2.4)
  moon.position.set(-10, 16, 7)
  moon.castShadow = true
  moon.shadow.mapSize.set(2048, 2048)
  moon.shadow.camera.near = 1
  moon.shadow.camera.far = 60
  moon.shadow.camera.left = -22
  moon.shadow.camera.right = 22
  moon.shadow.camera.top = 22
  moon.shadow.camera.bottom = -22
  moon.shadow.bias = -0.0004
  moon.shadow.normalBias = 0.02
  scene.add(moon)

  const ambient = new THREE.HemisphereLight(0x7fd6ff, 0x07131a, 0.9)
  scene.add(ambient)

  const lantern = new THREE.PointLight(0xffb45c, 28, 22, 2)
  lantern.position.set(2.2, 2.4, 1.5)
  scene.add(lantern)

  const lanternBulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 12),
    new THREE.MeshStandardMaterial({
      color: 0xffd7a1,
      emissive: 0xff9f43,
      emissiveIntensity: 4,
      roughness: 0.4,
    }),
  )
  lanternBulb.position.copy(lantern.position)
  scene.add(lanternBulb)

  const stone = new THREE.MeshStandardMaterial({
    color: 0x3f5156,
    roughness: 0.82,
    metalness: 0.12,
  })
  const stoneWarm = new THREE.MeshStandardMaterial({
    color: 0x4a3a32,
    roughness: 0.78,
    metalness: 0.08,
  })

  const boxes = [
    { x: -5.5, z: -2, h: 3.2, w: 1.6, d: 1.6, m: stone },
    { x: 5.2, z: -5.5, h: 4.2, w: 1.8, d: 1.8, m: stoneWarm },
    { x: -2.2, z: -9, h: 2.4, w: 1.4, d: 1.4, m: stone },
    { x: 3.6, z: -12, h: 5.0, w: 2.0, d: 2.0, m: stoneWarm },
    { x: -7.5, z: -13, h: 3.6, w: 1.5, d: 1.5, m: stone },
    { x: 8.0, z: 0.5, h: 2.8, w: 1.2, d: 1.2, m: stoneWarm },
    { x: 0.5, z: -18, h: 4.6, w: 2.2, d: 2.2, m: stone },
  ]

  const meshes = []
  for (const box of boxes) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(box.w, box.h, box.d), box.m)
    mesh.position.set(box.x, box.h / 2, box.z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
    meshes.push(mesh)
  }

  // 一点暖色地面引导，给 11.18 的截图一个视觉锚点
  const emberRing = new THREE.Mesh(
    new THREE.RingGeometry(1.2, 1.45, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffb45c,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
  emberRing.rotation.x = -Math.PI / 2
  emberRing.position.set(2.2, 0.02, 1.5)
  scene.add(emberRing)

  let flicker = 0

  function update(dt) {
    flicker += dt
    lantern.intensity = 28 + Math.sin(flicker * 9.2) * 1.6 + Math.sin(flicker * 21.7) * 0.8
    lanternBulb.material.emissiveIntensity = 3.8 + Math.sin(flicker * 11.3) * 0.5
    emberRing.material.opacity = 0.2 + Math.sin(flicker * 3.1) * 0.05
  }

  function dispose() {
    scene.remove(ground, grid, moon, ambient, lantern, lanternBulb, emberRing)
    ground.geometry.dispose()
    ground.material.dispose()
    grid.geometry.dispose()
    grid.material.dispose()
    for (const mesh of meshes) {
      mesh.geometry.dispose()
      scene.remove(mesh)
    }
    stone.dispose()
    stoneWarm.dispose()
  }

  return { update, dispose }
}
