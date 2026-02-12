const CONFIG = {
    growthFactor: 1.6,
    displayTime: 5000, 
    fadeTime: 1200,    
    infiniteRate: 150,
    roses: ["🌹", "🌸", "💐", "🌺", "❤️"],
    noMessages: ["No?", "wtf u no lub me or som?", "heh","just click yes honey","or u want something else 🤨"],
    yesSequence: [
        { text: "I lobbb uuuu honayyy!!!! My Sayang", img: "/gifs/fish.mp4" },
        { text: "U better love me forever and ever", img: "/gifs/angy.mp4" },
        { text: "Mi Cantikkkk", img: "/gifs/eat.mp4" },
        { text: "How much u love me" }, // Pause happens here
        { text: "Awwwwww", img: "/gifs/blush.mp4" }
    ],
    memories: [
        { url: "images/ree.png", caption: "Our first date" },
        { url: "images/smu.jpg", caption: "Your Birthday" },
        { url: "images/sid.jpg", caption: "My love of my life" },
        { url: "images/sat.png", caption: "My Birthday" },
        { url: "images/cat.png", caption: "Simbu and AowAow" }
    ],
    finalMessage: "Don't ever forget what we went through",
    finalBg: "images/final.jpg"
};

let noClickCount = 0;
let heartsActive = true;
let musicStarted = false;
let currentStep = 0;
let slideshowInterval;

function openMessage() {
    playMusic();
    const openingScreen = document.getElementById('opening-screen');
    const questionContainer = document.getElementById('question-container');
    openingScreen.classList.add('fade-out');
    setTimeout(() => {
        openingScreen.style.display = 'none';
        questionContainer.style.display = 'block';
        questionContainer.style.opacity = "0";
        setTimeout(() => {
            questionContainer.style.transition = "opacity 1s ease";
            questionContainer.style.opacity = "1";
        }, 50);
    }, 1000); 
}

function playMusic() {
    if (!musicStarted) {
        const music = document.getElementById('bg-music');
        if (music) {
            music.volume = 0.5;
            music.play().catch(e => console.log("Audio blocked:", e));
            musicStarted = true;
        }
    }
}

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
    setTimeout(() => {
        displayContainer.style.opacity = 1;
        if (bgOverlay) bgOverlay.style.opacity = 0.5;
    }, 50);
    runSlideshowLoop();
}

function runSlideshowLoop() {
    const displayContainer = document.getElementById('display-container');
    const messageEl = document.getElementById('timed-message');
    const videoEl = document.getElementById('timed-video');
    const sourceEl = document.getElementById('video-source');
    const scaleContainer = document.getElementById('love-scale-container');
    const mediaWrapper = document.getElementById('main-media-wrapper');

    const updateContent = (index) => {
        if (index === 3) {
            clearInterval(slideshowInterval);
            scaleContainer.style.display = 'block';
            mediaWrapper.style.display = 'none';
        }

        if (index < CONFIG.yesSequence.length) {
            messageEl.textContent = CONFIG.yesSequence[index].text;
            sourceEl.src = CONFIG.yesSequence[index].img;
            videoEl.load();
            videoEl.play();
        } else {
            // End of slideshow logic
            messageEl.textContent = CONFIG.finalMessage;
            mediaWrapper.style.display = 'none';
            scaleContainer.style.display = 'none';
            if (document.getElementById('bg-overlay')) 
                document.getElementById('bg-overlay').style.backgroundImage = `url('${CONFIG.finalBg}')`;
            showGallery();
            triggerEndgame();
        }
    };

    updateContent(currentStep);

    slideshowInterval = setInterval(() => {
        currentStep++;
        if (currentStep > CONFIG.yesSequence.length) {
            clearInterval(slideshowInterval);
            return;
        }
        
        displayContainer.style.opacity = 0;
        setTimeout(() => {
            updateContent(currentStep);
            // Wait for text/video to load then fade in
            setTimeout(() => { 
                displayContainer.style.opacity = 1; 
            }, 100);
        }, CONFIG.fadeTime);
    }, CONFIG.displayTime);
}

function submitLoveScale(value) {
    const displayContainer = document.getElementById('display-container');
    const scaleContainer = document.getElementById('love-scale-container');
    const mediaWrapper = document.getElementById('main-media-wrapper');

    // Smooth fade out
    displayContainer.style.opacity = 0;

    setTimeout(() => {
        scaleContainer.style.display = 'none';
        mediaWrapper.style.display = 'block';
        currentStep++; 
        
        const messageEl = document.getElementById('timed-message');
        const videoEl = document.getElementById('timed-video');
        const sourceEl = document.getElementById('video-source');
        
        if (currentStep < CONFIG.yesSequence.length) {
            messageEl.textContent = CONFIG.yesSequence[currentStep].text;
            sourceEl.src = CONFIG.yesSequence[currentStep].img;
            videoEl.load();
            videoEl.play();
        } else {
            // If the scale was at the very end (though here it's index 3)
            messageEl.textContent = CONFIG.finalMessage;
        }

        // Smooth fade back in
        setTimeout(() => {
            displayContainer.style.opacity = 1;
            runSlideshowLoop();
        }, 100);
    }, 1200); // Matches CONFIG.fadeTime for consistency
}

function showGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    const grid = document.getElementById('memory-grid');
    galleryContainer.style.display = 'block';
    CONFIG.memories.forEach(mem => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.style.setProperty('--rotation', (Math.random() * 12 - 6) + 'deg');
        card.innerHTML = `<img src="${mem.url}" alt="Memory"><div class="memory-caption">${mem.caption}</div>`;
        grid.appendChild(card);
    });
}

function triggerEndgame() {
    heartsActive = false;
    const heartBg = document.getElementById('heart-background');
    if (heartBg) heartBg.style.opacity = "0";
    
    const container = document.getElementById('flower-container');
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
        el.src = Math.random() > 0.5 ? "https://flagcdn.com/w320/pk.png" : "https://flagcdn.com/w320/id.png";
    } else {
        el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        el.setAttribute("viewBox", "0 0 32 32");
        el.classList.add("floating-heart");
        el.innerHTML = `<path d="M16 28.22l-2.15-1.96C6.22 19.33 2 15.51 2 10.75 2 6.84 5.09 3.75 9 3.75c2.21 0 4.33 1.03 5.71 2.65C16.09 4.78 18.21 3.75 20.42 3.75c3.91 0 7 3.09 7 7 0 4.76-4.22 8.58-11.85 15.52L16 28.22z"/>`;
    }

    el.style.width = size + "px"; el.style.height = size + "px";
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