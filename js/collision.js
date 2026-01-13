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
            
            // Adicionar velocidade ao bloco quando empurrado
            addBlockVelocity({
                x: direction.x * pushStrength * 10, // Multiplicar para dar mais impulso
                y: direction.y * pushStrength * 10,
                z: direction.z * pushStrength * 10
            });
            
            // Atualizar a hitbox do bloco (já que é filha do bloco, move automaticamente)
            // Mas podemos retornar true para indicar que houve colisão
            return true;
        }
    }
    
    return false; // Sem colisão
}

// Sistema de física para o bloco
let blockVelocity = { x: 0, y: 0, z: 0 };
const gravity = -0.01; // Força da gravidade (negativa = para baixo)
const groundLevel = -7.8; // Nível do chão (centro do bloco quando está no nível das pernas)
const tableTopLevel = 0.325; // Nível do topo da mesa (centro do bloco quando está sobre a mesa)
const friction = 0.95; // Atrito para reduzir velocidade horizontal

export function applyBlockPhysics(block, deltaTime = 0.016) {
    // Verificar se o bloco está sobre a mesa (com margem de erro pequena)
    const isOnTable = Math.abs(block.position.y - tableTopLevel) < 0.15;
    
    // Aplicar gravidade apenas se o bloco não estiver sobre a mesa
    if (!isOnTable) {
        // Aplicar gravidade (aceleração para baixo)
        blockVelocity.y += gravity;
        
        // Atualizar posição vertical
        block.position.y += blockVelocity.y;
        
        // Verificar se o bloco chegou ao chão
        if (block.position.y <= groundLevel) {
            block.position.y = groundLevel;
            blockVelocity.y = 0; // Parar a queda
        }
    } else {
        // Se estiver sobre a mesa, manter na altura da mesa e parar velocidade vertical
        block.position.y = tableTopLevel;
        blockVelocity.y = 0; // Parar qualquer movimento vertical quando sobre a mesa
    }
    
    // Aplicar atrito à velocidade horizontal (reduzir movimento horizontal gradualmente)
    blockVelocity.x *= friction;
    blockVelocity.z *= friction;
    
    // Aplicar velocidade horizontal
    block.position.x += blockVelocity.x;
    block.position.z += blockVelocity.z;
    
    // Se a velocidade horizontal for muito pequena, zerar
    if (Math.abs(blockVelocity.x) < 0.001) blockVelocity.x = 0;
    if (Math.abs(blockVelocity.z) < 0.001) blockVelocity.z = 0;
}

export function addBlockVelocity(velocity) {
    // Adicionar velocidade ao bloco (útil para quando é empurrado)
    blockVelocity.x += velocity.x || 0;
    blockVelocity.y += velocity.y || 0;
    blockVelocity.z += velocity.z || 0;
}

export function resetBlockPosition(block, initialPosition = { x: 2, y: 0.325, z: 4 }) {
    // Resetar posição do bloco para a posição inicial
    block.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
    
    // Resetar velocidade do bloco
    blockVelocity.x = 0;
    blockVelocity.y = 0;
    blockVelocity.z = 0;
}

