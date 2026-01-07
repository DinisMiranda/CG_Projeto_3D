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
    
    // Criar textura procedural industrial (metal/concreto)
    const createIndustrialTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Cor base cinza metálico
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(0, 0, 512, 512);
        
        // Adicionar padrão de chapa metálica (linhas horizontais)
        ctx.strokeStyle = '#A0A0A0';
        ctx.lineWidth = 1;
        for (let i = 0; i < 512; i += 8) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
        }
        
        // Adicionar textura de superfície metálica (pontos/imperfeições)
        ctx.fillStyle = 'rgba(150, 150, 150, 0.3)';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = Math.random() * 3 + 1;
            ctx.fillRect(x, y, size, size);
        }
        
        // Adicionar algumas marcas/riscos industriais
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * 512, Math.random() * 512);
            ctx.lineTo(Math.random() * 512, Math.random() * 512);
            ctx.stroke();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3, 3);
        return texture;
    };
    
    const industrialTexture = createIndustrialTexture();
    
    // Material para a mesa/base - superfície metálica industrial
    const tableMaterial = new THREE.MeshStandardMaterial({
        map: industrialTexture,
        color: 0xC0C0C0, // cinza metálico
        roughness: 0.6,
        metalness: 0.7,
        bumpScale: 0.3
    });
    
    // Material para as pernas da mesa - metal escuro industrial
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0x707070, // cinza escuro metálico
        roughness: 0.5,
        metalness: 0.8
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
    
    // Material para o bloco vermelho
    const blockMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF0000, // vermelho
        roughness: 0.5,
        metalness: 0.2
    });

    return {
        metalMaterial,
        armExtrudeMaterial,
        tableMaterial,
        legMaterial,
        sphereMaterial,
        gripperMaterial,
        baseMaterial,
        cylinderMaterial,
        blockMaterial
    };
}

