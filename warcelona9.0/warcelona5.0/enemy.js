export class Enemy {
    constructor(x, y, health) { 
        this.x = x;
        this.y = y;
        this.speed = 1.5;
        this.health = health;
        this.width = 35; 
        this.height = 40;
        this.damage = 1;        
        this.element = document.createElement('div');
        this.element.classList.add('enemy');
        document.getElementById('gameContainer').appendChild(this.element);
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    chase(target) {
        const dx = target.x+20 - this.x;
        const dy = target.y+20 - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.x += this.speed * (dx / distance);
            this.y += this.speed * (dy / distance);
        }

        this.updatePosition();
    }

    takeDamage(damageAmount) {
        this.health -= damageAmount;       
    }

    applyKnockback(direction, magnitude) {
        switch (direction) {
            case 'up':
                this.y -= magnitude;
                break;
            case 'down':
                this.y += magnitude;
                break;
            case 'left':
                this.x -= magnitude;
                break;
            case 'right':
                this.x += magnitude;
                break;
        }

        this.updatePosition();
    }

    destroy() {
        this.element.remove();       
    }

    update(target) {
        this.chase(target);
        
    }
}
