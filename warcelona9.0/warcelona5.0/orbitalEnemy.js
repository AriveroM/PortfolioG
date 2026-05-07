import { Enemy } from './enemy.js';

export class OrbitingEnemy extends Enemy {
    constructor(x, y, health) {
        super(x, y, health);
        this.orbitalRadius = 50; 
        this.orbitalSpeed = 0.05; 
        this.orbitalAngle = 0; 

       
        this.orbital = document.createElement('div');
        this.orbital.classList.add('orbital');
        this.orbital.style.width = '10px'; 
        this.orbital.style.height = '10px';
        this.orbital.style.backgroundColor = 'red';
        this.orbital.style.position = 'absolute';
        this.orbital.style.borderRadius = '50%';
        document.getElementById('gameContainer').appendChild(this.orbital);
      
        this.updateOrbitalPosition();
    }

    update(character) {
        super.update(character);
        this.orbitalAngle += this.orbitalSpeed;
        this.updateOrbitalPosition();

        
        this.checkCollisionWithCharacter(character);
    }

    updateOrbitalPosition() {
        const orbitalX = this.x + this.width / 2 + this.orbitalRadius * Math.cos(this.orbitalAngle) - 5;
        const orbitalY = this.y + this.height / 2 + this.orbitalRadius * Math.sin(this.orbitalAngle) - 5;
        this.orbital.style.left = `${orbitalX}px`;
        this.orbital.style.top = `${orbitalY}px`;
    }

    checkCollisionWithCharacter(character) {
        const rect1 = this.orbital.getBoundingClientRect();
        const rect2 = character.element.getBoundingClientRect();

        if (rect1.left < rect2.right && rect1.right > rect2.left &&
            rect1.top < rect2.bottom && rect1.bottom > rect2.top) {
            
            character.takeDamage(1);
        }
    }

    destroy() {
        super.destroy();
        this.orbital.remove();
    }
}
