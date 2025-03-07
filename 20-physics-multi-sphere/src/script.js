import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es";

/**
 * Debug
 */
const gui = new GUI();
const debugObject = {};
debugObject.createSphere = () => {
  createSphere(0.5, {
    x: Math.random() * -0.5 * 3,
    y: 3,
    z: Math.random() * -0.5 * 3,
  });
};
debugObject.createBox = () => {
  createBox(Math.random(), {
    x: Math.random() * -0.5 * 3,
    y: 3,
    z: Math.random() * -0.5 * 3,
  });
};
debugObject.reset = () => {
  console.log("reseting...");
  console.log("objectsToUpdate count:", objectsToUpdate.length);
  for (const object of objectsToUpdate) {
    object.body.removeEventListener("collide", playHitSound);
    world.removeBody(object.body);
    scene.remove(object.mesh);
  }
  objectsToUpdate.splice(0, objectsToUpdate.length);
};
gui.add(debugObject, "createSphere");
gui.add(debugObject, "createBox");
gui.add(debugObject, "reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sounds
 */
const hitSound = new Audio("/sounds/hit.mp3");
const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  // could also add a debounce of about 13ms to add a short delay between playing sounds
  // since physics can somteimte log 4 events in very rapid succession
  if (impactStrength > 1.5) {
    hitSound.volume = Math.min(impactStrength / 5, 1);
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 */
// World
const world = new CANNON.World();
// default is NaiveBroadphase which can hurt performance, so we switch
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

// Physics Materials
const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

world.addContactMaterial(concretePlasticContactMaterial);

// Sphere
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   material: plasticMaterial,
// });
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );
// world.addBody(sphereBody);

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.material = concreteMaterial;
floorBody.mass = 0; // Since a body defaults to a mass of zero, we don't have to actually do this
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

// TODO:
// explore the following relationships between bodies
// 1. HingeConstraint - acts like a door hinge
// 2. DistanceConstraint - maintains strict distance between bodies
// 3. LockConstraint - merges the bodies to act as one
// 4. PointToPointConstraint - glues the bodies to a specific point
// 5. workers - for offloading physics into multiple threads
// 6. cannon.es - an updated physics library forked from this one.

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 20, 20, 20);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.1,
  roughness: 0.7,
  envMap: environmentMapTexture,
  envMapIntensity: 0.2,
});

const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: plasticMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);

  // Save in objects to update
  objectsToUpdate.push({ mesh: mesh, body: body });
};

const createBox = (size, position) => {
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(size, size, size);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(size * 0.5, size * 0.5, size * 0.5)
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: plasticMaterial,
  });
  body.position.copy(position);
  // body.addEventListener("collide", playHitSound);
  world.addBody(body);

  // Save in objects to update
  objectsToUpdate.push({ mesh: mesh, body: body });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });
createBox(0.5, { x: 0, y: 3, z: 2 });

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics world
  world.step(1 / 60, deltaTime, 3);

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
