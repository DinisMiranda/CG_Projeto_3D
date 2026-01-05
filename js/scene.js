import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createScene() {
    const scene = new THREE.Scene();
    return scene;
}

export function createCamera() {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    return camera;
}

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#000000");
    document.body.appendChild(renderer.domElement);
    return renderer;
}

export function createControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    return controls;
}

export function createMaterials() {
    const material = new THREE.MeshNormalMaterial();
    const extrudeMaterial = new THREE.MeshNormalMaterial();
    return { material, extrudeMaterial };
}

