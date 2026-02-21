const STORAGE_KEY = "board-score-hub-v1";

const GAME_TYPES = [
  "Eurogame",
  "Ameritrash / Tematico",
  "Deck-building",
  "Drafting",
  "Worker placement",
  "Area control",
  "4X / Civilizzazione",
  "Roll & Write",
  "Flip & Write",
  "Cooperativo",
  "Legacy / Campagna",
  "Party game",
  "Skirmish / Wargame",
  "Trick-taking",
  "Astratto",
  "Dungeon crawler",
  "Engine building",
  "Social deduction"
];

const CATEGORY_PRESETS = {
  "Generico rapido": ["Round 1", "Round 2", "Round 3", "Bonus finale"],
  "Eurogame classico": ["Tracciati", "Edifici", "Obiettivi", "Bonus finale", "Penalità"],
  "Cooperativo scenario": ["Missioni completate", "Supporto team", "Obiettivi secondari", "Danni/Subiti"],
  "Wargame / Skirmish": ["Unità eliminate", "Controllo aree", "Obiettivi tattici", "Perdite"],
  "Party / Quiz": ["Risposte corrette", "Bonus velocità", "Bonus round"],
  "Racing / Basso è meglio": ["Tempo Giro 1", "Tempo Giro 2", "Tempo Giro 3", "Penalità"]
};

const state = {
  sessionName: "",
  scoreMode: "highest",
  gameType: GAME_TYPES[0],
  players: ["Giocatore 1", "Giocatore 2"],
  categories: ["Round 1", "Round 2", "Bonus finale"],
  scores: {}
};

