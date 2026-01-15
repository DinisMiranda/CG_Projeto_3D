import { resetBlockPosition, setBlockGrabbed, isBlockGrabbed, setGripperClosing } from './collision.js';
import * as THREE from 'three';

export function setupControls(targets, rotationSpeed, gripper, garraConfig, hitboxes, block, blockInitialPosition, mesh3) {
    let hitboxesVisible = true; // Estado inicial: hitboxes visíveis
    
    document.addEventListener('keydown', (event) => {
        switch(event.key.toLowerCase()) {
            // Ombro pivot - rotaciona todo o braço
            case 'q':
                targets.ombroY -= rotationSpeed;
                break;
            case 'w':
                targets.ombroY += rotationSpeed;
                break;

            // Primeira articulação (pivot2) - rotaciona apenas mesh1
            case 'e':
                targets.pivot2Z -= rotationSpeed;
                break;
            case 'r':
                targets.pivot2Z += rotationSpeed;
                break;
            
            // Terceira articulação (pivot3) - rotaciona apenas mesh3 (topo)
            case '1':
                targets.pivot3X -= rotationSpeed;
                break;
            case '2':
                targets.pivot3X += rotationSpeed;
                break;
            case '3':
                targets.pivot3Z -= rotationSpeed;
                break;
            case '4':
                targets.pivot3Z += rotationSpeed;
                break;
            
            // Garra - abre/fecha com espaço
            case ' ':
                event.preventDefault();
                if (garraConfig.aberta) {
                    // Fechar garra
                    targets.garra1Y = garraConfig.baseFechadaY1;
                    targets.garra2Y = garraConfig.baseFechadaY2;
                    targets.garra3Y = garraConfig.posicaoFechadaY1;
                    targets.garra4Y = garraConfig.posicaoFechadaY2;
                    targets.garra3RotZ = garraConfig.rotacaoFechadaZ1;
                    targets.garra4RotZ = garraConfig.rotacaoFechadaZ2;
                    garraConfig.aberta = false;
                    
                    // Ativar flag para verificar agarrar no loop de animação
                    setGripperClosing(true);
                } else {
                    // Abrir garra
                    targets.garra1Y = garraConfig.baseAbertaY1;
                    targets.garra2Y = garraConfig.baseAbertaY2;
                    targets.garra3Y = garraConfig.posicaoAbertaY1;
                    targets.garra4Y = garraConfig.posicaoAbertaY2;
                    targets.garra3RotZ = garraConfig.rotacaoAbertaZ1;
                    targets.garra4RotZ = garraConfig.rotacaoAbertaZ2;
                    garraConfig.aberta = true;
                    
                    // Liberar o bloco se estiver agarrado
                    if (isBlockGrabbed()) {
                        setBlockGrabbed(false);
                    }
                }
                break;
            
            // Toggle hitboxes visibility
            case 'o':
                hitboxesVisible = !hitboxesVisible;
                // Alternar visibilidade de todas as hitboxes da garra
                hitboxes.gripperHitboxes.hitbox1.visible = hitboxesVisible;
                hitboxes.gripperHitboxes.hitbox2.visible = hitboxesVisible;
                hitboxes.gripperHitboxes.hitbox3.visible = hitboxesVisible;
                hitboxes.gripperHitboxes.hitbox4.visible = hitboxesVisible;
                // Alternar visibilidade da hitbox do bloco
                hitboxes.blockHitbox.visible = hitboxesVisible;
                break;
            
            // Reset block position
            case 't':
                if (block && blockInitialPosition) {
                    resetBlockPosition(block, blockInitialPosition);
                }
                break;
        }
    });
}

