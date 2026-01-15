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
        { x: 0.5, y: 0.5, z: 0.5 },
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

// Estado global para rastrear se o bloco está agarrado
let blockGrabbed = false;
let grabOffset = new THREE.Vector3(); // Offset do bloco em relação à garra
let gripperClosing = false; // Flag para indicar que a garra está fechando

export function isBlockGrabbed() {
    return blockGrabbed;
}

export function setBlockGrabbed(grabbed, offset = null) {
    blockGrabbed = grabbed;
    if (offset) {
        grabOffset.copy(offset);
    }
    if (!grabbed) {
        gripperClosing = false; // Reset flag quando soltar
    }
}

export function setGripperClosing(closing) {
    gripperClosing = closing;
}

export function isGripperClosing() {
    return gripperClosing;
}

export function handleGripperBlockCollision(gripperHitboxes, blockHitbox, block, gripperCenter, pushStrength = 0.005, garraConfig = null) {
    // Se o bloco já está agarrado, não aplicar colisão
    if (blockGrabbed) {
        return false;
    }
    
    // Se a garra está fechando, tentar agarrar o bloco
    if (gripperClosing && gripperCenter) {
        const grabCheck = checkBlockInGripperRange(gripperHitboxes, blockHitbox, gripperCenter);
        if (grabCheck.canGrab) {
            setBlockGrabbed(true, grabCheck.offset);
            gripperClosing = false; // Reset flag após agarrar
            return false; // Não aplicar colisão se agarrou
        }
        
        // Verificar se a garra já fechou completamente - se sim, resetar a flag
        if (garraConfig && !garraConfig.aberta) {
            // Verificar se os dedos estão próximos da posição fechada
            const finger1Y = gripperHitboxes.hitbox3.position.y;
            const finger2Y = gripperHitboxes.hitbox4.position.y;
            const targetY1 = garraConfig.posicaoFechadaY1;
            const targetY2 = garraConfig.posicaoFechadaY2;
            
            // Se os dedos estão próximos da posição fechada (dentro de 0.1), resetar flag
            if (Math.abs(finger1Y - targetY1) < 0.1 && Math.abs(finger2Y - targetY2) < 0.1) {
                gripperClosing = false;
            }
        }
    }
    
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
            
            // Adicionar velocidade ao bloco quando empurrado (força muito menor)
            addBlockVelocity({
                x: direction.x * pushStrength,
                y: direction.y * pushStrength,
                z: direction.z * pushStrength
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

export function applyBlockPhysics(block, deltaTime = 0.016, gripperCenter = null) {
    // Se o bloco está agarrado, seguir a garra
    if (blockGrabbed && gripperCenter) {
        // Calcular posição do bloco baseada na posição da garra + offset
        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(gripperCenter, grabOffset);
        
        // Atualizar diretamente a posição do bloco para seguir a garra instantaneamente
        // Isso garante que o bloco acompanhe perfeitamente a garra
        block.position.copy(targetPosition);
        
        // Zerar velocidade quando agarrado
        blockVelocity.x = 0;
        blockVelocity.y = 0;
        blockVelocity.z = 0;
        
        return;
    }
    
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
    
    // Liberar o bloco se estiver agarrado
    blockGrabbed = false;
}

// Verificar se o bloco está entre os dedos da garra (pronto para ser agarrado)
export function checkBlockInGripperRange(gripperHitboxes, blockHitbox, gripperCenter) {
    // Obter posições dos dedos e do bloco em coordenadas do mundo
    const finger1Pos = new THREE.Vector3();
    const finger2Pos = new THREE.Vector3();
    const blockPos = new THREE.Vector3();
    
    gripperHitboxes.hitbox3.getWorldPosition(finger1Pos);
    gripperHitboxes.hitbox4.getWorldPosition(finger2Pos);
    blockHitbox.getWorldPosition(blockPos);
    
    // Calcular distância do bloco ao centro da garra
    const distanceToGripper = blockPos.distanceTo(gripperCenter);
    
    // Calcular se o bloco está entre os dedos na direção Y (vertical)
    const minY = Math.min(finger1Pos.y, finger2Pos.y);
    const maxY = Math.max(finger1Pos.y, finger2Pos.y);
    const isBetweenFingersY = blockPos.y >= minY - 0.6 && blockPos.y <= maxY + 0.6;
    
    // Calcular distâncias do bloco aos dedos
    const distanceToFinger1 = blockPos.distanceTo(finger1Pos);
    const distanceToFinger2 = blockPos.distanceTo(finger2Pos);
    
    // Distância máxima para agarrar (aumentada para ser mais permissiva)
    const maxGrabDistance = 0.8;
    const maxGrabDistanceToGripper = 1.0; // Distância máxima do centro da garra
    
    // Verificar se o bloco está próximo o suficiente do centro da garra
    // e entre os dedos na direção Y
    // Aceitar se estiver próximo do centro OU próximo de pelo menos um dos dedos
    const isNearGripper = distanceToGripper < maxGrabDistanceToGripper;
    const isNearFingers = distanceToFinger1 < maxGrabDistance || distanceToFinger2 < maxGrabDistance;
    
    if ((isNearGripper || isNearFingers) && isBetweenFingersY) {
        // Calcular offset do bloco em relação ao centro da garra
        const offset = new THREE.Vector3().subVectors(blockPos, gripperCenter);
        return { canGrab: true, offset };
    }
    
    return { canGrab: false, offset: null };
}

