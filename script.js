// ===== PAGE NAVIGATION =====
let currentPage = 1;
const totalPages = 11;

function changePage(direction) {
    const current = document.querySelector(`.form-page[data-page="${currentPage}"]`);
    const next = document.querySelector(`.form-page[data-page="${currentPage + direction}"]`);

    if (direction === 1 && !validatePage(currentPage)) return;

    current.classList.remove('active');
    currentPage += direction;
    next.classList.add('active');

    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').style.display = currentPage === totalPages ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = currentPage === totalPages ? 'inline-block' : 'none';

    updateProgress();

    if (currentPage === 10) updateBMI();
}

function updateProgress() {
    const pct = (currentPage / totalPages) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('stepLabel').textContent = `Step ${currentPage} of ${totalPages}`;
}

function validatePage(page) {
    if (page === 1) {
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const country = document.getElementById('country').value;
        if (!dob || !gender || !country) {
            alert('Please fill in all fields on this page.');
            return false;
        }
    }
    if (page === 2) {
        const smoke = document.querySelector('input[name="smoke"]:checked');
        if (!smoke) { alert('Please select a smoking option.'); return false; }
    }
    if (page === 3) {
        const alcohol = document.querySelector('input[name="alcohol"]:checked');
        if (!alcohol) { alert('Please select an alcohol option.'); return false; }
    }
    if (page === 4) {
        const exercise = document.querySelector('input[name="exercise"]:checked');
        if (!exercise) { alert('Please select an exercise option.'); return false; }
    }
    if (page === 5) {
        const diet = document.querySelector('input[name="diet"]:checked');
        if (!diet) { alert('Please select a diet option.'); return false; }
    }
    if (page === 7) {
        const stress = document.querySelector('input[name="stress"]:checked');
        if (!stress) { alert('Please select a stress level.'); return false; }
    }
    if (page === 8) {
        const conditions = document.querySelectorAll('input[name="conditions"]:checked');
        if (conditions.length === 0) { alert('Please select at least one option.'); return false; }
    }
    if (page === 9) {
        const familyHistory = document.querySelector('input[name="familyHistory"]:checked');
        if (!familyHistory) { alert('Please select a family history option.'); return false; }
    }
    if (page === 11) {
        const seatbelt = document.querySelector('input[name="seatbelt"]:checked');
        const checkups = document.querySelector('input[name="checkups"]:checked');
        if (!seatbelt || !checkups) { alert('Please fill in all fields.'); return false; }
    }
    return true;
}

// ===== BMI CALCULATION =====
function updateBMI() {
    const h = parseFloat(document.getElementById('height').value);
    const w = parseFloat(document.getElementById('weight').value);
    const result = document.getElementById('bmiResult');
    if (h && w) {
        const bmi = (w / ((h / 100) ** 2)).toFixed(1);
        let cat = '';
        let color = '';
        if (bmi < 18.5) { cat = 'Underweight'; color = '#ffaa00'; }
        else if (bmi < 25) { cat = 'Normal'; color = '#00cc66'; }
        else if (bmi < 30) { cat = 'Overweight'; color = '#ff8800'; }
        else { cat = 'Obese'; color = '#ff1a1a'; }
        result.style.display = 'block';
        result.style.background = '#1a1a1a';
        result.style.color = color;
        result.textContent = `BMI: ${bmi} — ${cat}`;
    }
}

// ===== LIFE EXPECTANCY CALCULATION =====
const baseLifeExpectancy = {
    // Country base life expectancy (approx WHO data)
    '840': 77.3, '826': 81.3, '124': 82.7, '036': 83.5,
    '276': 81.3, '250': 82.5, '392': 84.6, '156': 77.3,
    '356': 70.4, '076': 76.4, '484': 75.1, '410': 83.5,
    '724': 83.6, '380': 83.5, '528': 82.3, '752': 83.0,
    '056': 81.6, '756': 83.8, '040': 81.6, '578': 83.2,
    '208': 81.3, '246': 81.9, '620': 82.1, '616': 78.7,
    '203': 79.4, '642': 76.2, '100': 75.1, '300': 82.2,
    '804': 73.6, '643': 73.2, '032': 77.1, '152': 80.2,
    '170': 77.3, '604': 77.0, '710': 64.1, '566': 55.4,
    '818': 72.0, '784': 78.7, '682': 76.9, '376': 83.0,
    '792': 78.0, '360': 72.3, '458': 76.2, '702': 84.1,
    '764': 78.7, '608': 71.4, '554': 82.3, 'other': 73.0
};

// Gender adjustment: females live ~5 years longer on average
const genderModifier = { 'male': -2.5, 'female': 2.5 };

function getVal(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
}

