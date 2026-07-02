// ── State ────────────────────────────────────────────────────────────────
const STATE_KEY = 'fittracker_v4';

const DEFAULT_STATE = {
  checked:      {},
  completed:    {},
  measurements: [],
  foodLogs:     {},   // { 'YYYY-MM-DD': [{ time, food, notes }] }
  bodyWeight:   [],   // [{ date, weight }]
  waterLog:     {},   // { 'YYYY-MM-DD': oz }
  settings: {
    name: '',
    startWeight: 305,
    startDate: null,
    targetMin: 240,
    targetMax: 260,
    dailyCalories: 2800,
    dailyProtein: 250,
  },
  selectedWeekDay: null,
  onboardingDone: false,
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STATE_KEY));
    if (saved) {
      state = { ...DEFAULT_STATE, ...saved };
      state.settings = { ...DEFAULT_STATE.settings, ...(saved.settings || {}) };
    }
  } catch(e) { console.warn('State load failed', e); }
}

function saveState() {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch(e) { console.warn('State save failed', e); }
}

// ── Date helpers ──────────────────────────────────────────────────────────
function todayISO()  { return new Date().toISOString().slice(0, 10); }
function todayName() { return DAY_NAMES[new Date().getDay()]; }
function dateKey(dateStr, day) { return dateStr + '_' + day; }
function formatDate(iso) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
function weeksSinceStart() {
  if (!state.settings.startDate) return 0;
  const ms = new Date() - new Date(state.settings.startDate + 'T00:00:00');
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}
function currentPhase() {
  const w = weeksSinceStart();
  if (w < 12) return 1;
  if (w < 24) return 2;
  return 3;
}

// ── Workout state ─────────────────────────────────────────────────────────
function getChecks(dk)   { return state.checked[dk] || {}; }
function isCompleted(dk) { return !!state.completed[dk]; }

function toggleExercise(dk, idx) {
  if (!state.checked[dk]) state.checked[dk] = {};
  state.checked[dk][idx] = !state.checked[dk][idx];
  saveState();
}

function markWorkoutDone(dk) {
  state.completed[dk] = true;
  if (!state.settings.startDate) {
    state.settings.startDate = todayISO();
  }
  saveState();
}

// ── Stats ─────────────────────────────────────────────────────────────────
function currentStreak() {
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const dn = DAY_NAMES[d.getDay()];
    if (!WORKOUT_DAYS.includes(dn)) continue;
    const dk = d.toISOString().slice(0, 10) + '_' + dn;
    if (state.completed[dk]) streak++;
    else if (i <= 1) continue;
    else break;
  }
  return streak;
}

function totalWorkouts()     { return Object.keys(state.completed).length; }
function workoutsThisWeek()  {
  const td = todayISO();
  return WORKOUT_DAYS.filter(d => state.completed[dateKey(td, d)]).length;
}

function getTotalInchesLost() {
  if (state.measurements.length < 2) return 0;
  const first = state.measurements[0];
  const last  = state.measurements[state.measurements.length - 1];
  let total = 0;
  ['waist','hips','thigh','chest'].forEach(f => {
    if (first[f] && last[f]) total += Math.max(0, first[f] - last[f]);
  });
  return total;
}

function getWeightLost() {
  if (!state.settings.startWeight) return 0;
  if (state.bodyWeight.length === 0) return 0;
  const latest = state.bodyWeight[state.bodyWeight.length - 1].weight;
  return Math.max(0, state.settings.startWeight - latest);
}

function getProgressPct() {
  const lost = getWeightLost();
  const goal = state.settings.startWeight - ((state.settings.targetMin + state.settings.targetMax) / 2);
  if (!goal) return 0;
  return Math.min(100, Math.round((lost / goal) * 100));
}

// ── Measurements ──────────────────────────────────────────────────────────
function addMeasurement(entry) {
  state.measurements.push(entry);
  state.measurements.sort((a, b) => a.date.localeCompare(b.date));
  saveState();
}
function deleteMeasurement(idx) {
  state.measurements.splice(idx, 1);
  saveState();
}

// ── Body weight ───────────────────────────────────────────────────────────
function addBodyWeight(date, weight) {
  const existing = state.bodyWeight.findIndex(e => e.date === date);
  if (existing >= 0) state.bodyWeight[existing].weight = weight;
  else state.bodyWeight.push({ date, weight });
  state.bodyWeight.sort((a, b) => a.date.localeCompare(b.date));
  saveState();
}

// ── Food log ──────────────────────────────────────────────────────────────
function addFoodEntry(date, entry) {
  if (!state.foodLogs[date]) state.foodLogs[date] = [];
  state.foodLogs[date].push({ ...entry, id: Date.now() });
  saveState();
}
function deleteFoodEntry(date, id) {
  if (!state.foodLogs[date]) return;
  state.foodLogs[date] = state.foodLogs[date].filter(e => e.id !== id);
  saveState();
}

// ── Water log ─────────────────────────────────────────────────────────────
const WATER_GOAL_OZ = 120;

function getWaterToday() {
  return state.waterLog[todayISO()] || 0;
}
function logWater(oz) {
  const today = todayISO();
  state.waterLog[today] = Math.max(0, (state.waterLog[today] || 0) + oz);
  saveState();
}
function waterGoalDaysThisWeek() {
  let count = 0;
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    if ((state.waterLog[d.toISOString().slice(0, 10)] || 0) >= WATER_GOAL_OZ) count++;
  }
  return count;
}

// ── Weekly report helpers ──────────────────────────────────────────────────
function weightLoggedThisWeek() {
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 7);
  return state.bodyWeight.some(e => new Date(e.date + 'T12:00:00') >= cutoff);
}
