$(document).ready(function () {
    // Function to render the equity curve chart
    function renderEquityCurveChart(data) {
        const ctx = document.getElementById('equityCurveChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.dates,
                datasets: [{
                    label: 'Equity Curve',
                    data: data.equityValues,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Function to render the drawdown chart
    function renderDrawdownChart(data) {
        const ctx = document.getElementById('drawdownChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.dates,
                datasets: [{
                    label: 'Drawdown',
                    data: data.drawdownValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Function to fetch backtesting results and render charts
    async function fetchAndRenderCharts() {
        try {
            const response = await fetch('/api/backtestResults'); // Ensure this endpoint matches your actual API endpoint for backtesting results
            if (!response.ok) {
                throw new Error('Failed to fetch strategies');
            }
            const backtestResults = await response.json();
            renderEquityCurveChart(backtestResults.equityCurveData);
            renderDrawdownChart(backtestResults.drawdownData);
        } catch (error) {
            console.error('Error fetching backtest results:', error.message);
            console.error(error.stack);
        }
    }

    // Call the function to fetch backtest results and render charts
    fetchAndRenderCharts();
});