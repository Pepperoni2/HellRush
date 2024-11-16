/* Initiliasing game variables */

/*
    variables that are important for game calculation
*/
let playerHealth = 100;     // global variable for the playerHealth
let enemyHealth = 25;       // global variable for the enemyHealth
let enemyDamage;
let pistolDamage, shotGunDamage;
let damageMultiplier = 1;   // damage multiplier is either 1 or 4

// set ammo variables
let maxShells, currentShells;
let maxAmmo, currentAmmo;

/* variables for weapon cooldown */
let quadActivated = true, quadCountdown = 10;
let megaActivated = true, megaCountdown = 4;
/* Init Objects */

/*
    in the monster array containing objects with stats like name, health and imgSrc
    the health will be stored into the global enemyHealth variable 
*/
let index = 0;
const monsters = [
    { name: 'Imp', health: 25, imgSrc: './images/ImpWalking.webp'}, // 0
    { name: 'Pinky', health: 75, imgSrc: './images/PinkyIdle.webp', }, // 1
    { name: 'Zombieman', health: 15, imgSrc: './images/Formerhuman_sprite.webp', }, // 2
    { name: 'Cacodemon', health: 150, imgSrc: './images/cacodemon.png', }, // 3 
    { name: 'Archvile', health: 120, imgSrc: './images/Archvile.webp', }, // 4
    { name: 'Baron of Hell', health: 200, imgSrc: './images/Baronofhell_sprite.webp', }, // 5
    { name: 'Spidermaster Mind', health: 300, imgSrc: './images/Spidermastermind_sprite.webp', }, // 6
];

/*Initiliasing and declaring Menu references */
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


let reloadShotgunBtn = document.createElement('button');
reloadShotgunBtn.classList.add('button-78');
let reloadPistolBtn  = document.createElement('button');
reloadPistolBtn.classList.add('button-78');


let restartBtn       = document.createElement('button');
restartBtn.classList.add('button-78');
restartBtn.innerHTML = 'Restart Game';
restartBtn.style.width = '50%';
restartBtn.style.padding = '1em';
restartBtn.style.marginLeft = '2em';   

reloadPistolBtn.addEventListener('click', function(){
    battle('reload pistol'); 
});

reloadShotgunBtn.addEventListener('click', function(){
    battle('reload shotgun')
});
restartBtn.addEventListener('click', function(){
    restartGame();
});


/*
    function to calculate enemyDamage by ID number that is passed in the battle method
*/
function calcEnemyDamage(monsterIndex){
    let damage;
    switch (monsterIndex) {
        case 0:
            damage = getRandomInt(3, 24);
            break;
        case 1:
            damage = getRandomInt(4, 30);
            break;
        case 2:
            damage = getRandomInt(3, 15);
            break;
        case 3:
            damage = getRandomInt(5, 30);
            break;
        case 4:
            damage = getRandomInt(0, 70);
            break;
        case 5:
            damage = getRandomInt(10, 40);
            break;
        case 6: 
        damage = getRandomInt(15, 40);
            break;
        default:
            damage = 0;
            break;
    }
    return damage;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function StartGame(){
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
    maxShells = 2;
    currentShells = maxShells;
    document.querySelector('#maxAmmo').innerHTML       = maxAmmo;
    document.querySelector('#currentAmmo').innerHTML   = currentAmmo;
    document.querySelector('#maxShells').innerHTML     = maxShells;
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
            quadCountdown = 10;
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
            reloadPistolBtn.remove();
            break;
        case 'reload shotgun':
            /* same procedure, see codeLine: 128-130 */
            Reloading(currentShells, maxShells, '#shotGunContainer', '#btnShotgun', shotgunShells);
            currentShells = maxShells;
            reloadShotgunBtn.remove();    

            break;
        default:
            console.error('An unknown error has occured!');
            break;
    }
    // enemyContainer.style.animation = "skew-x-shakeng 0.15s";
    // enemyContainer.style.animationPlayState = "running";

    if(enemyHealth <= 0){
        setNextEnemy();
    }
    else{ 
        /* Enemy Turn */
        enemyDamage = calcEnemyDamage(index)
        // console.log("Monster index: "+ index + " | EnemyDamage: "+enemyDamage);
        playerHealth -= enemyDamage;
        // console.log("enemy has attacked with "+enemyDamage);
        // console.log(`Player Health: ${playerHealth}`); 
        healthBar.textContent = playerHealth + '%';
        if(playerHealth <= 0){
            GameOver()
        }
        turnEvent.innerHTML += "<br>"+`Doom Guy received ${enemyDamage}`;
    }
}

