// script.js
const languageTexts = {
  en: {
    inputs: 'Enter Your Information',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    age: 'Age',
    height: 'Height',
    weight: 'Current Weight',
    activity: 'Activity Level',
    goal: 'Weight Loss Goal',
    calculate: 'Calculate',
    sedentary: 'Sedentary',
    light: 'Lightly Active',
    moderate: 'Moderately Active',
    active: 'Active',
    extra: 'Extra Active',
    unsafe: '⚠️ Unsafe: too fast',
    safe: '✅ Safe & sustainable',
    bmi: 'BMI',
    bmr: 'BMR',
    tdee: 'TDEE',
    obesity: 'Obesity Level',
    pounds: 'lb',
    kg: 'kg'
  },
  es: {
    inputs: 'Ingrese su información',
    gender: 'Género',
    male: 'Hombre',
    female: 'Mujer',
    age: 'Edad',
    height: 'Estatura',
    weight: 'Peso actual',
    activity: 'Nivel de actividad',
    goal: 'Meta de pérdida de peso',
    calculate: 'Calcular',
    sedentary: 'Sedentario',
    light: 'Ligera actividad',
    moderate: 'Moderada actividad',
    active: 'Activo',
    extra: 'Muy activo',
    unsafe: '⚠️ Inseguro: demasiado rápido',
    safe: '✅ Seguro y sostenible',
    bmi: 'IMC',
    bmr: 'TMB',
    tdee: 'GET',
    obesity: 'Nivel de obesidad',
    pounds: 'lb',
    kg: 'kg'
  }
};

const languageToggle = document.getElementById('languageToggle');
const unitToggle = document.getElementById('unitToggle');
const resultsDiv = document.getElementById('results');
const calculateBtn = document.getElementById('calculate');

function updateTexts() {
  const lang = languageToggle.value;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(languageTexts[lang][key]) el.textContent = languageTexts[lang][key];
  });
}

languageToggle.addEventListener('change', updateTexts);
updateTexts();

calculateBtn.addEventListener('click', () => {
  const gender = document.getElementById('gender').value;
  const age = parseInt(document.getElementById('age').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const goal = parseFloat(document.getElementById('goal').value);
  const activity = parseFloat(document.getElementById('activity').value);

  let heightCm;
  if(unitToggle.value === 'imperial'){
    const ft = parseInt(document.getElementById('heightFt').value);
    const inch = parseInt(document.getElementById('heightIn').value);
    heightCm = (ft * 12 + inch) * 2.54;
  } else {
    heightCm = parseFloat(document.getElementById('heightFt').value);
  }

  const BMR = gender === 'male' ? 10*weight*0.453592 + 6.25*heightCm - 5*age + 5 : 10*weight*0.453592 + 6.25*heightCm - 5*age -161;
  const TDEE = BMR * activity;
  const heightM = heightCm/100;
  const BMI = (weight*0.453592)/(heightM*heightM);

  let obesityLevel = '';
  if(BMI<18.5) obesityLevel='Underweight';
  else if(BMI<25) obesityLevel='Normal';
  else if(BMI<30) obesityLevel='Overweight';
  else if(BMI<35) obesityLevel='Obesity I';
  else if(BMI<40) obesityLevel='Obesity II';
  else obesityLevel='Obesity III';

  const timeframes = [3,6,12,24];
  let resultsHTML = `<div class='card'><h2 class='text-xl font-semibold mb-2'>Results</h2>`;
  resultsHTML += `<p>${languageTexts[languageToggle.value].bmr}: ${BMR.toFixed(0)}</p>`;
  resultsHTML += `<p>${languageTexts[languageToggle.value].tdee}: ${TDEE.toFixed(0)}</p>`;
  resultsHTML += `<p>${languageTexts[languageToggle.value].bmi}: ${BMI.toFixed(1)} (${obesityLevel})</p>`;

  resultsHTML += `<h3 class='mt-2 mb-2'>${languageTexts[languageToggle.value].goal} (${languageToggle.value==='en' ? 'Calories/day & Weekly Loss' : 'Calorías/día & pérdida semanal'})</h3>`;
  resultsHTML += `<div class='grid md:grid-cols-2 gap-2'>`;

  timeframes.forEach(months => {
    const weeks = months * 4.345;
    const totalDeficit = unitToggle.value==='imperial' ? goal*3500 : goal*7700;
    const dailyDeficit = totalDeficit/(weeks*7);
    const weeklyLoss = unitToggle.value==='imperial' ? dailyDeficit*7/3500 : dailyDeficit*7/7700;
    const goalCalories = TDEE - dailyDeficit;
    const safe = Math.abs(weeklyLoss) > 2 ? 'warning' : 'success';
    resultsHTML += `<div class='card'><h4>${months} months</h4>`;
    resultsHTML += `<p>${languageTexts[languageToggle.value].pounds}: ${weeklyLoss.toFixed(2)} ${unitToggle.value==='imperial'?'lb':'kg'}/week</p>`;
    resultsHTML += `<p>Calories/day: <span class='${safe}'>${goalCalories.toFixed(0)}</span></p>`;
    resultsHTML += `<p class='${safe}'>${Math.abs(weeklyLoss) > 2 ? languageTexts[languageToggle.value].unsafe : languageTexts[languageToggle.value].safe}</p>`;
    resultsHTML += `</div>`;
  });

  resultsHTML += `</div></div>`;
  resultsDiv.innerHTML = resultsHTML;
});
