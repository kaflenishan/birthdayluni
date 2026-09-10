/**
 * Cute Interactive Birthday Website Logic for Miss Lunibha
 * - Passcode Lock (112009)
 * - Playful "Are U really Here ?" & "Really?" Dialogues
 * - Conversation Mode: "17 years damnnn..." with typed bubble flow
 * - Jumping "No" Button
 * - Interactive Candle Blowout & Confetti
 * - Polaroid 3D Flipping
 * - Web Audio API Music Box & Sound FX
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STATE & CONSTANTS
  // ==========================================
  const SECRET_CODE = '112009';
  let enteredCode = '';

  const state = {
    activeScene: 'scene-passcode',
    candlesLit: 3,
    canBlowCandles: false,
    musicPlaying: false,
    noClickCount: 0,
    convoNoCount: 0
  };

  // ==========================================
  // 1b. COUNTDOWN TIMER TO MIDNIGHT
  // ==========================================
  const countdownWrap = document.getElementById('countdown-wrap');
  const codeReveal = document.getElementById('code-reveal');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  function getMidnightTonight() {
    const now = new Date();
    // Use UTC to avoid timezone issues on GitHub Pages
    const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
    return midnight;
  }

  function updateCountdown() {
    const now = new Date();
    const midnight = getMidnightTonight();
    const diff = midnight - now;

    if (diff <= 0) {
      // It's midnight! Reveal the code
      if (countdownWrap) countdownWrap.style.display = 'none';
      if (codeReveal) codeReveal.style.display = 'block';
      return false;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
    if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
    if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');

    return true;
  }

  // Check if it's already past midnight (using UTC)
  const nowInit = new Date();
  const midnightInit = getMidnightTonight();
  if (midnightInit - nowInit <= 0) {
    // Already past midnight, show code immediately
    if (countdownWrap) countdownWrap.style.display = 'none';
    if (codeReveal) codeReveal.style.display = 'block';
  } else {
    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // DOM Elements
  const confettiCanvas = document.getElementById('confetti-canvas');
  const ctx = confettiCanvas.getContext('2d');
  const ambientBg = document.getElementById('ambient-bg');
  const musicBtn = document.getElementById('music-btn');

  // Passcode Elements
  const passcodeInput = document.getElementById('passcode-input');
  const passcodeError = document.getElementById('passcode-error');
  const keyBtns = document.querySelectorAll('.key-btn[data-key]');
  const keyClear = document.getElementById('key-clear');
  const keyBackspace = document.getElementById('key-backspace');
  const passcodeCard = document.querySelector('.passcode-card');

  // Question Elements
  const q1YesBtn = document.getElementById('q1-yes-btn');
  const q1NoBtn = document.getElementById('q1-no-btn');
  const q2YesBtn = document.getElementById('q2-yes-btn');
  const q2NoBtn = document.getElementById('q2-no-btn');

  // Conversation Elements
  const convoBubbles = document.getElementById('convo-bubbles');
  const convoCta = document.getElementById('convo-cta');
  const convoOkyBtn = document.getElementById('convo-oky-btn');
  const convoNoBtn = document.getElementById('convo-no-btn');
  const convoNoMsg = document.getElementById('convo-no-msg');

  // Cake Elements
  const giftBox = document.getElementById('gift-box');
  const cakeStage = document.getElementById('cake-stage');
  const candles = document.querySelectorAll('.candle');
  const wishStatusMsg = document.getElementById('wish-status-msg');
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  const celebrateAgainBtn = document.getElementById('celebrate-again-btn');

  // ==========================================
  // 2. CANVAS CONFETTI SYSTEM
  // ==========================================
  let confettiParticles = [];
  let isConfettiActive = false;

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = ['#ff6b9d', '#ff85a2', '#fde047', '#a7f3d0', '#bae6fd', '#c084fc', '#f43f5e', '#fbbf24'];

  class ConfettiParticle {
    constructor(x, y, isBurst = false) {
      this.x = x ?? Math.random() * confettiCanvas.width;
      this.y = y ?? (isBurst ? confettiCanvas.height * 0.5 : -10);
      this.size = Math.random() * 8 + 6;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 12 + 4;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity - 5;
      } else {
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * 3 + 2;
      }
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
      this.opacity = 1;
      this.decay = Math.random() * 0.008 + 0.004;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.15;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      }
      ctx.restore();
    }
  }

  function launchConfetti(count = 80, originX, originY) {
    const startX = originX ?? window.innerWidth / 2;
    const startY = originY ?? window.innerHeight / 2;
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiParticle(startX, startY, true));
    }
    if (!isConfettiActive) {
      isConfettiActive = true;
      requestAnimationFrame(renderConfetti);
    }
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > confettiCanvas.height + 20) {
        confettiParticles.splice(i, 1);
      }
    }
    if (confettiParticles.length > 0) {
      requestAnimationFrame(renderConfetti);
    } else {
      isConfettiActive = false;
    }
  }

  // ==========================================
  // 3. AMBIENT FLOATING BUBBLES
  // ==========================================
  function createAmbientBubbles() {
    const colors = ['#fbcfe8', '#fed7aa', '#ddd6fe', '#bae6fd'];
    for (let i = 0; i < 14; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'ambient-bubble';
      const size = Math.random() * 50 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}vw`;
      bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
      bubble.style.animationDuration = `${Math.random() * 8 + 9}s`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      ambientBg.appendChild(bubble);
    }
  }
  createAmbientBubbles();

  // ==========================================
  // 4. WEB AUDIO SYNTHESIZER
  // ==========================================
  let audioCtx = null;
  let melodyTimeout = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  const NOTE_FREQS = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00,
    'A4': 440.00, 'A#4': 466.16, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25
  };

  const birthdayMelody = [
    { note: 'C4', dur: 0.4 }, { note: 'C4', dur: 0.4 }, { note: 'D4', dur: 0.7 }, { note: 'C4', dur: 0.7 },
    { note: 'F4', dur: 0.7 }, { note: 'E4', dur: 1.2 },
    { note: 'C4', dur: 0.4 }, { note: 'C4', dur: 0.4 }, { note: 'D4', dur: 0.7 }, { note: 'C4', dur: 0.7 },
    { note: 'G4', dur: 0.7 }, { note: 'F4', dur: 1.2 },
    { note: 'C4', dur: 0.4 }, { note: 'C4', dur: 0.4 }, { note: 'C5', dur: 0.7 }, { note: 'A4', dur: 0.7 },
    { note: 'F4', dur: 0.7 }, { note: 'E4', dur: 0.7 }, { note: 'D4', dur: 1.0 },
    { note: 'A#4', dur: 0.4 }, { note: 'A#4', dur: 0.4 }, { note: 'A4', dur: 0.7 }, { note: 'F4', dur: 0.7 },
    { note: 'G4', dur: 0.7 }, { note: 'F4', dur: 1.5 }
  ];

  function playMusicBoxNote(freq, duration = 0.5) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration * 1.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration * 1.8);
  }

  function playKeyClickSound() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.07);
  }

  function playWrongCodeSound() {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc.frequency.setValueAtTime(140, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  function playSquishSound(baseFreq = 260) {
    initAudio();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 1.3, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) { }
  }

  function playBlowSound() {
    initAudio();
    if (!audioCtx) return;
    try {
      const bufferSize = Math.floor(audioCtx.sampleRate * 0.25);
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, audioCtx.currentTime);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.24);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (err) {
      playKeyClickSound();
    }
  }

  function playMagicChimeSound() {
    initAudio();
    if (!audioCtx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => playMusicBoxNote(freq, 0.4), idx * 75);
    });
  }

  function playBirthdaySongLoop(noteIndex = 0) {
    if (!state.musicPlaying) return;
    if (noteIndex >= birthdayMelody.length) {
      melodyTimeout = setTimeout(() => { if (state.musicPlaying) playBirthdaySongLoop(0); }, 1500);
      return;
    }
    const current = birthdayMelody[noteIndex];
    const freq = NOTE_FREQS[current.note];
    if (freq) playMusicBoxNote(freq, current.dur);
    melodyTimeout = setTimeout(() => { if (state.musicPlaying) playBirthdaySongLoop(noteIndex + 1); }, current.dur * 650);
  }

  function toggleMusic() {
    initAudio();
    state.musicPlaying = !state.musicPlaying;
    if (state.musicPlaying) {
      musicBtn.querySelector('.btn-label').textContent = 'Music: On 🎶';
      musicBtn.classList.add('pulse-glow');
      playBirthdaySongLoop(0);
    } else {
      musicBtn.querySelector('.btn-label').textContent = 'Music: Off';
      musicBtn.classList.remove('pulse-glow');
      if (melodyTimeout) clearTimeout(melodyTimeout);
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  // ==========================================
  // 5. SCENE SWITCHING
  // ==========================================
  function switchScene(sceneId) {
    document.querySelectorAll('.scene').forEach(sc => sc.classList.remove('active'));
    const target = document.getElementById(sceneId);
    if (target) {
      target.classList.add('active');
      state.activeScene = sceneId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (sceneId === 'scene-cake') {
      buildCake();
    }
    if (sceneId === 'scene-scrapbook') {
      const sbBook = document.getElementById('scrapbook-book');
      const sbHint = document.getElementById('scrapbook-status-hint');
      if (sbBook) sbBook.classList.remove('book-opened');
      if (sbHint) sbHint.textContent = 'Tap the scrapbook to open it!';
    }
  }

  // ==========================================
  // 5b. CAKE BUILD SEQUENCE (Fall from sky 1 by 1 + Squish bounce)
  // ==========================================
  function buildCake() {
    // Grab elements
    const tierBottom = document.querySelector('.tier-bottom');
    const tierTop = document.querySelector('.tier-top');
    const decorations = document.querySelector('.cake-decorations');
    const cakePlate = document.querySelector('.cake-plate');
    const candleEls = document.querySelectorAll('.candle');
    const flameEls = document.querySelectorAll('.candle .flame');

    // Reset everything to hidden up in the sky
    tierBottom.className = 'cake-tier tier-bottom tier-hidden';
    tierTop.className = 'cake-tier tier-top tier-hidden';
    decorations.className = 'cake-decorations deco-hidden';
    cakePlate.className = 'cake-plate plate-hidden';
    candleEls.forEach((c, idx) => {
      c.className = `candle candle-hidden${idx === 1 ? ' center-candle' : ''}`;
    });
    flameEls.forEach(f => {
      f.style.opacity = '0';
      f.style.display = 'block';
      f.classList.remove('flame-ignite');
    });

    // Reset state
    state.candlesLit = 3;
    state.canBlowCandles = false;
    wishStatusMsg.textContent = 'watch your cake fall from the sky... 🎂✨';

    // Sequence timing: each part drops 1 by 1, squishes upon landing
    const T = {
      plate: 300,   // plate falls from sky, lands & squishes
      bottom: 1050,  // bottom tier falls, squishes onto plate
      top: 1800,  // top tier falls, squishes onto bottom tier
      decos: 2550,  // toppings fall, squish
      c1: 3200,  // candle 1 drops from sky
      c2: 3750,  // candle 2 drops from sky
      c3: 4300,  // candle 3 drops from sky
      flames: 4900,  // flames ignite
      unlock: 5300   // tapping candles unlocks!
    };

    function animIn(el, removeClass, addClass) {
      el.classList.remove(removeClass);
      el.classList.add(addClass);
    }

    // 1. Plate drops from sky & squishes
    setTimeout(() => {
      animIn(cakePlate, 'plate-hidden', 'plate-fall');
      setTimeout(() => playSquishSound(190), 360);
    }, T.plate);

    // 2. Bottom tier drops from sky & squishes
    setTimeout(() => {
      animIn(tierBottom, 'tier-hidden', 'tier-bottom-fall');
      setTimeout(() => playSquishSound(240), 360);
    }, T.bottom);

    // 3. Top tier drops from sky & squishes
    setTimeout(() => {
      animIn(tierTop, 'tier-hidden', 'tier-top-fall');
      setTimeout(() => playSquishSound(300), 360);
    }, T.top);

    // 4. Decorations drop from sky & squish
    setTimeout(() => {
      animIn(decorations, 'deco-hidden', 'deco-fall');
      setTimeout(() => playSquishSound(380), 340);
    }, T.decos);

    // 5. Candles drop 1 by 1 & squish
    [T.c1, T.c2, T.c3].forEach((t, i) => {
      setTimeout(() => {
        const c = candleEls[i];
        c.classList.remove('candle-hidden');
        c.classList.add('candle-fall');
        setTimeout(() => playSquishSound(440 + i * 50), 320);
      }, t);
    });

    // 6. Flames ignite after all 3 candles land
    setTimeout(() => {
      flameEls.forEach((f, i) => {
        setTimeout(() => {
          f.style.opacity = '1';
          f.style.display = 'block';
          f.classList.add('flame-ignite');
          playKeyClickSound();
        }, i * 140);
      });
      setTimeout(() => playMagicChimeSound(), 420);
    }, T.flames);

    // 7. Direct candle tap unlocks!
    setTimeout(() => {
      state.canBlowCandles = true;
      wishStatusMsg.textContent = 'Make a wish, then tap the candles to blow them out! 🕯️✨';
    }, T.unlock);
  }

  // ==========================================
  // 6. SCENE 0: PASSCODE LOGIC (112009)
  // ==========================================
  function updatePasscodeDisplay() {
    passcodeInput.value = enteredCode ? enteredCode.replace(/./g, '•') : '';
    passcodeError.textContent = '';
  }

  keyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (enteredCode.length < 6) {
        enteredCode += btn.dataset.key;
        playKeyClickSound();
        updatePasscodeDisplay();
        if (enteredCode.length === 6) validatePasscode();
      }
    });
  });

  keyClear.addEventListener('click', () => {
    enteredCode = '';
    playKeyClickSound();
    updatePasscodeDisplay();
  });

  if (keyBackspace) {
    keyBackspace.addEventListener('click', () => {
      if (enteredCode.length > 0) {
        enteredCode = enteredCode.slice(0, -1);
        playKeyClickSound();
        updatePasscodeDisplay();
      }
    });
  }

  function validatePasscode() {
    if (enteredCode === SECRET_CODE) {
      playMagicChimeSound();
      launchConfetti(70);
      passcodeError.style.color = '#16a34a';
      passcodeError.textContent = '✨ Access Granted! 💖';
      setTimeout(() => switchScene('scene-q1'), 700);
    } else {
      playWrongCodeSound();
      passcodeCard.classList.add('shake');
      passcodeError.style.color = '#e11d48';
      passcodeError.textContent = 'Oopsie! Wrong code, try again 🙈';
      setTimeout(() => {
        passcodeCard.classList.remove('shake');
        enteredCode = '';
        updatePasscodeDisplay();
      }, 1000);
    }
  }

  // ==========================================
  // 7. QUESTIONS & SASSY ATTITUDE FLOW
  // ==========================================
  function triggerAttitudeScreen() {
    initAudio();
    switchScene('scene-attitude');
    setTimeout(() => {
      launchConfetti(80);
      playMagicChimeSound();
      // go straight to convo, skip gift
      switchScene('scene-convo');
      startConversation();
    }, 3000);
  }

  q1YesBtn.addEventListener('click', () => {
    initAudio();
    playMagicChimeSound();
    switchScene('scene-q2');
  });

  q1NoBtn.addEventListener('click', () => triggerAttitudeScreen());

  q2YesBtn.addEventListener('click', () => {
    initAudio();
    playMagicChimeSound();
    // Go to flower question first
    switchScene('scene-flower');
  });

  q2NoBtn.addEventListener('click', () => triggerAttitudeScreen());

  // ==========================================
  // 8. CONVERSATION MODE (Chat Bubbles)
  // ==========================================
  const convoMessages = [
    { text: 'Holy cow, 17 😯', type: 'bubble-accent', delay: 1000 },
    { text: 'Damnnnnnn', type: 'bubble-them', delay: 1050 },
    { text: "well... i met u like a year ago and u were 16", type: 'bubble-them', delay: 1600 },
    { text: "how did u even become 17 dude", type: 'bubble-them', delay: 1400 },
    { text: "U Know Some magic or whatt🤣", type: 'bubble-them', delay: 1500 },
    { text: "jokes aside tho", type: 'bubble-accent', delay: 1600 },
    { text: "17 damn Dosent it sounds serious?", type: 'bubble-them', delay: 1200 },
    { text: "unlike your height ofcource 🤣", type: 'bubble-accent', delay: 900 },
    { text: "uff ok ok seriously now", type: 'bubble-them', delay: 1800 },
    { text: "sorry couldnt give u a real cake😔,", type: 'bubble-big', delay: 1400 },
    { text: "But i am not getting chocolet too uk😤", type: 'bubble-them', delay: 1600 },
    { text: "Well umm U Didnt ask for this but still... Did what i could Okay? 😌", type: 'bubble-accent', delay: 1400 },
  ];

  let convoStep = 0;
  let convoInterval = null;

  function startConversation() {
    // Reset
    convoBubbles.innerHTML = '';
    convoCta.style.display = 'none';
    convoNoMsg.textContent = '';
    state.convoNoCount = 0;
    convoStep = 0;

    // Add bubbles ONE BY ONE to DOM (not all at once)
    // so there's no invisible placeholder space causing early scroll
    let cumDelay = 400;

    convoMessages.forEach((msg, i) => {
      const msgDelay = msg.delay || 1200;

      setTimeout(() => {
        const el = document.createElement('p');
        el.className = `bubble ${msg.type}`;
        el.style.whiteSpace = 'pre-line';
        el.textContent = msg.text;
        convoBubbles.appendChild(el);

        // Trigger fade-in on next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.classList.add('visible');
            // Scroll the bubble box to show latest message
            convoBubbles.scrollTop = convoBubbles.scrollHeight;
          });
        });
      }, cumDelay);

      cumDelay += msgDelay;
    });

    // Show CTA only after all bubbles have appeared
    setTimeout(() => {
      convoCta.style.display = 'block';
      setTimeout(() => {
        convoCta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }, cumDelay + 300);
  }

  // "oky" goes straight to cake scene (buildCake auto-triggers via switchScene)
  convoOkyBtn.addEventListener('click', () => {
    initAudio();
    playMagicChimeSound();
    launchConfetti(50);
    switchScene('scene-cake'); // buildCake() called inside switchScene
    if (!state.musicPlaying) toggleMusic();
  });

  // Jumping "no" button
  convoNoBtn.addEventListener('click', () => {
    state.convoNoCount++;
    playWrongCodeSound();

    const messages = [
      "common 🥺",
      "noo come onnnn 😭",
      "ok ur actually trolling me 😤",
      "STOP PRESSING NO 💀",
      "fr fr just click oky already 😭",
      "what a meenie 😭",
      "idc im taking u there anyway 😤"
    ];

    convoNoMsg.textContent = messages[Math.min(state.convoNoCount - 1, messages.length - 1)];

    // After 7 clicks, just take her there
    if (state.convoNoCount >= 7) {
      convoNoBtn.style.display = 'none';
      setTimeout(() => {
        initAudio();
        playMagicChimeSound();
        launchConfetti(60);
        switchScene('scene-cake');
        if (!state.musicPlaying) toggleMusic();
      }, 800);
      return;
    }

    // Make the no button jump to a random position inside its container
    jumpNoButton();
  });

  function jumpNoButton() {
    const container = convoNoBtn.parentElement;
    const containerRect = container.getBoundingClientRect();
    const btnWidth = convoNoBtn.offsetWidth;
    const btnHeight = convoNoBtn.offsetHeight;

    // Random offset within a safe area (within ±120px of center)
    const maxX = Math.min(100, (containerRect.width / 2) - (btnWidth / 2));
    const maxY = 60;
    const randX = (Math.random() * maxX * 2) - maxX;
    const randY = (Math.random() * maxY * 2) - maxY;

    convoNoBtn.style.position = 'relative';
    convoNoBtn.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
    convoNoBtn.style.transform = `translate(${randX}px, ${randY}px)`;
  }

  // ==========================================
  // 9. SCENE 1 (GIFT): GIFT UNWRAPPING
  // ==========================================
  if (giftBox) {
    giftBox.addEventListener('click', () => {
      initAudio();
      playMagicChimeSound();
      launchConfetti(90, window.innerWidth / 2, window.innerHeight / 2);
      giftBox.style.transform = 'scale(1.18) rotate(-4deg)';
      setTimeout(() => {
        switchScene('scene-cake');
        if (!state.musicPlaying) toggleMusic();
      }, 600);
    });
  }

  // ==========================================
  // 10. SCENE 2: CANDLE BLOWOUT & WISH LOGIC
  // ==========================================
  function extinguishCandle(candleEl) {
    if (!candleEl.classList.contains('blown-out') && !candleEl.classList.contains('candle-hidden')) {
      candleEl.classList.add('blown-out');
      state.candlesLit = Math.max(0, state.candlesLit - 1);

      // Explicitly turn off flame display & opacity
      const flame = candleEl.querySelector('.flame');
      if (flame) {
        flame.style.opacity = '0';
        flame.style.display = 'none';
        flame.classList.remove('flame-ignite');
      }

      playBlowSound();
      playMagicChimeSound();
      const rect = candleEl.getBoundingClientRect();
      launchConfetti(35, rect.left + rect.width / 2, rect.top);

      if (state.candlesLit <= 0) {
        triggerWishCompleted();
      } else {
        wishStatusMsg.textContent = `${state.candlesLit} candle${state.candlesLit > 1 ? 's' : ''} left! make a wish ✨`;
      }
    }
  }

  candles.forEach(candle => {
    candle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.canBlowCandles) return;
      extinguishCandle(candle);
    });
  });

  if (cakeStage) {
    cakeStage.addEventListener('click', () => {
      if (!state.canBlowCandles || state.candlesLit <= 0) return;
      const activeCandle = Array.from(candles).find(c => !c.classList.contains('blown-out') && !c.classList.contains('candle-hidden'));
      if (activeCandle) extinguishCandle(activeCandle);
    });
  }

  function triggerWishCompleted() {
    wishStatusMsg.innerHTML = '🎉 <strong>wish made! opening your surprise scrapbook... 💖</strong>';

    launchConfetti(120);
    setTimeout(() => launchConfetti(80, window.innerWidth * 0.25), 300);
    setTimeout(() => launchConfetti(80, window.innerWidth * 0.75), 600);

    // Wait 2.5 seconds after candle blowout before transitioning directly into scrapbook
    setTimeout(() => switchScene('scene-scrapbook'), 2500);
  }

  // ==========================================
  // 10b. SCENE 2.5: 3D PAPERCRAFT SCRAPBOOK (Letter & Polaroids Together!)
  // ==========================================
  const scrapbookBook = document.getElementById('scrapbook-book');
  const scrapbookHint = document.getElementById('scrapbook-status-hint');

  if (scrapbookBook) {
    scrapbookBook.addEventListener('click', () => {
      if (!scrapbookBook.classList.contains('book-opened')) {
        scrapbookBook.classList.add('book-opened');
        initAudio();
        playMagicChimeSound();
        launchConfetti(90);
        setTimeout(() => launchConfetti(70, window.innerWidth * 0.3), 300);
        setTimeout(() => launchConfetti(70, window.innerWidth * 0.7), 600);

        if (scrapbookHint) {
          scrapbookHint.innerHTML = 'Tada! Handmade with all my heart for your 17th';
        }
      }
    });
  }

  const scrapbookDoneBtn = document.getElementById('scrapbook-done-btn');
  if (scrapbookDoneBtn) {
    scrapbookDoneBtn.addEventListener('click', () => {
      initAudio();
      playMagicChimeSound();
      launchConfetti(70);
      switchScene('scene-end');
    });
  }

  // ==========================================
  // 11. POLAROID FLIP INTERACTION
  // ==========================================
  polaroidCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.toggle('flipped');
      playMagicChimeSound();
    });
  });

  // ==========================================
  // 12. FLOWER QUESTION LOGIC
  // ==========================================
  const flowerInputScene = document.getElementById('flower-input-scene');
  const flowerSubmitScene = document.getElementById('flower-submit-scene');
  const flowerResponseScene = document.getElementById('flower-response-scene');

  function checkFlowerAnswerScene() {
    if (!flowerInputScene || !flowerResponseScene) return;
    const answer = flowerInputScene.value.toLowerCase().replace(/[\s\-_.,!?]/g, '').trim();
    
    // Accept any variation of "white tulip" or just "tulip"
    const validAnswers = [
      'whitetulip', 'tulip', 'whitetulips', 'tulips',
      'white tulip', 'white tulips',
      'wt', 'whtulip', 'whitetlp'
    ];
    
    const isCorrect = validAnswers.some(v => answer.includes(v)) || 
                      answer.includes('tulip');
    
    if (isCorrect) {
      flowerResponseScene.textContent = 'its white tulip :) 🌷';
      flowerResponseScene.className = 'flower-response';
      flowerInputScene.disabled = true;
      flowerSubmitScene.disabled = true;
      flowerInputScene.style.borderColor = '#16a34a';
      playMagicChimeSound();
      launchConfetti(50);
      
      // After correct answer, start conversation
      setTimeout(() => {
        switchScene('scene-convo');
        startConversation();
      }, 1500);
    } else if (answer.length > 0) {
      flowerResponseScene.textContent = 'nope, think again 🤔';
      flowerResponseScene.className = 'flower-response wrong';
      flowerInputScene.value = '';
    }
  }

  if (flowerSubmitScene) {
    flowerSubmitScene.addEventListener('click', checkFlowerAnswerScene);
  }
  if (flowerInputScene) {
    flowerInputScene.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkFlowerAnswerScene();
    });
  }

  // ==========================================
  // 13. REPLAY / CELEBRATE AGAIN
  // ==========================================
  if (celebrateAgainBtn) {
    celebrateAgainBtn.addEventListener('click', () => {
      // Reset state (cake resets automatically when scene-cake is entered via buildCake)
      state.candlesLit = 3;
      state.canBlowCandles = false;
      wishStatusMsg.textContent = 'Make a wish, then tap the candles to blow them out! 🕯️✨';
      if (scrapbookBook) scrapbookBook.classList.remove('book-opened');
      if (scrapbookHint) scrapbookHint.textContent = 'Tap the scrapbook to open it! 🎁';
      enteredCode = '';
      updatePasscodeDisplay();
      switchScene('scene-passcode');
      launchConfetti(60);
    });
  }

});
