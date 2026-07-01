// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ── Workout card builder ──────────────────────────────────────────────────
function buildWorkoutCard(day, dateStr, interactive) {
  const w    = WORKOUTS[day];
  const dk   = dateKey(dateStr, day);
  const chk  = getChecks(dk);
  const done = isCompleted(dk);
  const doneCount = Object.values(chk).filter(Boolean).length;
  const total = w.exercises.length;
  let html = '';

  if (done) {
    html += `<div class="done-banner"><div class="done-banner-icon"></div>
      <div class="done-banner-text">Workout complete — great work!</div></div>`;
  }

  html += `<div class="card">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px">
      <div class="card-title">${w.title}</div>
      ${interactive && !done ? `<div class="ex-counter">${doneCount}/${total}</div>` : ''}
    </div>
    <span class="tag ${w.tagClass}">${w.tag}</span>`;

  w.exercises.forEach((ex, i) => {
    const checked = !!chk[i];
    html += `<div class="ex-row">
      <div class="ex-check ${checked ? 'done' : ''}"
           onclick="handleToggle('${dk}',${i})"
           role="checkbox" aria-checked="${checked}" aria-label="${ex.name}"></div>
      <div class="ex-info">
        <div class="ex-name ${checked ? 'done' : ''}">${ex.name}</div>
        <div class="ex-detail">${ex.detail}</div>
        ${ex.tip ? `<div class="ex-tip">${ex.tip}</div>` : ''}
      </div>
    </div>`;
  });

  if (interactive) {
    if (done) {
      html += `<button class="btn-primary done-state" disabled>
        <i class="ti ti-check" style="font-size:16px;vertical-align:-2px;margin-right:6px" aria-hidden="true"></i>Completed</button>`;
    } else {
      html += `<button class="btn-primary" onclick="handleComplete('${dk}')">Mark as complete</button>`;
    }
  }
  html += `</div>`;
  return html;
}

function handleToggle(dk, idx) {
  toggleExercise(dk, idx);
  const active = document.querySelector('.screen.active').id;
  if (active === 'screen-today') renderToday();
  else if (active === 'screen-week') renderWeekDetail(state.selectedWeekDay || todayName());
}

function handleComplete(dk) {
  markWorkoutDone(dk);
  showToast('Workout logged! 💪');
  renderToday();
  updateHeader();
}

// ── TODAY ─────────────────────────────────────────────────────────────────
function renderToday() {
  const day = todayName();
  const w   = WORKOUTS[day];
  const isRest = day === 'Fri' || day === 'Sun';

  let html = `<div style="font-size:20px;font-weight:700;color:var(--text-primary);margin-bottom:6px">${w.title}</div>`;

  if (isRest) {
    html += `<div class="tip-box" style="margin-bottom:12px">
      <div style="font-size:13px;font-weight:500;color:var(--text-primary);margin-bottom:4px">Rest day reminder</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">Recovery is where the actual fat loss happens. Your body burns fat and repairs muscle while you sleep — not during the workout. Honor your rest days.</div>
    </div>`;
  }

  html += buildWorkoutCard(day, todayISO(), true);

  // Week 1 habit reminder
  const weeks = weeksSinceStart();
  if (weeks === 0) {
    html += `<div class="tip-box" style="margin-top:4px">
      <div style="font-size:11px;font-weight:500;color:var(--text-accent);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Week 1 — your only job</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">Log what you eat today — no tracking app needed, just a notes app or piece of paper. Awareness before action.</div>
    </div>`;
  }

  document.getElementById('today-content').innerHTML = html;
}

