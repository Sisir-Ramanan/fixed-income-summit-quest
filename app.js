/* ============================================================
   app.js  –  Fixed Income Summit Quest
   Complete game engine: state, logging, mountain, yield-curve
   interactive, quiz, survey, export, Google Sheets integration
   ============================================================ */

/* ---------- CONFIG ---------- */
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzWEJ3EophhhzU9CizlMghjHXearEptLBO7PoX2Q7rjSwh_ciGaAIybKV3J4xoELjko/exec';
const BASE_CAMP_ORDER = ['bond_pricing', 'ytm', 'forward_rates', 'duration', 'expectations_hypothesis'];
const BASE_CAMP_LABELS = {
  bond_pricing: 'Bond Pricing Basics',
  ytm: 'Yield Measures',
  forward_rates: 'Forward Rates & Yield Curves',
  duration: 'Duration & Risk',
  expectations_hypothesis: 'Expectations Hypothesis'
};
const BASE_CAMP_ICONS = {
  bond_pricing: '1',
  ytm: '2',
  forward_rates: '3',
  duration: '4',
  expectations_hypothesis: '5'
};

/* ---------- UTILITIES ---------- */
function generateId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return 'FI-' + id;
}

function now() { return Date.now(); }

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function typesetMath() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise().catch(() => {});
  } else {
    setTimeout(() => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(() => {});
      }
    }, 300);
  }
}

/* ---------- TREATMENT RANDOMIZATION ---------- */
function assignTreatment() {
  // Block randomization using localStorage counter for balance
  try {
    let counter = parseInt(localStorage.getItem('fisq_treatment_counter') || '0', 10);
    const condition = (counter % 2 === 0) ? 'explanation-before-attempt' : 'explanation-after-error';
    localStorage.setItem('fisq_treatment_counter', String(counter + 1));
    return condition;
  } catch (e) {
    // Fallback: random
    return Math.random() < 0.5 ? 'explanation-before-attempt' : 'explanation-after-error';
  }
}

/* ---------- SESSION STATE ---------- */
let session = {};

function initSession() {
  const anonymousId = generateId();
  const alias = document.getElementById('alias-input').value.trim() || 'Anonymous';
  const consentBtns = document.querySelectorAll('.toggle-btn');
  let consent = 'yes';
  consentBtns.forEach(b => { if (b.classList.contains('active')) consent = b.dataset.consent; });

  session = {
    anonymousId,
    alias,
    consent,
    treatmentCondition: assignTreatment(),
    startTime: now(),
    endTime: null,

    preQuiz: {
      startTime: null,
      endTime: null,
      score: 0,
      responses: []
    },

    game: {
      startTime: null,
      endTime: null,
      baseCampsCompleted: [],
      responses: []
    },

    postQuiz: {
      startTime: null,
      endTime: null,
      score: 0,
      responses: []
    },

    survey: {
      selfEfficacy: {},
      engagement: {},
      openText: {},
      selfReport: {}
    },

    conceptTimings: {}
  };

  // Initialize concept timings
  BASE_CAMP_ORDER.forEach(c => {
    session.conceptTimings[c] = { totalTimeMs: 0, questionsAttempted: 0 };
  });
}

/* ---------- CAMP PROGRESS STATE ---------- */
let campProgress = {};
// campProgress[conceptId] = { currentLevel: 0, completed: false, questions: [...] }
// Each question in camp: { ...questionData, retryCount: 0 }

let currentCamp = null;
let currentQuestion = null;
let questionDisplayedAt = null;

/* ---------- SCREEN NAVIGATION ---------- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ---------- QUIZ ENGINE ---------- */
let quizState = { phase: '', index: 0, questions: [], questionDisplayedAt: null };

