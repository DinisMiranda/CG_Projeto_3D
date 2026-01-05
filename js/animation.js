export function createAnimationSystem(ombroPivot, pivot2, pivot3, gripper) {
    const animationSpeed = 0.1;
    const rotationSpeed = 0.1;
    
    const targets = {
        ombroY: 0,
        pivot2Z: -Math.PI / 6,
        pivot3X: 0,
        pivot3Z: 0,
        garra1Y: gripper.garraConfig.baseAbertaY1,
        garra2Y: gripper.garraConfig.baseAbertaY2,
        garra3Y: gripper.garraConfig.posicaoAbertaY1,
        garra4Y: gripper.garraConfig.posicaoAbertaY2
    };
    
    // Inicializar valores atuais com os targets
    ombroPivot.rotation.y = targets.ombroY;
    pivot2.rotation.z = targets.pivot2Z;
    pivot3.rotation.x = targets.pivot3X;
    pivot3.rotation.z = targets.pivot3Z;
    gripper.rectangleGarra1.position.y = targets.garra1Y;
    gripper.rectangleGarra2.position.y = targets.garra2Y;
    gripper.rectangleGarra3.position.y = targets.garra3Y;
    gripper.rectangleGarra4.position.y = targets.garra4Y;

    function updateAnimation() {
        // Interpolação suave para rotações
        ombroPivot.rotation.y += (targets.ombroY - ombroPivot.rotation.y) * animationSpeed;
        pivot2.rotation.z += (targets.pivot2Z - pivot2.rotation.z) * animationSpeed;
        pivot3.rotation.x += (targets.pivot3X - pivot3.rotation.x) * animationSpeed;
        pivot3.rotation.z += (targets.pivot3Z - pivot3.rotation.z) * animationSpeed;
        
        // Interpolação suave para posições da garra
        gripper.rectangleGarra1.position.y += (targets.garra1Y - gripper.rectangleGarra1.position.y) * animationSpeed;
        gripper.rectangleGarra2.position.y += (targets.garra2Y - gripper.rectangleGarra2.position.y) * animationSpeed;
        gripper.rectangleGarra3.position.y += (targets.garra3Y - gripper.rectangleGarra3.position.y) * animationSpeed;
        gripper.rectangleGarra4.position.y += (targets.garra4Y - gripper.rectangleGarra4.position.y) * animationSpeed;
    }

    return {
        targets,
        rotationSpeed,
        animationSpeed,
        updateAnimation
    };
}

