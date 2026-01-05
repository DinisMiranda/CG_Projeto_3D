import { createScene, createCamera, createRenderer, createControls, createMaterials } from './scene.js';
import { createTable } from './table.js';
import { createArm } from './arm.js';
import { createGripper } from './gripper.js';
import { createAnimationSystem } from './animation.js';
import { setupControls } from './controls.js';
import * as THREE from 'three';

// Inicialização
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
const controls = createControls(camera, renderer);
const { material, extrudeMaterial } = createMaterials();

// Criar mesa
createTable(scene, material);

// Criar braço
const { ombroPivot, pivot2, pivot3, mesh3 } = createArm(scene, material, extrudeMaterial);

// Criar garra
const gripper = createGripper(mesh3, material);

// Sistema de animação
const animationSystem = createAnimationSystem(ombroPivot, pivot2, pivot3, gripper);

// Controles
setupControls(animationSystem.targets, animationSystem.rotationSpeed, gripper, gripper.garraConfig);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    animationSystem.updateAnimation();
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

