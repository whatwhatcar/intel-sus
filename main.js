// 1. Select the element
const progressFill = document.getElementById('progress-fill');

// 2. Create a function to update the percentage
function setProgress(percent) {
    // Ensure the percent stays between 0 and 100
    const validatedPercent = Math.max(0, Math.min(percent, 100));

    // Update the width style property
    progressFill.style.width = `${validatedPercent}%`;
}

// Example: Set to 75% after 1 second
setTimeout(() => {
    setProgress(25);
}, 1000);