// ── WEEK ──────────────────────────────────────────────────────────────────
function renderWeek() {
  const today = todayName();
  const td    = todayISO();
  const sel   = state.selectedWeekDay || today;

  document.getElementById('week-grid').innerHTML = WEEK_ORDER.map(d => {
    const dk      = dateKey(td, d);
    const done    = isCompleted(dk);
    const isToday = d === today;
    const isRest  = d === 'Fri' || d === 'Sun';
    const isSel   = d === sel;
    let cls = 'day-pill';
    if (isSel)       cls += ' is-selected';
    else if (done)   cls += ' is-done';
    else if (isRest) cls += ' is-rest';
    if (isToday && !isSel) cls += ' is-today';
    const icon = done ? '✓' : isRest ? '–' : isToday ? '▶' : '·';
    return `<div class="${cls}" onclick="selectDay('${d}')">
      <div class="dp-name">${d}</div>
      <div class="dp-icon">${icon}</div>
    </div>`;
  }).join('');

  renderWeekDetail(sel);
}

function selectDay(day) {
  state.selectedWeekDay = day;
  renderWeek();
}

function renderWeekDetail(day) {
  document.getElementById('week-detail').innerHTML = buildWorkoutCard(day, todayISO(), false);
}

// ── PROGRESS ──────────────────────────────────────────────────────────────
function renderProgress() {
  const lost    = getWeightLost();
  const pct     = getProgressPct();
  const phase   = currentPhase();
  const phaseData = PHASES[phase - 1];
  const inchLost = getTotalInchesLost();

  // Goal progress bar
  const target = ((state.settings.targetMin + state.settings.targetMax) / 2);
  const currentW = state.bodyWeight.length
    ? state.bodyWeight[state.bodyWeight.length - 1].weight
    : state.settings.startWeight;

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Workouts done</div>
      <div class="stat-val">${totalWorkouts()}</div>
      <div class="stat-sub">all time</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">This week</div>
      <div class="stat-val">${workoutsThisWeek()}<span class="stat-unit"> / 4</span></div>
      <div class="stat-sub">days complete</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Streak</div>
      <div class="stat-val">${currentStreak()}<span class="stat-unit"> days</span></div>
      <div class="stat-sub">workout days</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Lbs lost</div>
      <div class="stat-val">${lost.toFixed(1)}<span class="stat-unit"> lbs</span></div>
      <div class="stat-sub">since start</div>
    </div>`;

  // Phase indicator
  const phaseColors = ['var(--fill-accent)','var(--fill-success)','var(--fill-warning)'];
  const phaseBg = ['var(--bg-accent)','var(--bg-success)','var(--bg-warning)'];
  const phaseTxt = ['var(--text-accent)','var(--text-success)','var(--text-warning)'];
  document.getElementById('phase-section').innerHTML = `
    <div style="background:${phaseBg[phase-1]};border-radius:12px;border:0.5px solid var(--border);padding:14px;margin-bottom:14px">
      <div style="font-size:11px;font-weight:500;color:${phaseTxt[phase-1]};text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px">Current phase — ${phaseData.months}</div>
      <div style="font-size:17px;font-weight:500;color:var(--text-primary);margin-bottom:6px">Phase ${phase}: ${phaseData.name}</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:1.5;margin-bottom:10px">${phaseData.focus}</div>
      <div style="font-size:12px;font-weight:500;color:${phaseTxt[phase-1]}">Expected this block: ${phaseData.expected}</div>
    </div>
    <div style="margin-bottom:6px;display:flex;justify-content:space-between;align-items:baseline">
      <div style="font-size:13px;color:var(--text-secondary)">Goal progress</div>
      <div style="font-size:13px;font-weight:500;color:var(--text-primary)">${currentW} lbs → ${target} lbs target</div>
    </div>
    <div style="height:10px;background:var(--surface-0);border-radius:99px;overflow:hidden;margin-bottom:4px">
      <div style="height:100%;width:${pct}%;background:${phaseColors[phase-1]};border-radius:99px;transition:width .4s ease"></div>
    </div>
    <div style="font-size:12px;color:var(--text-muted);text-align:right">${pct}% to goal</div>`;

  // Weight chart
  renderWeightChart();

  // Streak calendar
  renderStreakCal();

  // Inch progress bars
  renderInchBars(inchLost);

  // Wins
  renderWins();
}

function renderWeightChart() {
  const wrap = document.getElementById('weight-chart');
  if (!wrap) return;
  if (state.bodyWeight.length < 2) {
    wrap.innerHTML = `<div class="empty"><i class="ti ti-scale" aria-hidden="true"></i>Log your weight in the Measure tab to see your chart here.</div>`;
    return;
  }
  const entries = state.bodyWeight.slice(-12);
  const weights = entries.map(e => e.weight);
  const minW = Math.min(...weights) - 5;
  const maxW = Math.max(...weights) + 5;
  const W = 340, H = 100;
  const pts = entries.map((e, i) => {
    const x = 20 + (i / (entries.length - 1)) * (W - 40);
    const y = H - 10 - ((e.weight - minW) / (maxW - minW)) * (H - 20);
    return `${x},${y}`;
  });
  const startW = state.settings.startWeight;
  const targetW = (state.settings.targetMin + state.settings.targetMax) / 2;
  const targetY = H - 10 - ((targetW - minW) / (maxW - minW)) * (H - 20);

  wrap.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block">
    <line x1="20" y1="${targetY}" x2="${W-20}" y2="${targetY}" stroke="var(--border-success)" stroke-width="1" stroke-dasharray="4,3"/>
    <text x="${W-22}" y="${targetY-4}" font-size="9" fill="var(--text-success)" text-anchor="end">goal</text>
    <polyline points="${pts.join(' ')}" fill="none" stroke="var(--fill-accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${entries.map((e,i) => {
      const [x,y] = pts[i].split(',');
      return `<circle cx="${x}" cy="${y}" r="3" fill="var(--fill-accent)"/>
              <text x="${x}" y="${parseFloat(y)-7}" font-size="9" fill="var(--text-secondary)" text-anchor="middle">${e.weight}</text>`;
    }).join('')}
  </svg>`;
}

