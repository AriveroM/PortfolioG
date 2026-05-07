import { Character } from './character.js';
import { Projectile } from './projectile.js';
import { EnemySpawner } from './enemySpawner.js';
import { ChargeEnemy } from './chargeEnemy.js';
import { Enemy } from './enemy.js';
import { Orbital } from './orbital.js';
import { ChasingEnemy } from './chispas.js';


const gameContainer = document.getElementById('gameContainer');
const rect = gameContainer.getBoundingClientRect();

const screenWidth = rect.width;
const screenHeight = rect.height;

const character = new Character(screenWidth/2, screenHeight/2);
const projectiles = [];
const enemySpawner = new EnemySpawner(1750);

let keysPressed = {};

let omnishootInterval;

const orbital = new Orbital(30,0.015,40);
const orbitalcm = new Orbital(3,0.25,150);
const orbital2 = new Orbital(3,0.03,50);
const orbital3 = new Orbital(3,0.03,30);
const orbital4 = new Orbital(3,0.03,30);
const orbitals1 = new Orbital(10,0.05,70);
const orbitals2 = new Orbital(10,0.05,100)
const orbitals3 = new Orbital(10,0.05,130)


const chispas = new ChasingEnemy(-40,-40);
const chispitas = new ChasingEnemy(-40,-40);

