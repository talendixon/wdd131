// SkillTracker - Main JavaScript

// Global Variables and State
let skills = [];
let sessions = [];
let currentTimer = null;
let timerInterval = null;
let timerRunning = false;
let timerSeconds = 0;
let currentSkillId = null;

// Data Models
class Skill {
    constructor(id, name, color, goal = 0) {
        this.id = id;
        this.name = name;
        this.color = color || getRandomColor();
        this.goal = goal; // Weekly goal in minutes
    }
}

class Session {
    constructor(skillId, duration, difficulty, notes, tags, date = new Date()) {
        this.id = generateId();
        this.skillId = skillId;
        this.duration = duration; // in minutes
        this.difficulty = difficulty;
        this.notes = notes;
        this.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        this.date = date;
    }
}

// Helper Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function getRandomColor() {
    const colors = [
        '#3A86FF', // Primary
        '#FF006E', // Secondary
        '#FFBE0B', // Accent
        '#FB5607', // Orange
        '#8338EC', // Purple
        '#06D6A0'  // Teal
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

function saveToLocalStorage() {
    localStorage.setItem('skillTracker_skills', JSON.stringify(skills));
    localStorage.setItem('skillTracker_sessions', JSON.stringify(sessions));
}

function loadFromLocalStorage() {
    const savedSkills = localStorage.getItem('skillTracker_skills');
    const savedSessions = localStorage.getItem('skillTracker_sessions');
    
    if (savedSkills) {
        skills = JSON.parse(savedSkills);
    } else {
        // Add some demo skills if none exist
        skills = [
            new Skill(generateId(), 'JavaScript Programming', '#3A86FF', 300),
            new Skill(generateId(), 'Guitar Practice', '#FF006E', 240),
            new Skill(generateId(), 'Spanish Language', '#FFBE0B', 180)
        ];
    }
    
    if (savedSessions) {
        sessions = JSON.parse(savedSessions);
    } else {
        // Add some demo sessions if none exist
        if (skills.length > 0) {
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const twoDaysAgo = new Date(now);
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            
            sessions = [
                new Session(skills[0].id, 45, 3, 'Worked on functions and closures', 'morning, focus', now),
                new Session(skills[0].id, 30, 4, 'Studied DOM manipulation', 'evening', yesterday),
                new Session(skills[1].id, 60, 2, 'Practiced basic chords and transitions', 'relaxed', twoDaysAgo)
            ];
        }
    }
    
    saveToLocalStorage();
}

// DOM Functions
function populateSkillsList() {
    const skillList = document.getElementById('skill-list');
    if (!skillList) return;
    
    skillList.innerHTML = '';
    
    skills.forEach(skill => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = skill.name;
        link.dataset.skillId = skill.id;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('#skill-list a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            currentSkillId = skill.id;
            updateCharts();
            updateHistory();
            updateRecommendations();
        });
        
        listItem.appendChild(link);
        skillList.appendChild(listItem);
    });
    
    // Activate the first skill by default
    if (skills.length > 0 && skillList.querySelector('a')) {
        skillList.querySelector('a').classList.add('active');
        currentSkillId = skills[0].id;
    }
}

function populateSkillSelects() {
    const selects = ['skill-select', 'timer-skill'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '';
        
        skills.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill.id;
            option.textContent = skill.name;
            select.appendChild(option);
        });
    });
}

function updateMetrics() {
    const totalTimeElem = document.getElementById('total-time');
    const currentStreakElem = document.getElementById('current-streak');
    const skillsCountElem = document.getElementById('skills-count');
    const goalProgressElem = document.getElementById('goal-progress');
    const goalPercentageElem = document.getElementById('goal-percentage');
    
    if (!totalTimeElem || !currentStreakElem || !skillsCountElem || !goalProgressElem || !goalPercentageElem) return;
    
    // Calculate total practice time in hours
    const totalMinutes = sessions.reduce((total, session) => total + parseInt(session.duration), 0);
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal place
    totalTimeElem.textContent = `${totalHours} hrs`;
    
    // Calculate current streak
    const streak = calculateStreak();
    currentStreakElem.textContent = `${streak} days`;
    
    // Count skills
    skillsCountElem.textContent = skills.length;
    
    // Calculate weekly goal progress
    const weeklyProgress = calculateWeeklyGoalProgress();
    goalProgressElem.querySelector('.progress').style.width = `${weeklyProgress}%`;
    goalPercentageElem.textContent = `${Math.round(weeklyProgress)}%`;
}

