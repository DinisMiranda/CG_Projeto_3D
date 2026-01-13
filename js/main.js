import { createScene, createCamera, createRenderer, createControls, addLighting } from './scene.js';
import { createMaterials } from './materials.js';
import { createTable } from './table.js';
import { createArm } from './arm.js';
import { createGripper } from './gripper.js';
import { createAnimationSystem } from './animation.js';
import { setupControls } from './controls.js';
import { createGripperHitboxes, createBlockHitbox, handleGripperBlockCollision, applyBlockPhysics } from './collision.js';
import * as THREE from 'three';

// Inicialização
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const controls = createControls(camera, renderer);

// Adicionar iluminação
addLighting(scene);

// Criar materiais
const materials = createMaterials();

// Criar mesa e bloco
const block = createTable(scene, materials.tableMaterial, materials.legMaterial, materials.blockMaterial);

// Criar braço
const { ombroPivot, pivot2, pivot3, mesh3 } = createArm(
    scene, 
    materials.baseMaterial, 
    materials.cylinderMaterial,
    materials.armExtrudeMaterial,
    materials.sphereMaterial
);

// Criar garra
const gripper = createGripper(mesh3, materials.gripperMaterial);

// Criar hitboxes para colisão
const gripperHitboxes = createGripperHitboxes(gripper);
const blockHitbox = createBlockHitbox(block);

// Sistema de animação
const animationSystem = createAnimationSystem(ombroPivot, pivot2, pivot3, gripper);

// Controles
const blockInitialPosition = { x: 1, y: 0.325, z: 3 }; // Posição inicial do bloco
setupControls(
    animationSystem.targets, 
    animationSystem.rotationSpeed, 
    gripper, 
    gripper.garraConfig,
    { gripperHitboxes, blockHitbox },
    block,
    blockInitialPosition
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    animationSystem.updateAnimation();
    
    // Verificar colisões e empurrar bloco se necessário
    handleGripperBlockCollision(gripperHitboxes, blockHitbox, block);
    
    // Aplicar física ao bloco (gravidade e movimento)
    applyBlockPhysics(block);
    
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

