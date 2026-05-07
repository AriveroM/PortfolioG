import { Enemy } from './enemy.js';

export class AreaDamageEnemy extends Enemy {
    constructor(x = 30, y = 30, health) {
      super(x, y, health);
      this.width = 45;
      this.height = 50;
      this.speed = 1.25;
      this.waitTime = 1000;
      this.areaDamageDuration = 250; 
      this.areaDamageRange = 70; 
      this.areaDamage = 2; 
      this.lastWaitTime = 0; 
      this.isWaiting = false;
      this.isAreaDamageActive = false;
      this.element.classList.add('bulky'); 
    }
  
    update(character) {
      if (this.isWithinStoppingDistance(character) && !this.isWaiting) {        
        this.isWaiting = true;
        this.lastWaitTime = Date.now();
      } else if (this.isWaiting && Date.now() - this.lastWaitTime >= this.waitTime) {       
        this.activateAreaDamage();
        this.isWaiting = false;
      }  
      
      if (this.isAreaDamageActive) {
        if (Date.now() - this.lastWaitTime >= this.areaDamageDuration) {
          
          this.isAreaDamageActive = false;
        } else if (this.characterInRange(character)) {          
          character.takeDamage(this.areaDamage);
        }
      }  
     
      if (!this.isWaiting && !this.isAreaDamageActive) {
        this.chase(character);
      }
  
      super.updatePosition();
    }
  
    isWithinStoppingDistance(target) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.areaDamageRange;
    }
  
    activateAreaDamage() {
      this.isAreaDamageActive = true;
      this.lastWaitTime = Date.now();
      this.createAreaDamageVisual();
      
    }
  
    characterInRange(character) {
      const dx = character.x - this.x;
      const dy = character.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.areaDamageRange;
    }

    createAreaDamageVisual() {
       
        const circle = document.createElement('div');  
        const circleSize = 115;     
        
        circle.classList.add('area');      
        
        circle.style.position = 'absolute';
        circle.style.width = `${circleSize}px`;
        circle.style.height = `${circleSize}px`;
        circle.style.left = `${this.x + this.width+5  - circleSize / 2}px`;
        circle.style.top = `${this.y + this.height+5  - circleSize / 2}px`;             
        circle.style.borderRadius = '50%';        
        
        circle.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';        
        
        document.body.appendChild(circle);        
        
        setTimeout(() => {
            document.body.removeChild(circle);
        }, 250); 
    }
  }
  