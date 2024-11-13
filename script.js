/*Initiliasing game variables */
let playerHealth = 100;
let enemyHealth  = 25;
let enemyDamage;
let pistolDamage, shotGunDamage;
let damageMultiplier = 1;
// set ammo variables
let maxShells, currentShells;
let maxAmmo, currentAmmo;

/* variables for cooldown */
let quadActivated = true, quadCountdown = 5;
let megaActivated = true, megaCountdown = 3;




/* Init Objects */
let index = 0;
const monsters = [
    { name: 'IMP', health: 25, imgSrc: './images/ImpWalking.webp'},
    { name: 'Pinky', health: 75, imgSrc: './images/PinkyIdle.webp'},
    { name: 'Zombieman', health: 15, imgSrc: './images/Formerhuman_sprite.webp'},
    { name: 'Cacodemon', health: 150, imgSrc: './images/cacodemon.png'},
    { name: 'Demonwarrior', health: 200, imgSrc: './images/EXdemon.png'}
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


function updateAmmo(ammotype, currentAmmo){
    ammotype.innerHTML = currentAmmo;
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
        default:
            alert('An unknown error has occured!');
            break;
    }
    if(enemyHealth <= 0){
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
    enemyHealth = monsters[index].health;
    demonImage.src = monsters[index].imgSrc;
    demonName.textContent = monsters[index].name;
    demonHealth.textContent = enemyHealth + '%';
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
        document.querySelector('#pistolContainer').querySelector('button').disabled = true;
    }
    pistolDamage = 10 * damageMultiplier;
    damageMultiplier = 1;
    enemyHealth -= pistolDamage;
    demonHealth.textContent = enemyHealth + "%";
    turnEvent.innerHTML += `Doom Guy did ${pistolDamage} damage! \n`;
}

function Shotgun(){
    currentShells -= 1;
    updateAmmo(shotgunShells, currentShells);
    if(currentShells <= 0){
        document.querySelector('#shotGunContainer').querySelector('#btnShotgun').style.display = 'none';
        let reloadButton = document.createElement('button');
        reloadButton.innerHTML = 'Reload Shotgun'
        document.querySelector('#shotGunContainer').appendChild(reloadButton);
        reloadButton.addEventListener('click', function(){
                currentShells = maxShells;
                document.querySelector('#shotGunContainer').querySelector('#btnShotgun').style.display = 'block';
                updateAmmo(shotgunShells, currentShells);
                reloadButton.style.display = 'none';
            }
        );
    }
    shotGunDamage = 35 * damageMultiplier;
    damageMultiplier = 1;
    enemyHealth -= shotGunDamage;
    demonHealth.textContent = enemyHealth + "%";
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