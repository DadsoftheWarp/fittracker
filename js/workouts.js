// ── Workout definitions ───────────────────────────────────────────────────
const WORKOUTS = {
  Mon: {
    title: 'Lower body circuit A',
    tag: 'Legs · 45 sec rest',
    tagClass: 'tag-lower',
    icon: 'ti-barbell',
    exercises: [
      { name: 'Romanian deadlift',   detail: '4 × 15 reps', tip: 'Hinge at hips, soft knee — feel it in your hamstrings' },
      { name: 'DB goblet squat',     detail: '4 × 15 reps', tip: 'Hold dumbbell at chest, sit back not forward, knees track toes' },
      { name: 'Glute bridge',        detail: '4 × 20 reps', tip: 'Drive hips to ceiling, squeeze glutes hard at the top' },
      { name: 'Standing calf raise', detail: '3 × 20 reps', tip: 'Full range — all the way up and all the way down, slow' },
      { name: 'DB sumo squat',       detail: '3 × 15 reps', tip: 'Wide stance, toes out 45°, weight in heels' },
    ]
  },
  Tue: {
    title: 'Cardio + core',
    tag: 'Treadmill + jump rope',
    tagClass: 'tag-cardio',
    icon: 'ti-run',
    exercises: [
      { name: 'Jump rope intervals',    detail: '8 × 60 sec on / 45 sec off', tip: 'Land softly on balls of feet, slight knee bend — weighted rope makes this brutally effective' },
      { name: 'Treadmill incline walk', detail: '20 min at 3–4% incline',     tip: 'Conversational pace — you should be able to speak in full sentences' },
      { name: 'Dead bug',               detail: '3 × 10 reps',                tip: 'Lower back stays pressed into the floor the entire time' },
      { name: 'DB plank row',           detail: '3 × 8 each side',            tip: 'Hips stay square — do not rotate. This is core work, not back work' },
      { name: 'Pallof press',           detail: '3 × 12 reps',                tip: 'Resist rotation — this is the whole point. Core stays braced throughout' },
    ]
  },
  Wed: {
    title: 'Active recovery',
    tag: 'Low intensity',
    tagClass: 'tag-rest',
    icon: 'ti-walk',
    exercises: [
      { name: 'Treadmill easy walk', detail: '30 min at 2–3% incline', tip: 'Keep it genuinely easy — this is recovery, not a workout. Heart rate under 120.' },
      { name: 'Hip flexor stretch',  detail: '2 min each side',        tip: 'Hold at tension, breathe deeply and relax further into it each exhale' },
      { name: 'Hamstring stretch',   detail: '2 min each side',        tip: 'Slight knee bend is fine — never force it, especially at bodyweight' },
    ]
  },
  Thu: {
    title: 'Lower body circuit B',
    tag: 'Legs · 45 sec rest',
    tagClass: 'tag-lower',
    icon: 'ti-barbell',
    exercises: [
      { name: 'DB deadlift',             detail: '4 × 15 reps',     tip: 'Keep DBs close to legs throughout, chest up, proud posture' },
      { name: 'DB reverse lunge',        detail: '3 × 12 each leg', tip: 'Step BACK not forward — far easier on knee joint loading' },
      { name: 'Single-leg glute bridge', detail: '3 × 15 each leg', tip: 'Non-working leg extended, drive through heel of planted foot' },
      { name: 'DB step-up to bench',     detail: '3 × 12 each leg', tip: 'Drive through the heel of the elevated foot to stand — glute activation' },
      { name: 'Calf raise',              detail: '3 × 20 reps',     tip: 'Full range of motion every rep. Slow on the way down.' },
    ]
  },
  Fri: {
    title: 'Rest day',
    tag: 'Full rest',
    tagClass: 'tag-rest',
    icon: 'ti-zzz',
    exercises: [
      { name: 'Sleep 7–9 hours',     detail: 'Recovery is training',    tip: 'Fat burning and muscle repair happen during deep sleep — this is not optional' },
      { name: 'Stay well hydrated',  detail: 'At least 80 oz water',    tip: 'Dehydration causes water retention and hunger — drink even when not thirsty' },
      { name: 'Food log review',     detail: 'Check your eating habits', tip: 'Look back at the week — any patterns? Late night eating? Skipped meals causing binges?' },
    ]
  },
  Sat: {
    title: 'Full body cardio blast',
    tag: 'Highest calorie day',
    tagClass: 'tag-cardio',
    icon: 'ti-flame',
    exercises: [
      { name: 'Jump rope intervals',           detail: '10 × 60 sec / 30 sec rest', tip: 'Push the pace — this is your hardest session of the week. Weighted rope.' },
      { name: 'DB thruster (squat to press)',  detail: '4 × 12 reps',               tip: 'One fluid movement — squat down, then explosively press as you stand. Uses everything.' },
      { name: 'DB deadlift',                   detail: '3 × 15 reps',               tip: 'Moderate weight, controlled pace — focus on form not load' },
      { name: 'Treadmill incline cooldown',    detail: '15 min walk',               tip: 'Bring heart rate down gradually — never stop cold after intervals' },
      { name: 'Dead bug + plank circuit',      detail: '3 rounds',                  tip: '10 dead bugs + 30 sec plank = 1 round. Rest 45 sec between rounds.' },
    ]
  },
  Sun: {
    title: 'Rest day',
    tag: 'Full rest',
    tagClass: 'tag-rest',
    icon: 'ti-zzz',
    exercises: [
      { name: 'Full rest or short walk', detail: 'Listen to your body',     tip: 'A 20 min walk outside is great if you feel good. Force nothing.' },
      { name: 'Meal prep for the week',  detail: 'Sets you up for success', tip: 'Prep protein and vegetables Sunday = no bad decisions Monday through Friday' },
    ]
  }
};

