import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import gsap from "gsap";

/**
 * Base
 */

// Debug
const gui = new dat.GUI();


// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axes Helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xaaaaff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Objects
 */

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Geometries
/*---------------------------------------------------------
  TODO:
  Convert the for...loop into a function that will accept
  a Mesh, #rows, #cols, anchor point (v3), gridGap and 
  using Mesh.geometry.parameters height and width, return
  a flat array of Mesh objects whose positions fill in 
  the specified grid.
---------------------------------------------------------*/

const planeGeometry = new THREE.PlaneGeometry(0.1, 0.1);
material.color = new THREE.Color(0xadefff);

const planes = [];
const cellWidth = 0.1;
let p = 0;
let n = 0;
// Make grid of planes
for (let i = -0.9; i < 1; i+=cellWidth) {
  p++;
  for (let j = -0.9; j < 1; j+=cellWidth) {
    if (p === 1) n++;
    // Object
    const plane = new THREE.Mesh(
      planeGeometry,
      material
    );
  
    // Position
    plane.position.set(i - (cellWidth/2), j - (cellWidth/2), 0);
    planes.push(plane)
    
  }
}

console.log("planes:" , planes);
console.log(`n: ${n}, p: ${p}`);
// Add to scene
scene.add(...planes);

let flip = false;

// event listener
document.addEventListener("click", function() {
  flip = !flip;

  // Create rotation wrappers and animate them
  const rotations = planes.map(plane => ({ rotationY: plane.rotation.y, rotationX: plane.rotation.x }));
  gsap.to(rotations, {
    duration: 1,
    rotationY: flip ? Math.PI : 0,
    // rotationX: flip ? Math.PI/4 : 0,
    ease: "power2.inOut",
    stagger: {
      grid: [20, 20],
      from: flip ? "center" : "edges",
      // axis: "xy",
      each: 0.02 // Adjust this value for more/less staggering
    },
    onUpdate: function() {
      // Apply wrapper's rotation to the plane
      for (let i = 0; i < rotations.length; i++) {
        planes[i].rotation.y = rotations[i].rotationY;
        // planes[i].rotation.x = rotations[i].rotationX;
      }
    }
  });
});





/**
 * Resizing
 */

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  
  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();

//   // Update objects
//   planes.forEach((plane, index) => {
//     const rotY = (0.1 + index/200) * elapsedTime;
//     const rotX = (0.1 + index/150) * elapsedTime;
    
//     plane.rotation.y = Math.PI * Math.min(rotY, 2);
//     plane.rotation.x = Math.PI * Math.min(rotX, 2);
//   })

//   // Update controls
//   controls.update();

//   // Render
//   renderer.render(scene, camera);

//   // Call tick again on the next frame
//   window.requestAnimationFrame(tick);
// }

// Animations
const tick = () => {
  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

// Start the animations running
tick();