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
      { name: 'Hip flexor stretch',  detail: '2 min each side',        tip: 'Hold at tension, breathe deeply and relax further into it each exhale',        desc: 'Kneel on one knee (half-kneeling position) with your back knee on the floor and front foot flat. Shift your hips forward slowly until you feel a stretch at the front of your back hip and thigh. Keep your torso upright and core lightly braced.' },
      { name: 'Hamstring stretch',   detail: '2 min each side',        tip: 'Slight knee bend is fine — never force it, especially at bodyweight',               desc: 'Sit on the floor with one leg extended straight, the other bent comfortably. Keeping your back flat, hinge forward at the hips toward your extended foot until you feel a stretch in the back of your thigh. Do not round your lower back.' },
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

// ── Daily meal suggestions ────────────────────────────────────────────────
const MEALS = {
  Mon: [
    { type: 'Breakfast', name: 'Eggs & oats',            items: ['5 scrambled eggs', '1½ cups oatmeal with cinnamon', 'Black coffee'],                           protein: 42, cals: 520 },
    { type: 'Lunch',     name: 'Chicken rice bowl',       items: ['8 oz grilled chicken breast', '1½ cups white rice', 'Steamed broccoli + olive oil'],           protein: 65, cals: 620 },
    { type: 'Snack',     name: 'Cottage cheese',          items: ['1½ cups cottage cheese', 'Sliced cucumber', '1 apple'],                                        protein: 32, cals: 240 },
    { type: 'Dinner',    name: 'Beef & sweet potato',     items: ['8 oz 90% lean ground beef', '1 large sweet potato', 'Sautéed peppers & zucchini'],             protein: 58, cals: 600 },
  ],
  Tue: [
    { type: 'Breakfast', name: 'Greek yogurt power bowl', items: ['1½ cups plain Greek yogurt', '1 cup berries', '2 tbsp peanut butter', 'Black coffee'],        protein: 45, cals: 490 },
    { type: 'Lunch',     name: 'Ground turkey bowl',      items: ['8 oz ground turkey (93%)', '1½ cups rice', 'Salsa + shredded lettuce'],                        protein: 62, cals: 580 },
    { type: 'Snack',     name: 'Eggs & fruit',            items: ['3 hard-boiled eggs', '1 banana', 'Handful of almonds'],                                        protein: 24, cals: 310 },
    { type: 'Dinner',    name: 'Salmon & vegetables',     items: ['8 oz salmon fillet', 'Roasted asparagus + olive oil', '½ cup white rice'],                     protein: 60, cals: 580 },
  ],
  Wed: [
    { type: 'Breakfast', name: 'Veggie egg scramble',     items: ['5 eggs', 'Spinach, peppers, onion', '2 slices whole grain toast', 'Black coffee'],             protein: 38, cals: 510 },
    { type: 'Lunch',     name: 'Tuna salad plate',        items: ['2 cans tuna in water', 'Mixed greens + olive oil', '½ cup cottage cheese', 'Crackers'],        protein: 60, cals: 520 },
    { type: 'Snack',     name: 'Protein shake',           items: ['2 scoops whey protein', '1 cup milk', '1 banana'],                                             protein: 52, cals: 380 },
    { type: 'Dinner',    name: 'Chicken thighs & greens', items: ['8 oz chicken thighs (skin off)', 'Roasted broccoli + garlic', '1 cup white rice'],             protein: 58, cals: 560 },
  ],
  Thu: [
    { type: 'Breakfast', name: 'Eggs & potatoes',         items: ['5 eggs any style', '1 cup diced potatoes (roasted)', 'Salsa', 'Black coffee'],                 protein: 36, cals: 530 },
    { type: 'Lunch',     name: 'Lean beef rice bowl',     items: ['8 oz 90% lean ground beef', '1½ cups rice', 'Roasted sweet corn + black beans'],               protein: 62, cals: 650 },
    { type: 'Snack',     name: 'Greek yogurt & nuts',     items: ['1 cup plain Greek yogurt', 'Handful of walnuts', '1 orange'],                                  protein: 22, cals: 310 },
    { type: 'Dinner',    name: 'Tilapia & vegetables',    items: ['10 oz tilapia fillets', 'Sautéed zucchini & bell pepper', '1 cup white rice'],                  protein: 62, cals: 560 },
  ],
  Fri: [
    { type: 'Breakfast', name: 'Cottage cheese bowl',     items: ['1½ cups cottage cheese', '1 cup pineapple chunks', '2 tbsp peanut butter', 'Black coffee'],    protein: 42, cals: 480 },
    { type: 'Lunch',     name: 'Chicken salad wrap',      items: ['8 oz grilled chicken', 'Large flour tortilla', 'Lettuce, tomato, avocado, Greek yogurt'],       protein: 58, cals: 620 },
    { type: 'Snack',     name: 'Hard-boiled eggs',        items: ['4 hard-boiled eggs', '1 apple', 'String cheese'],                                              protein: 34, cals: 310 },
    { type: 'Dinner',    name: 'Pork tenderloin & sides', items: ['10 oz pork tenderloin', 'Roasted sweet potato', 'Steamed green beans'],                        protein: 62, cals: 560 },
  ],
  Sat: [
    { type: 'Breakfast', name: 'Pre-workout protein oats', items: ['1½ cups oats', '1 scoop protein powder', '1 banana', 'Black coffee'],                         protein: 42, cals: 560 },
    { type: 'Lunch',     name: 'Post-workout chicken',     items: ['10 oz grilled chicken breast', '2 cups white rice', 'Broccoli + teriyaki sauce (light)'],      protein: 78, cals: 720 },
    { type: 'Snack',     name: 'Cottage cheese & fruit',  items: ['1½ cups cottage cheese', '1 cup strawberries', '1 tbsp honey'],                                protein: 32, cals: 240 },
    { type: 'Dinner',    name: 'Steak & sweet potato',    items: ['8 oz sirloin steak', '1 large sweet potato', 'Side salad + olive oil'],                        protein: 60, cals: 600 },
  ],
  Sun: [
    { type: 'Breakfast', name: 'Sunday eggs',             items: ['5 eggs over-easy', '2 slices turkey bacon', '1 cup fruit salad', 'Black coffee'],               protein: 40, cals: 480 },
    { type: 'Lunch',     name: 'Meal prep chicken bowl',  items: ['8 oz rotisserie chicken (no skin)', '1½ cups rice', 'Roasted vegetables'],                      protein: 62, cals: 580 },
    { type: 'Snack',     name: 'Beef jerky & almonds',    items: ['2 oz beef jerky', 'Handful of almonds', '1 orange'],                                           protein: 22, cals: 280 },
    { type: 'Dinner',    name: 'Salmon & greens',         items: ['8 oz salmon', 'Large spinach salad + olive oil + lemon', '1 cup quinoa'],                       protein: 58, cals: 580 },
  ],
};
