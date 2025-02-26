import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { normalize } from "three/src/math/MathUtils.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// const object1 = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 16),
//   new THREE.MeshBasicMaterial({ color: "#ff0000" })
// );
// object1.position.x = -2;
// object1.name = "object1";

// const object2 = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 16),
//   new THREE.MeshBasicMaterial({ color: "#ff0000" })
// );
// object2.name = "object2";

// const object3 = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 16),
//   new THREE.MeshBasicMaterial({ color: "#ff0000" })
// );
// object3.position.x = 2;
// object3.name = "object3";

// scene.add(object1, object2, object3);

// Three.JS updates the objects' coordinates right before rendering them
// If we don't update the matrices manually here, before the raycaster,
// they will not be calculated at the correct location.
// object1.updateMatrixWorld();
// object2.updateMatrixWorld();
// object3.updateMatrixWorld();

/**
 * Models
 */
const gltfLoader = new GLTFLoader();
let model = null;

gltfLoader.load(
  "/models/Duck/glTF/Duck.gltf",
  (gltf) => {
    console.log("success", gltf);
    model = gltf.scene;
    model.position.y = -1.2;
    scene.add(model);
  },
  (progress) => {
    console.log("progress: ", progress);
  },
  (error) => {
    console.log("error: ", error);
  }
);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();
// raycaster.set(rayOrigin, rayDirection);

// const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Mouse
 */
const mouse = new THREE.Vector2();

const normalizePixels = (value, size) => {
  return (value / size) * 2 - 1;
};

window.addEventListener("mousemove", (_event) => {
  mouse.x = normalizePixels(_event.clientX, sizes.width);
  // same normalization, but inverted to put -1 at bottom of viewport
  mouse.y = -((_event.clientY / sizes.height) * 2 - 1);
});

window.addEventListener("click", () => {
  if (currentIntersect) {
    console.log("click on:", currentIntersect.object.name);
  }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

let currentIntersect = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate Objects
  // object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  // object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  // object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Cast a ray
  raycaster.setFromCamera(mouse, camera);

  let modelIntersects = [];

  if (model) {
    modelIntersects = raycaster.intersectObject(model);

    if (modelIntersects.length) {
      model.scale.set(1.2, 1.2, 1.2);
    } else {
      model.scale.set(1, 1, 1);
    }
  }

  // If the raycaster is set within scene, do this...
  // const rayOrigin = new THREE.Vector3(-3, 0, 0);
  // const rayDirection = new THREE.Vector3(1, 0, 0);
  // rayDirection.normalize();
  // raycaster.set(rayOrigin, rayDirection);

  // const objectsToTest = [object1, object2, object3];
  // const intersects = raycaster.intersectObjects(objectsToTest);

  // for (const object of objectsToTest) {
  //   object.material.color.set("#ff0000");
  // }

  // for (const intersection of intersects) {
  //   intersection.object.material.color.set("#0000ff");
  // }

  // if (intersects.length) {
  //   if (currentIntersect === null) {
  //     console.log("mouse enter:", intersects[0].object.name);
  //   }
  //   currentIntersect = intersects[0];
  // } else {
  //   if (currentIntersect) {
  //     console.log("mouse leave");
  //   }
  //   currentIntersect = null;
  // }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
