import * as THREE from 'three';

export function createTable(scene, tableMaterial, legMaterial) {
    // Retângulo grande - debaixo da base
    const rectangleGeometry = new THREE.BoxGeometry(20, 0.5, 12);
    const rectangle = new THREE.Mesh(rectangleGeometry, tableMaterial);
    rectangle.position.y = -0.425;
    rectangle.receiveShadow = true;
    scene.add(rectangle);

    // Pernas da mesa (4 cilindros nas esquinas)
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    
    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(-9, -4.175, -5.5);
    leg1.castShadow = true;
    scene.add(leg1);
    
    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(9, -4.175, -5.5);
    leg2.castShadow = true;
    scene.add(leg2);
    
    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.position.set(-9, -4.175, 5.5);
    leg3.castShadow = true;
    scene.add(leg3);
    
    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.position.set(9, -4.175, 5.5);
    leg4.castShadow = true;
    scene.add(leg4);
}