window.addEventListener('keydown', (event) => {
    keysPressed[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keysPressed[event.code] = false;
});



function difficulty()
{ 
    if(character.level == 1)
    {
        enemySpawner.spawnRate = 1500;
    }
    else if(character.level == 2)
    {
        enemySpawner.chargeEnemyRate = 0.1;
        enemySpawner.spawnRate = 650;
        enemySpawner.normalH = 20;
    }
    else if(character.level == 3)
    {
        enemySpawner.areaDamageEnemyRate = 0.1;
        enemySpawner.spawnRate = 550;       
    }
    else if(character.level == 4)
    {
        enemySpawner.spawnRate = 450; 
    }
    else if(character.level == 5)
    {
        enemySpawner.tankEnemyRate = 0.1;        
        
    }
    else if(character.level == 6)
    {
        
        enemySpawner.chargeEnemyRate = 0.15;       
        enemySpawner.spawnRate = 350; 
        
    }
    else if(character.level == 7)
    {
        enemySpawner.explosionEnemyRate = 0.1;       
        
    }
    else if(character.level == 8)
    {
        enemySpawner.spawnRate = 300;    
        
    }
    else if(character.level == 9)
    {             
         
        enemySpawner.tankEnemyRate = 0.12;
        enemySpawner.explosionEnemyRate = 0.15;  
        enemySpawner.chargeEnemyRate = 0.2;
        enemySpawner.areaDamageEnemyRate = 0.15;
                
    }
    else if(character.level == 10)
    {             
        enemySpawner.spawnRate = 250; 
                
    }  
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  
  function createStartScreen() {
    const startScreen = document.createElement('div');
    startScreen.id = 'start-screen';
    startScreen.style.position = 'absolute';
    startScreen.style.width = '100%';
    startScreen.style.height = '100%';
    startScreen.style.display = 'flex';
    startScreen.style.justifyContent = 'center';
    startScreen.style.alignItems = 'center';
    startScreen.style.flexDirection = 'column'; 

    
    const titleImage = document.createElement('img');
    titleImage.src = './images/warcelonaButton.png'; 
    titleImage.style.width = '50%'; 
    titleImage.style.position = 'fixed';
    titleImage.style.top = '5%';
    titleImage.style.height = 'auto';
    titleImage.style.opacity = '0'; 
    titleImage.style.transition = 'opacity 2s ease-in-out'; 

   
    const startButton = document.createElement('button');
    startButton.classList.add('start-button');
    startButton.textContent = 'Start Game';
    startButton.addEventListener('click', startGame);

    
    startScreen.appendChild(titleImage);
    startScreen.appendChild(startButton);
    document.body.appendChild(startScreen);

    
    setTimeout(() => { titleImage.style.opacity = '1'; }, 500);
}

function startGame() {
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        document.body.removeChild(startScreen);
    }
    showDialogueScreen(); 
}

function showDialogueScreen() {
    const dialogueScreen = document.createElement('div');
    dialogueScreen.id = 'dialogue-screen';
    dialogueScreen.style.position = 'fixed'; 
    dialogueScreen.style.top = '0';
    dialogueScreen.style.left = '0';
    dialogueScreen.style.width = '100%';
    dialogueScreen.style.height = '100%';
    dialogueScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dialogueScreen.style.display = 'flex';
    dialogueScreen.style.flexDirection = 'column';
    dialogueScreen.style.justifyContent = 'center';
    dialogueScreen.style.alignItems = 'center';
    dialogueScreen.style.zIndex = '1000'; 

    
    const dialogueText = document.createElement('p');
    dialogueText.id = 'dialogue-text';
    dialogueText.style.color = 'white';
    dialogueText.style.fontSize = '24px'; 
    dialogueText.style.textAlign = 'center';
    dialogueText.style.padding = '20px';

   
    const dialogues = ["Bienvenido", "Laia tiene que coger un vuelo", "Pero ha anochecido","Y en la boyante ciudad de Barcelona acechan peligrosos malechores","Laia necesita ayuda, podrias prestarsela?", "En primer lugar Laia tendra que evitar a los malechores usa las teclas de control WASD para ello", "utiliza las flechas de direccion del teclado para incapazitar a los enemigos", "Contribuir a la seguridad en Barcelona ara que Laia obtenga poderes que le permitiran completar su aventura", "Sobrevive al menos hasta que Laia haya obtenido 10 niveles", "Estas listo?"];
    let currentDialogue = 0;
    dialogueText.textContent = dialogues[currentDialogue];

    dialogueScreen.appendChild(dialogueText);

    
    dialogueScreen.addEventListener('click', () => {
        currentDialogue++;
        if (currentDialogue < dialogues.length) {
            dialogueText.textContent = dialogues[currentDialogue];
        } else {
            document.body.removeChild(dialogueScreen);           
            requestAnimationFrame(gameLoop);
        }
    });

    document.body.appendChild(dialogueScreen);
}

function showGameOverScreen() {
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';
    gameOverScreen.style.position = 'fixed';
    gameOverScreen.style.top = '0';
    gameOverScreen.style.left = '0';
    gameOverScreen.style.width = '100%';
    gameOverScreen.style.height = '100%';
    gameOverScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.flexDirection = 'column';
    gameOverScreen.style.justifyContent = 'center';
    gameOverScreen.style.alignItems = 'center';
    gameOverScreen.style.zIndex = '1000';

    const gameOverText = document.createElement('p');
    gameOverText.id = 'game-over-text';
    gameOverText.style.color = 'white';
    gameOverText.style.fontSize = '24px';
    gameOverText.style.textAlign = 'center';
    gameOverText.style.padding = '20px';
    gameOverText.textContent = 'Has perdido Laia no tiene suficiente poder para salvar al mundo.';
    if(character.level >= 10)
    {
        gameOverText.textContent = 'Felicidades, Laia puede proseguir su aventura, Ha canalizado todo su poder para crear un objeto que le servira para mas adelante.';        
        const victoryImage = document.createElement('img');
        victoryImage.src = 'images/connector.png'; 
        victoryImage.style.width = '30%'; 
        victoryImage.style.height = '30%';
        victoryImage.style.marginTop = '20px';

        gameOverScreen.appendChild(victoryImage); 
    }
    else
    {
        gameOverText.textContent = 'Has perdido Laia no tiene suficiente poder para salvar al mundo.'; 
    }  
 
    const form = document.getElementById('alfinal'); 
    form.style.display = 'block';
    const restartButton = document.getElementById('restartGameButton');
    restartButton.style.display = 'block';    

    restartButton.addEventListener('click', restartGame);
    
    gameOverScreen.appendChild(gameOverText);
    gameOverScreen.appendChild(form);    
    gameOverScreen.appendChild(restartButton);

    
    


    document.body.appendChild(gameOverScreen);
}

function restartGame() {    
  
    location.reload();
}


function gameLoop() {
    
    if(!character.isChoosing)
    {   

        if (character.health <= 0) {  
                   
            setCookie('WarcelonaGameCompleted', 'true', 7);           
            showGameOverScreen(); 
            return; 
        }

        if(character.shotCooldown <= 100)
        {
            character.shotCooldown = 100;
        }

        let  puntuacionInput = document.getElementsByName("puntuacion")[0];        
        puntuacionInput.value = character.level; 
       
        console.log(puntuacionInput); 

        character.handleArrowKeys(keysPressed); 
        character.checkHealth();   
        handleShooting(keysPressed);    
        enemySpawner.update(character);
        difficulty();

        let toDestroy = { enemies: [], projectiles: [] };

        if(character.friendship ==true)
        {
            orbital2.update(character,enemySpawner.enemies);
        }

        if(character.orbital1 == true)
        {
        orbital.update(character, enemySpawner.enemies);
        }

        if(character.electro == true)
        {
        orbitalcm.update(character, enemySpawner.enemies);
        }

        if(character.chispitas == true)
        {
            chispitas.update(enemySpawner.enemies);
            if(character.friendship ==true)
            {
                orbital3.update(chispitas,enemySpawner.enemies);
            }
        }

        if(character.damocles == true)
        {
        orbitals1.update(character, enemySpawner.enemies);

        orbitals2.update(character, enemySpawner.enemies);

        orbitals3.update(character, enemySpawner.enemies);
        }

        if(character.chispas == true)
        {
        chispas.update(enemySpawner.enemies);
        if(character.friendship ==true)
        {
            orbital4.update(chispas,enemySpawner.enemies);
        }
        }

        if (!omnishootInterval && character.omnishoot) {
            omnishootInterval = setInterval(handleOmnishoot, 2500);
        }
       

        character.updateHealthDisplay();
    
        enemySpawner.enemies.forEach((enemy) => {      
            if (character.hasCollidedWith(enemy) && !character.invulnerable) {
                character.takeDamage(enemy.damage);                         
            }
            if (character.hasCollidedWith(enemy) && character.contactDamage)
            {               
                enemy.takeDamage(500); 
            }
            if (enemy.health <= 0) {
                toDestroy.enemies.push(enemy);
                if(character.lifeSteal)
                {
                    const life = Math.floor(Math.random() * 100);
                    if(life <= 2)
                    {
                        character.health += 1 
                    }
                }            
            }
        });

        
        projectiles.forEach((projectile) => {
            projectile.move();
            if (projectile.isOutOfScreen()) {
                toDestroy.projectiles.push(projectile);
            }
        });
    
        projectiles.forEach((projectile) => {
            enemySpawner.enemies.forEach((enemy) => {
                if (projectile.hasCollidedWith(enemy)) {
                    enemy.takeDamage(character.attackPower);
                    enemy.applyKnockback(projectile.direction, character.knockBackForce);
                    if(!character.piercingShoot) toDestroy.projectiles.push(projectile);                              
                }
            });
        });
        
        toDestroy.enemies.forEach(enemy => {
            const index = enemySpawner.enemies.indexOf(enemy);
            if (index > -1) {
                enemySpawner.enemies.splice(index, 1);
                enemy.destroy();
                character.gainExperience(10);
            }
        });
        
        toDestroy.projectiles.forEach(projectile => {
            const index = projectiles.indexOf(projectile);
            if (index > -1) {
                projectiles.splice(index, 1);
                projectile.destroy();
            }
        });
    }

    requestAnimationFrame(gameLoop);
}

function handleShooting(keysPressed) {
    if (character.canShoot()) {
        const middleX = character.x + (character.width / 2 - 10);
        const middleY = character.y + (character.height / 2 - 10);

        let shotDirection = null;       

        if (keysPressed['ArrowUp']) {
            shotDirection = 'up';
        } else if (keysPressed['ArrowLeft']) {
            shotDirection = 'left';
        } else if (keysPressed['ArrowDown']) {
            shotDirection = 'down';
        } else if (keysPressed['ArrowRight']) {
            shotDirection = 'right';
        }

        if (shotDirection) {
            handleProjectileCreation(shotDirection, middleX, middleY);
            character.lastShot = Date.now();
        }
    }
}

function handleProjectileCreation(direction, middleX, middleY) {
    if (character.pairshoot) {
        const offsetX = character.width / 2 - 15;
        const offsetY = character.height / 2 - 20;
        projectiles.push(new Projectile(middleX - offsetX-10, middleY - offsetY, direction));
        projectiles.push(new Projectile(middleX - offsetX + 10, middleY - offsetY, direction));
    }
    else if(character.miope)
    {
        const diagonalDirection1 = direction + '-right';
        const diagonalDirection2 = direction + '-left';      
        projectiles.push(new Projectile(middleX, middleY, diagonalDirection1));
        projectiles.push(new Projectile(middleX, middleY, diagonalDirection2));           

    }
    else {
        projectiles.push(new Projectile(middleX, middleY, direction));
    }

    if (character.doubleshoot) {
        const diagonalDirection1 = direction + '-right';
        const diagonalDirection2 = direction + '-left';      
        projectiles.push(new Projectile(middleX, middleY, diagonalDirection1));
        projectiles.push(new Projectile(middleX, middleY, diagonalDirection2));    
    }  

   
}

function handleOmnishoot() {
    const middleX = character.x + (character.width / 2 - 10);
    const middleY = character.y + (character.height / 2 - 10);
    ['up', 'up-right', 'right', 'down-right', 'down', 'down-left', 'left', 'up-left'].forEach(dir => {
        projectiles.push(new Projectile(middleX, middleY, dir));
    });
}


createStartScreen();

