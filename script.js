/*Initiliasing game variables */
let playerHealth = 100;
let enemyDamage;
let pistolDamage, shotGunDamage;
let damageMultiplier = 1;

// set ammo variables
let maxShells, currentShells;
let maxAmmo, currentAmmo;

/* variables for weapon cooldown */
let quadActivated = true, quadCountdown = 5;
let megaActivated = true, megaCountdown = 3;




/* Init Objects */
let index = 0;
const monsters = [
    { name: 'IMP', health: 25, imgSrc: './images/ImpWalking.webp'},
    { name: 'Pinky', health: 75, imgSrc: './images/PinkyIdle.webp'},
    { name: 'Zombieman', health: 15, imgSrc: './images/Formerhuman_sprite.webp'},
    { name: 'Cacodemon', health: 150, imgSrc: './images/cacodemon.png'},
    { name: 'Demonwarrior', health: 200, imgSrc: './images/EXdemon.png'},
    { name: 'Juggernaut', health: 300, imgSrc: './images/Jugger.png'},
    { name: 'Archvile', health: 120, imgSrc: './images/Archvile.webp'}
];

/*Initiliasing  Menu references */
const startMenu      = document.querySelector('.startMenu');
const playerBar      = document.querySelector('.playerBar');
const face           = document.querySelector('#face');
const healthBar      = document.querySelector('.healthContainer')
const enemyContainer = document.querySelector('.enemyContainer');
const terminal       = document.querySelector('.terminal');

const pistolAmmo     = document.querySelector('#currentAmmo');
const shotgunShells  = document.querySelector('#currentShells');

const demonHealth    = document.querySelector('#enemyHealth');
const demonName      = document.querySelector('#enemyName');
const demonImage     = document.querySelector('#enemyImg');
const turnEvent      = document.querySelector('#turnEvent')



function StartGame(){
    console.log('The game has started');
    startMenu.style.display = 'none';
    playerBar.style.visibility = 'visible';
    terminal.style.visibility = 'visible';
    enemyContainer.style.display = 'flex';

    // Set textContent with variable values
    healthBar.textContent = playerHealth + "%";
    setAmmo()
    demonHealth.textContent = monsters[index].health + "%";
    demonName.textContent   = monsters[index].name;
    turnEvent.textContent   = monsters[index].name + " approaches";

}
// Handle functions for ammunition 
// declaring global ammo variables
function setAmmo(){
    maxAmmo = 15;
    currentAmmo = maxAmmo;
    maxShells = 3;
    currentShells = maxShells;
    document.querySelector('#maxAmmo').innerHTML = maxAmmo;
    document.querySelector('#currentAmmo').innerHTML = currentAmmo;
    document.querySelector('#maxShells').innerHTML = maxShells;
    document.querySelector('#currentShells').innerHTML = currentShells;
}
// Updating ammo Count on the User Interface ("Player Bar")
function updateAmmo(ammotype, currentAmmo){
    ammotype.innerHTML = currentAmmo;
}
// Reloading resets the ammo count
function Reloading(ammotype, ammoLimit, containerRef = '', btnRef = '', spanRef){
    ammotype = ammoLimit;
    document.querySelector(containerRef).querySelector(btnRef).style.display = 'block';
    turnEvent.innerHTML += `Doom Guy reloads!`;
    updateAmmo(spanRef, ammotype);
}