const DAY_NAMES    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const WORKOUT_DAYS = ['Mon','Tue','Thu','Sat'];
const WEEK_ORDER   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// ── Goal & program data ───────────────────────────────────────────────────
const ATHLETE_PROFILE = {
  name: '',
  startWeight: 305,
  targetMin: 240,
  targetMax: 260,
  height: '6\'4"',
  age: 34,
  startDate: null,
  dailyCalories: 2800,
  dailyProtein: 250,
};

const PHASES = [
  {
    num: 1, name: 'Foundation', months: 'Months 1–3', weeks: 'Weeks 1–12',
    color: 'accent', expected: '12–18 lbs lost',
    focus: 'Build the habit. Light weights, nail form. Goblet squats only. Rope: 60-sec intervals. Sessions 35–40 min.',
    milestones: ['Complete 10 workouts', 'Log food for 14 days', 'First inch lost', 'Drop one clothing size']
  },
  {
    num: 2, name: 'Momentum', months: 'Months 4–6', weeks: 'Weeks 13–24',
    color: 'success', expected: '18–24 lbs lost',
    focus: 'Add intensity. Increase weights 5% when sets feel easy. Extend rope to 10 intervals. Athlete instincts kick in.',
    milestones: ['Reintroduce barbell squats', '25 workouts complete', 'Two clothing sizes dropped', '20 lbs milestone']
  },
  {
    num: 3, name: 'Peak', months: 'Months 7–8', weeks: 'Weeks 25–32',
    color: 'warning', expected: 'Final 15–20 lbs',
    focus: 'Finish strong. Add 5th workout day if consistently hitting 4. Loss slows — stay the course. Target: 240–260 lbs.',
    milestones: ['50 workouts complete', 'Target weight range reached', 'Barbell squat back in rotation', 'Maintenance plan set']
  }
];

const NUTRITION_RULES = [
  { icon: 'ti-meat',      title: 'Protein first, every meal', body: '250g/day. 6–8 oz of chicken, fish, or lean beef per meal. Protein keeps you full, protects muscle, and costs more energy to digest.' },
  { icon: 'ti-droplet',   title: 'Eliminate liquid calories', body: 'Soda, juice, sweet coffee, alcohol. Switch to water, black coffee, unsweetened drinks. This one change alone = 400–600 cal daily deficit.' },
  { icon: 'ti-package',   title: 'Cut ultra-processed foods, not carbs', body: 'Chips, crackers, fast food — minimize them. Rice, potatoes, oats, and fruit are fine. You need carbs to fuel training.' },
  { icon: 'ti-clock',     title: 'Stop eating 2–3 hrs before bed', body: 'Late-night eating keeps insulin elevated overnight and blocks fat burning during sleep — your most productive fat-loss window.' },
];
