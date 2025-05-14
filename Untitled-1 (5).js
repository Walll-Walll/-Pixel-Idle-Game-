// Idle Game with Upgrades, Abilities, and Bosses

let count = 0;
let increment = 1;
let upgradeCost = 10;

// Ability state
let abilityActive = false;
let abilityCooldown = false;
const abilityDuration = 5000; // ms
const abilityCooldownTime = 15000; // ms

// Leveling and upgrades
let level = 1;
let exp = 0;
let expToNext = 50;
let abilityPoints = 0;
let clickPowerLevel = 0;
let autoPowerLevel = 0;
let clickPowerCost = 1;
let autoPowerCost = 1;

// Boss state
let bossActive = false;
let bossHealth = 0;
let bossMaxHealth = 0;
let bossReward = 0;
let nextBossAt = 100;

// Boss images by difficulty (Kenney assets)
const bossImages = [
    "https://raw.githubusercontent.com/kenneyNL/platformer-art-deluxe/main/PNG/Enemies/slimeBlue.png", // Easy
    "https://raw.githubusercontent.com/kenneyNL/platformer-art-deluxe/main/PNG/Enemies/bee.png",       // Medium
    "https://raw.githubusercontent.com/kenneyNL/platformer-art-deluxe/main/PNG/Enemies/bat.png"        // Hard
];

// Player character images (Kenney assets)
const characterIdle = "https://raw.githubusercontent.com/kenneyNL/platformer-art-deluxe/main/PNG/Player/p1_stand.png";
const characterClick = "https://raw.githubusercontent.com/kenneyNL/platformer-art-deluxe/main/PNG/Player/p1_jump.png";

function getBossImage() {
    if (nextBossAt < 300) {
        return bossImages[0]; // Easy
    } else if (nextBossAt < 600) {
        return bossImages[1]; // Medium
    } else {
        return bossImages[2]; // Hard
    }
}

function gainExp(amount) {
    exp += amount;
    while (exp >= expToNext) {
        exp -= expToNext;
        level++;
        abilityPoints++;
        expToNext = Math.floor(expToNext * 1.25);
        alert(`Level Up! You are now level ${level} and gained 1 Ability Point!`);
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('count-display').innerText = `Count: ${count}`;
    document.getElementById('increment-value').innerText = `Click Value: ${increment + clickPowerLevel}`;
    document.getElementById('upgrade-cost').innerText = `Upgrade Cost: ${upgradeCost}`;
    document.getElementById('level-display').innerText = `Level: ${level}`;
    document.getElementById('ap-display').innerText = `Ability Points: ${abilityPoints}`;
    document.getElementById('clickPower-cost').innerText = clickPowerCost;
    document.getElementById('autoPower-cost').innerText = autoPowerCost;
    document.getElementById('clickPower-level').innerText = `Level: ${clickPowerLevel}`;
    document.getElementById('autoPower-level').innerText = `Level: ${autoPowerLevel}`;
    document.getElementById('ability-status').innerText =
        abilityActive ? "Ability: ACTIVE!" : (abilityCooldown ? "Ability: Cooling Down..." : "Ability: Ready!");
    document.getElementById('ability-button').disabled = abilityActive || abilityCooldown;
    // Boss UI
    const bossSection = document.getElementById('boss-section');
    const bossImage = document.getElementById('boss-image');
    if (bossActive) {
        bossSection.style.display = 'block';
        document.getElementById('boss-health').innerText = `Boss Health: ${bossHealth} / ${bossMaxHealth}`;
        if (bossImage) {
            bossImage.src = getBossImage();
            bossImage.style.display = "block";
        }
    } else {
        bossSection.style.display = 'none';
        if (bossImage) bossImage.style.display = "none";
    }
}

function manualIncrement() {
    // Animate character on click
    const character = document.getElementById('player-character');
    if (character) {
        character.src = characterClick;
        setTimeout(() => {
            character.src = characterIdle;
        }, 200);
    }

    if (bossActive) {
        bossHealth -= increment + clickPowerLevel;
        gainExp(5);
        if (bossHealth <= 0) {
            bossActive = false;
            count += bossReward;
            nextBossAt += 100;
            gainExp(25);
            alert(`Boss defeated! You earned ${bossReward} points!`);
        }
    } else {
        count += increment + clickPowerLevel;
        gainExp(1);
    }
    checkBoss();
    updateDisplay();
}

function autoIncrement() {
    if (!bossActive) {
        count += increment + autoPowerLevel;
        gainExp(1);
        checkBoss();
        updateDisplay();
    }
}

function buyUpgrade() {
    if (count >= upgradeCost) {
        count -= upgradeCost;
        increment += 1;
        upgradeCost = Math.floor(upgradeCost * 1.7);
        updateDisplay();
    } else {
        alert("Not enough points to upgrade!");
    }
}

function buyPermanentUpgrade(type) {
    if (type === 'clickPower' && abilityPoints >= clickPowerCost) {
        abilityPoints -= clickPowerCost;
        clickPowerLevel++;
        clickPowerCost = Math.floor(clickPowerCost * 1.5) + 1;
    } else if (type === 'autoPower' && abilityPoints >= autoPowerCost) {
        abilityPoints -= autoPowerCost;
        autoPowerLevel++;
        autoPowerCost = Math.floor(autoPowerCost * 1.5) + 1;
    } else {
        alert("Not enough Ability Points!");
    }
    updateDisplay();
}

function activateAbility() {
    if (!abilityActive && !abilityCooldown) {
        abilityActive = true;
        increment *= 5;
        updateDisplay();
        setTimeout(() => {
            abilityActive = false;
            increment = Math.floor(increment / 5);
            abilityCooldown = true;
            updateDisplay();
            setTimeout(() => {
                abilityCooldown = false;
                updateDisplay();
            }, abilityCooldownTime);
        }, abilityDuration);
    }
}

function checkBoss() {
    if (!bossActive && count >= nextBossAt) {
        bossActive = true;
        bossMaxHealth = 50 + Math.floor(nextBossAt / 2);
        bossHealth = bossMaxHealth;
        bossReward = Math.floor(nextBossAt / 2);
        updateDisplay();
    }
}

// Fullscreen toggle
function toggleFullscreen() {
    const elem = document.documentElement;
    const btn = document.getElementById('fullscreen-btn');
    if (!document.fullscreenElement) {
        elem.requestFullscreen().then(() => {
            btn.textContent = "Exit Fullscreen";
        });
    } else {
        document.exitFullscreen().then(() => {
            btn.textContent = "Go Fullscreen";
        });
    }
}
document.addEventListener('fullscreenchange', () => {
    const btn = document.getElementById('fullscreen-btn');
    if (btn) {
        btn.textContent = document.fullscreenElement ? "Exit Fullscreen" : "Go Fullscreen";
    }
});

// Auto increment every second
setInterval(autoIncrement, 1000);

// Initial display update
window.onload = updateDisplay;