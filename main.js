import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';


////////////////////////ESCENA//////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setAnimationLoop( animate );
				renderer.xr.enabled = true;
				renderer.xr.setReferenceSpaceType( 'local-floor' );
				

				document.body.appendChild( VRButton.createButton( renderer ) );

//SKYBOX/////////////////////////
const loader = new THREE.CubeTextureLoader();
loader.setPath( 'skybox/' );

const textureCube = loader.load( [
	'px.png', 'nx.png',
	'py.png', 'ny.png',
	'pz.png', 'nz.png'
] );
scene.background = textureCube
//CAMARA y controles///////////////////

const manager = new THREE.LoadingManager();
const loaderFbx = new FBXLoader( manager );

const controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 0, 0 );
				controls.update();

let gamepad;
let moveForward = false;
let moveBackward = false;
const speed = 0.3;
const gravity = 0.01;
let verticalSpeed = 0;

const character = new THREE.Object3D();
scene.add(character);
character.add(camera);
camera.position.set(0, 5.6, 0); 

window.addEventListener("gamepadconnected", (event) => {
  console.log("Controlador conectado:", event.gamepad.id);
});

function updateCharacterMovement() {
  const gamepads = navigator.getGamepads();
  if (gamepads[0]) {
    const gp = gamepads[0];
    const leftStickY = gp.axes[1];

    moveForward = leftStickY < -0.1;
    moveBackward = leftStickY > 0.1;

        if (gp.buttons[7].value > 0.5) {
      shootRay();
    }

  }

  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  if (moveForward) character.position.addScaledVector(direction, speed);
  if (moveBackward) character.position.addScaledVector(direction, -speed);



    character.position.y = 5.6; // fuera de VR, mantener altura
  }

////////////////PUNTERO////////////////////////
const raycaster = new THREE.Raycaster();
const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
enemy.position.set(0, 1, -5);
scene.add(enemy);

function shootRay() {
  // Origen del disparo
  const origin = new THREE.Vector3();
  camera.getWorldPosition(origin);

  // Dirección del disparo
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  raycaster.set(origin, direction);
  const intersects = raycaster.intersectObject(enemy);

  if (intersects.length > 0) {
    console.log("¡Enemigo alcanzado!");
    scene.remove(enemy);

    // Vibración del control
    if (navigator.vibrate) navigator.vibrate(200);
  }
}

//////////////////////// CROSSHAIR ////////////////////////
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

//////////////////////// GAMEPAD ////////////////////////
window.addEventListener("gamepadconnected", (event) => {
  console.log("Control conectado:", event.gamepad.id);
});

///////TEXTURA////////

const madera = new THREE.TextureLoader().load('text/r.jpg' ); 
const alfombra = new THREE.MeshPhongMaterial( { map:madera} );

const neoon = new THREE.MeshStandardMaterial({ emissive: 0xFFEA00, emissiveIntensity: 1.3, metalness: 0});
const material34 = new THREE.MeshStandardMaterial({ emissive: 0xffff00, emissiveIntensity: 1, metalness: 0.5, transparent: true, opacity: 0.8 });

//ESCENA////////////////////////////

const Piso = new THREE.BoxGeometry( 70, 0.2, 50 );
const cube1 = new THREE.Mesh( Piso, alfombra);
scene.add( cube1 );
cube1.position.set(-15,0,0)

const Piso1 = new THREE.BoxGeometry( 70, 0.2, 50 );
const cube2 = new THREE.Mesh( Piso1, alfombra);
scene.add( cube2 );
cube2.position.set(40,0,0)

const Piso2 = new THREE.BoxGeometry( 70, 0.2, 50 );
const cube3 = new THREE.Mesh( Piso2, alfombra);
scene.add( cube3 );
cube3.position.set(-15,0,-50)

const Piso3 = new THREE.BoxGeometry( 70, 0.2, 50 );
const cube4 = new THREE.Mesh( Piso3, alfombra);
scene.add( cube4 );
cube4.position.set(40,0,-50)