function startQuiz(phase, questions) {
  quizState = {
    phase,
    index: 0,
    questions: [...questions],
    questionDisplayedAt: null
  };

  if (phase === 'pre') {
    session.preQuiz.startTime = now();
    showScreen('screen-prequiz');
  } else {
    session.postQuiz.startTime = now();
    showScreen('screen-postquiz');
  }

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const { phase, index, questions } = quizState;
  if (index >= questions.length) {
    finishQuiz();
    return;
  }

  const q = questions[index];
  const prefix = phase === 'pre' ? 'prequiz' : 'postquiz';

  // Progress
  document.getElementById(`${prefix}-progress`).textContent = `${index + 1} / ${questions.length}`;
  document.getElementById(`${prefix}-bar`).style.width = `${((index) / questions.length) * 100}%`;

  // Render question
  const area = document.getElementById(`${prefix}-question-area`);
  area.innerHTML = '';

  // Prompt
  const promptDiv = document.createElement('div');
  promptDiv.className = 'q-prompt';
  promptDiv.innerHTML = q.prompt;
  area.appendChild(promptDiv);

  // Formula if present
  if (q.formula) {
    const formulaDiv = document.createElement('div');
    formulaDiv.className = 'q-formula';
    formulaDiv.innerHTML = q.formula;
    area.appendChild(formulaDiv);
  }

  // Input
  if (q.type === 'numeric') {
    const wrap = document.createElement('div');
    wrap.className = 'q-input-wrap';
    wrap.innerHTML = `<input type="number" step="0.01" id="${prefix}-input" placeholder="Your answer" autocomplete="off"><span class="q-unit">${q.unit || ''}</span>`;
    area.appendChild(wrap);
    setTimeout(() => {
      const inp = document.getElementById(`${prefix}-input`);
      if (inp) inp.focus();
    }, 100);
  } else if (q.type === 'choice') {
    const list = document.createElement('div');
    list.className = 'choice-list';
    q.options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'choice-item';
      item.innerHTML = `<input type="radio" name="${prefix}-choice" value="${opt.value}" id="${prefix}-opt-${opt.value}"><label for="${prefix}-opt-${opt.value}">${opt.text}</label>`;
      item.addEventListener('click', () => {
        list.querySelectorAll('.choice-item').forEach(ci => ci.classList.remove('selected'));
        item.classList.add('selected');
        item.querySelector('input').checked = true;
      });
      list.appendChild(item);
    });
    area.appendChild(list);
  }

  // Show/hide buttons
  document.getElementById(`btn-${prefix}-submit`).classList.remove('hidden');
  document.getElementById(`btn-${prefix}-submit`).disabled = false;
  document.getElementById(`btn-${prefix}-next`).classList.add('hidden');

  // Hide feedback
  document.getElementById(`${prefix}-feedback`).classList.add('hidden');
  document.getElementById(`${prefix}-feedback`).className = 'feedback hidden';

  quizState.questionDisplayedAt = now();
  typesetMath();
}

function submitQuizAnswer() {
  const { phase, index, questions } = quizState;
  const q = questions[index];
  const prefix = phase === 'pre' ? 'prequiz' : 'postquiz';

  // Evaluate
  let userAnswer, isCorrect;

  if (q.type === 'numeric') {
    const input = document.getElementById(`${prefix}-input`);
    if (!input || input.value.trim() === '') { alert('Please enter a number.'); return; }
    const val = parseFloat(input.value);
    if (!isFinite(val)) { alert('Please enter a valid number.'); return; }
    userAnswer = val;
    isCorrect = Math.abs(val - q.answer) <= q.tolerance;
  } else {
    const picked = document.querySelector(`input[name="${prefix}-choice"]:checked`);
    if (!picked) { alert('Please select an option.'); return; }
    userAnswer = picked.value;
    isCorrect = picked.value === q.answer;
  }

  const timeSpent = now() - quizState.questionDisplayedAt;

  // Log
  const response = {
    questionId: q.id,
    conceptTag: q.conceptTag,
    displayedAt: quizState.questionDisplayedAt,
    submittedAt: now(),
    timeSpentMs: timeSpent,
    userAnswer,
    correctAnswer: q.answer,
    isCorrect,
    retryAttempts: 0
  };

  if (phase === 'pre') {
    session.preQuiz.responses.push(response);
    if (isCorrect) session.preQuiz.score++;
  } else {
    session.postQuiz.responses.push(response);
    if (isCorrect) session.postQuiz.score++;
  }

  // Update concept timing
  if (session.conceptTimings[q.conceptTag]) {
    session.conceptTimings[q.conceptTag].totalTimeMs += timeSpent;
    session.conceptTimings[q.conceptTag].questionsAttempted++;
  }

  // Show feedback
  const fb = document.getElementById(`${prefix}-feedback`);
  fb.classList.remove('hidden');
  if (isCorrect) {
    fb.className = 'feedback ok';
    fb.textContent = 'Correct!';
  } else {
    fb.className = 'feedback bad';
    fb.innerHTML = `Incorrect. The correct answer is <strong>${q.answer}${q.unit ? ' ' + q.unit : ''}</strong>.`;
  }

  // Disable submit, show next
  document.getElementById(`btn-${prefix}-submit`).classList.add('hidden');
  document.getElementById(`btn-${prefix}-next`).classList.remove('hidden');
}

function nextQuizQuestion() {
  quizState.index++;
  renderQuizQuestion();
}

