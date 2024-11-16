/* Initiliasing game variables */

/*
    variables that are important for game calculation
*/
const startPlayerHealth = 100;
let playerHealth = startPlayerHealth;     // global variable for the playerHealth
let enemyHealth = 25;       // global variable for the enemyHealth
let enemyDamage;
let pistolDamage, shotGunDamage;
let damageMultiplier = 1;   // damage multiplier is either 1 or 4

// set ammo variables
const maxShells = 2;  // max Shotgun shells
const maxAmmo = 15;    // max Pistol ammo
let currentAmmo, currentShells; // current ammo variables

/* variables for ability/item cooldown */
/*
    quadAvailable and megaAvailable are booleans to check if
    the QuadDamage or MegaHealth are activated
    these will be set to false, if the buttons have been pressed

    the countdown values describe the "waiting time" of each ability
    MegaHealth  - 4 Turns remaining
    Quad Damage - 10 Turn remaining
*/
let quadAvailable = true, quadCountdown = 10;
let megaAvailable = true, megaCountdown = 5;

/* Init Objects */
/*
    monster array containing objects with stats like name, health and imgSrc
    the health will be stored into the global enemyHealth variable

    objects are key-value pairs, the index of the monsters array     
    key - value
    name: string
    health: number
    imgSrc: string

    essential to represent complex data structures and to encapsulate behaviour

*/
let index = 0; // index of the monsters object array
const monsters = [
    { name: 'Imp', health: 25, imgSrc: './images/ImpWalking.webp'}, // 0
    { name: 'Pinky', health: 75, imgSrc: './images/PinkyIdle.webp', }, // 1
    { name: 'Zombieman', health: 15, imgSrc: './images/Formerhuman_sprite.webp', }, // 2
    { name: 'Cacodemon', health: 150, imgSrc: './images/cacodemon.png', }, // 3 
    { name: 'Archvile', health: 120, imgSrc: './images/Archvile.webp', }, // 4
    { name: 'Baron of Hell', health: 200, imgSrc: './images/Baronofhell_sprite.webp', }, // 5
    { name: 'Spidermastermind', health: 300, imgSrc: './images/Spidermastermind_sprite.webp', }, // 6
];

/*Initiliasing and declaring Menu references */
//Start Menu
const startMenu      = document.querySelector('.startMenu');

// Player references (UI)
const playerBar      = document.querySelector('.playerBar');
const face           = document.querySelector('#face');
const healthBar      = document.querySelector('.healthContainer')
const pistolAmmo     = document.querySelector('#currentAmmo');
const shotgunShells  = document.querySelector('#currentShells');

// Terminal references
const terminal       = document.querySelector('.terminal');
const turnEvent      = document.querySelector('#turnEvent')

// enemy references 
const enemyContainer = document.querySelector('.enemyContainer');
const demonHealth    = document.querySelector('#enemyHealth');
const demonName      = document.querySelector('#enemyName');
const demonImage     = document.querySelector('#enemyImg');


//creating button elements for the reloadbuttons and restart button
/* 
    adding className .styledBtn to reloadbtn so it aligns with styling of other buttons
*/
let reloadShotgunBtn = document.createElement('button');
let reloadPistolBtn  = document.createElement('button');
reloadShotgunBtn.classList.add('styledBtn');
reloadPistolBtn.classList.add('styledBtn');

// restart button, added styling 
let restartBtn       = document.createElement('button');
restartBtn.classList.add('styledBtn');
restartBtn.innerHTML = 'Restart Game';
restartBtn.style.width = '50%';
restartBtn.style.padding = '1em';
restartBtn.style.marginLeft = '2em';   


// Adding eventlisteners for reload and restartbtn
/*
    when reload buttons are clicked the battle function will be called
    and 'reload pistol' or 'reload shotgun' are passed as string arguments
    to the battle function

*/
reloadPistolBtn.addEventListener('click', function(){
    battle('reload pistol');
});

reloadShotgunBtn.addEventListener('click', function(){
    battle('reload shotgun');
});

/*
    EventListener click for the restart Button
    RestartGame() function will be called when clicked
*/
restartBtn.addEventListener('click', function(){
    restartGame();
});


/*
    function to calculate enemyDamage by index that is passed as a parameter in the battle method,

    depending on the enemy (monsterindex) the damage-range is adjusted by the min max values

    the function getRandomInt has two parameters (min, max) both of type number
*/
function calcEnemyDamage(monsterIndex){
    let damage;
    switch (monsterIndex) {
        case 0:
            damage = getRandomInt(3, 24);       // First enemy has a damage range of 3 to 24 damage
            break;
        case 1:
            damage = getRandomInt(4, 30);       // Second enemy has a damage range of 4 to 30 damage
            break;
        case 2:
            damage = getRandomInt(3, 15);       // Third enemy has a damage range of 3 to 15 damage
            break;
        case 3:
            damage = getRandomInt(5, 30);       // Fourth enemy has a damage range of 5 to 30 damage
            break;
        case 4:
            damage = getRandomInt(0, 70);       // Fith enemy has a damage range of 0 to 70 damage
            break;
        case 5:
            damage = getRandomInt(10, 40);      // Sixth enemy has a damage range of 10 to 40 damage
            break;
        case 6: 
        damage = getRandomInt(15, 40);          // Last enemy has a damage range of 15 to 40 damage
            break;
        default:        // default case if something goes wrong
            damage = 0; // set Damage to Zero
            break;
    }
    return damage;
}
// get Random number function in range from min to max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
    StartGame() is the first function that is called through the UI.
