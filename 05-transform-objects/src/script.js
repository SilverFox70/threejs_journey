import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const group = new THREE.Group();
scene.add(group);

const createCube = ({ size = 1, color}) => {
  return new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshBasicMaterial({ color: color})
  );
}

const cubeData = [
  {
    color: 0xff0000,
    position: [-2, 0, 0]
  },
  {
    color: 0x00ff00,
    position: [0, 0, 0]
  },
  {
    color: 0x0000ff,
    position: [2, 0, 0]
  }
]

cubeData.forEach(c => {
  const cube = createCube({ color: c.color});
  cube.position.set(c.position[0], c.position[1], c.position[2]);
  group.add(cube);
});


// Scale

// Rotation
// mesh.rotation.reorder("YXZ");      // must be applied before rotations
// mesh.rotation.y = Math.PI * 0.25;
// mesh.rotation.x = Math.PI * 0.25;

// Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)