function calculateStreak() {
    if (sessions.length === 0) return 0;
    
    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get today's date with time set to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if practiced today
    const latestSessionDate = new Date(sortedSessions[0].date);
    latestSessionDate.setHours(0, 0, 0, 0);
    
    if (latestSessionDate.getTime() !== today.getTime()) {
        // No practice today, check if practiced yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (latestSessionDate.getTime() !== yesterday.getTime()) {
            // No practice yesterday either, streak is 0
            return 0;
        }
    }
    
    // Count consecutive days
    let streak = 1;
    let currentDate = new Date(latestSessionDate);
    
    for (let i = 1; i < sortedSessions.length; i++) {
        const previousDate = new Date(sortedSessions[i].date);
        previousDate.setHours(0, 0, 0, 0);
        
        // Check if the previous session was the day before
        currentDate.setDate(currentDate.getDate() - 1);
        
        if (previousDate.getTime() === currentDate.getTime()) {
            streak++;
            // Continue checking the streak
        } else {
            // Streak is broken
            break;
        }
    }
    
    return streak;
}

function calculateWeeklyGoalProgress() {
    if (skills.length === 0) return 0;
    
    // Get current week's sessions
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startOfWeek;
    });
    
    // Calculate total goal minutes for all skills
    const totalGoalMinutes = skills.reduce((total, skill) => total + parseInt(skill.goal || 0), 0);
    
    if (totalGoalMinutes === 0) return 0;
    
    // Calculate total minutes practiced this week
    const weeklyMinutes = weekSessions.reduce((total, session) => total + parseInt(session.duration), 0);
    
    // Calculate percentage
    return Math.min(100, (weeklyMinutes / totalGoalMinutes) * 100);
}

function updateCharts() {
    const chartCanvas = document.getElementById('progress-chart');
    if (!chartCanvas) return;
    
    // Get last 7 days of data
    const dates = [];
    const dateLabels = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
        
        const options = { weekday: 'short' };
        dateLabels.push(date.toLocaleDateString(undefined, options));
    }
    
    // Get data for the selected skill or all skills
    let dataBySkill = {};
    
    sessions.forEach(session => {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        
        // Check if session is within the last 7 days
        const matchingDateIndex = dates.findIndex(date => date.getTime() === sessionDate.getTime());
        
        if (matchingDateIndex !== -1) {
            // If a specific skill is selected, only include its data
            if (currentSkillId && session.skillId !== currentSkillId) return;
            
            // Initialize skill data if it doesn't exist
            if (!dataBySkill[session.skillId]) {
                const skill = skills.find(s => s.id === session.skillId);
                dataBySkill[session.skillId] = {
                    label: skill ? skill.name : 'Unknown Skill',
                    backgroundColor: skill ? skill.color : '#ccc',
                    data: Array(7).fill(0)
                };
            }
            
            // Add session duration to the corresponding date
            dataBySkill[session.skillId].data[matchingDateIndex] += parseInt(session.duration);
        }
    });
    
    // Convert data object to array
    const datasets = Object.values(dataBySkill);
    
    // Determine if we need to display a stacked chart (all skills) or a single bar chart (one skill)
    const chartType = currentSkillId ? 'bar' : 'bar';
    const stacked = !currentSkillId;
    
    // Destroy existing chart if it exists
    if (window.progressChart) {
        window.progressChart.destroy();
    }
    
    // Create new chart
    window.progressChart = new Chart(chartCanvas, {
        type: chartType,
        data: {
            labels: dateLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: stacked
                },
                y: {
                    stacked: stacked,
                    title: {
                        display: true,
                        text: 'Minutes Practiced'
                    }
                }
            }
        }
    });
}

