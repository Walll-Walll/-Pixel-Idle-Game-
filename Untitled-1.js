// Idle Game with Upgrades, Abilities, Crits, Level Gain, Mouse Skins

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

// Crit and level gain upgrades
let critChance = 0.05; // 5% base
let critDamage = 2;    // 2x base
let critUpgradeLevel = 0;
let critUpgradeCost = 50;

let levelGainBonus = 0; // Extra EXP per click
let levelGainUpgradeLevel = 0;
let levelGainUpgradeCost = 50;

// Mouse skins
const mouseSkins = [
    {
        name: "Default",
        cursor: "pointer",
        cost: 0,
        damageBonus: 0,
        critBonus: 0,
        expBonus: 0
    },
    {
        name: "Sword Cursor",
        cursor: "url('https://cur.cursors-4u.net/games/gam-10/gam973.cur'), pointer",
        cost: 500,
        damageBonus: 2,
        critBonus: 0.05,
        expBonus: 0
    },
    {
        name: "Star Cursor",
        cursor: "url('https://cur.cursors-4u.net/symbols/sym-1/sym57.cur'), pointer",
        cost: 1000,
        damageBonus: 0,
        critBonus: 0.10,
        expBonus: 1
    }
];
let currentMouseSkin = 0;

// Boss state
let bossActive = false;
let bossHealth = 0;
let bossMaxHealth = 0;
let bossReward = 0;
let nextBossAt = 100;

// Boss images by difficulty
const bossImages = [
    "https://kenney.nl/assets/platformer-art-deluxe/PNG/Enemies/slimeBlue.png", // Easy
    "https://kenney.nl/assets/platformer-art-deluxe/PNG/Enemies/bee.png", // Medium
    "https://kenney.nl/assets/platformer-art-deluxe/PNG/Enemies/bat.png" // Hard
];