function finishQuiz() {
  const { phase } = quizState;
  if (phase === 'pre') {
    session.preQuiz.endTime = now();
    // Start game phase
    session.game.startTime = now();
    initCampProgress();
    showScreen('screen-mountain');
    renderMountain();
  } else {
    session.postQuiz.endTime = now();
    showScreen('screen-survey');
    renderSurvey();
  }
}

/* ---------- MOUNTAIN MAP ---------- */
function initCampProgress() {
  campProgress = {};
  BASE_CAMP_ORDER.forEach(conceptId => {
    const questions = GAME_QUESTIONS[conceptId] || [];
    campProgress[conceptId] = {
      currentLevel: 0,
      completed: false,
      questions: questions.map(q => ({ ...q, retryCount: 0 }))
    };
  });
}

function renderMountain() {
  const completed = session.game.baseCampsCompleted.length;
  document.getElementById('camps-completed').textContent = `${completed} / 5 camps`;

  // Render SVG mountain
  renderMountainSVG();

  // Render camp buttons
  const container = document.getElementById('camp-buttons');
  container.innerHTML = '';

  BASE_CAMP_ORDER.forEach((conceptId, idx) => {
    const camp = campProgress[conceptId];
    const btn = document.createElement('button');
    btn.className = 'camp-btn';
    if (camp.completed) btn.classList.add('completed');

    const totalQ = camp.questions.length;
    const doneQ = camp.currentLevel;
    let statusText = camp.completed ? 'Completed' : `${doneQ} / ${totalQ} levels`;

    btn.innerHTML = `
      <span class="camp-number">${camp.completed ? '\u2705' : BASE_CAMP_ICONS[conceptId]}</span>
      <span class="camp-name">${BASE_CAMP_LABELS[conceptId]}</span>
      <span class="camp-status">${statusText}</span>
    `;

    if (!camp.completed) {
      btn.addEventListener('click', () => enterBaseCamp(conceptId));
    }

    container.appendChild(btn);
  });

  // Summit button
  const summitBtn = document.getElementById('btn-summit');
  if (completed === 5) {
    summitBtn.classList.remove('hidden');
  } else {
    summitBtn.classList.add('hidden');
  }
}

