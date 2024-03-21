$(document).ready(function() {
    const fetchStrategies = async () => {
        try {
            const response = await fetch('/api/strategies');
            if (!response.ok) {
                throw new Error('Failed to fetch strategies');
            }
            const { strategies } = await response.json();
            const strategyList = $('#strategyList');
            strategyList.empty();
            if (strategies.length === 0) {
                strategyList.append('<p>No strategies found. Start by creating one.</p>');
            } else {
                strategies.forEach(strategy => {
                    strategyList.append(`
                        <div class="strategy-item">
                            <h3>${strategy.strategyName}</h3>
                            <p>Asset Symbol: ${strategy.assetSymbol}</p>
                            <p>Time Frame: ${strategy.timeFrame}</p>
                            <p>Strategy Rules: ${strategy.strategyRules}</p>
                            <button onclick="deleteStrategy('${strategy._id}')">Delete</button>
                            <button onclick="editStrategy('${strategy._id}')">Edit</button>
                            <button onclick="backtestStrategy('${strategy._id}')">Backtest</button>
                            <button onclick="optimizeStrategy('${strategy._id}')">Optimize</button>
                        </div>
                    `);
                });
            }
        } catch (error) {
            console.error('Error fetching strategies:', error.message, error.stack);
        }
    };

    fetchStrategies();

    window.deleteStrategy = async (id) => {
        try {
            const response = await fetch(`/api/strategies/${id}`, { method: 'DELETE' });
            if(response.ok) {
                console.log(`Strategy with ID ${id} deleted successfully`);
                fetchStrategies(); // Refresh the list after deletion
            } else {
                throw new Error('Failed to delete strategy');
            }
        } catch (error) {
            console.error('Error deleting strategy:', error.message, error.stack);
        }
    };

    window.editStrategy = async (id) => {
        console.log(`Edit strategy with ID: ${id}`);
        // Implement strategy edition functionality
    };

    window.backtestStrategy = async (id) => {
        console.log(`Backtest strategy with ID: ${id}`);
        // Implement strategy backtesting functionality
    };

    window.optimizeStrategy = async (id) => {
        console.log(`Optimize strategy with ID: ${id}`);
        // Implement strategy optimization functionality
    };
});