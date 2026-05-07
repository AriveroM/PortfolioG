import { Enemy } from './enemy.js';
import { ChargeEnemy } from './chargeEnemy.js';
import { AreaDamageEnemy } from './bulky.js'; 
import { TankEnemy } from './tankEnemy.js';
import { ExplosionEnemy } from './explosionEnemy.js';
import { OrbitingEnemy } from './orbitalEnemy.js'; 
export class EnemySpawner {
    constructor(spawnRate) {
        this.enemies = [];
        this.spawnRate = spawnRate;
        this.lastSpawn = Date.now();
        this.chargeEnemyRate = 0;
        this.areaDamageEnemyRate = 0;
        this.tankEnemyRate = 0;
        this.explosionEnemyRate = 0;
        this.orbitingEnemyRate = 0.1; 
        this.normalH = 20;
        this.chargeEnemyH = 20;
        this.areaEnemyH = 60;
        this.tankEnemyH = 100;
        this.explosionEnemyH = 30;
        this.orbitingEnemyH = 40; 
    }

    update(character) {
        const now = Date.now();
        
        if (now - this.lastSpawn > this.spawnRate) {
            const side = Math.floor(Math.random() * 4);
            let x, y;

            switch (side) {
                case 0: 
                    x = -30;
                    y = Math.random() * window.innerHeight;
                    break;
                case 1: 
                    x = Math.random() * window.innerWidth;
                    y = -30;
                    break;
                case 2: 
                    x = window.innerWidth + 30;
                    y = Math.random() * window.innerHeight;
                    break;
                case 3: 
                    x = Math.random() * window.innerWidth;
                    y = window.innerHeight + 30;
                    break;
            }

            let enemy;
            const rand = Math.random();

            
            if (rand < this.chargeEnemyRate) {
                enemy = new ChargeEnemy(x, y, this.chargeEnemyH);
            } else if (rand < this.chargeEnemyRate + this.areaDamageEnemyRate) {
                enemy = new AreaDamageEnemy(x, y, this.areaEnemyH);
            } else if (rand < this.chargeEnemyRate + this.areaDamageEnemyRate + this.tankEnemyRate) {
                enemy = new TankEnemy(x, y, this.tankEnemyH);
            } else if (rand < this.chargeEnemyRate + this.areaDamageEnemyRate + this.tankEnemyRate + this.explosionEnemyRate) {
                enemy = new ExplosionEnemy(x, y, this.explosionEnemyH);
            } else if (rand < this.chargeEnemyRate + this.areaDamageEnemyRate + this.tankEnemyRate + this.explosionEnemyRate + this.orbitingEnemyRate) {
                enemy = new OrbitingEnemy(x, y, this.orbitingEnemyH); // Añadido
            } else {
                enemy = new Enemy(x, y, this.normalH);
            }

            this.enemies.push(enemy);
            this.lastSpawn = now;
        }

        // Actualizar cada enemigo(IMPORTANTE)
        this.enemies.forEach(enemy => {
            enemy.update(character);
        });
    }
}
