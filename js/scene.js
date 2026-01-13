import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createScene() {
    const scene = new THREE.Scene();
    return scene;
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    return camera;
}

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#2a2a2a"); // cinza escuro suave - melhor visibilidade sem cansar a vista
    document.body.appendChild(renderer.domElement);
    return renderer;
}

export function createControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    return controls;
}

export function addLighting(scene) {
    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Luz direcional principal
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Luz direcional secundária (preenchimento)
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);
    
    // Luz pontual para realçar
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);
}

