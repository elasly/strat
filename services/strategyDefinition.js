class StrategyDefinition {
  constructor(name) {
    this.name = name;
    this.indicators = [];
    this.entryConditions = [];
    this.exitConditions = [];
    this.patterns = []; // Re-introduced to support pattern-based strategies
    this.conditions = []; // Re-introduced for additional rule definitions
    this.riskManagement = {
      stopLoss: null, // Can be a percentage or a fixed value
      takeProfit: null, // Can be a percentage or a fixed value
    };
  }

  // Add an indicator with its name, parameters, and an empty array for conditions
  addIndicator(name, parameters) {
    const indicator = {
      name,
      parameters,
      conditions: []
    };
    this.indicators.push(indicator);
    console.log(`Added indicator: ${name} with parameters: ${JSON.stringify(parameters)}`);
  }

  // Add a condition to an indicator
  addConditionToIndicator(indicatorName, conditionType, conditionValue, comparisonValue) {
    const indicator = this.indicators.find(ind => ind.name === indicatorName);
    if (!indicator) {
      console.error(`Indicator ${indicatorName} not found`);
      throw new Error(`Indicator ${indicatorName} not found`);
    }
    const condition = {
      conditionType,
      conditionValue,
      comparisonValue
    };
    indicator.conditions.push(condition);
    console.log(`Added condition to indicator: ${indicatorName}, condition: ${JSON.stringify(condition)}`);
  }

  // Add an entry condition
  addEntryCondition(indicatorName, condition) {
    this.entryConditions.push({ indicatorName, condition });
    console.log(`Added entry condition for indicator: ${indicatorName}, condition: ${JSON.stringify(condition)}`);
  }

  // Add an exit condition
  addExitCondition(indicatorName, condition) {
    this.exitConditions.push({ indicatorName, condition });
    console.log(`Added exit condition for indicator: ${indicatorName}, condition: ${JSON.stringify(condition)}`);
  }

  // Set the risk management parameters
  setRiskManagement(stopLoss, takeProfit) {
    this.riskManagement.stopLoss = stopLoss;
    this.riskManagement.takeProfit = takeProfit;
    console.log(`Set risk management parameters: stopLoss = ${stopLoss}, takeProfit = ${takeProfit}`);
  }

  // Add a pattern for strategy definition
  addPattern(pattern) {
    this.patterns.push(pattern);
    console.log(`Added pattern for strategy: ${JSON.stringify(pattern)}`);
  }

  // Add a general condition for strategy definition
  addCondition(condition) {
    this.conditions.push(condition);
    console.log(`Added general condition for strategy: ${JSON.stringify(condition)}`);
  }

  // Compile and return the strategy definition
  compile() {
    try {
      console.log(`Compiling strategy: ${this.name}`);
      const compiledStrategy = {
        name: this.name,
        indicators: this.indicators,
        entryConditions: this.entryConditions,
        exitConditions: this.exitConditions,
        patterns: this.patterns,
        conditions: this.conditions,
        riskManagement: this.riskManagement,
      };
      console.log(`Compiled strategy: ${JSON.stringify(compiledStrategy)}`);
      return compiledStrategy;
    } catch (error) {
      console.error('Error compiling strategy definition:', error.message, error.stack);
      throw error;
    }
  }
}