import { ChasingEnemy } from './chispas.js';


export class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;        
        this.maxLife = 5;
        this.health = this.maxLife;
        this.speed = 4;
        this.width = 70; 
        this.height = 70; 
        this.attackPower = 10;
        this.lastShot = 0;
        this.projectileSize = 20;
        this.shotCooldown = 250; 
        this.knockBackForce = 5;
        this.invulnerableUntil = 0; 
        this.invulnerableDuration = 1000; 
        this.experience = 0;
        this.level = 1;
        this.expNextLevel = 50; 
        this.element = document.createElement('div');
        this.element.classList.add('character');
        document.getElementById('gameContainer').appendChild(this.element);       
        this.updatePosition();
        this.updateHealthDisplay();
        this.healthContainer = document.createElement('div');
        this.healthContainer.id = 'healthContainer';
        this.element.appendChild(this.healthContainer);
        this.createExpBar();
        this.updateExpBar();
        this.upgrades = 3;
        this.doubleshoot =  false;
        this.piercingShoot =  false;
        this.contactDamage = false;
        this.pairshoot = false;
        this.omnishoot = false;
        this.isChoosing = false;
        this.lifeSteal = false;
        this.hasShield = false;
        this.shieldRegenerationTime = 30000;   
        this.orbital1 = false;
        this.damocles = false;
        this.chispas = false; 
        this.chispitas = false;
        this.friendship = false;
        this.miope = false;
        this.electro = false;

    }
    
    takeDamage(damage) {

        if (this.hasShield) {
            this.hasShield = false;
            this.resetShieldTimer();   
            this.blinkCharacter();             
        }
        else{
         if(Date.now() > this.invulnerableUntil) {
            this.health -= damage;
            this.invulnerableUntil = Date.now() + this.invulnerableDuration;         
            this.blinkCharacter();                
        }
    }
    }    
    
    resetShieldTimer() {
        setTimeout(() => {
            this.hasShield = true; 
        }, this.shieldRegenerationTime);
    }
    
    checkHealth() {
        if (this.health > this.maxLife) {
            this.health = this.maxLife;
        }
    }
   
    incrementHealth(amount) {
        this.health += amount;
        this.checkHealth(); 
        this.updateHealthDisplay(); 
    }

    
    blinkCharacter() {
        const blinkTimes = 5; 
        const blinkDuration = 200; 
        
        for (let i = 0; i < blinkTimes; i++) {
            setTimeout(() => this.element.style.visibility = 'hidden', i * 2 * blinkDuration);
            setTimeout(() => this.element.style.visibility = 'visible', (i * 2 + 1) * blinkDuration);
        }
    }
    
    hasCollidedWith(enemy) {
        const characterRect = {
            left: this.x+12,
            right: this.x + this.width-12,
            top: this.y+12,
            bottom: this.y + this.height-12
        };
    
        const enemyRect = {
            left: enemy.x,
            right: enemy.x + enemy.width,
            top: enemy.y,
            bottom: enemy.y + enemy.height
        };
    
        return !(characterRect.left > enemyRect.right ||
                 characterRect.right < enemyRect.left ||
                 characterRect.top > enemyRect.bottom ||
                 characterRect.bottom < enemyRect.top);
    }
  
    handleArrowKeys(keysPressed) {

        const gameContainer = document.getElementById('gameContainer');
        const rect = gameContainer.getBoundingClientRect();        
        const screenWidth = rect.width;
        const screenHeight = rect.height;
        
        if (keysPressed.KeyW && this.y > 0) this.y -= this.speed;
        if (keysPressed.KeyS && this.y < screenHeight - 70) this.y += this.speed;
        if (keysPressed.KeyA && this.x > 0) this.x -= this.speed;
        if (keysPressed.KeyD && this.x < screenWidth - 70) this.x += this.speed;

        this.updatePosition();
        this.updateHealthBarPosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }
   
    canShoot() {
        const now = Date.now();
        if (now - this.lastShot > this.shotCooldown) {
            this.lastShot = now;
            return true;
        }
        return false;
    }

    updateHealthDisplay() {
        const healthContainer = document.getElementById('healthContainer');
                healthContainer.innerHTML = '';
    
       
        const healthBarContainer = document.createElement('div');
        healthBarContainer.classList.add('health-bar-container');
    
    
        const maxHealthBar = document.createElement('div');
        maxHealthBar.classList.add('max-health-bar');
        maxHealthBar.style.width = `${this.maxLife * 10}px`; 
    
       
        const currentHealthBar = document.createElement('div');
        currentHealthBar.classList.add('current-health-bar');
        currentHealthBar.style.width = `${this.health * 10}px`; 
    
      
        healthBarContainer.appendChild(maxHealthBar);
        healthBarContainer.appendChild(currentHealthBar);   
        healthContainer.appendChild(healthBarContainer);
    
    
        this.updateHealthBarPosition();
    }

    updateHealthBarPosition() {
        const healthContainer = document.getElementById('healthContainer');
        healthContainer.style.top = `${this.y - 10}px`; 
        healthContainer.style.left = `${this.x}px`; 
    }

    gainExperience(amount) {
        this.experience += amount;
        if (this.experience >= this.expNextLevel) {
            this.levelUp();
            
        }
        this.updateExpBar();
    }

    levelUp() {
        this.level++;
        this.experience -= this.expNextLevel;
        this.expNextLevel = Math.floor(this.expNextLevel * 1.5);
        this.levelText.textContent = `Nivel: ${this.level}`; 
        this.showUpgradeOptions();
    }

    fadeInMenu() {
        const upgradeMenu = document.getElementById('upgrade-menu');
        upgradeMenu.classList.add('fade-in');
        upgradeMenu.classList.remove('fade-out');
      }
      
     
      fadeOutMenu() {
        const upgradeMenu = document.getElementById('upgrade-menu');
        upgradeMenu.classList.add('fade-out');
        upgradeMenu.classList.remove('fade-in');
      }

    showUpgradeOptions() {        
            const upgradeOptions = [
                
                {
                    name: 'Gym',
                    effect: () => this.attackPower += 1,
                    description: 'Aumenta levemente el ataque de Laia' // Descripción pendiente
                },
                {
                    name: 'Press de banca',
                    effect: () => this.attackPower += 2.5,
                    description: 'Aumenta moderadamente el ataque de Laia' // Descripción pendiente
                },
                {
                    name: 'Dominadas',
                    effect: () => this.attackPower *= 1.75,
                    description: 'Aumenta ampliamente el ataque de Laia' // Descripción pendiente
                },
                {
                    name: 'Vendas',
                    effect: () => this.incrementHealth(1),
                    description: 'Cura levemente a Laia' // Descripción pendiente
                },
                {
                    name: 'Botiquin',
                    effect: () => this.incrementHealth(this.maxLife),
                    description: 'Cura a Laia toda su salud' // Descripción pendiente
                },
                {
                    name: 'Cardio',
                    effect: () => this.speed += 0.75,
                    description: 'Aumenta ligeramente la velocidad de Laia' // Descripción pendiente
                },
                {
                    name: 'Maraton de TV3',
                    effect: () => this.speed += 2,
                    description: 'Aumenta ampliamente la velocidad de Laia' // Descripción pendiente
                },
                {
                    name: 'Paquete de tabaco',
                    effect: () => { this.speed *= 0.3; this.attackPower += 5 },
                    description: 'Reduce drasticamente la velocidad de Laia pero aumenta su ataque de forma moderada(no fumeis niños)' // Descripción pendiente
                },
                {
                    name: 'Juego de manos',
                    effect: () => this.shotCooldown *= 0.9,
                    description: 'Aumenta ligeramente la velocidad de ataque de Laia ' // Descripción pendiente
                },
                {
                    name: 'Alto voltaje',
                    effect: () => this.shotCooldown *= 0.8,
                    description: 'Aumenta moderadamene la velocidad de Laia' // Descripción pendiente
                },
                {
                    name: 'Leche de soja',
                    effect: () => { this.shotCooldown *= 0.4; this.attackPower *= 0.3 },
                    description: 'Aumenta al maximo la velocidad de Laia pero reduce su ataque al maximo' // Descripción pendiente
                },                
                {
                    name: 'Triple Disparo',
                    effect: () => this.doubleshoot = true,
                    description: 'Laia dispara el triple de proyectiles' // Descripción pendiente
                },                
                {
                    name: 'Creatina',
                    effect: () => { this.shotCooldown /= 0.6; this.attackPower += 10; this.projectileSize += 40; this.changeProjectileSize(this.projectileSize, this.projectileSize) },
                    description: 'El tamaño de los proyectiles de Laia aumenta considerablemente junto a su Ataque, reduciendo la velocidad de disparo' // Descripción pendiente
                },
                {
                    name: 'Prozis',
                    effect: () => { this.projectileSize += 10; this.changeProjectileSize(this.projectileSize, this.projectileSize) },
                    description: 'El tamaño de los proyectiles de Laia aumenta ligeramente' // Descripción pendiente
                },               
                {
                    name: 'Disparo perforante',
                    effect: () => { this.attackPower = 2;this.piercingShoot = true},
                    description: 'Los disparos de Laia atraviesan ligeramente a los enemigos aunque baja drasticamente el ataque ede Laia' // Descripción pendiente
                },
                {
                    name: 'Cura media',
                    effect: () => this.incrementHealth(2),
                    description: 'Cura medianamente a Laia' // Descripción pendiente
                },
                {
                    name: 'Adrenalina',
                    effect: () => { this.speed *= 2; this.shotCooldown *= 0.8 },
                    description: 'Aumenta drasticamente la velocidad de Laia y moderadamente su velocidad de disparo' // Descripción pendiente
                },
                {
                    name: 'Entrecot',
                    effect: () => { this.vidaMaxima += 1; this.attackPower += 0.5 },
                    description: 'Laia aumenta su salud maxima en uno y aumenta levemente su ataque' // Descripción pendiente
                },
                {
                    name: 'Vacuna del COVID(pfizer)',
                    effect: () => { this.health = 1; this.attackPower *= 3 },
                    description: 'Aumenta Drasticamente el ataque de Laia pero reduce su salud a 1' // Descripción pendiente
                },
                {
                    name: 'Vacuna del COVID(moderna)',
                    effect: () => { this.health = 1; this.shotCooldown *= 0.4 },
                    description: 'Aumenta al maximo la velocidad de ataque de Laia pero reduce su salud a 1' // Descripción pendiente
                },
                {
                    name: 'Doble disparo',
                    effect: () => this.pairshoot = true,
                    description: 'Laia dispara el doble de disparos' // Descripción pendiente
                },
                {
                    name: 'Tiroides',
                    effect: () => { this.width += 10; this.height += 10; this.changeCaracterSize(this.width, this.height) },
                    description: 'Aumenta el tamaño de Laia' // Descripción pendiente
                },
                {
                    name: 'Virus',
                    effect: () => { this.width += 5; this.height += 5; this.changeCaracterSize(this.width, this.height); this.attackPower += 1 },
                    description: 'Aumenta el tamaño de Laia y levemente su ataque' // Descripción pendiente
                },
                {
                    name: 'Alambre eletrico',
                    effect: () => this.contactDamage = true,
                    description: 'Los enemigos reciben daño cuando tocan a Laia' // Descripción pendiente
                },
                {
                    name: 'Camara de fotos',
                    effect: () => this.invulnerableDuration = 2000,
                    description: 'Aumenta levemente el tiempo que Laia es invulnerable despues de recibir daño' // Descripción pendiente
                },
                {
                    name: 'Camara de video',
                    effect: () => this.invulnerableDuration = 3500,
                    description: 'Aumenta moderadamente el tiempo que Laia es invulnerablo despues de recibir daño' // Descripción pendiente
                },
                {
                    name: 'Sangre de cristo',
                    effect: () => this.invulnerableDuration = 5000,
                    description: 'Aumenta drasticamente el tiempo que Laia es invulnerbale despues de recibir daño' // Descripción pendiente
                },
                {
                    name: 'Sobrecarga',
                    effect: () => { this.omnishoot = true},
                    description: 'De vez en cuando Laia se sobrecarga liberando una andanada de proyectiles en todas las direcciones' // Descripción pendiente
                },
                {
                    name: 'Black Friday',
                    effect: () => { this.shotCooldown /= 0.8; this.attackPower *= 0.8; this.speed *= 0.8; this.upgrades = 5 },
                    description: 'Laia se vuelve mas debil pero tiene mas poderes que elegir cuando sube de nivel' // Descripción pendiente
                },
                {
                    name: 'Loba solitaria',
                    effect: () => { this.shotCooldown *= 0.6; this.attackPower *= 1.5; this.speed *= 1.3; this.upgrades = 1 },
                    description: 'Laia se vuelve mas poderosa pero tiene menos poderes que elegir cuando sube de nivel' // Descripción pendiente
                },
                {
                    name: 'Prime',
                    effect: () => { this.shotCooldown *= 0.7; this.attackPower *= 1.2; this.speed *= 1.1 },
                    description: 'Laia se vuelve levemente mas poderosa' // Descripción pendiente
                },
                {
                    name: 'Empujon',
                    effect: () => this.knockBackForce += 10,
                    description: 'Laia aumenta moderadamente su fuerza de empuje a los enemigos cuando los impacta' // Descripción pendiente
                },
                {
                    name: 'Barricada',
                    effect: () => { this.knockBackForce += 5; this.attackPower += 0.7 },
                    description: 'Aumenta ligeramente tanto el ataque como la fuerza de empuje a los enmigos' // Descripción pendiente
                },
                {
                    name: 'NO PUEDES PASAR',
                    effect: () => { this.knockBackForce += 5; this.shotCooldown *= 0.8 },
                    description: 'aumenta moderadamente la velocidad de ataque de laia y ligeramente su fuerza de empuje a los enemigos' // Descripción pendiente
                },
                {
                    name: 'Taekwondo',
                    effect: () => { this.attackPower *= 1.25; this.shotCooldown /= 0.9 },
                    description: 'Laia aumenta su poder de ataque pero dispara mas lento' // Descripción pendiente
                },
                {
                    name: 'Antidisturbios',
                    effect: () => { this.width += 10; this.height += 10; this.changeCaracterSize(this.width, this.width); this.knockBackForce += 15 },
                    description: 'Laia crece y hace retroceder mas a los enemigos' // Descripción pendiente
                },
                {
                    name: 'Hazte más pequeño Velocidad++',
                    effect: () => { this.width -= 20; this.height -= 20; this.changeCaracterSize(this.width, this.height); this.speed *= 1.5 },
                    description: '' // Descripción pendiente
                },
                {
                    name: 'Adrenocromo',
                    effect: () => this.lifeSteal = true,
                    description: 'Cuando matas un enemigo tienes una leve probabilidad de recuperar vida'// Descripción pendiente
                },
                {
                    name: 'Vampirismo',
                    effect: () => { this.shotCooldown *= 0.5; this.lifeSteal = true },
                    description: 'Aumenta drasticamente la velocidad de ataque de Laia y probabilidad de curarte al mayar a un enemigo' // Descripción pendiente
                },                
                {
                    name: 'Psicologo',
                    effect: () => { this.maxLife += 1; this.incrementHealth(1) },
                    description: 'Laia aumenta levemente su salud maxima' // Descripción pendiente
                },
                {
                    name: 'Seguro dental',
                    effect: () => { this.maxLife += 2; this.incrementHealth(2) },
                    description: 'Laia aumente moderadamente su salud maxima' // Descripción pendiente
                },
                {
                    name: 'Mutua',
                    effect: () => { this.maxLife += 3; this.incrementHealth(3) },
                    description: 'Laia aumenta drasticamente su salud maxima' // Descripción pendiente
                },
                {
                    name: 'Chaleco anti-balas',
                    effect: () => this.hasShield = true,
                    description: 'Cada 30 segundos Laia obtiene un escudo que la protege del siguiente golpe que reciba ' // Descripción pendiente
                },
                
                {
                    name: 'Chispas!',
                    effect: () => this.chispas = true,
                    description: 'Chispas, el perro de Laia acude en su ayuda' // Descripción pendiente
                },
                {
                    name: 'Rayo',
                    effect: () => this.orbital1 = true,
                    description: 'Laia obtiene un rayo protector que daña a sus enemigos' // Descripción pendiente
                },
                {
                    name: 'Espada de Damocles',
                    effect: () => this.damocles = true,
                    description: 'Laia genera una espada de rayos que barre a los enemigos a su paso' 
                },
                {
                    name: 'Chispitas!',
                    effect: () => this.chispitas = true,
                    description: 'Chispitas, la hija de la perra de Laia acude en tu ayuda' 
                },
                {
                    name: 'Poder de la amistad',
                    effect: () => this.friendship = true,
                    description: 'Laia y todos sus aliados en pantalla obtienen un rayo protector' 
                },
                {
                    name: 'Electromagnetismo',
                    effect: () => this.electro = true,
                    description: 'Laia genera un campo magnetico a su alrededor que daña levemente a sus enemigos' 
                },
                {
                    name: 'Miopia',
                    effect: () => this.miope = true,
                    description: 'Laia padece miopia, al ponerse las gafas dispara doble pero es incapaz de apuntar' 
                }
        ];

        const selectedUpgrades = this.selectRandomUpgrades(upgradeOptions, this.upgrades);
        const upgradeMenu = document.createElement('div');
        upgradeMenu.id = 'upgrade-menu';
        document.body.appendChild(upgradeMenu);

        selectedUpgrades.forEach(option => {
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade-option';
        
            const title = document.createElement('p'); 
            title.innerText = option.name;
            title.className = 'upgrade-title';
        
            const description = document.createElement('p');
            description.innerText = option.description;
            description.className = 'upgrade-description';
        
            upgradeElement.onclick = () => { 
                option.effect();
                this.fadeOutMenu();
                setTimeout(() => {
                    document.body.removeChild(upgradeMenu);
                    this.isChoosing = false;
                }, 500); 
            };
        
            upgradeElement.appendChild(title);
            upgradeElement.appendChild(description);
            upgradeMenu.appendChild(upgradeElement);
    });

    this.isChoosing = true;
    this.fadeInMenu(); 
    }

    selectRandomUpgrades(upgrades, count) {
        const shuffled = [...upgrades].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
        } 
  
  
    changeProjectileSize(newWidth, newHeight) 
    {
      
        const style = document.createElement('style');
        style.type = 'text/css';
        
      
        style.innerHTML = `.projectile { width: ${newWidth}px; height: ${newHeight}px; }`;
        
      
        document.head.appendChild(style);
    }

    

    changeCaracterSize(newWidth, newHeight) 
    {
        
        const style = document.createElement('style')
        style.type = 'text/css';        
       
        style.innerHTML = `.character { width: ${newWidth}px; height: ${newHeight}px; }`;
       
        document.head.appendChild(style);
    }

    createExpBar() {
        const expContainer = document.createElement('div');
        expContainer.id = 'expContainer';       
        this.levelText = document.createElement('div');
        this.levelText.id = 'levelText';
        this.levelText.style.position = 'absolute';
        this.levelText.style.top = '-25px';
        this.levelText.style.width = '100%';
        this.levelText.style.textAlign = 'center';
        this.levelText.textContent = `Nivel: ${this.level}`;
        const expBar = document.createElement('div');
        expBar.id = 'expBar';        

        expContainer.appendChild(expBar);
        document.body.appendChild(expContainer);
        expContainer.appendChild(this.levelText); 
        document.body.appendChild(expContainer);  
    }

    updateExpBar() {
        const expBar = document.getElementById('expBar');
        const expPercentage = (this.experience / this.expNextLevel) * 100;
        expBar.style.width = `${expPercentage}%`;
    } 


}
