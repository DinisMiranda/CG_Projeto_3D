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
    blockInitialPosition,
    mesh3
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    animationSystem.updateAnimation();
    
    // Calcular posição do centro da garra usando transformação do mesh3
    // O centro da garra está em (3.5, 0.5, 0.5) em coordenadas locais do mesh3
    const gripperCenterLocal = new THREE.Vector3(3.5, 0.5, 0.5);
    const gripperCenter = new THREE.Vector3();
    gripperCenter.copy(gripperCenterLocal);
    gripperCenter.applyMatrix4(mesh3.matrixWorld); // Transformar para coordenadas do mundo
    
    // Verificar colisões e empurrar bloco se necessário (também verifica agarrar)
    handleGripperBlockCollision(gripperHitboxes, blockHitbox, block, gripperCenter, 0.005, gripper.garraConfig);
    
    // Aplicar física ao bloco (gravidade e movimento)
    applyBlockPhysics(block, 0.016, gripperCenter);
    
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