function renderMountainSVG() {
  const container = document.getElementById('mountain-svg-container');
  const completed = session.game.baseCampsCompleted;
  const total = 5;

  // Mountain SVG with path and base camps
  const w = 700, h = 400;
  // Camp positions on the mountain (x, y)
  const positions = [
    { x: 100, y: 340 },  // Camp 1: Bond Pricing
    { x: 220, y: 280 },  // Camp 2: Yield Measures
    { x: 380, y: 220 },  // Camp 3: Forward Rates
    { x: 510, y: 150 },  // Camp 4: Duration
    { x: 590, y: 90 },   // Camp 5: Expectations Hypothesis
  ];
  const summit = { x: 520, y: 40 };

  let pathD = `M 50 370`;
  positions.forEach(p => { pathD += ` L ${p.x} ${p.y}`; });
  pathD += ` L ${summit.x} ${summit.y}`;

  let campsSvg = '';
  positions.forEach((p, i) => {
    const conceptId = BASE_CAMP_ORDER[i];
    const isDone = completed.includes(conceptId);
    const fill = isDone ? '#0f7f3e' : '#d4dbe6';
    const textFill = isDone ? '#fff' : '#3a4557';

    campsSvg += `
      <circle cx="${p.x}" cy="${p.y}" r="22" fill="${fill}" stroke="#fff" stroke-width="3"/>
      <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="${textFill}">${isDone ? '\u2713' : i + 1}</text>
      <text x="${p.x}" y="${p.y + 40}" text-anchor="middle" font-size="10" fill="#5a6473">${BASE_CAMP_LABELS[conceptId].split(' ')[0]}</text>
    `;
  });

  // Summit marker
  const allDone = completed.length === total;
  campsSvg += `
    <polygon points="${summit.x},${summit.y - 18} ${summit.x - 14},${summit.y + 10} ${summit.x + 14},${summit.y + 10}" fill="${allDone ? '#f0c040' : '#c8cdd8'}" stroke="#fff" stroke-width="2"/>
    <text x="${summit.x}" y="${summit.y + 4}" text-anchor="middle" font-size="10" font-weight="bold" fill="${allDone ? '#5a3800' : '#888'}">\u26F0</text>
  `;

  // Climber position: on the last completed camp, or at start
  let climberPos = { x: 50, y: 350 };
  if (completed.length > 0) {
    const lastIdx = Math.max(...completed.map(c => BASE_CAMP_ORDER.indexOf(c)));
    climberPos = positions[lastIdx];
  }
  if (allDone) climberPos = summit;

  campsSvg += `
    <circle cx="${climberPos.x}" cy="${climberPos.y - 30}" r="8" fill="#d96d0f" stroke="#fff" stroke-width="2">
      <animate attributeName="cy" values="${climberPos.y - 30};${climberPos.y - 34};${climberPos.y - 30}" dur="1.5s" repeatCount="indefinite"/>
    </circle>
  `;

  // Mountain shape background
  const mountainBg = `
    <polygon points="50,370 200,180 350,120 480,60 600,30 700,80 700,370" fill="url(#mountainGrad)" opacity="0.15"/>
    <defs>
      <linearGradient id="mountainGrad" x1="0" y1="1" x2="0.5" y2="0">
        <stop offset="0%" stop-color="#4a7c6f"/>
        <stop offset="70%" stop-color="#8fb3a6"/>
        <stop offset="100%" stop-color="#e8e8e8"/>
      </linearGradient>
    </defs>
  `;

  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;">
      ${mountainBg}
      <path d="${pathD}" fill="none" stroke="#b0b8c4" stroke-width="3" stroke-dasharray="8 6"/>
      ${campsSvg}
    </svg>
  `;
}

/* ---------- BASE CAMP (GAME QUESTIONS) ---------- */
function enterBaseCamp(conceptId) {
  currentCamp = conceptId;
  const camp = campProgress[conceptId];

  document.getElementById('basecamp-title').textContent = BASE_CAMP_LABELS[conceptId];
  document.getElementById('btn-back-mountain').onclick = () => {
    showScreen('screen-mountain');
    renderMountain();
  };

  renderBaseCampQuestion();
  showScreen('screen-basecamp');
}

function renderBaseCampQuestion() {
  const camp = campProgress[currentCamp];
  const levelIdx = camp.currentLevel;
  const totalLevels = camp.questions.length;

  if (levelIdx >= totalLevels) {
    // Camp completed
    camp.completed = true;
    if (!session.game.baseCampsCompleted.includes(currentCamp)) {
      session.game.baseCampsCompleted.push(currentCamp);
    }
    showScreen('screen-mountain');
    renderMountain();

    // Check if all camps done
    if (session.game.baseCampsCompleted.length === 5) {
      session.game.endTime = now();
      setTimeout(() => {
        showScreen('screen-summit');
      }, 500);
    }
    return;
  }

  currentQuestion = camp.questions[levelIdx];
  const levelNames = ['Recall', 'Application', 'Analysis'];
  const levelName = levelNames[levelIdx] || `Level ${levelIdx + 1}`;

  document.getElementById('basecamp-level-label').textContent = `${levelName} \u2014 Level ${levelIdx + 1} of ${totalLevels}`;
  document.getElementById('basecamp-bar').style.width = `${(levelIdx / totalLevels) * 100}%`;

  // Clear areas
  const beforeBox = document.getElementById('basecamp-explanation-before');
  const afterBox = document.getElementById('basecamp-explanation-after');
  const feedbackEl = document.getElementById('basecamp-feedback');
  beforeBox.classList.add('hidden');
  afterBox.classList.add('hidden');
  feedbackEl.classList.add('hidden');
  feedbackEl.className = 'feedback hidden';

  // Treatment: show explanation before attempt?
  if (session.treatmentCondition === 'explanation-before-attempt' && currentQuestion.conceptNote) {
    beforeBox.classList.remove('hidden');
    beforeBox.innerHTML = `<h4>Concept Note</h4><p>${currentQuestion.conceptNote}</p>`;
  }

  // Render question
  const area = document.getElementById('basecamp-question-area');
  area.innerHTML = '';

  const promptDiv = document.createElement('div');
  promptDiv.className = 'q-prompt';
  promptDiv.innerHTML = currentQuestion.prompt;
  area.appendChild(promptDiv);

  if (currentQuestion.formula) {
    const formulaDiv = document.createElement('div');
    formulaDiv.className = 'q-formula';
    formulaDiv.innerHTML = currentQuestion.formula;
    area.appendChild(formulaDiv);
  }

  // Interactive yield curve?
  const ycContainer = document.getElementById('interactive-yc-container');
  if (currentQuestion.type === 'interactive') {
    ycContainer.classList.remove('hidden');
    initYieldCurveInteractive();
  } else {
    ycContainer.classList.add('hidden');
  }

  // Input area
  if (currentQuestion.type === 'numeric' || currentQuestion.type === 'interactive') {
    const wrap = document.createElement('div');
    wrap.className = 'q-input-wrap';
    wrap.innerHTML = `<input type="number" step="0.01" id="basecamp-input" placeholder="Your answer" autocomplete="off"><span class="q-unit">${currentQuestion.unit || ''}</span>`;
    area.appendChild(wrap);
    setTimeout(() => {
      const inp = document.getElementById('basecamp-input');
      if (inp) inp.focus();
    }, 100);
  } else if (currentQuestion.type === 'choice') {
    const list = document.createElement('div');
    list.className = 'choice-list';
    currentQuestion.options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'choice-item';
      item.innerHTML = `<input type="radio" name="basecamp-choice" value="${opt.value}" id="bc-opt-${opt.value}"><label for="bc-opt-${opt.value}">${opt.text}</label>`;
      item.addEventListener('click', () => {
        list.querySelectorAll('.choice-item').forEach(ci => ci.classList.remove('selected'));
        item.classList.add('selected');
        item.querySelector('input').checked = true;
      });
      list.appendChild(item);
    });
    area.appendChild(list);
  }

  // Buttons
  document.getElementById('btn-basecamp-submit').classList.remove('hidden');
  document.getElementById('btn-basecamp-submit').disabled = false;
  document.getElementById('btn-basecamp-next').classList.add('hidden');

  questionDisplayedAt = now();
  typesetMath();
}

function submitBaseCampAnswer() {
  if (!currentQuestion) return;
  const camp = campProgress[currentCamp];
  const q = currentQuestion;

  let userAnswer, isCorrect;

  if (q.type === 'numeric' || q.type === 'interactive') {
    const input = document.getElementById('basecamp-input');
    if (!input || input.value.trim() === '') { alert('Please enter a number.'); return; }
    const val = parseFloat(input.value);
    if (!isFinite(val)) { alert('Please enter a valid number.'); return; }
    userAnswer = val;
    isCorrect = Math.abs(val - q.answer) <= q.tolerance;
  } else {
    const picked = document.querySelector('input[name="basecamp-choice"]:checked');
    if (!picked) { alert('Please select an option.'); return; }
    userAnswer = picked.value;
    isCorrect = picked.value === q.answer;
  }

  const timeSpent = now() - questionDisplayedAt;

  // Log attempt
  q.retryCount = (q.retryCount || 0) + (isCorrect ? 0 : 1);

  const response = {
    questionId: q.id,
    conceptTag: q.conceptTag,
    baseCamp: currentCamp,
    difficultyLevel: q.level,
    displayedAt: questionDisplayedAt,
    submittedAt: now(),
    timeSpentMs: timeSpent,
    userAnswer,
    correctAnswer: q.answer,
    isCorrect,
    retryAttempts: q.retryCount
  };
  session.game.responses.push(response);

  // Update concept timing
  if (session.conceptTimings[q.conceptTag]) {
    session.conceptTimings[q.conceptTag].totalTimeMs += timeSpent;
    session.conceptTimings[q.conceptTag].questionsAttempted++;
  }

  // Feedback
  const feedbackEl = document.getElementById('basecamp-feedback');
  feedbackEl.classList.remove('hidden');

  if (isCorrect) {
    feedbackEl.className = 'feedback ok';
    feedbackEl.innerHTML = `<strong>Correct!</strong> ${q.explanation || ''}`;

    // Celebrate animation
    const card = document.querySelector('#screen-basecamp .card');
    card.classList.add('anim-celebrate');
    setTimeout(() => card.classList.remove('anim-celebrate'), 600);

    // Advance level
    camp.currentLevel++;

    // Update bar
    document.getElementById('basecamp-bar').style.width = `${(camp.currentLevel / camp.questions.length) * 100}%`;

  } else {
    feedbackEl.className = 'feedback bad';
    feedbackEl.innerHTML = `<strong>Not quite.</strong> The correct answer is <strong>${q.answer}${q.unit ? ' ' + q.unit : ''}</strong>. ${q.explanation || ''}`;

    // Slide-down animation
    const card = document.querySelector('#screen-basecamp .card');
    card.classList.add('anim-slide-down');
    setTimeout(() => card.classList.remove('anim-slide-down'), 600);

    // Treatment: show explanation after error?
    if (session.treatmentCondition === 'explanation-after-error' && q.conceptNote) {
      const afterBox = document.getElementById('basecamp-explanation-after');
      afterBox.classList.remove('hidden');
      afterBox.innerHTML = `<h4>Concept Note</h4><p>${q.conceptNote}</p>`;
    }
  }

  // Hide submit, show next
  document.getElementById('btn-basecamp-submit').classList.add('hidden');
  document.getElementById('btn-basecamp-next').classList.remove('hidden');
}

function nextBaseCampQuestion() {
  renderBaseCampQuestion();
}

/* ---------- INTERACTIVE YIELD CURVE ---------- */
function initYieldCurveInteractive() {
  const sliders = [
    document.getElementById('yc-slider-1'),
    document.getElementById('yc-slider-2'),
    document.getElementById('yc-slider-3')
  ];
  const vals = [
    document.getElementById('yc-val-1'),
    document.getElementById('yc-val-2'),
    document.getElementById('yc-val-3')
  ];

  // Reset sliders
  sliders[0].value = '3.0'; vals[0].textContent = '3.0';
  sliders[1].value = '3.5'; vals[1].textContent = '3.5';
  sliders[2].value = '4.0'; vals[2].textContent = '4.0';

  function update() {
    const s = sliders.map((sl, i) => {
      vals[i].textContent = parseFloat(sl.value).toFixed(1);
      return parseFloat(sl.value);
    });
    drawYieldCurve(s);
  }

  sliders.forEach(sl => {
    sl.removeEventListener('input', update);
    sl.addEventListener('input', update);
  });

  update();
}

function drawYieldCurve(spotRates) {
  // Draw spot curve
  const spotCanvas = document.getElementById('yc-spot-canvas');
  const fwdCanvas = document.getElementById('yc-forward-canvas');

  drawChart(spotCanvas, [1, 2, 3], spotRates, 'Yield (%)', '#1a6b5a', 'Spot Rates');

  // Calculate forward rates
  const s1 = spotRates[0] / 100;
  const s2 = spotRates[1] / 100;
  const s3 = spotRates[2] / 100;

  const f01 = s1 * 100; // forward from 0 to 1 is just the 1yr spot
  const f12 = (Math.pow(1 + s2, 2) / (1 + s1) - 1) * 100;
  const f23 = (Math.pow(1 + s3, 3) / Math.pow(1 + s2, 2) - 1) * 100;

  drawChart(fwdCanvas, [1, 2, 3], [f01, f12, f23], 'Rate (%)', '#d96d0f', 'Forward Rates', true);
}

function drawChart(canvas, labels, data, yLabel, color, title, isBars) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const pad = { left: 50, right: 20, top: 25, bottom: 35 };

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  // Y range
  const minVal = Math.min(0, ...data);
  const maxVal = Math.max(1, ...data) * 1.15;
  const yRange = maxVal - minVal || 1;

  const toX = (i) => pad.left + (i / (labels.length - 1 || 1)) * innerW;
  const toY = (v) => pad.top + ((maxVal - v) / yRange) * innerH;

  // Grid lines
  ctx.strokeStyle = '#e6e9ef';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (i / 4) * innerH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();

    ctx.fillStyle = '#647186';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    const val = (maxVal - (i / 4) * yRange).toFixed(1);
    ctx.fillText(val, pad.left - 6, y + 3);
  }

  // Axes
  ctx.strokeStyle = '#8d98a9';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, H - pad.bottom);
  ctx.lineTo(W - pad.right, H - pad.bottom);
  ctx.stroke();

  if (isBars) {
    // Bar chart
    const barW = Math.min(40, innerW / labels.length * 0.6);
    const baseY = toY(0);
    data.forEach((v, i) => {
      const x = toX(i) - barW / 2;
      const y = toY(v);
      ctx.fillStyle = color;
      ctx.fillRect(x, Math.min(y, baseY), barW, Math.abs(baseY - y));

      // Value label
      ctx.fillStyle = '#2a3140';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(v.toFixed(2) + '%', toX(i), y - 6);
    });
  } else {
    // Line + dots
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = toX(i);
      const y = toY(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    data.forEach((v, i) => {
      const x = toX(i);
      const y = toY(v);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Value label
      ctx.fillStyle = '#2a3140';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(v.toFixed(1) + '%', x, y - 10);
    });
  }

  // X labels
  ctx.fillStyle = '#4a5568';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((lbl, i) => {
    ctx.fillText(lbl + 'Y', toX(i), H - pad.bottom + 16);
  });

  // Y label
  ctx.fillStyle = '#5a6473';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.save();
  ctx.translate(12, pad.top + innerH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();
}

/* ---------- SURVEY ---------- */
function renderSurvey() {
  // Self-efficacy
  const efficacyContainer = document.getElementById('survey-efficacy');
  efficacyContainer.innerHTML = '';
  SURVEY_CONFIG.selfEfficacy.forEach(item => {
    efficacyContainer.appendChild(createLikertRow(item.text, `se_${item.conceptTag}`, 5));
  });

  // Engagement
  const engagementContainer = document.getElementById('survey-engagement');
  engagementContainer.innerHTML = '';
  SURVEY_CONFIG.engagement.forEach(item => {
    engagementContainer.appendChild(createLikertRow(item.text, `eng_${item.id}`, 5));
  });

  // Self-report understanding (1-10)
  const selfReportContainer = document.getElementById('survey-self-report');
  selfReportContainer.innerHTML = '';
  SURVEY_CONFIG.selfReport.forEach(item => {
    selfReportContainer.appendChild(createScaleRow(item.text, `sr_${item.id}`, 10));
  });

  // Open text
  const openContainer = document.getElementById('survey-open');
  openContainer.innerHTML = '';
  SURVEY_CONFIG.openText.forEach(item => {
    const div = document.createElement('div');
    div.className = 'survey-textarea';
    div.innerHTML = `<label for="open_${item.id}">${item.text}</label><textarea id="open_${item.id}" rows="3" placeholder="Type here..."></textarea>`;
    openContainer.appendChild(div);
  });
}

function createLikertRow(text, name, max) {
  const row = document.createElement('div');
  row.className = 'likert-row';

  const textSpan = document.createElement('span');
  textSpan.className = 'likert-text';
  textSpan.textContent = text;
  row.appendChild(textSpan);

  const options = document.createElement('div');
  options.className = 'likert-options';
  for (let i = 1; i <= max; i++) {
    const lbl = document.createElement('label');
    lbl.innerHTML = `<input type="radio" name="${name}" value="${i}"><span class="likert-num">${i}</span>`;
    options.appendChild(lbl);
  }
  row.appendChild(options);
  return row;
}

function createScaleRow(text, name, max) {
  const row = document.createElement('div');
  row.className = 'scale-row';

  const textSpan = document.createElement('span');
  textSpan.className = 'scale-text';
  textSpan.textContent = text;
  row.appendChild(textSpan);

  const options = document.createElement('div');
  options.className = 'scale-options';
  for (let i = 1; i <= max; i++) {
    const lbl = document.createElement('label');
    lbl.innerHTML = `<input type="radio" name="${name}" value="${i}"><span class="scale-num">${i}</span>`;
    options.appendChild(lbl);
  }
  row.appendChild(options);
  return row;
}

function collectSurvey() {
  // Self-efficacy
  SURVEY_CONFIG.selfEfficacy.forEach(item => {
    const checked = document.querySelector(`input[name="se_${item.conceptTag}"]:checked`);
    session.survey.selfEfficacy[item.conceptTag] = checked ? parseInt(checked.value) : null;
  });

  // Engagement
  SURVEY_CONFIG.engagement.forEach(item => {
    const checked = document.querySelector(`input[name="eng_${item.id}"]:checked`);
    session.survey.engagement[item.id] = checked ? parseInt(checked.value) : null;
  });

  // Self-report
  SURVEY_CONFIG.selfReport.forEach(item => {
    const checked = document.querySelector(`input[name="sr_${item.id}"]:checked`);
    session.survey.selfReport[item.id] = checked ? parseInt(checked.value) : null;
  });

  // Open text
  SURVEY_CONFIG.openText.forEach(item => {
    const textarea = document.getElementById(`open_${item.id}`);
    session.survey.openText[item.id] = textarea ? textarea.value.trim() : '';
  });
}

/* ---------- RESULTS ---------- */
function showResults() {
  session.endTime = now();

  const preScore = session.preQuiz.score;
  const postScore = session.postQuiz.score;
  const gain = postScore - preScore;
  const totalMs = session.endTime - session.startTime;
  const totalMin = Math.round(totalMs / 60000);

  document.getElementById('res-pre').textContent = `${preScore} / ${PRE_QUIZ.length}`;
  document.getElementById('res-post').textContent = `${postScore} / ${POST_QUIZ.length}`;
  document.getElementById('res-gain').textContent = (gain >= 0 ? '+' : '') + gain;
  document.getElementById('res-time').textContent = `${totalMin} min`;

  // Per-concept breakdown
  const breakdownEl = document.getElementById('concept-breakdown');
  breakdownEl.innerHTML = '';

  BASE_CAMP_ORDER.forEach(conceptId => {
    const label = BASE_CAMP_LABELS[conceptId];
    // Find pre/post scores for this concept
    const preR = session.preQuiz.responses.find(r => r.conceptTag === conceptId);
    const postR = session.postQuiz.responses.find(r => r.conceptTag === conceptId);
    const preOk = preR && preR.isCorrect ? 1 : 0;
    const postOk = postR && postR.isCorrect ? 1 : 0;
    const g = postOk - preOk;

    const row = document.createElement('div');
    row.className = 'concept-row';
    const gainClass = g > 0 ? 'positive' : g < 0 ? 'negative' : 'neutral';
    row.innerHTML = `
      <span class="concept-name">${escapeHtml(label)}</span>
      <span class="concept-scores">
        <span class="score-pre">Pre: ${preOk}/1</span>
        <span class="score-post">Post: ${postOk}/1</span>
        <span class="score-gain ${gainClass}">${g > 0 ? '+' : ''}${g}</span>
      </span>
    `;
    breakdownEl.appendChild(row);
  });

  // Status message
  const statusEl = document.getElementById('results-status');
  if (session.consent === 'yes') {
    submitToGoogleSheets();
    statusEl.innerHTML = '<strong>Data submission:</strong> Your anonymous data is being sent to the research database. You can also download a local copy.';
  } else {
    statusEl.innerHTML = '<strong>Data not submitted:</strong> You chose not to consent. Your data stays only in your browser. You can download a local copy for your own records.';
  }

  showScreen('screen-results');
}

/* ---------- DATA EXPORT ---------- */
function buildExportData() {
  return {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    anonymousId: session.anonymousId,
    alias: session.alias,
    consent: session.consent,
    treatmentCondition: session.treatmentCondition,
    sessionStartTime: session.startTime,
    sessionEndTime: session.endTime,
    totalDurationMs: session.endTime - session.startTime,

    preQuiz: {
      startTime: session.preQuiz.startTime,
      endTime: session.preQuiz.endTime,
      durationMs: session.preQuiz.endTime - session.preQuiz.startTime,
      score: session.preQuiz.score,
      total: PRE_QUIZ.length,
      responses: session.preQuiz.responses
    },

    game: {
      startTime: session.game.startTime,
      endTime: session.game.endTime,
      durationMs: session.game.endTime ? session.game.endTime - session.game.startTime : null,
      baseCampsCompleted: session.game.baseCampsCompleted,
      responses: session.game.responses
    },

    postQuiz: {
      startTime: session.postQuiz.startTime,
      endTime: session.postQuiz.endTime,
      durationMs: session.postQuiz.endTime - session.postQuiz.startTime,
      score: session.postQuiz.score,
      total: POST_QUIZ.length,
      responses: session.postQuiz.responses
    },

    survey: session.survey,
    conceptTimings: session.conceptTimings
  };
}

function downloadJSON() {
  const data = buildExportData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fisq_${session.anonymousId}_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function submitToGoogleSheets() {
  if (session.consent !== 'yes') return;
  if (GOOGLE_SHEETS_URL.includes('YOUR_DEPLOYMENT_ID_HERE')) {
    console.log('Google Sheets URL not configured. Skipping submission.');
    return;
  }

  const data = buildExportData();

  try {
    fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => {
      console.log('Data submitted to Google Sheets.');
    }).catch(err => {
      console.warn('Google Sheets submission failed:', err);
    });
  } catch (e) {
    console.warn('Google Sheets submission error:', e);
  }
}

/* ---------- EVENT LISTENERS ---------- */
document.addEventListener('DOMContentLoaded', () => {

  // Consent toggle
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Start button
  document.getElementById('btn-start').addEventListener('click', () => {
    initSession();
    startQuiz('pre', PRE_QUIZ);
  });

  // Pre-quiz submit/next
  document.getElementById('btn-prequiz-submit').addEventListener('click', () => submitQuizAnswer());
  document.getElementById('btn-prequiz-next').addEventListener('click', () => nextQuizQuestion());

  // Post-quiz submit/next
  document.getElementById('btn-postquiz-submit').addEventListener('click', () => submitQuizAnswer());
  document.getElementById('btn-postquiz-next').addEventListener('click', () => nextQuizQuestion());

  // Base camp submit/next
  document.getElementById('btn-basecamp-submit').addEventListener('click', () => submitBaseCampAnswer());
  document.getElementById('btn-basecamp-next').addEventListener('click', () => nextBaseCampQuestion());

  // Summit -> post-quiz
  document.getElementById('btn-start-postquiz').addEventListener('click', () => {
    startQuiz('post', POST_QUIZ);
  });

  // Summit button on mountain
  document.getElementById('btn-summit').addEventListener('click', () => {
    session.game.endTime = now();
    showScreen('screen-summit');
  });

  // Survey submit
  document.getElementById('btn-survey-submit').addEventListener('click', () => {
    collectSurvey();
    showResults();
  });

  // Download
  document.getElementById('btn-download').addEventListener('click', () => downloadJSON());
});
