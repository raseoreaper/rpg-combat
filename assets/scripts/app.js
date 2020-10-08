const attackValue = 10;
const strongerAttackValue = 18;
const healingValue = 20;
const monsterAttackValue = 15;

const ATTACKT_MODE = 'Attack';
const STONGER_ATTACK_MODE = 'Stronger Attack';

const LOG_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_GAME_OVER = 'GAME_OVER';


let battleLog = [];

function getMaxLifeValues() {
    const enterValue = parseInt(prompt('Enter the number of HP you desirer', '100'))

    const parsedValue = enterValue;

    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw { message: 'Invalid user input, not a number' };
    }
    return parsedValue;
}

let chosenMaxLife;

try {
    chosenMaxLife = getMaxLifeValues();
} catch (error) {
    console.log(error);
    chosenMaxLife = 100;
    alert('The value you enter is not a number. The default value will be 100')
}

let currentPlayerHealth = chosenMaxLife
let currentMonsterHealth = chosenMaxLife
let hasBonusLife = true;

console.log(chosenMaxLife);
adjustHealthBars(chosenMaxLife);

const writeToLog = (ev, val, monsterHealth, playerHealth) => {
    let logEntry;
    if (ev === LOG_PLAYER_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_PLAYER_STRONG_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_MONSTER_ATTACK) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_PLAYER_HEAL) {
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    } else if (ev === LOG_GAME_OVER) {
        logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth
        };
    }
    battleLog.push(logEntry);
}

const resetHandler = () => {
    currentPlayerHealth = chosenMaxLife;
    currentMonsterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

const endRound = () => {
    initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(strongerAttackValue);
    currentPlayerHealth -= playerDamage
    writeToLog(LOG_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert('Bonus Life Activated!!!!!!')
        setPlayerHealth(initialPlayerHealth);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert('You Win!');
        resetHandler();
        writeToLog(LOG_MONSTER_ATTACK, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth);
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lose!');
        resetHandler();
        writeToLog(LOG_MONSTER_ATTACK, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth);
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert('Draw!!!');
        resetHandler();
        writeToLog(LOG_MONSTER_ATTACK, 'DRAW !!!', currentMonsterHealth, currentPlayerHealth);
    }
}

const damageDeal = (mode) => {
    let maxDamage;
    let logEvent;

    if (mode === ATTACKT_MODE) {
        maxDamage = attackValue;
        logEvent = LOG_PLAYER_ATTACK;
    } else if (mode === STONGER_ATTACK_MODE) {
        maxDamage = strongerAttackValue;
        logEvent = LOG_PLAYER_STRONG_ATTACK;
    }

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage

    writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

    endRound();
}

const attackHandler = () => {
    damageDeal(ATTACKT_MODE);
}

const strongAttackHandler = () => {
    damageDeal(STONGER_ATTACK_MODE);
}

const healingHandler = () => {
    let healValue;

    if (currentPlayerHealth >= chosenMaxLife - healingValue) {
        healValue = chosenMaxLife - currentPlayerHealth
        alert('You cannot reach higher than you MAX health');
    } else {
        healValue = healingValue;
    }

    increasePlayerHealth(healingValue);
    currentPlayerHealth += healValue;

    writeToLog(LOG_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

const printLogHandler = () => {
    //console.log(battleLog);


    //-----For of exemple-------------------
    /*for (let i = 0; i < battleLog.length; i++) {
        console.log(battleLog[i])
    }*/
    /*for (const logEntry of battleLog) {
        console.log(logEntry);
    }*/


    //-----For in exemple-----------------
    let i = 0;
    for (const logEntry of battleLog) {
        console.log(`#${i}`);
        for (const key in logEntry) {
            console.log(`${key} => ${logEntry[key]}`);
        }
        i++
    }

}

attackBtn.addEventListener('click', attackHandler)
strongAttackBtn.addEventListener('click', strongAttackHandler)
healBtn.addEventListener('click', healingHandler)
logBtn.addEventListener('click', printLogHandler)