const Piso4 = new THREE.BoxGeometry( 70, 0.2, 50 );
const cube5 = new THREE.Mesh( Piso4, alfombra);
scene.add( cube5 );
cube5.position.set(-15,0,-100)

const Piso5 = new THREE.BoxGeometry( 70, 0.2, 50 );
const cube6 = new THREE.Mesh( Piso5, alfombra);
scene.add( cube6 );
cube6.position.set(40,0,-100)

const Segunda9 = new THREE.SphereGeometry( 0.2, 32, 16 ); 
const material10 = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } ); 
const luna = new THREE.Mesh( Segunda9, material10); 
scene.add( luna );
luna.position.set(0,3.8,0)

const cub = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
const cube7 = new THREE.Mesh( cub, alfombra);
scene.add( cube7 );
cube7.position.set(13.35,5,3.8)

/////ANIMACION////////////
let t2 = 0;



/////FBX///////////////


loaderFbx.load("Rodrigo.fbx", function(object1){
    object1.scale.x=0.01;
    object1.scale.y=0.01;
    object1.scale.z=0.01;

    object1.position.set(0,0,0)
    object1.rotation.y = -1.5;
        scene.add(object1)
})
loaderFbx.load("ruleta.fbx", function(object1){
    object1.scale.x=0.01;
    object1.scale.y=0.01;
    object1.scale.z=0.01;

    object1.position.set(0,0,0)
    object1.rotation.y = -1.5;
        scene.add(object1)
})
loaderFbx.load("luz.fbx", function(object1){
    object1.scale.x=0.01;
    object1.scale.y=0.01;
    object1.scale.z=0.01;

    object1.position.set(0,0,0)
    object1.rotation.y = -1.5;
    object1.traverse(function(child){
        if(child.isMesh){
            child.material= neoon;
        }
    })
        scene.add(object1)
})

///LUCES/////////////
const Lampara1 = new THREE.BoxGeometry( 2, 10, 2);
const cube31 = new THREE.Mesh( Lampara1, material34 );
scene.add(cube31);
cube31.position.set(-20,50,-44)

const Lampara2 = new THREE.BoxGeometry( 2, 10, 2);
const cube32 = new THREE.Mesh( Lampara2, material34 );
scene.add(cube32);
cube32.position.set(-3.5,52,-45)

const Lampara3 = new THREE.BoxGeometry( 2, 10, 2);
const cube33 = new THREE.Mesh( Lampara3, material34 );
scene.add(cube33);
cube33.position.set(15.2,52,-45)

const Lampara4 = new THREE.BoxGeometry( 2, 10, 2);
const cube34 = new THREE.Mesh( Lampara4, material34 );
scene.add(cube34);
cube34.position.set(33,50,-45)

const Ambientlight = new THREE.AmbientLight( 0xABAB96 ); 
scene.add( Ambientlight );

const light = new THREE.DirectionalLight(0xD4D4D4, 1);
light.position.set(0,4,7);
scene.add(light);

const letreros1 = new THREE.PointLight( 0xFFFFFF, 10, 50);
scene.add( letreros1 );
letreros1.position.set( 0, 40, -40);

const letreros2 = new THREE.PointLight( 0xFFFFFF, 10, 50);
scene.add( letreros2 );
letreros2.position.set( 0, 40, -80);

const letreros3 = new THREE.PointLight( 0xFFFFFF, 10, 50);
scene.add( letreros3 );
letreros3.position.set( 0, 40, 0);

camera.position.z = 8;
camera.position.y = 19;

function animate() {
  t2 += 0.008;
  luna.position.x = cube7.position.x + 1.5 * Math.cos(t2*2) ;
  luna.position.z = cube7.position.z + 1.5 * Math.sin(t2*2) ;

   updateCharacterMovement();

  renderer.render( scene, camera );

}
