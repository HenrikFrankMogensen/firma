import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js'

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / 500,
  0.1,
  1000
)
camera.position.set(0, 0, 13)

const scene = new THREE.Scene()

let bee
let mixer
const gltfLoader = new GLTFLoader()
gltfLoader.load('./3dModel/demon_bee_full_texture.glb', (gltf) => {
  bee = gltf.scene
  bee.rotation.y = 1
  bee.scale.set(0.7, 0.7, 0.7)
  scene.add(gltf.scene)

  mixer = new THREE.AnimationMixer(bee)
  mixer.clipAction(gltf.animations[0]).play()
})

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
})
renderer.setSize(window.innerWidth, 500)
const canvas = document.getElementById('container3D').appendChild(renderer.domElement)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
scene.add(ambientLight)
const topLight = new THREE.DirectionalLight(0xffffff, 1)
topLight.position.set(500, 500, 500)
scene.add(topLight)

// Opret en clock til at holde styr på tid
const clock = new THREE.Clock()
let tick1 = true
let mouse = new THREE.Vector2(); // This will hold the mouse coordinates
let currentMouse = new THREE.Vector2(); // This will hold the mouse coordinates
let smoothing = 0.3; // Glidende faktor (jo lavere, jo langsommere bevægelse)

// Animering
const animate = () => {
  // Beregn tiden mellem frames
  const delta = clock.getDelta() // Tidsdifferens (sekunder) siden sidste frame

  if (mixer) {
    // Opdater animationen med den tidsdifferens
    mixer.update(delta) // Her er delta uafhængig af FPS
  }

  if (bee && tick1) {
    bee.position.set(-0.08, -1, 0)
    tick1 = false
  }

  // Bruger mouse.x til at vende bi efter hvor der clickes
  if (bee) {
    bee.rotation.y = currentMouse.x
    bee.rotation.x = currentMouse.y
  }

  // Anmod om næste frame
  window.requestAnimationFrame(animate)

  // Render scenen
  renderer.render(scene, camera);
}

// Start animation
animate();

// Detect if it's a touch device
var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Event listener to update mouse position
if (!isTouchDevice) {
  window.addEventListener('mousemove', (event) => {
    // Get mouse position in pixel coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 1.5 - 0.75;
    // At top of the screen mouse.y is +1 and at the bottom -1
    // At left of the screen mouse.x is -1 og at left +1

    // Brug lerp for at få en glidende bevægelse
    currentMouse.lerp(mouse, smoothing)
  })
}

// For touchskærm
window.addEventListener('touchmove', (event) => {
  // For at få den første berøring
  let touch = event.touches[0];
  //console.log('Touch move at: ', touch.clientX, touch.clientY);
  mouse.x = (touch.clientX / window.outerWidth) * 2 - 1
  //mouse.y = (touch.clientY / window.innerHeight) * 1.5 - 0.75

  // Brug lerp for at få en glidende bevægelse
  currentMouse.lerp(mouse, smoothing)
})

window.addEventListener('resize', () => {
  renderer.setSize(window.outerWidth, 500)
  camera.aspect = window.outerWidth / 500
  camera.updateProjectionMatrix()
})
