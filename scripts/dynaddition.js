// Wrap in IIFE to avoid polluting global scope
(function () {

  // Rule schema externalized
  const ruleSchema = {
    indicator: {
      type: 'string',
      options: ['volume', 'bb']
    },
    comparison: {
      type: 'string',
      options: ['greaterThan', 'lessThan']
    },
    value: 'string'
  };

  // Track rules in simple array
  const rules = [];

  // Utility method to generate unique ID
  function getUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  function addRule() {
    // Generate unique ID
    const id = getUniqueId();

    // Create rule object
    const rule = {
      id,
      conditions: [
        {
          indicator: '',
          comparison: '',
          value: ''
        }
      ]
    };

    // Push to rules array
    rules.push(rule);

    // Render UI...

    // Add validation...

    // Add delete handler...

  }

  // Initial render of example rule

  // Attach click handler to add rule button

})();

// Validation utility
function validateRule(rule) {
  // Validate rule against schema
  // Return errors or null if valid
}

// Render a rule to UI
function renderRule(rule) {

  // Generate UI elements

  // Populate UI elements from rule data

  // Attach click handler to delete button
  deleteBtn.addEventListener('click', () => {
    deleteRule(rule.id);
  });

  // Return UI container element
}

// Delete rule by id  
function deleteRule(id) {
  const index = rules.findIndex(r => r.id === id);
  if (index !== -1) {
    rules.splice(index, 1);
    // Re-render UI
  }
}

// On add rule click
addRuleBtn.addEventListener('click', () => {

  // Create blank rule
  const rule = {
    // ...
  };

  // Validate rule
  const errors = validateRule(rule);
  if (errors) {
    // Show errors and return 
  }

  // Add rule
  rules.push(rule);

  // Render UI
  const ui = renderRule(rule);

  // Add ui to DOM
});

// Refactored to separate concerns into modules

// rules.js
export const addRule = () => {
  //...
};

export const deleteRule = (id) => {
  //...
};

// validation.js
export const validateRule = (rule) => {
  //...
};

// ui.js 
export const renderRule = (rule) => {
  //...
};

// index.js
import { addRule, deleteRule } from './rules.js';
import { validateRule } from './validation.js';
import { renderRule } from './ui.js';

// Event handlers call modules
addRuleBtn.addEventListener('click', () => {
  //...
  addRule();
  //...
});