// Player character images
const characterIdle = "https://kenney.nl/assets/platformer-art-deluxe/PNG/Player/p1_stand.png";
const characterClick = "https://kenney.nl/assets/platformer-art-deluxe/PNG/Player/p1_jump.png";

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
    document.getElementById('increment-value').innerText = `Click Value: ${increment + clickPowerLevel + mouseSkins[currentMouseSkin].damageBonus}`;
    document.getElementById('upgrade-cost').innerText = `Upgrade Cost: ${upgradeCost}`;
    document.getElementById('level-display').innerText = `Level: ${level}`;
    document.getElementById('ap-display').innerText = `Ability Points: ${abilityPoints}`;
    document.getElementById('clickPower-cost').innerText = clickPowerCost;
    document.getElementById('autoPower-cost').innerText = autoPowerCost;
    document.getElementById('clickPower-level').innerText = `Level: ${clickPowerLevel}`;
    document.getElementById('autoPower-level').innerText = `Level: ${autoPowerLevel}`;
    document.getElementById('crit-upgrade-cost').innerText = critUpgradeCost;
    document.getElementById('crit-upgrade-level').innerText = `Level: ${critUpgradeLevel}`;
    document.getElementById('levelgain-upgrade-cost').innerText = levelGainUpgradeCost;
    document.getElementById('levelgain-upgrade-level').innerText = `Level: ${levelGainUpgradeLevel}`;
    document.getElementById('ability-status').innerText =
        abilityActive ? "Ability: ACTIVE!" : (abilityCooldown ? "Ability: Cooling Down..." : "Ability: Ready!");
    document.getElementById('ability-button').disabled = abilityActive || abilityCooldown;

    // Mouse skin select
    const select = document.getElementById('mouse-skin-select');
    if (select && select.options.length !== mouseSkins.length) {
        select.innerHTML = '';
        mouseSkins.forEach((skin, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.text = `${skin.name} (${skin.cost} clicks)`;
            select.appendChild(opt);
        });
    }
    if (select) select.selectedIndex = currentMouseSkin;
    document.body.style.cursor = mouseSkins[currentMouseSkin].cursor;
    document.getElementById('mouse-skin-info').innerText =
        `Damage+${mouseSkins[currentMouseSkin].damageBonus}, Crit+${Math.round(mouseSkins[currentMouseSkin].critBonus*100)}%, EXP+${mouseSkins[currentMouseSkin].expBonus}`;

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

    // Crit calculation
    let isCrit = Math.random() < (critChance + mouseSkins[currentMouseSkin].critBonus);
    let dmg = increment + clickPowerLevel + mouseSkins[currentMouseSkin].damageBonus;
    if (isCrit) dmg *= (critDamage + mouseSkins[currentMouseSkin].critBonus);

    if (bossActive) {
        bossHealth -= Math.floor(dmg);
        gainExp(5 + levelGainBonus + mouseSkins[currentMouseSkin].expBonus);
        if (bossHealth <= 0) {
            bossActive = false;
            count += bossReward;
            nextBossAt += 100;
            gainExp(25 + levelGainBonus + mouseSkins[currentMouseSkin].expBonus);
            alert(`Boss defeated! You earned ${bossReward} points!`);
        }
    } else {
        count += Math.floor(dmg);
        gainExp(1 + levelGainBonus + mouseSkins[currentMouseSkin].expBonus);
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

function buyCritUpgrade() {
    if (count >= critUpgradeCost) {
        count -= critUpgradeCost;
        critUpgradeLevel++;
        critChance += 0.05;
        critDamage += 1;
        critUpgradeCost = Math.floor(critUpgradeCost * 2);
        updateDisplay();
    } else {
        alert("Not enough clicks!");
    }
}

function buyLevelGainUpgrade() {
    if (count >= levelGainUpgradeCost) {
        count -= levelGainUpgradeCost;
        levelGainUpgradeLevel++;
        levelGainBonus += 1;
        levelGainUpgradeCost = Math.floor(levelGainUpgradeCost * 2);
        updateDisplay();
    } else {
        alert("Not enough clicks!");
    }
}

function buyMouseSkin() {
    const select = document.getElementById('mouse-skin-select');
    const idx = select.selectedIndex;
    const skin = mouseSkins[idx];
    if (currentMouseSkin === idx) {
        alert("Already equipped!");
        return;
    }
    if (count >= skin.cost) {
        count -= skin.cost;
        currentMouseSkin = idx;
        document.body.style.cursor = skin.cursor;
        updateDisplay();
    } else {
        alert("Not enough clicks for this skin!");
    }
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

// Falling mice logic (improved for reliability)
function spawnFallingMouse() {
    const container = document.getElementById('falling-mice-container');
    if (!container) return;

    // Use clientWidth/clientHeight for reliability
    const containerWidth = container.clientWidth || 400;
    const containerHeight = container.clientHeight || 400;

    const mouseImg = document.createElement('img');
    mouseImg.src = "https://kenney.nl/assets/ui-pack/PNG/white_mouse.png";
    mouseImg.className = "falling-mouse";
    mouseImg.style.left = Math.random() * (containerWidth - 48) + "px";
    mouseImg.style.top = "-48px";

    // Animate falling
    let pos = -48;
    const speed = 1 + Math.random() * 1.5; // px per frame
    const maxY = containerHeight;
    let falling = setInterval(() => {
        pos += speed;
        mouseImg.style.top = pos + "px";
        if (pos > maxY) {
            clearInterval(falling);
            if (mouseImg.parentNode) mouseImg.parentNode.removeChild(mouseImg);
        }
    }, 16);

    // Click event
    mouseImg.onclick = function(e) {
        e.stopPropagation();
        clearInterval(falling);
        if (mouseImg.parentNode) mouseImg.parentNode.removeChild(mouseImg);

        // Reward: random between current clicks and 10x current clicks
        let min = Math.max(1, count);
        let max = Math.max(10, count * 10);
        let reward = Math.floor(Math.random() * (max - min + 1)) + min;
        count += reward;
        updateDisplay();

        // Show floating text
        const text = document.createElement('div');
        text.innerText = `+${reward} clicks!`;
        text.style.position = "absolute";
        text.style.left = mouseImg.style.left;
        text.style.top = pos + "px";
        text.style.color = "#fff";
        text.style.fontWeight = "bold";
        text.style.fontSize = "1.2em";
        text.style.textShadow = "2px 2px 4px #000";
        text.style.pointerEvents = "none";
        container.appendChild(text);
        setTimeout(() => {
            if (text.parentNode) text.parentNode.removeChild(text);
        }, 1000);
    };

    container.appendChild(mouseImg);
}

// Spawn a falling mouse every 5 seconds, 70% chance
setInterval(() => {
    if (Math.random() < 0.7) {
        spawnFallingMouse();
    }
}, 5000);

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