Scene
│
├── rectangle (Mesa - Mesh)
│
├── leg1, leg2, leg3, leg4 (Pernas da Mesa - Mesh)
│
└── cube (Base - Mesh)
    │
    └── ombroPivot (Object3D) [Q/W controla rotação Y]
        │
        └── cylinder (Cylinder - Mesh)
            │
            └── mesh1 (Primeira parte do braço - Mesh)
                │
                └── pivot2 (Object3D) [E/R controla rotação Z]
                    │
                    └── mesh2 (Segunda parte do braço - Mesh)
                        │
                        ├── sphere (Esfera articulação - Mesh)
                        │
                        └── pivot3 (Object3D) [1/2 controla rotação X, 3/4 controla rotação Z]
                            │
                            └── mesh3 (Terceira parte do braço - Mesh)
                                │
                                ├── sphere3 (Esfera articulação - Mesh)
                                │
                                └── Garra [ESPAÇO abre/fecha]
                                    ├── rectangleGarra1 (Base inferior - Mesh)
                                    ├── rectangleGarra2 (Base superior - Mesh)
                                    ├── rectangleGarra3 (Dedo inferior - Mesh)
                                    └── rectangleGarra4 (Dedo superior - Mesh)

## Controles de Teclado

- **Q/W**: Rotaciona ombroPivot (todo o braço) em Y
- **E/R**: Rotaciona pivot2 (inclinação do mesh2) em Z
- **1/2**: Rotaciona pivot3 em X (mesh3)
- **3/4**: Rotaciona pivot3 em Z (mesh3)
- **ESPAÇO**: Abre/fecha a garra

## Materiais

- **Mesa e pernas**: Branco (MeshStandardMaterial)
- **Base e cylinder**: Cinza metálico (MeshStandardMaterial)
- **Partes do braço (mesh1, mesh2, mesh3)**: Cinza metálico (MeshStandardMaterial)
- **Esferas (articulações)**: Cinza escuro metálico brilhante (MeshStandardMaterial)
- **Garra**: Vermelho (MeshStandardMaterial)
