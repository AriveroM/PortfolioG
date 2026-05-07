import { Enemy } from './enemy.js';

export class ChasingEnemy extends Enemy {
    constructor(x, y) {
        super(x, y, Infinity); // Salud infinita
        this.speed = 4; // Velocidad específica para ChasingEnemy
        this.attackCooldown = 0.25 * 1000; // 0.25 segundos en milisegundos
        this.lastAttackTime = 0;
        this.element.classList.add('chasing-enemy'); // Agrega una clase CSS específica
    }

    chase(target) {
        // Calcula el centro del objetivo
        const targetCenterX = target.x + target.width / 2;
        const targetCenterY = target.y + target.height / 2;

        // Calcula la dirección hacia el centro del objetivo
        const dx = targetCenterX - this.x;
        const dy = targetCenterY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) { // Evita dividir por cero y ajusta según sea necesario
            this.x += this.speed * (dx / distance);
            this.y += this.speed * (dy / distance);
        }

        this.updatePosition();
    }

    chaseClosestEnemy(enemies) {
        const closestEnemy = this.findClosestEnemy(enemies);
        if (closestEnemy) {
            this.chase(closestEnemy);
        }
    }

    findClosestEnemy(enemies) {
        let closestEnemy = null;
        let minDistance = Infinity;
        enemies.forEach(enemy => {
            if (enemy !== this) {
                const distance = this.distanceTo(enemy);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestEnemy = enemy;
                }
            }
        });
        return closestEnemy;
    }

    distanceTo(enemy) {
        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    attackEnemy(enemy) {
        const currentTime = Date.now();
        if (currentTime - this.lastAttackTime > this.attackCooldown) {
            enemy.takeDamage(5);
            this.lastAttackTime = currentTime;
        }
    }

    update(enemies) {
        this.chaseClosestEnemy(enemies);

        enemies.forEach(enemy => {
            if (this !== enemy && this.hasCollidedWith(enemy)) {
                this.attackEnemy(enemy);
            }
        });
    }

    hasCollidedWith(enemy) {
        return checkCollision(this.element, enemy.element);
    }
}

function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return rect1.left < rect2.right && rect1.right > rect2.left &&
           rect1.top < rect2.bottom && rect1.bottom > rect2.top;
}
