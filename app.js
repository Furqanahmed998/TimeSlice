function calculateProgress() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    
    // Year progress
    const yearDaysPassed = (today - startOfYear) / (1000 * 60 * 60 * 24) + 1;
    const yearTotalDays = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24) + 1;
    const yearPercentage = (yearDaysPassed / yearTotalDays) * 100;

    // Month progress
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const monthDaysPassed = today.getDate();
    const monthTotalDays = endOfMonth.getDate();
    const monthPercentage = (monthDaysPassed / monthTotalDays) * 100;

    // Week progress (assuming weeks start on Monday)
    const currentDay = today.getDay() || 7; // Convert Sunday (0) to 7
    const weekPercentage = ((currentDay - 1) / 7) * 100;

    // Update DOM elements
    document.getElementById("current-date").textContent = today.toDateString();
    document.getElementById("current-time").textContent = today.toLocaleTimeString();
    
    // Update progress bars
    updateProgressBar("year-progress", yearPercentage);
    updateProgressBar("month-progress", monthPercentage);
    updateProgressBar("week-progress", weekPercentage);

    return {
        year: {
            percentage: yearPercentage,
            daysPassed: yearDaysPassed,
            daysRemaining: yearTotalDays - yearDaysPassed
        },
        month: {
            percentage: monthPercentage,
            daysPassed: monthDaysPassed,
            daysRemaining: monthTotalDays - monthDaysPassed
        },
        week: {
            percentage: weekPercentage,
            daysPassed: currentDay - 1,
            daysRemaining: 7 - (currentDay - 1)
        }
    };
}

function updateProgressBar(elementId, percentage) {
    document.getElementById(`${elementId}-text`).textContent = percentage.toFixed(2);
    document.getElementById(`${elementId}-fill`).style.width = percentage.toFixed(2) + "%";
}

function drawCharts(progressData) {
    // Year Chart
    createDoughnutChart('yearChart', progressData.year.percentage, 'Year');
    
    // Month Chart
    createDoughnutChart('monthChart', progressData.month.percentage, 'Month');
    
    // Week Chart
    createDoughnutChart('weekChart', progressData.week.percentage, 'Week');
    
    // Days Analysis Chart
    const ctxBar = document.getElementById('daysChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Year', 'Month', 'Week'],
            datasets: [{
                label: 'Days Passed',
                data: [
                    progressData.year.daysPassed,
                    progressData.month.daysPassed,
                    progressData.week.daysPassed
                ],
                backgroundColor: '#2196F3',
                borderWidth: 1
            }, {
                label: 'Days Remaining',
                data: [
                    progressData.year.daysRemaining,
                    progressData.month.daysRemaining,
                    progressData.week.daysRemaining
                ],
                backgroundColor: '#90CAF9',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createDoughnutChart(canvasId, percentage, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: ['#2196F3', '#E3F2FD'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: `${label} Progress`
                }
            }
        }
    });
}

// Initial run
let progressData = calculateProgress();
drawCharts(progressData);

// Update every second
setInterval(() => {
    progressData = calculateProgress();
}, 1000);

// Update charts every hour
setInterval(() => {
    drawCharts(progressData);
}, 3600000);