function updateHistory() {
    const historyTable = document.getElementById('history-table');
    if (!historyTable) return;
    
    historyTable.innerHTML = '';
    
    // Get recent sessions for the current skill or all skills
    let recentSessions = [...sessions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
    
    // Filter by current skill if one is selected
    if (currentSkillId) {
        recentSessions = recentSessions.filter(session => session.skillId === currentSkillId);
    }
    
    if (recentSessions.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 5;
        emptyCell.textContent = 'No practice sessions recorded yet';
        emptyCell.style.textAlign = 'center';
        emptyRow.appendChild(emptyCell);
        historyTable.appendChild(emptyRow);
        return;
    }
    
    recentSessions.forEach(session => {
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(session.date);
        
        const skillCell = document.createElement('td');
        const skill = skills.find(s => s.id === session.skillId);
        skillCell.textContent = skill ? skill.name : 'Unknown Skill';
        
        const durationCell = document.createElement('td');
        durationCell.textContent = `${session.duration} min`;
        
        const difficultyCell = document.createElement('td');
        difficultyCell.textContent = '⭐'.repeat(session.difficulty);
        
        const notesCell = document.createElement('td');
        notesCell.textContent = session.notes || 'No notes';
        
        row.appendChild(dateCell);
        row.appendChild(skillCell);
        row.appendChild(durationCell);
        row.appendChild(difficultyCell);
        row.appendChild(notesCell);
        
        historyTable.appendChild(row);
    });
}

function updateRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations-container');
    if (!recommendationsContainer) return;
    
    // Generate recommendations based on practice data
    const recommendations = generateRecommendations();
    
    recommendationsContainer.innerHTML = '';
    
    if (recommendations.length === 0) {
        recommendationsContainer.innerHTML = '<p>Log more practice sessions to receive personalized recommendations.</p>';
        return;
    }
    
    recommendations.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        const title = document.createElement('h3');
        title.textContent = rec.title;
        
        const content = document.createElement('p');
        content.textContent = rec.content;
        
        card.appendChild(title);
        card.appendChild(content);
        recommendationsContainer.appendChild(card);
    });
}

function generateRecommendations() {
    const recommendations = [];
    
    // If no sessions, return empty recommendations
    if (sessions.length === 0) return recommendations;
    
    // Get data for the selected skill or all skills
    const filteredSessions = currentSkillId 
        ? sessions.filter(session => session.skillId === currentSkillId)
        : sessions;
    
    if (filteredSessions.length === 0) return recommendations;
    
    // 1. Time of day recommendation
    const timeRecommendation = analyzeOptimalPracticeTime(filteredSessions);
    if (timeRecommendation) {
        recommendations.push(timeRecommendation);
    }
    
    // 2. Consistency recommendation
    const consistencyRecommendation = analyzeConsistency(filteredSessions);
    if (consistencyRecommendation) {
        recommendations.push(consistencyRecommendation);
    }
    
    // 3. Session length recommendation
    const lengthRecommendation = analyzeSessionLength(filteredSessions);
    if (lengthRecommendation) {
        recommendations.push(lengthRecommendation);
    }
    
    // 4. Skill-specific goal recommendation
    if (currentSkillId) {
        const goalRecommendation = analyzeGoalProgress(currentSkillId);
        if (goalRecommendation) {
            recommendations.push(goalRecommendation);
        }
    }
    
    return recommendations;
}

function analyzeOptimalPracticeTime(sessions) {
    // Group sessions by time of day
    const morningCount = sessions.filter(session => {
        const date = new Date(session.date);
        const hour = date.getHours();
        return hour >= 5 && hour < 12;
    }).length;
    
    const afternoonCount = sessions.filter(session => {
        const date = new Date(session.date);
        const hour = date.getHours();
        return hour >= 12 && hour < 17;
    }).length;
    
    const eveningCount = sessions.filter(session => {
        const date = new Date(session.date);
        const hour = date.getHours();
        return hour >= 17 && hour < 22;
    }).length;
    
    const nightCount = sessions.filter(session => {
        const date = new Date(session.date);
        const hour = date.getHours();
        return hour >= 22 || hour < 5;
    }).length;
    
    // Find the time with the most sessions
    const timeSlots = [
        { name: 'morning', count: morningCount },
        { name: 'afternoon', count: afternoonCount },
        { name: 'evening', count: eveningCount },
        { name: 'night', count: nightCount }
    ];
    
    const optimalTime = timeSlots.reduce((best, current) => {
        return current.count > best.count ? current : best;
    }, { name: '', count: 0 });
    
    if (optimalTime.count === 0) return null;
    
    return {
        title: 'Optimal Practice Time',
        content: `You seem to practice most often in the ${optimalTime.name}. Consider scheduling your sessions during this time for consistency.`
    };
}