const el = {
  sessionName: document.getElementById("sessionName"),
  scoreMode: document.getElementById("scoreMode"),
  gameTypeSelect: document.getElementById("gameTypeSelect"),
  categoryPresetSelect: document.getElementById("categoryPresetSelect"),
  applyPresetBtn: document.getElementById("applyPresetBtn"),
  addRoundBtn: document.getElementById("addRoundBtn"),
  playerNameInput: document.getElementById("playerNameInput"),
  addPlayerBtn: document.getElementById("addPlayerBtn"),
  playersList: document.getElementById("playersList"),
  categoryNameInput: document.getElementById("categoryNameInput"),
  addCategoryBtn: document.getElementById("addCategoryBtn"),
  categoriesList: document.getElementById("categoriesList"),
  scoreGridWrapper: document.getElementById("scoreGridWrapper"),
  leaderboard: document.getElementById("leaderboard"),
  stats: document.getElementById("stats"),
  fillZerosBtn: document.getElementById("fillZerosBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  saveSessionBtn: document.getElementById("saveSessionBtn"),
  resetBtn: document.getElementById("resetBtn"),
  pillTemplate: document.getElementById("pillTemplate")
};

function keyOf(player, category) {
  return `${player}__${category}`;
}

function numberValue(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function uniqueName(name, existing) {
  const base = name.trim();
  if (!existing.includes(base)) {
    return base;
  }
  let i = 2;
  while (existing.includes(`${base} (${i})`)) {
    i += 1;
  }
  return `${base} (${i})`;
}

function renderSelectOptions() {
  el.gameTypeSelect.innerHTML = "";
  for (const type of GAME_TYPES) {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    el.gameTypeSelect.append(opt);
  }

  el.categoryPresetSelect.innerHTML = "";
  Object.keys(CATEGORY_PRESETS).forEach((presetName) => {
    const opt = document.createElement("option");
    opt.value = presetName;
    opt.textContent = presetName;
    el.categoryPresetSelect.append(opt);
  });
}

function sanitizeScores() {
  const nextScores = {};
  for (const player of state.players) {
    for (const category of state.categories) {
      const k = keyOf(player, category);
      nextScores[k] = numberValue(state.scores[k] ?? 0);
    }
  }
  state.scores = nextScores;
}

function renderPillList(container, items, onRemove) {
  container.innerHTML = "";
  items.forEach((label, index) => {
    const node = el.pillTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".pill-label").textContent = label;
    node.querySelector(".pill-remove").addEventListener("click", () => onRemove(index));
    container.append(node);
  });
}

function calculateTotals() {
  return state.players.map((player) => {
    const total = state.categories.reduce((acc, category) => {
      return acc + numberValue(state.scores[keyOf(player, category)]);
    }, 0);
    return { player, total };
  });
}

function buildScoreTable() {
  sanitizeScores();
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headRow = document.createElement("tr");
  const playerHead = document.createElement("th");
  playerHead.className = "sticky-col";
  playerHead.textContent = "Giocatore";
  headRow.append(playerHead);

  for (const category of state.categories) {
    const th = document.createElement("th");
    th.textContent = category;
    headRow.append(th);
  }

  const totalHead = document.createElement("th");
  totalHead.textContent = "Totale";
  headRow.append(totalHead);

  thead.append(headRow);

  const totalsMap = new Map(calculateTotals().map((item) => [item.player, item.total]));

  for (const player of state.players) {
    const row = document.createElement("tr");

    const playerCell = document.createElement("td");
    playerCell.className = "sticky-col";
    playerCell.textContent = player;
    row.append(playerCell);

    for (const category of state.categories) {
      const inputCell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.step = "any";
      input.value = state.scores[keyOf(player, category)] ?? 0;
      input.addEventListener("input", (event) => {
        state.scores[keyOf(player, category)] = numberValue(event.target.value);
        renderResults();
      });
      inputCell.append(input);
      row.append(inputCell);
    }

    const totalCell = document.createElement("td");
    totalCell.textContent = String(totalsMap.get(player) ?? 0);
    row.append(totalCell);

    tbody.append(row);
  }

  table.append(thead, tbody);
  el.scoreGridWrapper.innerHTML = "";
  el.scoreGridWrapper.append(table);
}

function renderLeaderboard() {
  const totals = calculateTotals();
  const sorted = totals.sort((a, b) => {
    return state.scoreMode === "highest" ? b.total - a.total : a.total - b.total;
  });

  el.leaderboard.innerHTML = "";
  sorted.forEach((entry, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${idx + 1}. ${entry.player}</span><strong>${entry.total}</strong>`;
    el.leaderboard.append(li);
  });
}

function renderStats() {
  const totals = calculateTotals().map((x) => x.total);
  const sum = totals.reduce((a, b) => a + b, 0);
  const avg = totals.length ? sum / totals.length : 0;
  const max = totals.length ? Math.max(...totals) : 0;
  const min = totals.length ? Math.min(...totals) : 0;
  const spread = max - min;

  const entries = [
    ["Giocatori", state.players.length],
    ["Categorie", state.categories.length],
    ["Media punti", avg.toFixed(2)],
    ["Massimo", max],
    ["Minimo", min],
    ["Differenza (max-min)", spread],
    ["Modalità vittoria", state.scoreMode === "highest" ? "Punti alti" : "Punti bassi"],
    ["Tipo gioco", state.gameType]
  ];

  el.stats.innerHTML = "";
  for (const [k, v] of entries) {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = k;
    dd.textContent = String(v);
    el.stats.append(dt, dd);
  }
}

function renderResults() {
  buildScoreTable();
  renderLeaderboard();
  renderStats();
}

function renderAll() {
  renderPillList(el.playersList, state.players, (index) => {
    if (state.players.length <= 1) {
      return;
    }
    state.players.splice(index, 1);
    sanitizeScores();
    renderAll();
  });

  renderPillList(el.categoriesList, state.categories, (index) => {
    if (state.categories.length <= 1) {
      return;
    }
    state.categories.splice(index, 1);
    sanitizeScores();
    renderAll();
  });

  renderResults();
}

function addPlayer(name) {
  const trimmed = name.trim();
  if (!trimmed) {
    return;
  }
  state.players.push(uniqueName(trimmed, state.players));
  sanitizeScores();
  renderAll();
}

function addCategory(name) {
  const trimmed = name.trim();
  if (!trimmed) {
    return;
  }
  state.categories.push(uniqueName(trimmed, state.categories));
  sanitizeScores();
  renderAll();
}

function addRound() {
  const roundCount = state.categories.filter((c) => c.toLowerCase().startsWith("round")).length + 1;
  addCategory(`Round ${roundCount}`);
}

function applyPreset(name) {
  const preset = CATEGORY_PRESETS[name];
  if (!preset) {
    return;
  }
  state.categories = [...preset];
  if (name.toLowerCase().includes("basso")) {
    state.scoreMode = "lowest";
    el.scoreMode.value = "lowest";
  }
  sanitizeScores();
  renderAll();
}

function fillEmptyWithZeros() {
  sanitizeScores();
  renderAll();
}

function exportCsv() {
  const totals = calculateTotals();
  const header = ["Giocatore", ...state.categories, "Totale"];
  const rows = state.players.map((player) => {
    const values = state.categories.map((category) => state.scores[keyOf(player, category)] ?? 0);
    const total = totals.find((t) => t.player === player)?.total ?? 0;
    return [player, ...values, total];
  });

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = (state.sessionName || "partita").replace(/\s+/g, "_").toLowerCase();
  a.download = `${safeName}_scoreboard.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function saveSession() {
  const payload = {
    ...state,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  alert("Sessione salvata nel browser.");
}

function loadSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    state.sessionName = parsed.sessionName || "";
    state.scoreMode = parsed.scoreMode === "lowest" ? "lowest" : "highest";
    state.gameType = GAME_TYPES.includes(parsed.gameType) ? parsed.gameType : GAME_TYPES[0];
    state.players = Array.isArray(parsed.players) && parsed.players.length ? parsed.players : [...state.players];
    state.categories = Array.isArray(parsed.categories) && parsed.categories.length ? parsed.categories : [...state.categories];
    state.scores = parsed.scores && typeof parsed.scores === "object" ? parsed.scores : {};
  } catch {
    // Ignora dati corrotti
  }
}

function fullReset() {
  state.sessionName = "";
  state.scoreMode = "highest";
  state.gameType = GAME_TYPES[0];
  state.players = ["Giocatore 1", "Giocatore 2"];
  state.categories = ["Round 1", "Round 2", "Bonus finale"];
  state.scores = {};
  localStorage.removeItem(STORAGE_KEY);
  el.sessionName.value = "";
  el.scoreMode.value = "highest";
  el.gameTypeSelect.value = GAME_TYPES[0];
  sanitizeScores();
  renderAll();
}

function bindEvents() {
  el.sessionName.addEventListener("input", (e) => {
    state.sessionName = e.target.value.trim();
  });

  el.scoreMode.addEventListener("change", (e) => {
    state.scoreMode = e.target.value;
    renderResults();
  });

  el.gameTypeSelect.addEventListener("change", (e) => {
    state.gameType = e.target.value;
    renderStats();
  });

  el.applyPresetBtn.addEventListener("click", () => applyPreset(el.categoryPresetSelect.value));
  el.addRoundBtn.addEventListener("click", addRound);

  el.addPlayerBtn.addEventListener("click", () => {
    addPlayer(el.playerNameInput.value);
    el.playerNameInput.value = "";
    el.playerNameInput.focus();
  });

  el.playerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addPlayer(el.playerNameInput.value);
      el.playerNameInput.value = "";
    }
  });

  el.addCategoryBtn.addEventListener("click", () => {
    addCategory(el.categoryNameInput.value);
    el.categoryNameInput.value = "";
    el.categoryNameInput.focus();
  });

  el.categoryNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addCategory(el.categoryNameInput.value);
      el.categoryNameInput.value = "";
    }
  });

  el.fillZerosBtn.addEventListener("click", fillEmptyWithZeros);
  el.exportCsvBtn.addEventListener("click", exportCsv);
  el.saveSessionBtn.addEventListener("click", saveSession);
  el.resetBtn.addEventListener("click", fullReset);
}

function init() {
  renderSelectOptions();
  loadSession();
  el.sessionName.value = state.sessionName;
  el.scoreMode.value = state.scoreMode;
  el.gameTypeSelect.value = state.gameType;
  sanitizeScores();
  bindEvents();
  renderAll();
}

init();
