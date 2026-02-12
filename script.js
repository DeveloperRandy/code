const CONFIG = {
    growthFactor: 1.6,
    displayTime: 6000, // Duration each slide stays visible
    fadeTime: 2000,    // Duration of the fade transition (matching CSS)
    burstCount: 80,
    infiniteRate: 150,
    roses: ["🌹", "🥀", "🌹", "🌷", "🌹"],
    noMessages: ["Are you sure?", "Pookie please...", "Don't do this! 💔"],
    yesSequence: [
        { 
            text: "Knew you would say yes!", 
            img: "/gifs/two.mp4", 
            bg: "images/sitting.png" 
        },
        { 
            text: "I have so many things planned!", 
            img: "/gifs/three.mp4", 
            bg: "images/bg2.jpg" 
        },
        { 
            text: "You're the best! ❤️", 
            img: "/gifs/four.mp4", 
            bg: "images/bg3.jpg" 
        }
    ],
    finalMessage: "Forever yours! 🌹",
    finalBg: "images/final.jpg"
};

let noClickCount = 0;
let heartsActive = true;

function handleNoClick() {
    const noBtn = document.querySelector('.no-button');
    const yesBtn = document.querySelector('.yes-button');
    noBtn.textContent = CONFIG.noMessages[noClickCount % CONFIG.noMessages.length];
    noClickCount++;
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = `${currentSize * CONFIG.growthFactor}px`;
}

function handleYesClick() {
    document.getElementById('question-container').style.display = 'none';
    const displayContainer = document.getElementById('display-container');
    const bgOverlay = document.getElementById('bg-overlay');

    displayContainer.style.display = 'block';
    
    // Initial fade in for the first slide
    setTimeout(() => {
        displayContainer.style.opacity = 1;
        if (bgOverlay) bgOverlay.style.opacity = 0.5;
    }, 50);

    startSlideshow();
}

function startSlideshow() {
    const displayContainer = document.getElementById('display-container');
    const bgOverlay = document.getElementById('bg-overlay');
    const messageEl = document.getElementById('timed-message');
    const videoEl = document.getElementById('timed-video');
    const sourceEl = document.getElementById('video-source');
    let step = 0;

    const updateContent = (index) => {
        if (index < CONFIG.yesSequence.length) {
            messageEl.textContent = CONFIG.yesSequence[index].text;
            sourceEl.src = CONFIG.yesSequence[index].img;
            if (bgOverlay) bgOverlay.style.backgroundImage = `url('${CONFIG.yesSequence[index].bg}')`;
            videoEl.load();
            videoEl.play();
        } else {
            messageEl.textContent = CONFIG.finalMessage;
            if (bgOverlay) bgOverlay.style.backgroundImage = `url('${CONFIG.finalBg}')`;
            triggerEndgame();
        }
    };

    // Initial load
    updateContent(0);

    const loop = setInterval(() => {
        step++;
        
        // 1. Start Fade Out
        displayContainer.style.opacity = 0;
        if (bgOverlay) bgOverlay.style.opacity = 0;

        // 2. Wait for fade out to finish (fadeTime) then update content
        setTimeout(() => {
            updateContent(step);
            
            // 3. Start Fade In
            displayContainer.style.opacity = 1;
            if (bgOverlay) bgOverlay.style.opacity = 0.5;
            
            if (step >= CONFIG.yesSequence.length) clearInterval(loop);
        }, CONFIG.fadeTime);
        
    }, CONFIG.displayTime);
}

function triggerEndgame() {
    heartsActive = false;
    const heartBg = document.getElementById('heart-background');
    if (heartBg) heartBg.style.opacity = "0";
    
    const container = document.getElementById('flower-container');

    // Burst effect
    for (let i = 0; i < CONFIG.burstCount; i++) {
        const f = document.createElement('div');
        f.className = 'flower burst-flower';
        f.innerHTML = CONFIG.roses[Math.floor(Math.random() * CONFIG.roses.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = 150 + Math.random() * 600;
        f.style.setProperty('--tw', `${Math.cos(angle) * dist}px`);
        f.style.setProperty('--th', `${Math.sin(angle) * dist}px`);
        container.appendChild(f);
        f.addEventListener('animationend', () => f.remove());
    }

    // Infinite falling roses
    setInterval(() => {
        const f = document.createElement('div');
        f.className = 'flower falling-flower';
        f.innerHTML = CONFIG.roses[Math.floor(Math.random() * CONFIG.roses.length)];
        f.style.left = Math.random() * 100 + "vw";
        f.style.setProperty('--speed', (3 + Math.random() * 4) + "s");
        container.appendChild(f);
        f.addEventListener('animationend', () => f.remove());
    }, CONFIG.infiniteRate);
}

function createHeartBackground() {
    const container = document.getElementById('heart-background');
    if (!container) return;
    for (let i = 0; i < 15; i++) {
        setTimeout(() => spawnHeart(container), i * 400);
    }
}

function spawnHeart(container) {
    if (!heartsActive) return;
    const random = Math.random();
    let el;
    const size = Math.random() * 20 + 40;
    const duration = Math.random() * 5 + 8;

    if (random > 0.4) {
        el = document.createElement('img');
        el.className = "flag-heart";
        // Alternating between PK and ID flags as in your original
        if (Math.random() > 0.4) {
            el.src = "https://flagcdn.com/w320/pk.png";
            el.style.backgroundColor = "#006600";
        } else {
            el.src = "https://flagcdn.com/w320/id.png";
            el.style.backgroundColor = "#ff0000";
        }
    } else {
        el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        el.setAttribute("viewBox", "0 0 32 32");
        el.classList.add("floating-heart");
        el.innerHTML = `<path d="M16 28.22l-2.15-1.96C6.22 19.33 2 15.51 2 10.75 2 6.84 5.09 3.75 9 3.75c2.21 0 4.33 1.03 5.71 2.65C16.09 4.78 18.21 3.75 20.42 3.75c3.91 0 7 3.09 7 7 0 4.76-4.22 8.58-11.85 15.52L16 28.22z"/>`;
    }

    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = Math.random() * 100 + "vw";
    el.style.setProperty('--duration', duration + "s");
    el.style.setProperty('--sway', (Math.random() * 200 - 100) + "px");
    el.style.setProperty('--rotation', (Math.random() * 40 - 20) + "deg");

    container.appendChild(el);
    setTimeout(() => {
        el.remove();
        if (heartsActive) spawnHeart(container);
    }, duration * 1000);
}

window.onload = createHeartBackground;