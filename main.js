import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

////////////////////////ESCENA//////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
// IMPORTANTE: usar "local" en lugar de "local-floor" evita que el VR te ponga bajo el suelo.
renderer.xr.setReferenceSpaceType('local');
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

////////////////////////SKYBOX//////////////////
const loader = new THREE.CubeTextureLoader();
loader.setPath('skybox/');
const textureCube = loader.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
scene.background = textureCube;

////////////////////////CÁMARA Y CONTROLES//////////////////
const manager = new THREE.LoadingManager();
const loaderFbx = new FBXLoader(manager);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

////////////////////////MOVIMIENTO//////////////////
let gamepad;
let moveForward = false;
let moveBackward = false;
let speed = 0.6; // 🔹 duplicado para hacerlo más rápido
const character = new THREE.Object3D();
scene.add(character);
character.add(camera);

// 🔹 altura del jugador (más realista)
camera.position.set(0, 1.7, 0);

window.addEventListener('gamepadconnected', (event) => {
  console.log('Controlador conectado:', event.gamepad.id);
});

function updateCharacterMovement() {
  const gamepads = navigator.getGamepads();
  if (gamepads[0]) {
    const gp = gamepads[0];
    const leftStickY = gp.axes[1];
    moveForward = leftStickY < -0.1;
    moveBackward = leftStickY > 0.1;
  }

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0; // 🔹 evita moverse hacia arriba o abajo

  if (moveForward) character.position.addScaledVector(direction, speed);
  if (moveBackward) character.position.addScaledVector(direction, -speed);
}

////////////////////////PUNTERO////////////////////////
const crosshair = document.createElement('div');
crosshair.style.position = 'absolute';
crosshair.style.top = '50%';
crosshair.style.left = '50%';
crosshair.style.transform = 'translate(-50%, -50%)';
crosshair.style.width = '10px';
crosshair.style.height = '10px';
crosshair.style.border = '2px solid white';
crosshair.style.borderRadius = '50%';
crosshair.style.pointerEvents = 'none';
crosshair.style.zIndex = '10';
document.body.appendChild(crosshair);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0);
let rodrigo;
let mirandoARodrigo = false;

function checkSight() {
  raycaster.setFromCamera(mouse, camera);
  if (rodrigo) {
    const intersects = raycaster.intersectObject(rodrigo, true);
    mirandoARodrigo = intersects.length > 0;
    crosshair.style.borderColor = mirandoARodrigo ? 'red' : 'white';
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'b' && mirandoARodrigo && rodrigo) {
    scene.remove(rodrigo);
    rodrigo = null;
    crosshair.style.borderColor = 'white';
    console.log('Rodrigo eliminado 👋');
  }
});

////////////////////////TEXTURAS////////////////////////
const madera = new THREE.TextureLoader().load('text/r.jpg');
const alfombra = new THREE.MeshPhongMaterial({ map: madera });
const neoon = new THREE.MeshStandardMaterial({
  emissive: 0xffea00,
  emissiveIntensity: 1.3,
  metalness: 0,
});
const material34 = new THREE.MeshStandardMaterial({
  emissive: 0xffff00,
  emissiveIntensity: 1,
  metalness: 0.5,
  transparent: true,
  opacity: 0.8,
});

////////////////////////ESCENA////////////////////////
const pisos = [];
for (let i = 0; i < 6; i++) {
  const piso = new THREE.Mesh(new THREE.BoxGeometry(70, 0.2, 50), alfombra);
  piso.position.set((i % 2 ? 40 : -15), 0, -50 * Math.floor(i / 2));
  scene.add(piso);
  pisos.push(piso);
}

const luna = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
scene.add(luna);
luna.position.set(0, 3.8, 0);

const cube7 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), alfombra);
scene.add(cube7);
cube7.position.set(13.35, 5, 3.8);

////////////////////////FBX MODELOS////////////////////////
loaderFbx.load('Rodrigo.fbx', (object1) => {
  object1.scale.set(0.01, 0.01, 0.01);
  object1.position.set(0, 0, 0);
  object1.rotation.y = -1.5;
  rodrigo = object1;
  scene.add(object1);
});

loaderFbx.load('ruleta.fbx', (object1) => {
  object1.scale.set(0.01, 0.01, 0.01);
  object1.position.set(0, 0, 0);
  object1.rotation.y = -1.5;
  scene.add(object1);
});

loaderFbx.load('luz.fbx', (object1) => {
  object1.scale.set(0.01, 0.01, 0.01);
  object1.position.set(0, 0, 0);
  object1.rotation.y = -1.5;
  object1.traverse((child) => {
    if (child.isMesh) child.material = neoon;
  });
  scene.add(object1);
});

////////////////////////LUCES////////////////////////
const ambientLight = new THREE.AmbientLight(0xabab96);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xd4d4d4, 1);
dirLight.position.set(0, 4, 7);
scene.add(dirLight);

const letreros = [
  new THREE.PointLight(0xffffff, 10, 50),
  new THREE.PointLight(0xffffff, 10, 50),
  new THREE.PointLight(0xffffff, 10, 50),
];
letreros[0].position.set(0, 40, -40);
letreros[1].position.set(0, 40, -80);
letreros[2].position.set(0, 40, 0);
letreros.forEach((l) => scene.add(l));

////////////////////////ANIMACIÓN////////////////////////
let t2 = 0;
function animate() {
  t2 += 0.008;
  luna.position.x = cube7.position.x + 1.5 * Math.cos(t2 * 2);
  luna.position.z = cube7.position.z + 1.5 * Math.sin(t2 * 2);

  updateCharacterMovement();
  checkSight();
  renderer.render(scene, camera);
}