function renderStreakCal() {
  const now = new Date();
  let dots = '';
  for (let w = 7; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const dt  = new Date(now); dt.setDate(dt.getDate() - (w*7 + (6-d)));
      const dn  = DAY_NAMES[dt.getDay()];
      const dk  = dt.toISOString().slice(0,10) + '_' + dn;
      const fut = dt > now;
      const rest = dn === 'Fri' || dn === 'Sun';
      let bg = 'var(--surface-0)';
      if      (fut)                 bg = 'var(--surface-0)';
      else if (rest)                bg = 'var(--surface-1)';
      else if (state.completed[dk]) bg = 'var(--fill-accent)';
      else                          bg = '#F09595';
      dots += `<div class="streak-dot" style="background:${bg}" title="${dt.toISOString().slice(0,10)} ${dn}"></div>`;
    }
  }
  document.getElementById('streak-cal').innerHTML = dots;
}

function renderInchBars(total) {
  const wrap = document.getElementById('measure-bars');
  if (!wrap) return;
  if (state.measurements.length < 2) { wrap.innerHTML = ''; return; }
  const first = state.measurements[0];
  const last  = state.measurements[state.measurements.length - 1];
  const fields = [
    {key:'waist',label:'Waist'},{key:'hips',label:'Hips'},
    {key:'thigh',label:'Thigh'},{key:'chest',label:'Chest'}
  ];
  let html = '';
  fields.forEach(({key,label}) => {
    if (!first[key] || !last[key]) return;
    const lost = Math.max(0, first[key] - last[key]);
    const pct = Math.min(100, (lost / first[key]) * 100 * 5);
    html += `<div class="progress-row">
      <div class="progress-label">${label}</div>
      <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct.toFixed(1)}%"></div></div>
      <div class="progress-val">${lost > 0 ? '-'+lost.toFixed(1)+'"' : '—'}</div>
    </div>`;
  });
  wrap.innerHTML = html || '';
}

