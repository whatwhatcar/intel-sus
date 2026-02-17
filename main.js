// Attendence
const attendanceCount = document.getElementById('attendance-count');
const attendanceTotal = document.getElementById('attendance-total');

let currentAttendance = 0;
attendanceCount.textContent = currentAttendance;

const maxAttendance = 100;
attendanceTotal.textContent = maxAttendance;

// Progress
const progressFill = document.getElementById('progress-fill');

// Check In
const checkInTextbox = document.getElementById('checkin-textbox');
const checkInSelect = document.getElementById('checkin-select');
const checkInButton = document.getElementById('checkin-button');

// Welcome
const welcomeMessage = document.getElementById('welcome-message');

// Teams
const team1Count = document.getElementById('team1-count');
const team2Count = document.getElementById('team2-count');
const team3Count = document.getElementById('team3-count');

const teamData = {
    "team1": { total: 0, element: team1Count },
    "team2": { total: 0, element: team2Count },
    "team3": { total: 0, element: team3Count }
};

function setProgress() {
    const percentage = (currentAttendance / maxAttendance) * 100;
    const validatedPercent = Math.max(0, Math.min(percentage, 100));
    progressFill.style.width = `${validatedPercent}%`;
}

checkInButton.addEventListener("click", () => {
    const name = checkInTextbox.value.trim();
    const teamKey = checkInSelect.value;

    if (!name || !teamData[teamKey]) return;
    attendanceCount.textContent = ++currentAttendance;
    setProgress();

    const teamName = checkInSelect.options[checkInSelect.selectedIndex].text;
    welcomeMessage.textContent = `Welcome, ${name} from ${teamName}!`;

    const team = teamData[teamKey];
    team.element.textContent = ++team.total;

    checkInTextbox.value = checkInSelect.value = "";
});

setProgress();