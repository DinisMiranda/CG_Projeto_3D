import * as THREE from 'three';

export function createArm(scene, baseMaterial, cylinderMaterial, extrudeMaterial, sphereMaterial) {
    // Base (cube) - fixa na cena
    const geometry = new THREE.BoxGeometry(4, 0.35, 4);
    const cube = new THREE.Mesh(geometry, baseMaterial);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    // Ombro pivot - no topo da base
    const ombroPivot = new THREE.Object3D();
    ombroPivot.position.y = 0.175;
    cube.add(ombroPivot);

    // Cylinder - pivot que controla a primeira parte do braço
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 10);
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.y = 0.25;
    cylinder.castShadow = true;
    ombroPivot.add(cylinder);

    // Primeira parte do braço (mesh1)
    const shape1 = new THREE.Shape();
    shape1.moveTo(0, 0);
    shape1.lineTo(0, 1);
    shape1.lineTo(4, 1);
    shape1.lineTo(4, 0);
    shape1.lineTo(0, 0);
    const extrudeGeometry1 = new THREE.ExtrudeGeometry(shape1);
    const mesh1 = new THREE.Mesh(extrudeGeometry1, extrudeMaterial);
    mesh1.rotation.x = -Math.PI / 2;
    mesh1.rotation.y = Math.PI / 2;
    mesh1.position.set(-0.5, 4, 0.5);
    mesh1.castShadow = true;
    cylinder.add(mesh1);
    
    // Segunda articulação pivot - no fim do mesh1
    const pivot2 = new THREE.Object3D();
    pivot2.position.set(0, 0.5, 0.5);
    pivot2.rotation.z = -Math.PI / 6;
    mesh1.add(pivot2);
    
    // Segunda parte do braço (mesh2)
    const shape2 = new THREE.Shape();
    shape2.moveTo(0, 0);
    shape2.lineTo(0, 1);
    shape2.lineTo(2, 1);
    shape2.lineTo(2, 0);
    shape2.lineTo(0, 0);
    const extrudeGeometry2 = new THREE.ExtrudeGeometry(shape2);
    const mesh2 = new THREE.Mesh(extrudeGeometry2, extrudeMaterial);
    mesh2.rotation.x = -Math.PI / 2;
    mesh2.rotation.y = Math.PI / 2;
    mesh2.position.set(-0.5, 0, 0.5);
    mesh2.castShadow = true;
    pivot2.add(mesh2);
    
    // // Esfera - articulação no fim do mesh2
    // const sphereRadius = 0.6;
    // const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.set(1.5 + sphereRadius / 2, 0.5, 0.5);
    // sphere.castShadow = true;
    // mesh2.add(sphere);
    
    // Terceira articulação pivot - no centro da esfera
    const pivot3 = new THREE.Object3D();
    pivot3.position.set(1.5 + 0.6 / 2, 0.5, 0.5); // centro da esfera
    mesh2.add(pivot3);
    
    // Terceira parte do braço (mesh3)
    const shape3 = new THREE.Shape();
    shape3.moveTo(0, 0);
    shape3.lineTo(0, 1);
    shape3.lineTo(3, 1);
    shape3.lineTo(3, 0);
    shape3.lineTo(0, 0);
    const extrudeGeometry3 = new THREE.ExtrudeGeometry(shape3);
    const mesh3 = new THREE.Mesh(extrudeGeometry3, extrudeMaterial);
    mesh3.rotation.x = -Math.PI / 2;
    mesh3.rotation.y = Math.PI / 2;
    // Posicionar para que o início do mesh3 (x=0 do shape) fique no pivot3
    // O mesh3 tem comprimento 3, então precisa começar em -0.5 para que o início fique no pivot
    mesh3.position.set(-0.5, 0.5, 0.5);
    mesh3.castShadow = true;
    pivot3.add(mesh3);
    
    // Esfera - articulação no fim do mesh3
    const sphere3Radius = 0.6;
    const sphere3Geometry = new THREE.SphereGeometry(sphere3Radius, 32, 32);
    const sphere3 = new THREE.Mesh(sphere3Geometry, sphereMaterial);
    sphere3.position.set(2.5 + sphere3Radius / 2, 0.5, 0.5);
    sphere3.castShadow = true;
    mesh3.add(sphere3);

    return {
        ombroPivot,
        pivot2,
        pivot3,
        mesh3
    };
}

