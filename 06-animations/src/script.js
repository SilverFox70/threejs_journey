import * as THREE from 'three'
import gsap from "gsap"

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Clock 
// const clock = new THREE.Clock();

// GSAP style
gsap.to(mesh.position, { duration: 1, delay: 0.5, x: 2 })
gsap.to(mesh.rotation, { duration: 1, delay:1.5, y: Math.PI * 2 })
gsap.to(mesh.position, { duration: 1, delay: 2.5, y: 2})

// Animations
const tick = () => {
  // Elapsed time
  // const elapesdTime = clock.getElapsedTime()

  // // Update ojects
  // mesh.rotation.x = elapesdTime
  // mesh.rotation.y = elapesdTime
  // mesh.position.y = Math.sin(elapesdTime)
  // mesh.position.x = Math.cos(elapesdTime)

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick();

/* Outside JS based time solution to keep animation
   consistent regardless of framerate

let time = Date.now();

// Animations
const tick = () => {
  // Get time difference
  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime

  // Update objects
  mesh.rotation.x += 0.001 * deltaTime
  mesh.rotation.y += 0.001 * deltaTime

  // Render
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick);
}

tick()
*/
