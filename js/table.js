import * as THREE from 'three';

export function createTable(scene, material) {
    // Retângulo grande - debaixo da base
    const rectangleGeometry = new THREE.BoxGeometry(20, 0.5, 12);
    const rectangle = new THREE.Mesh(rectangleGeometry, material);
    rectangle.position.y = -0.425;
    scene.add(rectangle);

    // Pernas da mesa (4 cilindros nas esquinas)
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    const legMaterial = new THREE.MeshNormalMaterial();
    
    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(-9, -4.175, -5.5);
    scene.add(leg1);
    
    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(9, -4.175, -5.5);
    scene.add(leg2);
    
    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.position.set(-9, -4.175, 5.5);
    scene.add(leg3);
    
    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.position.set(9, -4.175, 5.5);
    scene.add(leg4);
}

