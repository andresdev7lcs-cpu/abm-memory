import { questions } from './questions.js';

const assets = {
    host: "https://pvkfxyhwjbphcrqqaitv.supabase.co/storage/v1/object/sign/Media%20Files/APP%20-%20Insurance/presenter.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hYjE4YmJhNC1kM2MxLTRiNTQtYmYwMC05NzQ4NjEzNGEzNjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNZWRpYSBGaWxlcy9BUFAgLSBJbnN1cmFuY2UvcHJlc2VudGVyLnBuZyIsImlhdCI6MTc2OTUzOTkyOSwiZXhwIjoxNzcyMTMxOTI5fQ.-CYQFO28iiStVJKARKptN9TQ1FarBasq_pTflutTPNk",
    chico: "https://pvkfxyhwjbphcrqqaitv.supabase.co/storage/v1/object/sign/Media%20Files/APP%20-%20Insurance/man.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hYjE4YmJhNC1kM2MxLTRiNTQtYmYwMC05NzQ4NjEzNGEzNjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNZWRpYSBGaWxlcy9BUFAgLSBJbnN1cmFuY2UvbWFuLnBuZyIsImlhdCI6MTc2OTUzOTkwNiwiZXhwIjoxNzcyMTMxOTA2fQ.MaS4cKr43YvC2Yuc2DEXiIwVQ2iyN7u1_lq1Kjxcrsg",
    chica: "https://pvkfxyhwjbphcrqqaitv.supabase.co/storage/v1/object/sign/Media%20Files/APP%20-%20Insurance/woman.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hYjE4YmJhNC1kM2MxLTRiNTQtYmYwMC05NzQ4NjEzNGEzNjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNZWRpYSBGaWxlcy9BUFAgLSBJbnN1cmFuY2Uvd29tYW4ucG5nIiwiaWF0IjoxNzY5NTM5OTQwLCJleHAiOjE3NzIxMzE5NDB9.bwWMzLKM9H6A2Zvsvmx5RBBfjRwyusWQV87bS0D-3Mg",
    homeBg: "https://pvkfxyhwjbphcrqqaitv.supabase.co/storage/v1/object/sign/Media%20Files/APP%20-%20Insurance/home.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hYjE4YmJhNC1kM2MxLTRiNTQtYmYwMC05NzQ4NjEzNGEzNjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNZWRpYSBGaWxlcy9BUFAgLSBJbnN1cmFuY2UvaG9tZS5wbmciLCJpYXQiOjE3Njk1Mzk4NjEsImV4cCI6MTc3MjEzMTg2MX0.9Y1tBh88EaCf4JCPQw1_qGA6cpVX6rYBemPIB6oGkPE",
    intro: "https://pvkfxyhwjbphcrqqaitv.supabase.co/storage/v1/object/sign/Media%20Files/APP%20-%20Insurance/intro.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hYjE4YmJhNC1kM2MxLTRiNTQtYmYwMC05NzQ4NjEzNGEzNjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNZWRpYSBGaWxlcy9BUFAgLSBJbnN1cmFuY2UvaW50cm8ucG5nIiwiaWF0IjoxNzY5NTM5ODk2LCJleHAiOjE3NzIxMzE4OTZ9.Qn-wjSY8uLYGedjzQN_bGi1TvbFI-40ybSfztqIAGDg"
};

const state = {
    screen: 'home',
    currentQuestionIndex: 0,
    score: 0,
    selectedCoach: null,
    timer: 30,
    timerInterval: null
};

const screens = {
    home: document.getElementById('screen-home'),
    character: document.getElementById('screen-character'),
    trivia: document.getElementById('screen-trivia'),
    results: document.getElementById('screen-results')
};

// --- Initialization ---
function init() {
    renderHome();
    showScreen('home');
}

// --- Navigation ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
        target.classList.add('active');
        state.screen = screenId;
    }
}

// --- Renderers ---
function renderHome() {
    const container = document.getElementById('app');
    container.innerHTML = `
        <div id="screen-home" class="screen active">
            <div class="logo-container">
                <h1 class="logo">FIRE PASS™</h1>
            </div>
            <div class="hero-content">
                <h2>100 Latinos en USA dicen…</h2>
                <div class="host-img-container">
                    <img src="${assets.host}" alt="Host" class="host-img">
                    <div class="speech-bubble">¡Bienvenidos al reto!</div>
                </div>
            </div>
            <button class="btn btn-primary" id="btn-play">Jugar ahora</button>
        </div>
    `;
    document.getElementById('btn-play').onclick = () => {
        renderCharacterSelect();
        showScreen('character');
    };
}

function renderCharacterSelect() {
    const container = document.getElementById('app');
    const screen = document.createElement('div');
    screen.id = 'screen-character';
    screen.className = 'screen';
    screen.innerHTML = `
        <div class="selection-header">
            <h2>¿Quién sabe más de dinero?</h2>
            <p>Elige tu personaje para comenzar</p>
        </div>
        <div class="character-grid">
            <div class="char-card" data-coach="chico">
                <img src="${assets.chico}" alt="Coach Chico">
                <span>Coach FIRE CHICO</span>
            </div>
            <div class="char-card" data-coach="chica">
                <img src="${assets.chica}" alt="Coach Chica">
                <span>Coach FIRE CHICA</span>
            </div>
        </div>
        <button class="btn btn-primary" id="btn-start-game">Jugar sin registrarme</button>
    `;
    container.appendChild(screen);

    const cards = screen.querySelectorAll('.char-card');
    cards.forEach(card => {
        card.onclick = () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.selectedCoach = card.dataset.coach;
        };
    });

    document.getElementById('btn-start-game').onclick = () => {
        if (!state.selectedCoach) {
            alert("Por favor elige un personaje");
            return;
        }
        startTrivia();
    };
}

