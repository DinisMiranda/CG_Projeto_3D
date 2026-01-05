import * as THREE from 'three';

export function createGripper(mesh3, gripperMaterial) {
    const rectangleGarraGeometry1 = new THREE.BoxGeometry(0.75, 0.05, 0.1);
    const rectangleGarra1 = new THREE.Mesh(rectangleGarraGeometry1, gripperMaterial);
    rectangleGarra1.position.set(3.5, 0, 0.5);
    rectangleGarra1.castShadow = true;
    mesh3.add(rectangleGarra1);

    const rectangleGarraGeometry2 = new THREE.BoxGeometry(0.75, 0.05, 0.1);
    const rectangleGarra2 = new THREE.Mesh(rectangleGarraGeometry2, gripperMaterial);
    rectangleGarra2.position.set(3.5, 1, 0.5);
    rectangleGarra2.castShadow = true;
    mesh3.add(rectangleGarra2);

    const rectangleGarraGeometry3 = new THREE.BoxGeometry(0.1, 0.25, 0.1);
    const rectangleGarra3 = new THREE.Mesh(rectangleGarraGeometry3, gripperMaterial);
    rectangleGarra3.position.set(3.9, 0.1, 0.5);
    rectangleGarra3.castShadow = true;
    mesh3.add(rectangleGarra3);

    const rectangleGarraGeometry4 = new THREE.BoxGeometry(0.1, 0.25, 0.1);
    const rectangleGarra4 = new THREE.Mesh(rectangleGarraGeometry4, gripperMaterial);
    rectangleGarra4.position.set(3.9, 0.9, 0.5);
    rectangleGarra4.castShadow = true;
    mesh3.add(rectangleGarra4);

    // Estado e configurações da garra
    const garraConfig = {
        aberta: true,
        posicaoAbertaY1: 0.1,
        posicaoAbertaY2: 0.9,
        posicaoFechadaY1: 0.4,
        posicaoFechadaY2: 0.6,
        baseAbertaY1: 0,
        baseAbertaY2: 1,
        baseFechadaY1: 0.35,
        baseFechadaY2: 0.65
    };

    return {
        rectangleGarra1,
        rectangleGarra2,
        rectangleGarra3,
        rectangleGarra4,
        garraConfig
    };
}

