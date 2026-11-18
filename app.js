firebase.initializeApp(APP_CONFIG.firebaseConfig);
const db = firebase.firestore();

const urlParams = new URLSearchParams(window.location.search);
let studentId = urlParams.get("aluno");

if (!studentId) {
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  if (pathSegments.length > 1) {
    studentId = pathSegments[0];
  } else {
    studentId = APP_CONFIG.defaultStudentId;
  }
}
studentId = studentId.trim();

const isTeacherMode = urlParams.get("teacher") === "true";

document.getElementById("display-student-name").textContent = studentId;
if (isTeacherMode) {
  document.getElementById("teacher-dashboard").classList.remove("hidden");
  document.getElementById("teacher-student-label").textContent = studentId;
}

const EXERCISES = [
  {
    id: "m1_q1",
    module: 1,
    tenseFocus: "Present Perfect vs Simple Past",
    context: "IELTS Writing Task 1 (Line Graph)",
    prompt: "Between 2010 and 2018, renewable energy consumption in Germany _______ steadily, before stabilizing at 38%.",
    options: ["has increased", "increased", "was increasing", "had increased"],
    answer: "increased",
    explanation: "The time period (2010–2018) is completely finished in the past with no connection to the present. In Task 1, completed historical intervals always require the Simple Past."
  },
  {
    id: "m1_q2",
    module: 1,
    tenseFocus: "Present Perfect vs Simple Past",
    context: "IELTS Writing Task 2 (Globalization Essay)",
    prompt: "Over the past two decades, rapid urbanization _______ significant strain on municipal infrastructure across developing nations.",
    options: ["placed", "was placing", "has placed", "had placed"],
    answer: "has placed",
    explanation: "'Over the past two decades' describes an unfinished timeframe extending up to the present moment, requiring the Present Perfect."
  },
  {
    id: "m1_q3",
    module: 1,
    tenseFocus: "Past Perfect vs Simple Past",
    context: "Academic Research Methodology",
    prompt: "By the time the longitudinal study concluded in 2023, nearly 30% of the original participants _______ from the program.",
    options: ["withdrew", "have withdrawn", "were withdrawing", "had withdrawn"],
    answer: "had withdrawn",
    explanation: "'By the time + Simple Past' establishes a past benchmark. The withdrawal happened earlier than the conclusion of the study, requiring the Past Perfect."
  },
  {
    id: "m1_q4",
    module: 1,
    tenseFocus: "Past Continuous vs Simple Past",
    context: "Case Study Report",
    prompt: "While the engineers _______ the structural integrity of the bridge, an unexpected seismic tremor occurred.",
    options: ["assessed", "had assessed", "were assessing", "have assessed"],
    answer: "were assessing",
    explanation: "The Past Continuous sets an ongoing background action ('were assessing') that was interrupted by a sudden single event in the Simple Past ('occurred')."
  },
  {
    id: "m1_q5",
    module: 1,
    tenseFocus: "Present Perfect vs Past Perfect",
    context: "Literature Review",
    prompt: "Prior to the publication of Smith's seminal paper in 2019, few scholars _______ the correlation between sleep deprivation and fiscal decision-making.",
    options: ["have investigated", "had investigated", "were investigating", "investigate"],
    answer: "had investigated",
    explanation: "'Prior to + past event (2019)' shifts the reference point into the past. An action occurring before that past point takes the Past Perfect."
  },
  {
    id: "m1_q6",
    module: 1,
    tenseFocus: "Present Perfect (Unfinished Result)",
    context: "IELTS Speaking Part 3",
    prompt: "Although governments _______ numerous policies to curb carbon emissions, global temperatures continue to rise.",
    options: ["enacted", "had enacted", "have enacted", "were enacting"],
    answer: "have enacted",
    explanation: "The focus is on cumulative past actions up to now whose present outcome is being evaluated in the main clause ('continue to rise')."
  },
  {
    id: "m1_q7",
    module: 1,
    tenseFocus: "Past Continuous (Parallel Trends)",
    context: "Historical Economic Analysis",
    prompt: "During the late 1990s, while traditional print media _______ a sharp decline in readership, digital news portals were gaining momentum.",
    options: ["experienced", "had experienced", "has experienced", "was experiencing"],
    answer: "was experiencing",
    explanation: "Two simultaneous, ongoing developments in a specific past period ('During the late 1990s') are effectively contrasted using Past Continuous in both clauses."
  },
  {
    id: "m1_q8",
    module: 1,
    tenseFocus: "Past Perfect (Cause in the Past)",
    context: "Environmental Science Report",
    prompt: "The coastal ecosystem recovered far more slowly than anticipated because industrial runoff _______ the local soil for decades.",
    options: ["contaminated", "has contaminated", "had contaminated", "was contaminating"],
    answer: "had contaminated",
    explanation: "The contamination occurred prior to the recovery period being analyzed in the Simple Past ('recovered'), explaining the cause."
  },
  {
    id: "m1_q9",
    module: 1,
    tenseFocus: "Present Perfect vs Simple Past",
    context: "IELTS Writing Task 1 (Trend up to Present)",
    prompt: "Since the introduction of congestion charges in 2003, inner-city traffic volume _______ by approximately 25%.",
    options: ["fell", "has fallen", "had fallen", "was falling"],
    answer: "has fallen",
    explanation: "'Since + specific point in the past (2003)' connects a past starting point directly to the present, demanding the Present Perfect."
  },
  {
    id: "m1_q10",
    module: 1,
    tenseFocus: "Past Perfect vs Past Continuous",
    context: "Sociological Survey",
    prompt: "When the census data was finally released, analysts realized that urban migration _______ at twice the projected rate.",
    options: ["had been occurring", "has occurred", "occurred", "was occur"],
    answer: "had been occurring",
    explanation: "An ongoing process taking place before a past realization ('realized') uses the Past Perfect (Continuous) to emphasize duration prior to that past point."
  },
  {
    id: "m2_q1",
    module: 2,
    tenseFocus: "Present Perfect",
    context: "Type the exact verb form (active or passive)",
    prompt: "In recent years, artificial intelligence _______ (transform) how medical diagnostics are conducted.",
    acceptedAnswers: ["has transformed"],
    explanation: "'In recent years' is a classic IELTS marker for the Present Perfect ('has transformed')."
  },
  {
    id: "m2_q2",
    module: 2,
    tenseFocus: "Past Perfect",
    context: "Type the exact verb form (include adverb placement)",
    prompt: "By the time the rescue team arrived at the remote village, the floodwaters _______ (already / recede).",
    acceptedAnswers: ["had already receded"],
    explanation: "The receding happened before the arrival in the past. Notice the standard placement of 'already' between 'had' and the past participle."
  },
  {
    id: "m2_q3",
    module: 2,
    tenseFocus: "Simple Past (Passive)",
    context: "Type the exact verb form (active or passive)",
    prompt: "In 2015, a comprehensive survey _______ (conduct) to evaluate public attitudes toward nuclear energy.",
    acceptedAnswers: ["was conducted"],
    explanation: "Specific past year ('In 2015') + passive subject ('a survey') requires Simple Past Passive ('was conducted')."
  },
  {
    id: "m2_q4",
    module: 2,
    tenseFocus: "Past Continuous",
    context: "Type the exact verb form",
    prompt: "At 9:00 AM yesterday, the committee members _______ (still / deliberate) over the proposed budget cuts.",
    acceptedAnswers: ["were still deliberating"],
    explanation: "An action in progress at a specific point in the past ('At 9:00 AM yesterday') requires Past Continuous."
  },
  {
    id: "m2_q5",
    module: 2,
    tenseFocus: "Present Perfect (Negative)",
    context: "Type the exact verb form (full or contracted)",
    prompt: "Despite decades of research, scientists _______ (not / find) a definitive cure for all forms of dementia yet.",
    acceptedAnswers: ["have not found", "haven't found"],
    explanation: "'Despite decades of research' + 'yet' indicates an incomplete action up to the present: Present Perfect Negative."
  },
  {
    id: "m2_q6",
    module: 2,
    tenseFocus: "Past Perfect (Negative)",
    context: "Type the exact verb form (full or contracted)",
    prompt: "Most respondents admitted that they _______ (never / encounter) such a complex questionnaire before that day.",
    acceptedAnswers: ["had never encountered"],
    explanation: "Experience (or lack thereof) up to a specific point in the past ('before that day') requires Past Perfect."
  },
  {
    id: "m2_q7",
    module: 2,
    tenseFocus: "Simple Past",
    context: "Type the exact verb form",
    prompt: "Sales of electric vehicles _______ (surge) dramatically in 2021, outperforming initial market forecasts.",
    acceptedAnswers: ["surged"],
    explanation: "Completed action anchored in a finished year ('in 2021') -> Simple Past ('surged')."
  },
  {
    id: "m2_q8",
    module: 2,
    tenseFocus: "Present Perfect",
    context: "Type the exact verb form",
    prompt: "This is the third time the central bank _______ (raise) interest rates within a twelve-month period.",
    acceptedAnswers: ["has raised"],
    explanation: "The structure 'This is the first/second/third time...' is always followed by the Present Perfect in standard academic English."
  },
  {
    id: "m3_q1",
    module: 3,
    tenseFocus: "Present Perfect vs Simple Past",
    context: "Identify the correct revision for the highlighted error in this Task 1 sentence:",
    prompt: "According to the bar chart, the proportion of elderly citizens in Japan <span class='highlight-err'>has risen sharply in 2005</span>.",
    options: [
      "rose sharply in 2005",
      "had risen sharply in 2005",
      "was rising sharply since 2005",
      "No error"
    ],
    answer: "rose sharply in 2005",
    explanation: "A classic IELTS Band 6.0 error: using Present Perfect with a finished past time expression ('in 2005'). Always use Simple Past with specific past dates."
  },
  {
    id: "m3_q2",
    module: 3,
    tenseFocus: "Past Perfect vs Simple Past",
    context: "Identify the correct revision for the highlighted error:",
    prompt: "Once the researchers <span class='highlight-err'>collected</span> all the blood samples, they began the laboratory analysis.",
    options: [
      "had collected (or 'collected' is acceptable)",
      "have collected",
      "were collecting",
      "had been collect"
    ],
    answer: "had collected (or 'collected' is acceptable)",
    explanation: "With 'Once' or 'After', Past Perfect ('had collected') is preferred in formal C1 writing to emphasize sequence."
  },
  {
    id: "m3_q3",
    module: 3,
    tenseFocus: "Present Perfect vs Simple Past",
    context: "Identify the correct revision for the highlighted error in this Task 2 essay:",
    prompt: "Technological advancements <span class='highlight-err'>dramatically altered</span> the way people communicate over the last twenty years.",
    options: [
      "have dramatically altered",
      "had dramatically altered",
      "were dramatically altering",
      "dramatically alter"
    ],
    answer: "have dramatically altered",
    explanation: "'Over the last twenty years' includes the present moment. Simple Past ('altered') wrongly implies the trend has stopped."
  },
  {
    id: "m3_q4",
    module: 3,
    tenseFocus: "Past Continuous vs Simple Past",
    context: "Identify the correct revision for the highlighted error:",
    prompt: "While the economy <span class='highlight-err'>expanded</span> rapidly in the mid-2000s, household debt reached unprecedented levels.",
    options: [
      "was expanding",
      "has expanded",
      "had expand",
      "expands"
    ],
    answer: "was expanding",
    explanation: "'While' introduces a continuous background trend ('was expanding')."
  },
  {
    id: "m3_q5",
    module: 3,
    tenseFocus: "Past Perfect (Unfulfilled Intention)",
    context: "Identify the correct revision for the highlighted error:",
    prompt: "The pharmaceutical firm <span class='highlight-err'>hoped</span> to launch the vaccine in June, but clinical delays forced a postponement.",
    options: [
      "had hoped",
      "has hoped",
      "was hope",
      "has been hoping"
    ],
    answer: "had hoped",
    explanation: "Using Past Perfect with verbs like 'hope' or 'expect' ('had hoped') conveys an unfulfilled past expectation."
  },
  {
    id: "m3_q6",
    module: 3,
    tenseFocus: "Present Perfect Passive",
    context: "Identify the correct revision for the highlighted error:",
    prompt: "Numerous studies <span class='highlight-err'>were published</span> recently demonstrating the benefits of bilingual education.",
    options: [
      "have been published",
      "had been published",
      "are published",
      "were being published"
    ],
    answer: "have been published",
    explanation: "The adverb 'recently' anchors the action in the immediate present timeframe, requiring Present Perfect Passive."
  },
  {
    id: "m4_q1",
    module: 4,
    tenseFocus: "Simple Past",
    options: ["emerged", "has emerged", "had emerged", "was emerging"],
    answer: "emerged",
    explanation: "Specific historical date ('In 1928') requires Simple Past."
  },
  {
    id: "m4_q2",
    module: 4,
    tenseFocus: "Past Continuous",
    options: ["conducted", "was conducting", "had conducted", "has conducted"],
    answer: "was conducting",
    explanation: "Background ongoing activity ('was conducting') interrupted by a discovery."
  },
  {
    id: "m4_q3",
    module: 4,
    tenseFocus: "Past Perfect",
    options: ["contaminated", "has contaminated", "had contaminated", "was contaminating"],
    answer: "had contaminated",
    explanation: "The mold contamination happened prior to Fleming noticing the Petri dish."
  },
  {
    id: "m4_q4",
    module: 4,
    tenseFocus: "Simple Past",
    options: ["revolutionized", "has revolutionized", "had revolutionized", "was revolutionizing"],
    answer: "revolutionized",
    explanation: "Anchored in a completed historical era ('during the 1940s')."
  },
  {
    id: "m4_q5",
    module: 4,
    tenseFocus: "Present Perfect",
    options: ["saved", "had saved", "have saved", "were saving"],
    answer: "have saved",
    explanation: "'Since that era' connects the past invention directly to ongoing present-day impact."
  },
  {
    id: "m4_q6",
    module: 4,
    tenseFocus: "Present Perfect",
    options: ["led", "has led", "had led", "was leading"],
    answer: "has led",
    explanation: "'In recent decades' signals an ongoing trend up to now."
  },
  {
    id: "m4_q7",
    module: 4,
    tenseFocus: "Past Perfect",
    options: ["warned", "has warned", "had warned", "was warning"],
    answer: "had warned",
    explanation: "Fleming's warning occurred in 1945, before modern resistance became a crisis."
  },
  {
    id: "m4_q8",
    module: 4,
    tenseFocus: "Present Perfect",
    options: ["intensified", "had intensified", "have intensified", "were intensifying"],
    answer: "have intensified",
    explanation: "'Over the past few years' requires Present Perfect to show current urgency."
  }
];

