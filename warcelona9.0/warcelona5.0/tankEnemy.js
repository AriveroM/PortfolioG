import { Enemy } from './enemy.js';

export class TankEnemy extends Enemy {
    constructor(x, y, health) {
        super(x, y, health);
        this.originalSpeed = 0.5;
        this.chargeSpeed = 9;
        this.width = 60;
        this.height = 60;
        this.damage = 2;
        this.isCharging = false;
        this.chargePreparationTime = 750;
        this.chargeDistance = 200;
        this.lastDirection = null;
        this.element.classList.add('tank');
    }

    update(character) {
        if (this.isWithinChargeDistance(character) && !this.isCharging && !this.lastDirection) {
            this.prepareCharge(character);
        } else if (this.isCharging) {
            this.continueCharge();
        } else {
            super.chase(character);
        }
        this.updatePosition();
    }

    isWithinChargeDistance(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.chargeDistance;
    }

    prepareCharge(target) {        
        this.lastDirection = { x: target.x - this.x, y: target.y - this.y };        
        this.speed = 0;
        setTimeout(() => {
            this.isCharging = true;
            this.speed = this.chargeSpeed;
        }, this.chargePreparationTime);
    }

    continueCharge() {      
        const distance = Math.sqrt(this.lastDirection.x * this.lastDirection.x + this.lastDirection.y * this.lastDirection.y);
        if (distance > 0) {
            this.x += (this.lastDirection.x / distance) * this.speed;
            this.y += (this.lastDirection.y / distance) * this.speed;
        }

        const gameContainer = document.getElementById('gameContainer');
        const rect = gameContainer.getBoundingClientRect();
       
        if (this.x <= 0 || this.x >= rect.width - this.width || this.y <= 0 || this.y >= rect.height - this.height) {
            this.isCharging = false;
            this.speed = this.originalSpeed;
            this.lastDirection = null;
        }
    }
}