function battle(playerAction){

    /* Cooldown Check for Mega Health and Quad Damage */    
    if(!quadActivated){
        quadCountdown -= 1;  
        document.querySelector('#quadCooldown').innerHTML = quadCountdown + ' Turns remaining';

        if(quadCountdown == 0){
            quadCountdown = 5;
            quadActivated = true;
            document.querySelector("#QuadContainer").querySelector('button').disabled = false;
            document.querySelector('#quadCooldown').innerHTML = '';

        }
    }
    if(!megaActivated){
        megaCountdown -= 1;
        document.querySelector('#megaCooldown').innerHTML = megaCountdown + ' Turns remaining';
        if(megaCountdown == 0){
            megaCountdown = 5;
            megaActivated = true;
            document.querySelector("#MegaContainer").querySelector('button').disabled = false;
            document.querySelector('#megaCooldown').innerHTML = '';

        }
    }
    turnEvent.textContent = '';
    switch(playerAction){
        case 'pistol':
            Pistol();
            break;
        case 'shotgun':
            Shotgun();
            break;
        case 'mega':
            MegaHealth()
            break;
        case 'quad':
            QuadDamage()
            break;
        case 'reload pistol':
            /* call reloading function
                -) function parameters
                pass current pistol ammo, max pistolAmmo, ID of the pistolcontainer, ID of the child btn, span reference inside the btn; 
            */
            Reloading(currentAmmo, maxAmmo, '#pistolContainer', '#btnPistol', pistolAmmo);
            currentAmmo = maxAmmo;
            break;
        case 'reload shotgun':
            /* same procedure, see codeLine: 128-130 */
            Reloading(currentShells, maxShells, '#shotGunContainer', '#btnShotgun', shotgunShells);
            currentShells = maxShells;
            break;
        default:
            console.error('An unknown error has occured!');
            break;
    }
    if(monsters[index].health <= 0){
        setNextEnemy();
    }
    else{ 
        /* Enemy Turn */
        enemyDamage = 25
        playerHealth -= enemyDamage;
        healthBar.textContent = playerHealth + '%';
        if(playerHealth <= 0){
            GameOver()
        }
        turnEvent.innerHTML += "<br>"+`Doom Guy received ${enemyDamage}`;
    }
}

function calcEnemyDamage(){
    
}

function setNextEnemy(){
    index += 1;
    demonImage.src = monsters[index].imgSrc;
    demonName.textContent = monsters[index].name;
    demonHealth.textContent = monsters[index].health + '%';
    turnEvent.textContent = monsters[index].name + " approaches!";
}

function GameOver(){
    face.src = './images/GameOver.png';
    playerBar.querySelector('.weaponContainer').style.display = 'none';
    healthBar.textContent = 'GAME OVER';
}

function Pistol(){
    currentAmmo -= 1;
    updateAmmo(pistolAmmo, currentAmmo);
    if(currentAmmo <= 0){
        document.querySelector('#pistolContainer').querySelector('#btnPistol').style.display = 'none';
        let reloadButton = document.createElement('button');
        reloadButton.innerHTML = 'Reload Pistol'
        document.querySelector('#pistolContainer').appendChild(reloadButton);
        reloadButton.addEventListener('click', function(){
            battle('reload pistol');
            reloadButton.style.display = 'none';
        });
    }
    pistolDamage = 10 * damageMultiplier;
    damageMultiplier = 1;
    monsters[index].health-= pistolDamage;
    demonHealth.textContent = monsters[index].health + "%";
    turnEvent.innerHTML += `Doom Guy did ${pistolDamage} damage! \n`;
}

function Shotgun(){
    
    currentShells -= 1;
    updateAmmo(shotgunShells, currentShells);
    // =============
    /* 
        check if current Shotgun shells are 0 
        hide shotgun Button and create Reload Button (should be deleted, when reload is pressed)
    */
    if(currentShells <= 0){
        document.querySelector('#shotGunContainer').querySelector('#btnShotgun').style.display = 'none';
        let reloadButton = document.createElement('button');
        reloadButton.innerHTML = 'Reload Shotgun'
        document.querySelector('#shotGunContainer').appendChild(reloadButton);
        reloadButton.addEventListener('click', function(){
            battle('reload shotgun')
            reloadButton.style.display = 'none';
        });
    }
    shotGunDamage = 35 * damageMultiplier;
    damageMultiplier = 1;
    monsters[index].health -= shotGunDamage;
    demonHealth.textContent = monsters[index].health + "%";
    turnEvent.innerHTML += `Doom Guy did ${shotGunDamage} damage! `;

}

function MegaHealth(){
    playerHealth += 100;
    if(playerHealth > 250){
        playerHealth = 250;
    }
    healthBar.textContent = playerHealth + "%";
    turnEvent.innerHTML += `Doom Guy healed +100 Healthpoints`;
    document.querySelector("#MegaContainer").querySelector('button').disabled = true;
    document.querySelector('#megaCooldown').innerHTML = megaCountdown + ' Turns remaining';
    megaActivated = false;
}

function QuadDamage(){
    damageMultiplier = 4;
    turnEvent.innerHTML += `Doom Guy acquired Quad Damage`;
    document.querySelector("#QuadContainer").querySelector('button').disabled = true;
    document.querySelector('#quadCooldown').innerHTML = quadCountdown + ' Turns remaining';
    quadActivated = false;
}