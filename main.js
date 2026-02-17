// --- Configuration ---
const MAX_ATTENDANCE = 100; // Set this to your target number

// --- DOM Elements ---
const dom = {
    count: document.getElementById('attendance-count'),
    total: document.getElementById('attendance-total'),
    progress: document.getElementById('progress-fill'),
    inputName: document.getElementById('checkin-textbox'),
    selectTeam: document.getElementById('checkin-select'),
    btnCheckIn: document.getElementById('checkin-button'),
    welcome: document.getElementById('welcome-message'),
    teams: {
        team1: {
            el: document.getElementById('team1-count'),
            border: document.getElementById('team1-border'),
            list: document.getElementById('team1-list')
        },
        team2: {
            el: document.getElementById('team2-count'),
            border: document.getElementById('team2-border'),
            list: document.getElementById('team2-list')
        },
        team3: {
            el: document.getElementById('team3-count'),
            border: document.getElementById('team3-border'),
            list: document.getElementById('team3-list')
        }
    }
};

// --- State Management ---
const loadData = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
};

// Load Total Count
let currentAttendance = loadData('intel_total_attendance', 0);

// Load Team Data (Counts and Names)
let teamData = loadData('intel_team_data', {
    team1: { count: 0, names: [] },
    team2: { count: 0, names: [] },
    team3: { count: 0, names: [] }
});

// --- Initialization ---
function init() {
    // Set Totals
    dom.count.innerText = currentAttendance;
    dom.total.innerText = MAX_ATTENDANCE;

    // Set Team Counts and Render Lists
    Object.keys(dom.teams).forEach(teamKey => {
        // Update number
        dom.teams[teamKey].el.innerText = teamData[teamKey].count;
        
        // Render existing names from storage
        teamData[teamKey].names.forEach(name => {
            addNameUserInterface(teamKey, name);
        });
    });

    updateProgressBar();
}

// --- UI Functions ---

function updateProgressBar() {
    const percentage = Math.min((currentAttendance / MAX_ATTENDANCE) * 100, 100);
    dom.progress.style.width = `${percentage}%`;
    
    // Change color as it gets full
    if(percentage === 100) {
        dom.progress.classList.remove('bg-intel-blue');
        dom.progress.classList.add('bg-green-500');
    }
}

function addNameUserInterface(teamKey, name) {
    const listContainer = dom.teams[teamKey].list;
    
    // Create a styled card for the user
    const userCard = document.createElement("div");
    userCard.className = "bg-white p-2 rounded shadow-sm text-sm text-gray-700 border-l-4 border-gray-300 animate-fade-in flex justify-between";
    
    // Updated color logic to match new sustainability themes
    if(teamKey === 'team1') userCard.classList.replace('border-gray-300', 'border-blue-500');
    if(teamKey === 'team2') userCard.classList.replace('border-gray-300', 'border-emerald-500');
    if(teamKey === 'team3') userCard.classList.replace('border-gray-300', 'border-amber-500');

    userCard.innerHTML = `<span>${name}</span> <span class="text-xs text-gray-400 self-center">Checked In</span>`;
    
    listContainer.prepend(userCard);
}

function showWelcome(name, teamName) {
    dom.welcome.classList.remove('hidden');
    dom.welcome.innerHTML = `Welcome <strong>${name}</strong>! You've joined the <strong>${teamName}</strong> team.`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        dom.welcome.classList.add('hidden');
    }, 4000);
}

function highlightTeam(teamKey) {
    const border = dom.teams[teamKey].border;
    // Add a flash effect or highlight
    border.classList.add('ring-4', 'ring-intel-blue/30');
    setTimeout(() => border.classList.remove('ring-4', 'ring-intel-blue/30'), 500);
}

// --- New Function: Determine and Display Winner ---
function handleWinner() {
    const teams = [
        { name: 'Team Water Wise', count: teamData.team1.count, key: 'team1' },
        { name: 'Team Net Zero', count: teamData.team2.count, key: 'team2' },
        { name: 'Team Renewables', count: teamData.team3.count, key: 'team3' }
    ];

    // Sort to find the highest count
    const winner = teams.reduce((prev, current) => (prev.count > current.count) ? prev : current);

    // Update the Winner Banner
    const banner = document.getElementById('winner-banner');
    const winnerText = document.getElementById('winner-text');
    
    winnerText.innerHTML = `🏆 ${winner.name} is the Winner with ${winner.count} members!`;
    banner.classList.remove('hidden');

    // Visual flair for the winning team card
    dom.teams[winner.key].border.classList.add('ring-4', 'ring-yellow-400', 'scale-110', 'z-30');
    
    triggerCelebration();
}

function triggerCelebration() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// --- Event Listeners ---

dom.btnCheckIn.addEventListener("click", () => {
    const name = dom.inputName.value.trim();
    const teamKey = dom.selectTeam.value;

    // Validation
    if (!name) {
        alert("Please enter your name.");
        return;
    }
    if (!teamKey || !dom.teams[teamKey]) {
        alert("Please select a team.");
        return;
    }

    // 1. Update State
    currentAttendance++;
    teamData[teamKey].count++;
    teamData[teamKey].names.push(name);

    // 2. Save to Storage
    localStorage.setItem('intel_total_attendance', currentAttendance);
    localStorage.setItem('intel_team_data', JSON.stringify(teamData));

    // 3. Update DOM
    dom.count.innerText = currentAttendance;
    dom.teams[teamKey].el.innerText = teamData[teamKey].count;
    
    addNameUserInterface(teamKey, name);
    updateProgressBar();
    highlightTeam(teamKey);

    // 4. User Feedback
    const teamName = dom.selectTeam.options[dom.selectTeam.selectedIndex].text;
    showWelcome(name, teamName);

    // 5. Reset Inputs
    dom.inputName.value = "";
    dom.selectTeam.value = "";

    // 6. Check for completion
    if (currentAttendance >= MAX_ATTENDANCE) {
        handleWinner();
    }
});

// Run start logic
init();