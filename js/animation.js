export function createAnimationSystem(ombroPivot, pivot2, pivot3, gripper) {
    const animationSpeed = 0.1;
    const rotationSpeed = 0.1;
    
    // Posição inicial: braço completamente para cima
    const targets = {
        ombroY: 0,
        pivot2Z: -Math.PI / 2, // Para cima (90 graus)
        pivot3X: -Math.PI / 2, // Completamente para baixo (90 graus)
        pivot3Z: Math.PI / 4, // Mais para fora (45 graus)
        garra1Y: gripper.garraConfig.baseAbertaY1,
        garra2Y: gripper.garraConfig.baseAbertaY2,
        garra3Y: gripper.garraConfig.posicaoAbertaY1,
        garra4Y: gripper.garraConfig.posicaoAbertaY2,
        garra3RotZ: gripper.garraConfig.rotacaoAbertaZ1,
        garra4RotZ: gripper.garraConfig.rotacaoAbertaZ2
    };
    
    // Inicializar valores atuais com os targets (posição inicial)
    ombroPivot.rotation.y = targets.ombroY;
    pivot2.rotation.z = targets.pivot2Z;
    pivot3.rotation.x = targets.pivot3X;
    pivot3.rotation.z = targets.pivot3Z;
    gripper.rectangleGarra1.position.y = targets.garra1Y;
    gripper.rectangleGarra2.position.y = targets.garra2Y;
    gripper.rectangleGarra3.position.y = targets.garra3Y;
    gripper.rectangleGarra4.position.y = targets.garra4Y;
    gripper.rectangleGarra3.rotation.z = targets.garra3RotZ;
    gripper.rectangleGarra4.rotation.z = targets.garra4RotZ;
    
    // Animação de inicialização (liga o braço)
    let initAnimationComplete = false;
    let initAnimationProgress = 0;
    const initAnimationDuration = 4000; // 4 segundos (aumentado para 2 voltas)
    const initStartTime = Date.now();
    
    function updateInitAnimation() {
        if (initAnimationComplete) return;
        
        const elapsed = Date.now() - initStartTime;
        const progress = Math.min(elapsed / initAnimationDuration, 1);
        
        // cylinder (ombroPivot) faz 2 voltas completas (4π)
        const ombroRotation = progress * Math.PI * 4;
        ombroPivot.rotation.y = ombroRotation;
        
        // mesh2 (pivot2) roda 90 graus (π/2) durante a animação
        const pivot2Rotation = targets.pivot2Z + (progress * Math.PI / 2);
        pivot2.rotation.z = pivot2Rotation;
        
        // mesh3 (pivot3) roda um pouco durante a animação
        const extraRotation3X = Math.sin(progress * Math.PI * 2) * 0.2;
        const extraRotation3Z = Math.cos(progress * Math.PI * 2) * 0.2;
        
        pivot3.rotation.x = targets.pivot3X + extraRotation3X;
        pivot3.rotation.z = targets.pivot3Z + extraRotation3Z;
        
        if (progress >= 1) {
            initAnimationComplete = true;
            // Atualizar targets com os valores finais da animação
            targets.ombroY = ombroPivot.rotation.y;
            targets.pivot2Z = pivot2.rotation.z;
            targets.pivot3X = pivot3.rotation.x;
            targets.pivot3Z = pivot3.rotation.z;
        }
    }

    function updateAnimation() {
        // Atualizar animação de inicialização primeiro
        updateInitAnimation();
        
        // Se a animação de inicialização terminou, usar interpolação normal
        if (initAnimationComplete) {
            // Interpolação suave para rotações
            ombroPivot.rotation.y += (targets.ombroY - ombroPivot.rotation.y) * animationSpeed;
            pivot2.rotation.z += (targets.pivot2Z - pivot2.rotation.z) * animationSpeed;
            pivot3.rotation.x += (targets.pivot3X - pivot3.rotation.x) * animationSpeed;
            pivot3.rotation.z += (targets.pivot3Z - pivot3.rotation.z) * animationSpeed;
        }
        
        // Interpolação suave para posições da garra (sempre)
        gripper.rectangleGarra1.position.y += (targets.garra1Y - gripper.rectangleGarra1.position.y) * animationSpeed;
        gripper.rectangleGarra2.position.y += (targets.garra2Y - gripper.rectangleGarra2.position.y) * animationSpeed;
        gripper.rectangleGarra3.position.y += (targets.garra3Y - gripper.rectangleGarra3.position.y) * animationSpeed;
        gripper.rectangleGarra4.position.y += (targets.garra4Y - gripper.rectangleGarra4.position.y) * animationSpeed;
        // Interpolação suave para rotações dos dedos
        gripper.rectangleGarra3.rotation.z += (targets.garra3RotZ - gripper.rectangleGarra3.rotation.z) * animationSpeed;
        gripper.rectangleGarra4.rotation.z += (targets.garra4RotZ - gripper.rectangleGarra4.rotation.z) * animationSpeed;
    }

    return {
        targets,
        rotationSpeed,
        animationSpeed,
        updateAnimation
    };
}