function renderWins() {
  const wrap = document.getElementById('wins-section');
  if (!wrap) return;
  if (state.measurements.length < 2 && state.bodyWeight.length < 2) {
    wrap.innerHTML = `<div class="empty"><i class="ti ti-trophy" aria-hidden="true"></i>Log measurements and weight to see your wins here.</div>`;
    return;
  }
  const labels = {waist:'Waist',hips:'Hips',thigh:'Thigh',chest:'Chest'};
  let pills = '';
  if (state.measurements.length >= 2) {
    const first = state.measurements[0], last = state.measurements[state.measurements.length-1];
    let total = 0;
    ['waist','hips','thigh','chest'].forEach(f => {
      if (first[f] && last[f]) {
        const d = first[f] - last[f];
        if (d > 0) { total += d; pills += `<div class="win-pill">${labels[f]}: ${d.toFixed(1)}" lost</div>`; }
      }
    });
    if (total > 0) pills += `<div class="win-pill total">Total: ${total.toFixed(1)}" lost</div>`;
  }
  const lbLost = getWeightLost();
  if (lbLost > 0) pills += `<div class="win-pill" style="background:var(--bg-success);color:var(--text-success)">${lbLost.toFixed(1)} lbs down</div>`;
  const ws = weeksSinceStart();
  if (ws > 0) pills += `<div class="win-pill" style="background:var(--bg-accent);color:var(--text-accent)">Week ${ws+1} in the program</div>`;

  wrap.innerHTML = pills
    ? `<div class="wins-wrap">${pills}</div>`
    : `<div class="empty">Keep going — wins appear as you log progress.</div>`;
}

// ── PLAN TAB ──────────────────────────────────────────────────────────────
function renderPlan() {
  const planContent = document.getElementById('plan-content');
  if (!planContent) return;

  const phase = currentPhase();
  const phaseColors = ['var(--text-accent)','var(--text-success)','var(--text-warning)'];
  const phaseBg = ['var(--bg-accent)','var(--bg-success)','var(--bg-warning)'];

  let html = `<div class="section-label">Your 8-month roadmap</div>`;

  // Phase cards
  PHASES.forEach(p => {
    const active = p.num === phase;
    html += `<div class="card" style="${active ? 'border-color:'+phaseColors[p.num-1]+';border-width:1.5px' : ''}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="font-size:11px;font-weight:500;color:${phaseColors[p.num-1]};text-transform:uppercase;letter-spacing:.07em">${p.months}</div>
        ${active ? '<div style="font-size:10px;background:'+phaseBg[p.num-1]+';color:'+phaseColors[p.num-1]+';padding:1px 8px;border-radius:20px;font-weight:500">Current</div>' : ''}
      </div>
      <div style="font-size:16px;font-weight:500;color:var(--text-primary);margin-bottom:4px">Phase ${p.num}: ${p.name}</div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;line-height:1.5">${p.focus}</div>
      <div style="font-size:12px;font-weight:500;color:${phaseColors[p.num-1]};margin-bottom:10px">Expected: ${p.expected}</div>
      <div style="font-size:11px;font-weight:500;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Milestones</div>
      ${p.milestones.map(m => `<div style="font-size:12px;color:var(--text-secondary);padding:3px 0;display:flex;gap:6px;align-items:flex-start">
        <i class="ti ti-circle-check" style="color:${phaseColors[p.num-1]};font-size:14px;flex-shrink:0;margin-top:1px" aria-hidden="true"></i>${m}
      </div>`).join('')}
    </div>`;
  });

  html += `<div class="section-label" style="margin-top:1.5rem">Nutrition targets</div>
  <div class="card">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;margin-bottom:14px">
      <div><div style="font-size:22px;font-weight:500;color:var(--text-primary)">2,800</div><div style="font-size:11px;color:var(--text-secondary)">calories/day</div></div>
      <div><div style="font-size:22px;font-weight:500;color:var(--text-primary)">250g</div><div style="font-size:11px;color:var(--text-secondary)">protein/day</div></div>
      <div><div style="font-size:22px;font-weight:500;color:var(--text-primary)">~1 lb</div><div style="font-size:11px;color:var(--text-secondary)">lost/week</div></div>
    </div>
    ${NUTRITION_RULES.map(r => `<div style="display:flex;gap:10px;padding:10px 0;border-top:0.5px solid var(--border);align-items:flex-start">
      <i class="ti ${r.icon}" style="color:var(--text-accent);font-size:18px;flex-shrink:0;margin-top:1px" aria-hidden="true"></i>
      <div>
        <div style="font-size:13px;font-weight:500;color:var(--text-primary);margin-bottom:2px">${r.title}</div>
        <div style="font-size:12px;color:var(--text-secondary);line-height:1.5">${r.body}</div>
      </div>
    </div>`).join('')}
  </div>

  <div class="section-label" style="margin-top:1.5rem">Week 1 habit</div>
  <div class="card" style="background:var(--bg-success);border-color:var(--border-success)">
    <div style="font-size:11px;font-weight:500;color:var(--text-success);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px">Before anything else</div>
    <div style="font-size:16px;font-weight:500;color:var(--text-primary);margin-bottom:8px">Log what you eat. Don't change anything yet.</div>
    <div style="font-size:13px;color:var(--text-secondary);line-height:1.6">Spend week 1 writing down everything you eat and drink — no tracking app needed. This single act reveals more about your eating patterns than any nutrition plan can prescribe. You cannot change what you cannot see.</div>
  </div>`;

  planContent.innerHTML = html;
}

