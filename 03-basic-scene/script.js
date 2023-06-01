// Home of our ThreeJS script
console.log("Hello form the script file!");

const canvas = document.querySelector("canvas.webgl");

/*--------------------------------------------------------------
  Create geemteries and add to scene
--------------------------------------------------------------*/
const scene = new THREE.Scene();
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(boxMesh);

/*--------------------------------------------------------------
  Set up 'sizees' and camera to view scene
--------------------------------------------------------------*/
const sizes = {
  width: 800,
  height: 600
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);