function calculateLifeExpectancy() {
    // Base
    const country = document.getElementById('country').value;
    let le = baseLifeExpectancy[country] || 73.0;

    // Gender
    const gender = document.getElementById('gender').value;
    le += genderModifier[gender] || 0;

    // Age deduction — already lived years reduce remaining
    const dob = new Date(document.getElementById('dob').value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;

    // Smoking
    const smoke = getVal('smoke');
    const smokeYears = parseInt(document.getElementById('smokeYears').value) || 0;
    if (smoke === 'heavy') le -= 8 + Math.min(smokeYears * 0.3, 10);
    else if (smoke === 'light') le -= 4 + Math.min(smokeYears * 0.2, 6);
    else if (smoke === 'former') le -= 1 + Math.min(smokeYears * 0.1, 3);

    // Alcohol
    const alcohol = getVal('alcohol');
    if (alcohol === 'heavy') le -= 6;
    else if (alcohol === 'moderate') le -= 1;
    else if (alcohol === 'social') le += 0.5;

    // Exercise
    const exercise = getVal('exercise');
    if (exercise === 'sedentary') le -= 4;
    else if (exercise === 'light') le -= 1;
    else if (exercise === 'moderate') le += 2;
    else if (exercise === 'active') le += 3.5;

    // Diet
    const diet = getVal('diet');
    if (diet === 'poor') le -= 4;
    else if (diet === 'average') le -= 1;
    else if (diet === 'good') le += 1;
    else if (diet === 'excellent') le += 2.5;

    // Fruits
    const fruits = getVal('fruits');
    if (fruits === 'yes') le += 1.5;
    else le -= 1;

    // Sleep
    const sleep = document.getElementById('sleep').value;
    if (sleep === 'less5') le -= 3;
    else if (sleep === '5to6') le -= 1;
    else if (sleep === '7to8') le += 1;
    else if (sleep === 'more9') le -= 1.5;

    // Insomnia
    const insomnia = getVal('insomnia');
    if (insomnia === 'yes') le -= 2;
    else if (insomnia === 'sometimes') le -= 0.5;

    // Stress
    const stress = getVal('stress');
    if (stress === 'high') le -= 3;
    else if (stress === 'veryhigh') le -= 5;
    else if (stress === 'low') le += 1.5;

    // Health conditions
    const conditions = document.querySelectorAll('input[name="conditions"]:checked');
    const conditionValues = {
        'heart': -8, 'diabetes': -5, 'hypertension': -3,
        'cancer': -7, 'stroke': -6, 'asthma': -2,
        'kidney': -5, 'mental': -2
    };
    conditions.forEach(c => {
        if (conditionValues[c.value]) le += conditionValues[c.value];
    });

    // Family history
    const familyHistory = getVal('familyHistory');
    if (familyHistory === 'yes') le -= 2;

    // Grandparents
    const grandparents = document.getElementById('grandparents').value;
    if (grandparents === 'under60') le -= 4;
    else if (grandparents === '60to70') le -= 2;
    else if (grandparents === 'over80') le += 2;

    // BMI
    const h = parseFloat(document.getElementById('height').value);
    const w = parseFloat(document.getElementById('weight').value);
    if (h && w) {
        const bmi = w / ((h / 100) ** 2);
        if (bmi < 18.5) le -= 2;
        else if (bmi >= 30) le -= 3;
        else if (bmi >= 25) le -= 1;
    }

    // Seatbelt
    const seatbelt = getVal('seatbelt');
    if (seatbelt === 'never') le -= 2;
    else if (seatbelt === 'sometimes') le -= 0.5;

    // Checkups
    const checkups = getVal('checkups');
    if (checkups === 'yes') le += 1.5;
    else if (checkups === 'no') le -= 1.5;

    // Ensure remaining life is at least 1 year and at most cap
    const remaining = Math.max(1, le - age);
    return { remaining, deathYear: today.getFullYear() + Math.ceil(remaining), age };
}

// ===== CALCULATE & SHOW RESULTS =====
function calculate() {
    if (!validatePage(11)) return;

    const { remaining, deathYear, age } = calculateLifeExpectancy();

    const now = new Date();
    const deathDate = new Date(now);
    deathDate.setFullYear(deathDate.getFullYear() + Math.floor(remaining));
    deathDate.setDate(deathDate.getDate() + Math.round((remaining % 1) * 365));

    const diffMs = deathDate.getTime() - now.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const years = Math.floor(totalSeconds / 31536000);
    const days = Math.floor((totalSeconds % 31536000) / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('quizSection').style.display = 'none';
    document.getElementById('clockSection').style.display = 'block';

    document.getElementById('deathDate').textContent =
        `Estimated end date: ${deathDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;

    function pad(n) { return String(n).padStart(2, '0'); }
    document.getElementById('years').textContent = pad(years);
    document.getElementById('days').textContent = pad(days);
    document.getElementById('hours').textContent = pad(hours);
    document.getElementById('minutes').textContent = pad(minutes);
    document.getElementById('seconds').textContent = pad(seconds);

    // Live countdown
    setInterval(() => {
        const s = Math.max(0, Math.floor((deathDate.getTime() - Date.now()) / 1000));
        const y = Math.floor(s / 31536000);
        const d = Math.floor((s % 31536000) / 86400);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        document.getElementById('years').textContent = pad(y);
        document.getElementById('days').textContent = pad(d);
        document.getElementById('hours').textContent = pad(h);
        document.getElementById('minutes').textContent = pad(m);
        document.getElementById('seconds').textContent = pad(sec);
    }, 1000);
}

function restart() {
    location.reload();
}