let currentModule = 1;
let studentResponses = {};

const studentDocRef = db.collection("ielts_students").doc(studentId);

studentDocRef.onSnapshot((doc) => {
  if (doc.exists && doc.data().responses) {
    studentResponses = doc.data().responses;
  } else {
    studentResponses = {};
  }
  updateProgressUI();
  renderCurrentModule();
  if (isTeacherMode) {
    renderTeacherDashboard();
  }
}, (error) => {
  console.error("Firestore error:", error);
  document.getElementById("sync-status").textContent = "● Offline / Check Rules";
  document.getElementById("sync-status").style.color = "#f87171";
});

async function saveResponse(questionId, userAnswer, isCorrect) {
  studentResponses[questionId] = {
    userAnswer,
    isCorrect,
    updatedAt: new Date().toISOString()
  };

  try {
    await studentDocRef.set({
      studentName: studentId,
      lastActive: firebase.firestore.FieldValue.serverTimestamp(),
      responses: studentResponses
    }, { merge: true });
  } catch (err) {
    console.error("Erro ao salvar no Firestore:", err);
  }
}

function updateProgressUI() {
  const total = EXERCISES.length;
  const completed = Object.keys(studentResponses).length;
  const pct = Math.round((completed / total) * 100);

  document.getElementById("progress-text").textContent = `${completed} of ${total} completed (${pct}%)`;
  document.getElementById("progress-fill").style.width = `${pct}%`;
}