// ── LOG (measurements + food + weight) ───────────────────────────────────
function renderLog() {
  renderMeasurementHistory();
  renderWeightHistory();
  renderFoodLog();
}

function submitMeasurement() {
  const date  = document.getElementById('m-date').value;
  if (!date) { showToast('Please pick a date'); return; }
  const waist = parseFloat(document.getElementById('m-waist').value)  || null;
  const hips  = parseFloat(document.getElementById('m-hips').value)   || null;
  const thigh = parseFloat(document.getElementById('m-thigh').value)  || null;
  const chest = parseFloat(document.getElementById('m-chest').value)  || null;
  if (!waist && !hips && !thigh && !chest) { showToast('Enter at least one measurement'); return; }
  addMeasurement({ date, waist, hips, thigh, chest });
  showToast('Measurement saved!');
  document.getElementById('m-waist').value = '';
  document.getElementById('m-hips').value  = '';
  document.getElementById('m-thigh').value = '';
  document.getElementById('m-chest').value = '';
  renderMeasurementHistory();
}

function submitWeight() {
  const date   = document.getElementById('w-date').value;
  const weight = parseFloat(document.getElementById('w-weight').value);
  if (!date || !weight) { showToast('Enter date and weight'); return; }
  addBodyWeight(date, weight);
  showToast('Weight logged!');
  document.getElementById('w-weight').value = '';
  renderWeightHistory();
}

function submitFood() {
  const date  = document.getElementById('f-date').value;
  const food  = document.getElementById('f-food').value.trim();
  if (!date || !food) { showToast('Enter date and food'); return; }
  const time  = document.getElementById('f-time').value || '';
  addFoodEntry(date, { time, food });
  showToast('Food logged!');
  document.getElementById('f-food').value = '';
  renderFoodLog();
}

function confirmDelete(idx) {
  if (!confirm('Delete this measurement?')) return;
  deleteMeasurement(idx);
  renderMeasurementHistory();
  showToast('Deleted');
}

function confirmDeleteWeight(idx) {
  if (!confirm('Delete this entry?')) return;
  state.bodyWeight.splice(idx, 1);
  saveState();
  renderWeightHistory();
  showToast('Deleted');
}

function confirmDeleteFood(date, id) {
  deleteFoodEntry(date, id);
  renderFoodLog();
}