*/

function StartGame(){
    /*
        playerBar, terminal and enemyContainer turn visible
        start Menu is set as display none
    */
    startMenu.style.display = 'none';
    playerBar.style.visibility = 'visible';
    terminal.style.visibility = 'visible';
    enemyContainer.style.display = 'flex';

    // Set textContent with variable values
    healthBar.textContent = playerHealth + "%";
    // SetAmmo sets the ammo and syncs the values with the UI
    setAmmo()
    /* 
        Set Enemycontainer UI with the values in the monster object array
        Through key-value pairs, the health name and source can be set
    */
    demonHealth.textContent = monsters[index].health + "%";
    demonName.textContent   = monsters[index].name;
    turnEvent.textContent   = monsters[index].name + " approaches";

}
// Handle functions for ammunition 
// declaring global ammo variables
function setAmmo(){
    currentAmmo = maxAmmo;
    currentShells = maxShells;
    //span element references, ammo count in the html file
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
/*
    Dynamic reloading function
    ammotype  = what type of ammo is it: shotgun, pistol
    ammoLimit = passes the max limit of the weapon
    containerRef = reference of the UI container
    btnRef = insided the container gets the reference of the button
    spanRef = ammoCount in the UI e.g. ( x / 6 )
*/
function Reloading(ammotype, ammoLimit, containerRef = '', btnRef = '', spanRef){
    ammotype = ammoLimit; //
    document.querySelector(containerRef).querySelector(btnRef).style.display = 'block';
    turnEvent.innerHTML += `Doom Guy reloads!`;
    spanRef.innerHTML = ammotype;
    updateAmmo(spanRef, ammotype);
}
// Main Battle function
/*
    battle function will always be triggered, when any button is pressed 
    (except restart Button or start Button)

    "playeraction" is a string parameter that defines the type of player action
*/
function battle(playerAction){
    /*
        checks if ablities have been activated
        if abilities have been used the available booleans(quadAvailable,  megaAvailable)
        the booleans will become false
    */
    if(!quadAvailable){ // if quadAvailable is false then countDown begins
        quadCountdown -= 1;  
        // Update turncount in the UI 
        document.querySelector('#quadCooldown').innerHTML = quadCountdown + ' Turns remaining';
        /* Cooldown Check for Mega Health and Quad Damage */  
        if(quadCountdown == 0){
            // if countdown reaches zero then countdown value resets
            quadCountdown = 10;
            quadAvailable = true; // Boolean is set to true again
            // Disabled state is deactivated
            document.querySelector("#QuadContainer").querySelector('button').disabled = false;
            document.querySelector('#quadCooldown').innerHTML = '';

        }
    }
    // Same procedure as above
    if(!megaAvailable){
        megaCountdown -= 1;
        document.querySelector('#megaCooldown').innerHTML = megaCountdown + ' Turns remaining';
        if(megaCountdown == 0){
            megaCountdown = 5;
            megaAvailable = true;
            document.querySelector("#MegaContainer").querySelector('button').disabled = false;
            document.querySelector('#megaCooldown').innerHTML = '';

        }
    }
    turnEvent.textContent = ''; // resets the terminal
    /*
        switch case for playerAction
    */
    switch(playerAction){
        case 'pistol':  // when pistol is used 
            Pistol(); 
            break;
        case 'shotgun':     // shotgun is used
            Shotgun();
            break;
        case 'mega':    // megaHealth is used
            MegaHealth()
            break;
        case 'quad':    // Quad Damage is used
            QuadDamage()
            break;
        case 'reload pistol':   // when reloading pistol
            /* call reloading function
                -) function parameters
                pass current pistol ammo, max pistolAmmo, ID of the pistolcontainer, ID of the child btn, span reference inside the btn; 
            */
            Reloading(currentAmmo, maxAmmo, '#pistolContainer', '#btnPistol', pistolAmmo);
            currentAmmo = maxAmmo;
            reloadPistolBtn.remove();
            break;
        case 'reload shotgun':   // when reloading shotgun
            /* same procedure as above in the 'reload pistol' */
            Reloading(currentShells, maxShells, '#shotGunContainer', '#btnShotgun', shotgunShells);
            currentShells = maxShells;
            reloadShotgunBtn.remove();
            break;
        default:
            console.error('An unknown error has occured!');
            break;
    }
    // some animation testing did not work :/

    // enemyContainer.style.animation = "skew-x-shakeng 0.15s";
    // enemyContainer.style.animationPlayState = "running";

    // if enemyHealth reaches 0 then call function setNextEnemy();
    if(enemyHealth <= 0){
        setNextEnemy();
    }
    else{ 
        /* Enemy Turn */
        enemyDamage = calcEnemyDamage(index)
        playerHealth -= enemyDamage;
        healthBar.textContent = playerHealth + '%';
        //lose condition if Player HP is less or equal than Zero
        if(playerHealth <= 0){
            GameOver()
        }
        turnEvent.innerHTML += "<br>"+`Doom Guy received ${enemyDamage} Damage`;
    }
}

/*
    setNextEnemy will be called when the enemyHealth <= 0 
*/
function setNextEnemy(){
    // add 1 to the index 
    index += 1;
    /* 
        When index exceeds the total monster count (length of the monster array),
        the player wins,

        else the next enemy will added and the corresponding UI elements are changed
        with the new values
    */
    if(index > monsters.length - 1){
        PlayerWon();    //call playerWon function
    }
    else{
        enemyHealth = monsters[index].health;
        demonImage.src = monsters[index].imgSrc;
        demonName.textContent = monsters[index].name;
        demonHealth.textContent = monsters[index].health + '%';
        turnEvent.textContent = monsters[index].name + " approaches!";
    }
    
}

// PlayerWon function
function PlayerWon(){
    demonImage.src = './images/doomguy-dance.gif';
    face.src       = './images/spamClick.gif';
    demonName.innerHTML = 'CONGRATS!'
    demonHealth.innerHTML = 'You successfully survived the Hell Rush!';
    turnEvent.textContent = 'You WON!!!! (~‾⌣‾)~';
    // adds restartBtn to the healthbar and weaponContainer is not displayed anymore
    playerBar.querySelector('.weaponContainer').style.display = 'none';
    healthBar.appendChild(restartBtn);

}

// Restart Game
function restartGame(){
    // Resetting global game variables
    playerHealth = startPlayerHealth;
    index = 0;
    quadAvailable = true;
    megaAvailable = true;
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

    /* 
        Removing reloadBtn from the UI to
        avoid having multiple instances of the same element
    */
    reloadPistolBtn.remove();
    reloadShotgunBtn.remove();
}

// Game Over function
function GameOver(){
    face.src = './images/GameOver.png';
    playerBar.querySelector('.weaponContainer').style.display = 'none';
    healthBar.textContent = 'GAME OVER'; 
    // Restart button appended to healthbar reference
    healthBar.appendChild(restartBtn);
}

// =============================
// Weapons & Abilities functions
// ============================= 

// is called when Pistol button is clicked, see html onclick with id=btnPistol
function Pistol(){
    currentAmmo -= 1;
    updateAmmo(pistolAmmo, currentAmmo); // UI Update
    // when pistol ammo empty, disable the pistol button 
    // and add the reload Pistol Button
    if(currentAmmo <= 0){
        document.querySelector('#pistolContainer').querySelector('#btnPistol').style.display = 'none';
        reloadPistolBtn.innerHTML = 'Reload Pistol'
        document.querySelector('#pistolContainer').appendChild(reloadPistolBtn);

    }
    // normal pistol damage is always 15, except if the "Quad Damage" ability has been used
    // then damageMultiplier = 4
    pistolDamage = 15 * damageMultiplier;
    damageMultiplier = 1; // reset
    enemyHealth -= pistolDamage; //subtract current enemyHealth
    demonHealth.textContent = enemyHealth + "%";
    turnEvent.innerHTML += `Doom Guy did ${pistolDamage} damage! \n`;
}
// same procedure
function Shotgun(){
    
    currentShells -= 1;
    updateAmmo(shotgunShells, currentShells); //Update to UI
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
    // Default damage = 45, same procedure as with pistol
    shotGunDamage = 45 * damageMultiplier;
    damageMultiplier = 1;
    enemyHealth -= shotGunDamage;
    demonHealth.textContent = enemyHealth + "%";
    turnEvent.innerHTML += `Doom Guy did ${shotGunDamage} damage! `;

}
/*
    MegaHealth function adds 100 HP points to the player
*/
function MegaHealth(){
    playerHealth += 100;
    if(playerHealth > 250){ 
        playerHealth = 250; // Set Max Health cap is 250 HP
    }
    // Update UI 
    healthBar.textContent = playerHealth + "%";
    turnEvent.innerHTML += `Doom Guy healed +100 Healthpoints`;
    document.querySelector("#MegaContainer").querySelector('button').disabled = true;
    
    document.querySelector('#megaCooldown').innerHTML = megaCountdown + ' Turns remaining';
    megaAvailable = false; // Set boolean to false for cooldown check in the battle function
}

function QuadDamage(){
    damageMultiplier = 4; // Damage multiplier is set to 4
     // Update UI 
    turnEvent.innerHTML += `Doom Guy acquired Quad Damage`;
    document.querySelector("#QuadContainer").querySelector('button').disabled = true;
    document.querySelector('#quadCooldown').innerHTML = quadCountdown + ' Turns remaining';
    quadAvailable = false; // Set boolean to false for cooldown check in the battle function
}