function renderCurrentModule() {
  const container = document.getElementById("exercise-container");
  container.innerHTML = "";

  if (currentModule === 4) {
    renderModule4Passage(container);
    return;
  }

  const intros = {
    1: "<strong>Module 1 — Academic Context (Multiple Choice):</strong> Select the verb form that best fits the academic timeline and IELTS register.",
    2: "<strong>Module 2 — Sentence Production (Gap-Fill):</strong> Conjugate the verb in parentheses accurately. Pay attention to passive voice and adverb placement.",
    3: "<strong>Module 3 — IELTS Writing Error Spotting:</strong> Each sentence contains a common Band 6.0 tense mistake. Choose the Band 8.0+ correction."
  };

  const introDiv = document.createElement("div");
  introDiv.className = "module-intro";
  introDiv.innerHTML = intros[currentModule];
  container.appendChild(introDiv);

  const moduleQuestions = EXERCISES.filter((q) => q.module === currentModule);

  moduleQuestions.forEach((q, idx) => {
    const saved = studentResponses[q.id];
    const card = document.createElement("div");
    card.className = "question-card";
    if (saved) {
      card.classList.add(saved.isCorrect ? "answered-correct" : "answered-wrong");
    }

    let interactiveHTML = "";

    if (q.module === 1 || q.module === 3) {
      interactiveHTML = `<div class="options-grid">
        ${q.options.map((opt) => {
          let btnClass = "option-btn";
          if (saved) {
            if (opt === q.answer) btnClass += " selected-correct";
            else if (opt === saved.userAnswer && !saved.isCorrect) btnClass += " selected-wrong";
          }
          return `<button class="${btnClass}" onclick="handleMCQ('${q.id}', '${opt.replace(/'/g, "\\'")}')">${opt}</button>`;
        }).join("")}
      </div>`;
    } else if (q.module === 2) {
      const val = saved ? saved.userAnswer : "";
      interactiveHTML = `
        <div class="input-row">
          <input type="text" id="input_${q.id}" class="text-input" placeholder="Type verb phrase here..." value="${val}" onkeydown="if(event.key==='Enter') handleGapFill('${q.id}')" />
          <button class="btn-submit" onclick="handleGapFill('${q.id}')">Check</button>
        </div>
      `;
    }

    const feedbackHTML = saved
      ? `<div class="feedback-box ${saved.isCorrect ? "correct" : "wrong"}">
          <strong>${saved.isCorrect ? "✓ Correct!" : `✗ Incorrect (Your answer: "${saved.userAnswer}")`}</strong><br/>
          ${!saved.isCorrect && q.acceptedAnswers ? `Accepted answer: <strong>${q.acceptedAnswers[0]}</strong><br/>` : ""}
          <span>${q.explanation}</span>
        </div>`
      : "";

    card.innerHTML = `
      <div class="q-meta">
        <span>Question ${idx + 1} • ${q.context}</span>
        <span>Focus: ${q.tenseFocus}</span>
      </div>
      <div class="q-prompt">${q.prompt}</div>
      ${interactiveHTML}
      ${feedbackHTML}
    `;

    container.appendChild(card);
  });
}

function renderModule4Passage(container) {
  const intro = document.createElement("div");
  intro.className = "module-intro";
  intro.innerHTML = "<strong>Module 4 — Integrated Academic Passage:</strong> Read the passage on the history of antibiotics and select the appropriate tense for each gap to maintain narrative cohesion.";
  container.appendChild(intro);

  const m4Questions = EXERCISES.filter((q) => q.module === 4);

  const makeSelect = (qId, num) => {
    const q = m4Questions.find((item) => item.id === qId);
    const saved = studentResponses[qId];
    let cls = "inline-select";
    if (saved) cls += saved.isCorrect ? " correct" : " wrong";

    return `<select class="${cls}" onchange="handleMCQ('${qId}', this.value)">
      <option value="">(${num}) Select...</option>
      ${q.options.map((opt) => `<option value="${opt}" ${saved && saved.userAnswer === opt ? "selected" : ""}>${opt}</option>`).join("")}
    </select>`;
  };

  const passageCard = document.createElement("div");
  passageCard.className = "passage-box";
  passageCard.innerHTML = `
    <p>
      The discovery of penicillin in 1928 marked a turning point in modern medicine. Before Alexander Fleming's breakthrough, minor bacterial infections frequently 
      ${makeSelect("m4_q1", 1)} as fatal conditions. One afternoon, while Fleming 
      ${makeSelect("m4_q2", 2)} routine experiments with staphylococci bacteria, he noticed that a blue-green mold 
      ${makeSelect("m4_q3", 3)} one of his culture plates, dissolving the surrounding bacteria.
    </p>
    <br/>
    <p>
      Following mass production during the 1940s, antibiotics rapidly 
      ${makeSelect("m4_q4", 4)} global healthcare, and they 
      ${makeSelect("m4_q5", 5)} hundreds of millions of lives since that era. However, in recent decades, the widespread overuse of these drugs 
      ${makeSelect("m4_q6", 6)} to the rise of antimicrobial resistance—a threat that Fleming himself 
      ${makeSelect("m4_q7", 7)} about during his 1945 Nobel lecture. Consequently, international health agencies 
      ${makeSelect("m4_q8", 8)} efforts over the past few years to fund novel pharmaceutical research.
    </p>
  `;
  container.appendChild(passageCard);

  m4Questions.forEach((q, idx) => {
    const saved = studentResponses[q.id];
    if (saved) {
      const fb = document.createElement("div");
      fb.className = `feedback-box ${saved.isCorrect ? "correct" : "wrong"}`;
      fb.style.marginBottom = "10px";
      fb.innerHTML = `<strong>Gap (${idx + 1}) — ${saved.isCorrect ? "✓ Correct" : `✗ Incorrect (Correct: ${q.answer})`}:</strong> ${q.explanation}`;
      container.appendChild(fb);
    }
  });
}

window.handleMCQ = function (qId, selectedOption) {
  if (!selectedOption) return;
  const q = EXERCISES.find((item) => item.id === qId);
  const isCorrect = selectedOption === q.answer;
  saveResponse(qId, selectedOption, isCorrect);
};

window.handleGapFill = function (qId) {
  const input = document.getElementById(`input_${qId}`);
  const rawVal = input.value.trim();
  if (!rawVal) return;

  const q = EXERCISES.find((item) => item.id === qId);
  const normalizedUser = rawVal.toLowerCase().replace(/\s+/g, " ");
  const isCorrect = q.acceptedAnswers.some((ans) => ans.toLowerCase() === normalizedUser);

  saveResponse(qId, rawVal, isCorrect);
};

function renderTeacherDashboard() {
  const entries = Object.entries(studentResponses);
  const total = EXERCISES.length;
  const completed = entries.length;
  const correctCount = entries.filter(([, val]) => val.isCorrect).length;
  const accuracy = completed > 0 ? Math.round((correctCount / completed) * 100) : 0;

  document.getElementById("stat-completed").textContent = `${completed} / ${total}`;
  document.getElementById("stat-accuracy").textContent = `${accuracy}%`;

  const tenseStats = {};
  entries.forEach(([qId, res]) => {
    const q = EXERCISES.find((item) => item.id === qId);
    if (!q) return;
    if (!tenseStats[q.tenseFocus]) tenseStats[q.tenseFocus] = { right: 0, total: 0 };
    tenseStats[q.tenseFocus].total++;
    if (res.isCorrect) tenseStats[q.tenseFocus].right++;
  });

  const breakdownEl = document.getElementById("tense-breakdown");
  breakdownEl.innerHTML = "";

  let weakestName = "—";
  let lowestRate = 101;

  Object.entries(tenseStats).forEach(([tense, data]) => {
    const rate = Math.round((data.right / data.total) * 100);
    if (rate < lowestRate) {
      lowestRate = rate;
      weakestName = `${tense} (${rate}%)`;
    }
    const chip = document.createElement("span");
    chip.className = "tense-chip";
    chip.innerHTML = `${tense}: <strong>${data.right}/${data.total} (${rate}%)</strong>`;
    breakdownEl.appendChild(chip);
  });

  document.getElementById("stat-weakest").textContent = completed > 0 ? weakestName : "—";
}

document.getElementById("btn-reset-progress").addEventListener("click", async () => {
  if (confirm(`Reset all saved answers for "${studentId}"?`)) {
    await studentDocRef.delete();
  }
});

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentModule = Number(btn.dataset.module);
    renderCurrentModule();
  });
});