function renderMeasurementHistory() {
  const wrap = document.getElementById('m-history');
  if (!wrap) return;
  if (!state.measurements.length) {
    wrap.innerHTML = `<div class="empty"><i class="ti ti-ruler-measure" aria-hidden="true"></i>No measurements yet. Log your baseline above — this becomes your reference point for everything.</div>`;
    return;
  }
  const first  = state.measurements[0];
  const labels = {waist:'Waist',hips:'Hips',thigh:'Thigh',chest:'Chest'};
  wrap.innerHTML = [...state.measurements].reverse().map((m, ri) => {
    const idx     = state.measurements.length - 1 - ri;
    const isFirst = idx === 0;
    const cells   = ['waist','hips','thigh','chest'].map(f => {
      const val = m[f] != null ? m[f].toFixed(1)+'"' : '—';
      let delta = '';
      if (!isFirst && m[f] && first[f]) {
        const d = m[f] - first[f];
        if (d < 0) delta = `<div class="m-cell-delta delta-good">▼ ${Math.abs(d).toFixed(1)}"</div>`;
        else if (d > 0) delta = `<div class="m-cell-delta delta-bad">▲ ${d.toFixed(1)}"</div>`;
      }
      return `<div class="m-cell"><div class="m-cell-label">${labels[f]}</div><div class="m-cell-val">${val}</div>${delta}</div>`;
    }).join('');
    return `<div class="m-entry">
      <div class="m-entry-header">
        <div class="m-entry-date">${formatDate(m.date)}${isFirst ? '<span class="baseline-badge">Baseline</span>':''}</div>
        <button class="m-delete-btn" onclick="confirmDelete(${idx})" aria-label="Delete"><i class="ti ti-trash" aria-hidden="true"></i></button>
      </div>
      <div class="m-grid">${cells}</div>
    </div>`;
  }).join('');
}

function renderWeightHistory() {
  const wrap = document.getElementById('w-history');
  if (!wrap) return;
  if (!state.bodyWeight.length) {
    wrap.innerHTML = `<div class="empty"><i class="ti ti-scale" aria-hidden="true"></i>No weight entries yet.</div>`;
    return;
  }
  wrap.innerHTML = [...state.bodyWeight].reverse().map((e, ri) => {
    const idx   = state.bodyWeight.length - 1 - ri;
    const start = state.settings.startWeight;
    const diff  = e.weight - start;
    const diffStr = diff < 0
      ? `<span style="color:var(--text-success);font-size:12px;font-weight:500">▼ ${Math.abs(diff).toFixed(1)} lbs</span>`
      : diff > 0
        ? `<span style="color:var(--text-danger);font-size:12px">▲ ${diff.toFixed(1)} lbs</span>`
        : '';
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:0.5px solid var(--border)">
      <div>
        <div style="font-size:14px;font-weight:500;color:var(--text-primary)">${e.weight} lbs</div>
        <div style="font-size:12px;color:var(--text-secondary)">${formatDate(e.date)} ${diffStr}</div>
      </div>
      <button class="m-delete-btn" onclick="confirmDeleteWeight(${idx})" aria-label="Delete"><i class="ti ti-trash" aria-hidden="true"></i></button>
    </div>`;
  }).join('');
}

function renderFoodLog() {
  const wrap = document.getElementById('f-history');
  if (!wrap) return;
  const today = todayISO();
  const entries = state.foodLogs[today] || [];
  if (!entries.length) {
    wrap.innerHTML = `<div class="empty" style="padding:16px 0"><i class="ti ti-pencil" aria-hidden="true"></i>Nothing logged today — start with breakfast.</div>`;
    return;
  }
  wrap.innerHTML = entries.map(e =>
    `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:0.5px solid var(--border)">
      ${e.time ? `<div style="font-size:11px;color:var(--text-muted);min-width:36px">${e.time}</div>` : ''}
      <div style="flex:1;font-size:14px;color:var(--text-primary)">${e.food}</div>
      <button class="m-delete-btn" onclick="confirmDeleteFood('${today}',${e.id})" aria-label="Delete"><i class="ti ti-x" aria-hidden="true"></i></button>
    </div>`
  ).join('');
}

// ── Header ────────────────────────────────────────────────────────────────
function updateHeader() {
  const name = state.settings.name;
  document.getElementById('header-title').textContent = name ? `Hey, ${name.split(' ')[0]}` : 'Fit Tracker';
  document.getElementById('header-date').textContent = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  document.getElementById('streak-count').textContent = currentStreak();
}
