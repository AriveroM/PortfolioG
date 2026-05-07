export class Orbital {
    constructor(damage, speed, orbitDistance) {
        this.damage = damage; 
        this.speed = speed;
        this.orbitDistance = orbitDistance;
        this.orbitalAngle = 0;

        this.element = document.createElement('div');
        this.element.classList.add('orbital');        
        document.getElementById('gameContainer').appendChild(this.element);
    }

    update(character, enemies) {
        
        this.orbitalAngle += this.speed;
        const orbitalX = character.x + character.width / 2 + this.orbitDistance * Math.cos(this.orbitalAngle);
        const orbitalY = character.y + character.height / 2 + this.orbitDistance * Math.sin(this.orbitalAngle);
        this.element.style.left = `${orbitalX}px`;
        this.element.style.top = `${orbitalY}px`;

        
        enemies.forEach(enemy => {
            if (this.checkCollision(this.element, enemy.element)) {
                enemy.takeDamage(this.damage);
            }
        });
    }

    checkCollision(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return rect1.left < rect2.right && rect1.right > rect2.left &&
               rect1.top < rect2.bottom && rect1.bottom > rect2.top;
    }

    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
}
