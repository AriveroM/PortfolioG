export class Projectile {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.speed = 5;        
        this.direction = direction;       
        this.element = document.createElement('div');
        this.element.classList.add('projectile');        
        document.getElementById('gameContainer').appendChild(this.element);
        this.updatePosition();
        this.applyCSSStyles();
    }

    

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    applyCSSStyles() {
       
        const styles = window.getComputedStyle(this.element);      
        this.width = parseInt(styles.width, 10);
        this.height = parseInt(styles.height, 10);
    }

    move() {
        switch (this.direction) {
            case 'up':
                this.y -= this.speed;
                break;
            case 'down':
                this.y += this.speed;
                break;
            case 'left':
                this.x -= this.speed;
                break;
            case 'right':
                this.x += this.speed;
                break;
            case 'up-right':
                this.y -= this.speed / Math.sqrt(2);
                this.x += this.speed / Math.sqrt(2);
                break;
            case 'up-left':
                this.y -= this.speed / Math.sqrt(2);
                this.x -= this.speed / Math.sqrt(2);
                break;
            case 'down-right':
                this.y += this.speed / Math.sqrt(2);
                this.x += this.speed / Math.sqrt(2);
                break;
            case 'down-left':
                this.y += this.speed / Math.sqrt(2);
                this.x -= this.speed / Math.sqrt(2);
                break;
            case 'right-right':
                this.x += this.speed / Math.sqrt(2);
                this.y -= this.speed / Math.sqrt(2);
                break;
            case 'right-left':
                this.x += this.speed / Math.sqrt(2);
                this.y += this.speed / Math.sqrt(2);
                break;
            case 'left-left':
                this.x -= this.speed / Math.sqrt(2);
                this.y -= this.speed / Math.sqrt(2);
                break;
            case 'left-right':
                this.x -= this.speed / Math.sqrt(2);
                this.y += this.speed / Math.sqrt(2);
                break;      
               
        }
        
        this.updatePosition();
    }

    hasCollidedWith(enemy) {
        const projectileRect = {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    
        const enemyRect = {
            left: enemy.x,
            right: enemy.x + enemy.width,
            top: enemy.y,
            bottom: enemy.y + enemy.height
        };
    
        return !(projectileRect.left >= enemyRect.right ||
                 projectileRect.right <= enemyRect.left ||
                 projectileRect.top >= enemyRect.bottom ||
                 projectileRect.bottom <= enemyRect.top);
    }

    destroy() {     
        this.element.remove();
    }


    isOutOfScreen() {
        const gameContainer = document.getElementById('gameContainer');
        const rect = gameContainer.getBoundingClientRect();
        
        const screenWidth = rect.width;
        const screenHeight = rect.height;
    
        return this.x < 0 || this.x > screenWidth || this.y < 0 || this.y > screenHeight;
    }
}
