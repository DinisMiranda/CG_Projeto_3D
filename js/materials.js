import * as THREE from 'three';

export function createMaterials() {
    // Criar texturas usando cores e padrões
    const textureLoader = new THREE.TextureLoader();
    
    // Material metálico para o braço robótico
    const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2,
        envMapIntensity: 1.0
    });
    
    // Material para partes extrudadas do braço
    const armExtrudeMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
        metalness: 0.7,
        roughness: 0.3
    });
    
    // Material para a mesa/base
    const tableMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF, // branco
        roughness: 0.6,
        metalness: 0.1
    });
    
    // Material para as pernas da mesa
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF, // branco
        roughness: 0.6,
        metalness: 0.1
    });
    
    // Material para as esferas (articulações)
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.5
    });
    
    // Material para a garra
    const gripperMaterial = new THREE.MeshStandardMaterial({
        color: 0xCC0000, // vermelho
        metalness: 0.6,
        roughness: 0.4
    });
    
    // Material para a base (cube)
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.8,
        roughness: 0.2
    });
    
    // Material para o cylinder
    const cylinderMaterial = new THREE.MeshStandardMaterial({
        color: 0x777777,
        metalness: 0.8,
        roughness: 0.2
    });

    return {
        metalMaterial,
        armExtrudeMaterial,
        tableMaterial,
        legMaterial,
        sphereMaterial,
        gripperMaterial,
        baseMaterial,
        cylinderMaterial
    };
}

