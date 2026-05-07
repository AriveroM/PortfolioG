import { Enemy } from './enemy.js';

export class ChargeEnemy extends Enemy {
  constructor(x, y, health) {
    super(x, y, health);
    this.width = 35;
    this.height = 35    
    this.originalSpeed = 2;
    this.chargeSpeed = this.originalSpeed * 7;
    this.isCharging = false;
    this.chargeCooldown = 3000;
    this.chargePreparationTime = 1000;    
    this.lastChargeTime = 0;
    this.chargeDistance = 150; 
    this.readyToCharge = false; 
    this.targetPosition = null;
    this.element.classList.add('charge-enemy');
  }

  update(character) {
    const now = Date.now();    
   
    if (this.isWithinChargeDistance(character) && !this.isCharging && !this.readyToCharge && now - this.lastChargeTime > this.chargeCooldown) {
      this.waitBeforeCharging();
    }   

    if (this.readyToCharge && now - this.lastChargeTime > this.chargePreparationTime) {
      if (!this.targetPosition) {
        this.targetPosition = { x: character.x, y: character.y };
        this.speed = this.chargeSpeed;
        this.isCharging = true;
      }
      this.moveToTarget();
    } else if (!this.isCharging && !this.readyToCharge) {
      super.chase(character);
    }
    super.updatePosition();
  }

  waitBeforeCharging() {
    this.lastChargeTime = Date.now();
    this.readyToCharge = true;
    this.speed = 0; 
  }

  isWithinChargeDistance(target) {
    const dx = this.x - target.x;
    const dy = this.y - target.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.chargeDistance;
  }

  moveToTarget() {
    const dx = this.targetPosition.x - this.x;
    const dy = this.targetPosition.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);    
    
    const moveDistance = this.speed;

    if (distance <= moveDistance)
     {     
      this.x = this.targetPosition.x;
      this.y = this.targetPosition.y;
      this.resetCharge();
    } else 
    {      
      this.x += (dx / distance) * moveDistance;
      this.y += (dy / distance) * moveDistance;
    }  
  }

  resetCharge() {
    this.isCharging = false;
    this.readyToCharge = false;
    this.speed = this.originalSpeed;
    this.targetPosition = null;
  }
}
