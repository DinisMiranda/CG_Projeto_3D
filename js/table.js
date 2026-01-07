import * as THREE from 'three';

export function createTable(scene, tableMaterial, legMaterial, blockMaterial) {
    // Retângulo grande - debaixo da base
    const rectangleGeometry = new THREE.BoxGeometry(20, 0.5, 12);
    const rectangle = new THREE.Mesh(rectangleGeometry, tableMaterial);
    rectangle.position.y = -0.425;
    rectangle.receiveShadow = true;
    scene.add(rectangle);

    // Pernas da mesa (4 cilindros nas esquinas)
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    
    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(-9, -4.3, -5.5); // baixado ligeiramente
    leg1.castShadow = true;
    scene.add(leg1);
    
    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(9, -4.3, -5.5); // baixado ligeiramente
    leg2.castShadow = true;
    scene.add(leg2);
    
    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.position.set(-9, -4.3, 5.5); // baixado ligeiramente
    leg3.castShadow = true;
    scene.add(leg3);
    
    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.position.set(9, -4.3, 5.5); // baixado ligeiramente
    leg4.castShadow = true;
    scene.add(leg4);
    
    // Bloco vermelho em cima da mesa
    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    const block = new THREE.Mesh(blockGeometry, blockMaterial);
    // Topo da mesa está em y = -0.425 + 0.25 = -0.175, então o bloco fica em -0.175 + 0.5 = 0.325
    block.position.set(2, 0.35, 4);
    block.castShadow = true;
    block.receiveShadow = true;
    scene.add(block);
    
    return block; // Retornar o bloco para poder criar hitbox depois
}