function analyzeConsistency(sessions) {
    // Check if there are enough sessions to analyze
    if (sessions.length < 3) return null;
    
    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate average days between sessions
    let totalGaps = 0;
    let gapCount = 0;
    
    for (let i = 1; i < sortedSessions.length; i++) {
        const currentDate = new Date(sortedSessions[i].date);
        const previousDate = new Date(sortedSessions[i-1].date);
        
        // Calculate days between
        const diffTime = Math.abs(currentDate - previousDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        totalGaps += diffDays;
        gapCount++;
    }
    
    if (gapCount === 0) return null;
    
    const avgGap = totalGaps / gapCount;
    
    if (avgGap > 3) {
        return {
            title: 'Improve Consistency',
            content: `On average, you practice every ${Math.round(avgGap)} days. Consider practicing more frequently for better skill development.`
        };
    } else if (avgGap <= 1.5) {
        return {
            title: 'Great Consistency!',
            content: 'You have excellent practice consistency. Keep up the good work!'
        };
    } else {
        return {
            title: 'Good Consistency',
            content: `You practice about every ${Math.round(avgGap)} days. Try to reduce this to daily sessions for optimal progress.`
        };
    }
}

function analyzeSessionLength(sessions) {
    // Calculate average session length
    const totalDuration = sessions.reduce((total, session) => total + parseInt(session.duration), 0);
    const avgDuration = totalDuration / sessions.length;
    
    if (avgDuration < 15) {
        return {
            title: 'Increase Session Duration',
            content: 'Your practice sessions average less than 15 minutes. Consider extending to 20-30 minutes for more effective skill building.'
        };
    } else if (avgDuration > 60) {
        return {
            title: 'Consider Shorter, Regular Sessions',
            content: 'Your sessions average over an hour. Research shows that multiple shorter sessions can be more effective than single long ones.'
        };
    } else {
        return {
            title: 'Optimal Session Length',
            content: `Your average session of ${Math.round(avgDuration)} minutes is within the recommended range for effective skill development.`
        };
    }
}

function analyzeGoalProgress(skillId) {
    const skill = skills.find(s => s.id === skillId);
    if (!skill || !skill.goal) return null;
    
    // Get current week's sessions for this skill
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startOfWeek && session.skillId === skillId;
    });
    
    // Calculate total minutes practiced this week
    const weeklyMinutes = weekSessions.reduce((total, session) => total + parseInt(session.duration), 0);
    
    // Calculate percentage of goal
    const goalPercentage = (weeklyMinutes / skill.goal) * 100;
    
    if (goalPercentage < 25) {
        return {
            title: 'Weekly Goal Progress',
            content: `You've completed ${Math.round(goalPercentage)}% of your weekly goal for ${skill.name}. You need to practice for ${skill.goal - weeklyMinutes} more minutes to reach your goal.`
        };
    } else if (goalPercentage < 75) {
        return {
            title: 'Keep Going!',
            content: `You're making good progress on your weekly goal for ${skill.name}. Just ${skill.goal - weeklyMinutes} more minutes to go!`
        };
    } else if (goalPercentage < 100) {
        return {
            title: 'Almost There!',
            content: `You're at ${Math.round(goalPercentage)}% of your weekly goal for ${skill.name}. Just ${skill.goal - weeklyMinutes} more minutes to complete it!`
        };
    } else {
        return {
            title: 'Goal Achieved!',
            content: `Congratulations! You've reached your weekly goal for ${skill.name}. Consider setting a higher goal for next week.`
        };
    }
}

// Timer Functions
function startTimer() {
    const skillSelect = document.getElementById('timer-skill');
    if (!skillSelect) return;
    
    currentSkillId = skillSelect.value;
    
    if (!currentSkillId) {
        alert('Please select a skill first.');
        return;
    }
    
    if (timerRunning) return;
    
    timerRunning = true;
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-timer');
    const stopBtn = document.getElementById('stop-timer');
    
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    
    timerInterval = setInterval(() => {
        timerSeconds++;
        if (timerDisplay) timerDisplay.textContent = formatTime(timerSeconds);
    }, 1000);
}

