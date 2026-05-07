import { Enemy } from './enemy.js';

export class ExplosionEnemy extends Enemy {
    constructor(x, y, health) {
        super(x, y, health);
        this.width = 35;
        this.height = 40;
        this.speed = 2.5;
        this.areaDamageDuration = 250;
        this.areaDamageRange = 80;
        this.areaDamage = 2;
        this.isExploding = false; 
        this.explodeTime = null;
        this.element.classList.add('explosion');
    }

    takeDamage(damageAmount) {
        this.health -= damageAmount;
        if (this.health <= 0) {
            this.isExploding = true;
            this.explodeTime = Date.now();
            this.explode();
            this.destroy();
        }
    }

    explode() {
        const circle = document.createElement('div');
        const circleSize = 135;

        circle.classList.add('area');
        circle.style.position = 'absolute';
        circle.style.width = `${circleSize}px`;
        circle.style.height = `${circleSize}px`;
        circle.style.left = `${this.x + this.width/2 - circleSize / 2}px`;
        circle.style.top = `${this.y + this.height/2 - circleSize / 2}px`;
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';

        document.body.appendChild(circle);
        setTimeout(() => {
            document.body.removeChild(circle);
        }, this.areaDamageDuration);
    }

    update(target) {
        if (!this.isExploding) {
            super.chase(target);
        }

        if (this.isExploding && Date.now() - this.explodeTime <= this.areaDamageDuration) {
            this.checkCharacterInRangeAndDamage(target);
        }

        this.updatePosition();
    }

    checkCharacterInRangeAndDamage(character) {
        const dx = character.x - this.x;
        const dy = character.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.areaDamageRange) {
            character.takeDamage(this.areaDamage);
        }
    }
}

