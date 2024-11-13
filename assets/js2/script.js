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
  bee.scale.set(0.8, 0.8, 0.8)
  scene.add(gltf.scene)

  mixer = new THREE.AnimationMixer(bee)
  mixer.clipAction(gltf.animations[0]).play()
})

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialies: true
})
renderer.setSize(window.innerWidth, 500)
const canvas = document.getElementById('container3D').appendChild(renderer.domElement)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
scene.add(ambientLight)
const topLight = new THREE.DirectionalLight(0xffffff, 1)
topLight.position.set(500, 500, 500)
scene.add(topLight)

const reRender3D = () => {
  requestAnimationFrame(reRender3D)
  renderer.render(scene, camera)
  if (mixer) mixer.update(0.02)
  if (bee) {
    bee.position.set(0, -1, 0)
  }
}
reRender3D()

let isPinchZooming = false;

// Forhindre zoom via pincet-bevægelse (touch events)
window.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    isPinchZooming = true;
    event.preventDefault();  // Forhindrer zoom ved touch
  }
}, { passive: false });

window.addEventListener('touchmove', function (event) {
  if (isPinchZooming) {
    event.preventDefault();  // Forhindrer zoom ved touch
  }
}, { passive: false });

window.addEventListener('touchend', function (event) {
  if (event.touches.length <= 1) {
    isPinchZooming = false;  // Stopper zoom når der kun er én finger
  }
}, { passive: false });

// Forhindre zoom via musens scrollhjul (wheel event) – men tillad normal scroll
window.addEventListener('wheel', function (event) {
  // Hvis scrollhjulet bruges til zooming (zoom ind eller ud), forhindrer vi det
  if (event.ctrlKey || event.metaKey) {
    // Hvis ctrl eller meta (cmd) er nede, betyder det zoom
    event.preventDefault();  // Forhindrer zoom
  } else {
    // Tillader normal scroll
    return;
  }
}, { passive: false });

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, 500)
  camera.aspect = window.innerWidth / 500
  camera.updateProjectionMatrix()
})