function stopTimer() {
    if (!timerRunning) return;
    
    clearInterval(timerInterval);
    timerRunning = false;
    
    const startBtn = document.getElementById('start-timer');
    const stopBtn = document.getElementById('stop-timer');
    
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    
    // Convert seconds to minutes
    const minutes = Math.ceil(timerSeconds / 60);
    
    // Pre-fill the session form
    const durationInput = document.getElementById('session-duration');
    if (durationInput) durationInput.value = minutes;
    
    const skillSelect = document.getElementById('skill-select');
    if (skillSelect) skillSelect.value = currentSkillId;
    
    // Reset timer
    timerSeconds = 0;
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) timerDisplay.textContent = formatTime(0);
    
    // Show the session form
    const sessionForm = document.getElementById('session-form-container');
    if (sessionForm) {
        sessionForm.style.display = 'block';
        sessionForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerSeconds = 0;
    
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-timer');
    const stopBtn = document.getElementById('stop-timer');
    
    if (timerDisplay) timerDisplay.textContent = formatTime(0);
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
}

// Form Handling
function addNewSkill(e) {
    if (e) e.preventDefault();
    
    const nameInput = document.getElementById('skill-name');
    const colorInput = document.getElementById('skill-color');
    const goalInput = document.getElementById('skill-goal');
    
    if (!nameInput || !nameInput.value.trim()) {
        alert('Please enter a skill name.');
        return;
    }
    
    const newSkill = new Skill(
        generateId(),
        nameInput.value.trim(),
        colorInput && colorInput.value ? colorInput.value : getRandomColor(),
        goalInput && goalInput.value ? parseInt(goalInput.value) : 0
    );
    
    skills.push(newSkill);
    saveToLocalStorage();
    
    // Reset form
    if (nameInput) nameInput.value = '';
    if (colorInput) colorInput.value = '#3A86FF';
    if (goalInput) goalInput.value = '';
    
    // Update UI
    populateSkillsList();
    populateSkillSelects();
    updateMetrics();
    updateCharts();
    
    // Hide the form
    const skillFormContainer = document.getElementById('skill-form-container');
    if (skillFormContainer) skillFormContainer.style.display = 'none';
    
    return newSkill;
}

function logSession(e) {
    if (e) e.preventDefault();
    
    const skillSelect = document.getElementById('skill-select');
    const durationInput = document.getElementById('session-duration');
    const difficultySelect = document.getElementById('session-difficulty');
    const notesInput = document.getElementById('session-notes');
    const tagsInput = document.getElementById('session-tags');
    
    if (!skillSelect || !skillSelect.value) {
        alert('Please select a skill.');
        return;
    }
    
    if (!durationInput || !durationInput.value) {
        alert('Please enter a duration.');
        return;
    }
    
    const newSession = new Session(
        skillSelect.value,
        parseInt(durationInput.value),
        parseInt(difficultySelect ? difficultySelect.value : 3),
        notesInput ? notesInput.value : '',
        tagsInput ? tagsInput.value : ''
    );
    
    sessions.push(newSession);
    saveToLocalStorage();
    
    // Reset form
    if (durationInput) durationInput.value = '';
    if (difficultySelect) difficultySelect.value = '3';
    if (notesInput) notesInput.value = '';
    if (tagsInput) tagsInput.value = '';
    
    // Update UI
    updateMetrics();
    updateCharts();
    updateHistory();
    updateRecommendations();
    
    // Hide the form
    const sessionFormContainer = document.getElementById('session-form-container');
    if (sessionFormContainer) sessionFormContainer.style.display = 'none';
    
    return newSession;
}