function startTrivia() {
    state.currentQuestionIndex = 0;
    state.score = 0;
    renderTrivia();
    showScreen('trivia');
    startTimer();
}

function renderTrivia() {
    const question = questions[state.currentQuestionIndex];
    const container = document.getElementById('app');
    let screen = document.getElementById('screen-trivia');

    if (!screen) {
        screen = document.createElement('div');
        screen.id = 'screen-trivia';
        screen.className = 'screen';
        container.appendChild(screen);
    }

    const hostMoodMsg = getHostMood(question.mood);

    screen.innerHTML = `
        <div class="trivia-header">
            <div class="question-count">Pregunta ${state.currentQuestionIndex + 1} de 10</div>
            <div class="timer-container">
                <div class="timer-circle" id="timer-val">${state.timer}</div>
            </div>
        </div>

        <div class="question-box">
            <p>${question.prompt}</p>
        </div>

        <div class="options-container">
            ${question.options.map(opt => `
                <button class="btn btn-option" data-key="${opt.key}">
                    <span class="option-key">${opt.key}</span>
                    <span class="option-text">${opt.text}</span>
                </button>
            `).join('')}
        </div>

        <div class="host-container mini">
            <img src="${assets.host}" alt="Host">
            <div class="speech-bubble">${hostMoodMsg}</div>
        </div>

        <div class="progress-bar-container">
            <div class="progress-fill" style="width: ${(state.currentQuestionIndex + 1) * 10}%"></div>
        </div>
    `;

    const btns = screen.querySelectorAll('.btn-option');
    btns.forEach(btn => {
        btn.onclick = () => handleAnswer(btn.dataset.key);
    });
}

function handleAnswer(key) {
    clearInterval(state.timerInterval);
    const correct = questions[state.currentQuestionIndex].correct;
    if (key === correct) {
        state.score++;
    }

    // Smooth transition to next question or results
    setTimeout(() => {
        nextQuestion();
    }, 500);
}

function nextQuestion() {
    state.currentQuestionIndex++;
    if (state.currentQuestionIndex < questions.length) {
        state.timer = 30;
        renderTrivia();
        startTimer();
    } else {
        renderResults();
        showScreen('results');
    }
}

function startTimer() {
    state.timer = 30;
    const timerEl = document.getElementById('timer-val');
    state.timerInterval = setInterval(() => {
        state.timer--;
        if (timerEl) timerEl.textContent = state.timer;
        if (state.timer <= 0) {
            clearInterval(state.timerInterval);
            nextQuestion();
        }
    }, 1000);
}

function renderResults() {
    const container = document.getElementById('app');
    const tier = getResultTier(state.score);
    const screen = document.createElement('div');
    screen.id = 'screen-results';
    screen.className = 'screen';

    screen.innerHTML = `
        <div class="results-content">
            <h1>¡Terminaste el reto!</h1>
            <p class="score-summary">Acertaste ${state.score} de 10</p>
            
            <div class="result-message">
                <h3>${tier.headline}</h3>
                <p>${tier.message.replace('{score}', state.score)}</p>
            </div>

            <div class="host-img-container large">
                <img src="${assets.host}" alt="Host">
            </div>

            <div class="cta-container">
                <button class="btn btn-primary" id="btn-primary-cta">${tier.primaryCta}</button>
                <button class="btn btn-secondary" id="btn-retry">Reintentar</button>
            </div>
        </div>
    `;
    container.appendChild(screen);

    document.getElementById('btn-retry').onclick = () => {
        location.reload(); // Quick reset
    };

    document.getElementById('btn-primary-cta').onclick = () => {
        if (state.score === 10) {
            alert("¡Premio mayor! Redirigiendo...");
        } else {
            alert("Descargando guía gratuita...");
        }
    };
}

// --- Helpers ---
function getHostMood(mood) {
    const options = {
        easy: ["¡Vamos!", "¡Eso fue fácil!", "¡Bien ahí!"],
        medium: ["Mmm… ¿seguro?", "Piénsalo bien…", "No te apresures…"],
        end: ["¡Terminaste!", "Ok… esto se puso interesante", "¡Vamos a ver tu puntaje!"]
    };
    const pool = options[mood] || options.easy;
    return pool[Math.floor(Math.random() * pool.length)];
}

function getResultTier(score) {
    if (score === 10) return {
        headline: "¡Premio mayor desbloqueado!",
        message: "10/10. Estás en el nivel top. Desbloqueaste el premio mayor.",
        primaryCta: "Ver premio mayor"
    };
    if (score >= 5) return {
        headline: "¡Buen puntaje!",
        message: "Tenemos una buena y una no tan buena noticia. Tus finanzas podrían estar en riesgo con ese ${score}/10… La buena noticia: puedes mejorar desde hoy.",
        primaryCta: "Descargar guía gratuita"
    };
    return {
        headline: "¡Puedes subir tu puntaje!",
        message: "Tenemos una buena y una no tan buena noticia. Con ${score}/10, podrías estar perdiendo dinero sin darte cuenta… La buena: puedes mejorar. ¿Reintentamos?",
        primaryCta: "Más información"
    };
}

// Start
init();