function PlayerWon(){
    demonImage.src = './images/doomguy-dance.gif';
    face.src       = './images/spamClick.gif';
    demonName.innerHTML = 'CONGRATS!'
    demonHealth.innerHTML = 'You successfully survived the Hell Rush!';
    turnEvent.textContent = 'You WON!!!! (~‾⌣‾)~';
    playerBar.querySelector('.weaponContainer').style.display = 'none';
    healthBar.appendChild(restartBtn);

}

function setNextEnemy(){
    index += 1;

    if(index > monsters.length - 1){
        PlayerWon();
    }
    else{
        enemyHealth = monsters[index].health;
        demonImage.src = monsters[index].imgSrc;
        demonName.textContent = monsters[index].name;
        demonHealth.textContent = monsters[index].health + '%';
        turnEvent.textContent = monsters[index].name + " approaches!";
    }
    
}

function restartGame(){
    // Resetting global game variables
    playerHealth = 100;
    index = 0;
    quadActivated = true;
    megaActivated = true;
    damageMultiplier = 1;
    setAmmo()
    quadCountdown = 10;
    megaCountdown = 5;
    enemyHealth = monsters[index].health;
    
    // Resetting UI 
    healthBar.textContent = playerHealth + "%";
    demonImage.src = monsters[index].imgSrc;
    demonName.textContent = monsters[index].name;
    demonHealth.textContent = monsters[index].health + '%';
    turnEvent.textContent = monsters[index].name + " approaches!";
    face.src = './images/idle.gif';

    // reset styling, button states and remove reload Button
    playerBar.querySelector('.weaponContainer').style.display = 'flex';
    document.querySelector('#pistolContainer').querySelector('#btnPistol').style.display = 'block';
    document.querySelector('#shotGunContainer').querySelector('#btnShotgun').style.display = 'block';
    document.querySelector("#QuadContainer").querySelector('button').disabled = false;
    document.querySelector("#MegaContainer").querySelector('button').disabled = false;
    document.querySelector('#quadCooldown').innerHTML = '';
    document.querySelector('#megaCooldown').innerHTML = '';

    reloadPistolBtn.remove();
    reloadShotgunBtn.remove();

}

function GameOver(){

    face.src = './images/GameOver.png';
    playerBar.querySelector('.weaponContainer').style.display = 'none';
    healthBar.textContent = 'GAME OVER'; 
    healthBar.appendChild(restartBtn);
}

function Pistol(){
    currentAmmo -= 1;
    updateAmmo(pistolAmmo, currentAmmo);
    if(currentAmmo <= 0){
        document.querySelector('#pistolContainer').querySelector('#btnPistol').style.display = 'none';
        reloadPistolBtn.innerHTML = 'Reload Pistol'
        document.querySelector('#pistolContainer').appendChild(reloadPistolBtn);

    }
    pistolDamage = 15 * damageMultiplier;
    damageMultiplier = 1;
    enemyHealth -= pistolDamage;
    demonHealth.textContent = enemyHealth + "%";
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
        
        reloadShotgunBtn.innerHTML = 'Reload Shotgun'
        document.querySelector('#shotGunContainer').appendChild(reloadShotgunBtn);

    }
    shotGunDamage = 45 * damageMultiplier;
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