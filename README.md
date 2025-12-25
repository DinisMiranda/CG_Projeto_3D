# Projeto: Braço Robótico com Garra Interativa

## Descrição do Projeto

Este projeto implementa uma simulação 3D de um braço robótico com uma garra (gripper) capaz de agarrar e soltar objetos. A aplicação foi desenvolvida utilizando **Three.js**, uma biblioteca JavaScript para renderização 3D no navegador.

## Objetivos

O projeto visa demonstrar:
- Modelagem 3D de um braço robótico articulado
- Implementação de uma garra com movimento de abertura/fechamento
- Sistema de detecção de proximidade e interação com objetos
- Controle interativo através do teclado
- Animações suaves e feedback visual

## Estrutura do Braço Robótico

### Componentes Principais

1. **Shoulder (Ombro)**
   - Base do braço robótico
   - Permite rotação em torno dos eixos X e Z
   - Limites de rotação: -90° a +90° no eixo Z

2. **Elbow (Cotovelo)**
   - Articulação intermediária
   - Conectada ao ombro
   - Permite rotação em torno do eixo Z
   - Limites de rotação: 0° a 145°

3. **Wrist (Pulso)**
   - Ponto de conexão da garra ao braço
   - Mantém a garra alinhada com o movimento do braço

4. **Gripper (Garra)**
   - Base da garra: estrutura de suporte
   - Dois dedos articulados (esquerdo e direito)
   - Movimento de abertura/fechamento controlado

## Sistema de Garra

### Funcionamento

A garra possui dois estados principais:

- **Aberta**: Os dedos estão separados em um ângulo de 30 graus, permitindo aproximação de objetos
- **Fechada**: Os dedos estão juntos (ângulo 0°), permitindo agarrar objetos próximos

### Mecanismo de Agarrar

1. **Detecção de Proximidade**
   - O sistema verifica continuamente a distância entre a garra e os objetos na cena
   - Raio de detecção: 0.6 unidades
   - Quando a garra está fechada e próxima de um objeto, este é automaticamente agarrado

2. **Agarrar Objeto**
   - Calcula o offset relativo entre o objeto e a garra
   - Marca o objeto como "agarrado"
   - Altera a cor do objeto para indicar visualmente que está sendo segurado
   - O objeto passa a seguir o movimento do braço robótico

3. **Soltar Objeto**
   - Quando a garra é aberta, o objeto é solto
   - A cor do objeto retorna ao estado original
   - O objeto permanece na posição onde foi solto

## Objetos Interativos

O cenário contém **3 objetos** posicionados estrategicamente:
- Objeto 1: Posição (3, 1, 0)
- Objeto 2: Posição (-2, 1.5, 1)
- Objeto 3: Posição (0, 2, -2)

Cada objeto:
- Possui geometria cúbica (0.3 x 0.3 x 0.3)
- Material com propriedades de metal (metalness: 0.3, roughness: 0.4)
- Cor vermelha quando livre, turquesa quando agarrado
- Pode ser agarrado e movido pela garra

## Controles

### Teclas de Movimento do Braço

- **R / Shift+R**: Rotação do braço em torno do eixo X
  - R: rotação negativa
  - Shift+R: rotação positiva

- **S / Shift+S**: Rotação do braço em torno do eixo Z
  - S: rotação negativa (limite: -90°)
  - Shift+S: rotação positiva (limite: +90°)

- **E / Shift+E**: Rotação do cotovelo em torno do eixo Z
  - E: aumenta o ângulo (limite: 145°)
  - Shift+E: diminui o ângulo (limite: 0°)

### Teclas de Controle da Garra

- **G**: Alterna entre abrir e fechar a garra
  - Primeira pressão: fecha a garra (pode agarrar objetos próximos)
  - Segunda pressão: abre a garra (solta o objeto agarrado)

### Outras Funcionalidades

- **T**: Alterna entre modo wireframe e sólido
- **Mouse**: Controle da câmera (OrbitControls)
  - Arrastar: rotacionar câmera
  - Scroll: zoom in/out

## Aspectos Técnicos

### Tecnologias Utilizadas

- **Three.js**: Biblioteca para renderização 3D
- **OrbitControls**: Controle de câmera interativo
- **JavaScript ES6 Modules**: Estrutura modular do código

### Conceitos de Computação Gráfica Aplicados

1. **Hierarquia de Transformações**
   - Uso de `Object3D` para criar hierarquias parent-child
   - Transformações relativas e absolutas
   - Cálculo de posições mundiais

2. **Animações**
   - Interpolação linear (lerp) para movimentos suaves
   - Loop de renderização contínuo
   - Atualização de estado em tempo real

3. **Detecção de Colisão/Proximidade**
   - Cálculo de distância euclidiana
   - Verificação de proximidade em cada frame
   - Sistema de estados para objetos (livre/agarrado)

4. **Materiais e Iluminação**
   - `MeshNormalMaterial`: Material que mostra normais (cores baseadas na orientação)
   - `MeshStandardMaterial`: Material com propriedades físicas (para objetos)
   - Iluminação ambiente e direcional

### Estrutura do Código

```
1. Inicialização da Cena
   - Criação da cena, câmera e renderer
   - Configuração de controles

2. Modelagem do Braço
   - Criação hierárquica dos componentes
   - Definição de geometrias e materiais

3. Implementação da Garra
   - Estrutura da garra e dedos
   - Sistema de abertura/fechamento

4. Sistema de Objetos
   - Criação de objetos interativos
   - Configuração de materiais e iluminação

5. Funções de Controle
   - Cálculo de posições mundiais
   - Detecção de proximidade
   - Lógica de agarrar/soltar

6. Loop de Renderização
   - Atualização de transformações
   - Animações suaves
   - Verificação de interações

7. Event Handlers
   - Controles de teclado
   - Resize da janela
```

## Interface do Usuário

O projeto inclui um painel informativo no canto superior esquerdo que exibe:
- Lista de controles disponíveis
- Estado atual da garra (Aberto/Fechado)

## Como Utilizar

1. Abra o arquivo `RobotArmWithGripper.html` em um navegador moderno
2. Use as teclas R, S, E para mover o braço até um objeto
3. Pressione G para fechar a garra quando estiver próximo do objeto
4. O objeto será agarrado automaticamente se estiver dentro do raio de detecção
5. Mova o braço para transportar o objeto
6. Pressione G novamente para abrir a garra e soltar o objeto

## Melhorias Futuras Possíveis

- Adicionar mais graus de liberdade ao braço
- Implementar física realista (usando bibliotecas como Cannon.js)
- Adicionar feedback háptico
- Sistema de múltiplos objetos simultâneos
- Gravação e reprodução de sequências de movimentos
- Interface gráfica para controle mais intuitivo
- Visualização de trajetórias

## Conclusão

Este projeto demonstra conceitos fundamentais de computação gráfica 3D, incluindo transformações hierárquicas, animações, detecção de interações e controle interativo. A implementação serve como base para sistemas mais complexos de simulação robótica e manipulação de objetos em ambientes virtuais.

