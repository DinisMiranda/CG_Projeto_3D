import * as THREE from 'three';

// Material para visualizar hitboxes (opcional - pode ser invisível)
const hitboxMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});

export function createHitbox(mesh, size, offset = { x: 0, y: 0, z: 0 }) {
    // Criar geometria da hitbox
    const hitboxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
    const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
    
    // Posicionar hitbox relativa ao mesh
    hitbox.position.set(offset.x, offset.y, offset.z);
    hitbox.visible = true; // Pode ser false para invisível
    
    // Adicionar hitbox como filha do mesh
    mesh.add(hitbox);
    
    return hitbox;
}

export function createGripperHitboxes(gripper) {
    // Hitbox para a base inferior (rectangleGarra1)
    const hitbox1 = createHitbox(
        gripper.rectangleGarra1,
        { x: 0.75, y: 0.05, z: 0.1 },
        { x: 0, y: 0, z: 0 }
    );
    
    // Hitbox para a base superior (rectangleGarra2)
    const hitbox2 = createHitbox(
        gripper.rectangleGarra2,
        { x: 0.75, y: 0.05, z: 0.1 },
        { x: 0, y: 0, z: 0 }
    );
    
    // Hitbox para o dedo inferior (rectangleGarra3)
    const hitbox3 = createHitbox(
        gripper.rectangleGarra3,
        { x: 0.1, y: 0.25, z: 0.1 },
        { x: 0, y: 0, z: 0 }
    );
    
    // Hitbox para o dedo superior (rectangleGarra4)
    const hitbox4 = createHitbox(
        gripper.rectangleGarra4,
        { x: 0.1, y: 0.25, z: 0.1 },
        { x: 0, y: 0, z: 0 }
    );
    
    return {
        hitbox1,
        hitbox2,
        hitbox3,
        hitbox4
    };
}

export function createBlockHitbox(block) {
    // Hitbox para o bloco vermelho
    const hitbox = createHitbox(
        block,
        { x: 1, y: 1, z: 1 },
        { x: 0, y: 0, z: 0 }
    );
    
    return hitbox;
}

export function checkCollision(hitboxA, hitboxB) {
    // Obter bounding boxes em coordenadas do mundo
    const boxA = new THREE.Box3().setFromObject(hitboxA);
    const boxB = new THREE.Box3().setFromObject(hitboxB);
    
    // Verificar se as boxes se intersectam
    return boxA.intersectsBox(boxB);
}

export function handleGripperBlockCollision(gripperHitboxes, blockHitbox, block, pushStrength = 0.05) {
    // Verificar colisão entre cada hitbox da garra e a hitbox do bloco
    const gripperHitboxArray = [
        gripperHitboxes.hitbox1,
        gripperHitboxes.hitbox2,
        gripperHitboxes.hitbox3,
        gripperHitboxes.hitbox4
    ];
    
    for (let gripperHitbox of gripperHitboxArray) {
        if (checkCollision(gripperHitbox, blockHitbox)) {
            // Calcular posição do centro da hitbox da garra em coordenadas do mundo
            const gripperWorldPos = new THREE.Vector3();
            gripperHitbox.getWorldPosition(gripperWorldPos);
            
            // Calcular posição do centro da hitbox do bloco em coordenadas do mundo
            const blockWorldPos = new THREE.Vector3();
            blockHitbox.getWorldPosition(blockWorldPos);
            
            // Calcular direção do empurrão (da garra para o bloco)
            const direction = new THREE.Vector3()
                .subVectors(blockWorldPos, gripperWorldPos)
                .normalize();
            
            // Aplicar força ao bloco (empurrar)
            block.position.x += direction.x * pushStrength;
            block.position.y += direction.y * pushStrength;
            block.position.z += direction.z * pushStrength;
            
            // Restrição: bloco não pode descer para dentro da mesa
            // Topo da mesa está em y = -0.425 + 0.25 = -0.175
            // Bloco tem altura 1, então centro mínimo é y = -0.175 + 0.5 = 0.325
            const minY = 0.325; // Altura mínima (centro do bloco sobre a mesa)
            if (block.position.y < minY) {
                block.position.y = minY;
            }
            
            // Atualizar a hitbox do bloco (já que é filha do bloco, move automaticamente)
            // Mas podemos retornar true para indicar que houve colisão
            return true;
        }
    }
    
    return false; // Sem colisão
}