// Testimonial Carousel
function setupTestimonialCarousel() {
    const testimonials = [
        {
            text: "SkillTracker has completely changed how I approach learning guitar. Being able to see my progress visually keeps me motivated even on tough days.",
            author: "Jamie S., Guitar Student"
        },
        {
            text: "As a language learner, consistency is everything. This app helps me maintain my daily practice streak and shows me exactly where I'm improving.",
            author: "Miguel R., Language Enthusiast"
        },
        {
            text: "I use SkillTracker for coding practice and the insights about my optimal practice times were spot on. Now I schedule my learning sessions for when I'm most productive.",
            author: "Taylor K., Developer"
        }
    ];
    
    const carousel = document.getElementById('testimonial-carousel');
    if (!carousel) return;
    
    let currentIndex = 0;
    
    function displayTestimonial(index) {
        carousel.innerHTML = '';
        
        const testimonial = testimonials[index];
        const testimonialDiv = document.createElement('div');
        testimonialDiv.className = 'testimonial';
        
        const quoteDiv = document.createElement('div');
        quoteDiv.className = 'quote';
        quoteDiv.textContent = `"${testimonial.text}"`;
        
        const authorDiv = document.createElement('div');
        authorDiv.className = 'author';
        authorDiv.textContent = testimonial.author;
        
        testimonialDiv.appendChild(quoteDiv);
        testimonialDiv.appendChild(authorDiv);
        carousel.appendChild(testimonialDiv);
    }
    
    // Display first testimonial
    displayTestimonial(currentIndex);
    
    // Set up navigation
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            displayTestimonial(currentIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            displayTestimonial(currentIndex);
        });
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        displayTestimonial(currentIndex);
    }, 8000);
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Load data
    loadFromLocalStorage();
    
    // Initialize UI
    populateSkillsList();
    populateSkillSelects();
    updateMetrics();
    updateCharts();
    updateHistory();
    updateRecommendations();
    setupTestimonialCarousel();
    
    // Skill form event listeners
    const newSkillBtn = document.getElementById('new-skill-btn');
    const skillForm = document.getElementById('skill-form');
    const cancelSkillBtn = document.getElementById('cancel-skill');
    
    if (newSkillBtn) {
        newSkillBtn.addEventListener('click', () => {
            const skillFormContainer = document.getElementById('skill-form-container');
            if (skillFormContainer) skillFormContainer.style.display = 'block';
        });
    }
    
    if (skillForm) {
        skillForm.addEventListener('submit', addNewSkill);
    }
    
    if (cancelSkillBtn) {
        cancelSkillBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const skillFormContainer = document.getElementById('skill-form-container');
            if (skillFormContainer) skillFormContainer.style.display = 'none';
        });
    }
    
    // Session form event listeners
    const newSessionBtn = document.getElementById('new-session-btn');
    const sessionForm = document.getElementById('session-form');
    const cancelSessionBtn = document.getElementById('cancel-session');
    
    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', () => {
            const sessionFormContainer = document.getElementById('session-form-container');
            if (sessionFormContainer) sessionFormContainer.style.display = 'block';
        });
    }
    
    if (sessionForm) {
        sessionForm.addEventListener('submit', logSession);
    }
    
    if (cancelSessionBtn) {
        cancelSessionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const sessionFormContainer = document.getElementById('session-form-container');
            if (sessionFormContainer) sessionFormContainer.style.display = 'none';
        });
    }
    
    // Timer event listeners
    const startTimerBtn = document.getElementById('start-timer');
    const stopTimerBtn = document.getElementById('stop-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    
    if (startTimerBtn) {
        startTimerBtn.addEventListener('click', startTimer);
    }
    
    if (stopTimerBtn) {
        stopTimerBtn.addEventListener('click', stopTimer);
    }
    
    if (resetTimerBtn) {
        resetTimerBtn.addEventListener('click', resetTimer);
    }
    
    // Login/Register event listeners
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Login functionality will be implemented in a future version.');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Registration functionality will be implemented in a future version.');
        });
    }
    
    // Handle tab switching in dashboard if present
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked tab
            link.classList.add('active');
            
            // Show the corresponding tab content
            const tabId = link.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            const tabContent = document.getElementById(tabId);
            if (tabContent) tabContent.style.display = 'block';
            
            // Update the charts if we're showing the analytics tab
            if (tabId === 'analytics-tab') {
                if (window.progressChart) window.progressChart.update();
            }
        });
    });
    
    // Activate the first tab by default if tabs exist
    if (tabLinks.length > 0) {
        const firstTabLink = tabLinks[0];
        firstTabLink.classList.add('active');
        
        const firstTabId = firstTabLink.getAttribute('data-tab');
        const firstTabContent = document.getElementById(firstTabId);
        if (firstTabContent) firstTabContent.style.display = 'block';
    }
});