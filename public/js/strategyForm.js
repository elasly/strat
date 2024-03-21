$(document).ready(function() {
  $('#submitStrategy').click(function(e) {
    e.preventDefault();

    // Constructing formData with detailed strategy components
    const formData = {
      strategyName: $('input[name="strategyName"]').val(),
      assetSymbol: $('input[name="assetSymbol"]').val(),
      timeFrame: $('select[name="timeFrame"]').val(),
      indicators: gatherIndicators(),
      entryCriteria: gatherEntryCriteria(),
      exitCriteria: gatherExitCriteria(),
      positionSizing: $('input[name="positionSizing"]').val(),
      stopLoss: $('input[name="stopLoss"]').val(),
      takeProfit: $('input[name="takeProfit"]').val(),
      patterns: gatherPatterns(),
      conditions: gatherConditions(),
      strategyRules: gatherStrategyRules()
    };

    console.log("Submitting strategy:", formData);

    $.ajax({
      type: "POST",
      url: "/submitStrategy",
      contentType: "application/json",
      data: JSON.stringify(formData),
      success: function(response) {
        console.log("Strategy submission response:", response);
        alert('Strategy submitted successfully!');
        // Clear the form or redirect as needed
        clearFormFields();
      },
      error: function(xhr, status, error) {
        console.error("Error submitting strategy:", xhr.responseText);
        alert(`Error submitting strategy: ${xhr.responseText}`);
      }
    });
  });

  function gatherEntryCriteria() {
    let entryCriteria = [];
    $('.entry-criteria-field').each(function() {
      entryCriteria.push($(this).val());
    });
    return entryCriteria;
  }

  function gatherExitCriteria() {
    let exitCriteria = [];
    $('.exit-criteria-field').each(function() {
      exitCriteria.push($(this).val());
    });
    return exitCriteria;
  }

  function gatherIndicators() {
    let indicators = [];
    $('.indicator-field').each(function() {
      indicators.push({
        name: $(this).attr('data-indicator-name'),
        parameters: gatherIndicatorParameters($(this))
      });
    });
    return indicators;
  }

  function gatherIndicatorParameters(indicatorElement) {
    let parameters = {};
    indicatorElement.find('.indicator-parameter').each(function() {
      let paramName = $(this).attr('data-parameter-name');
      let paramValue = $(this).val();
      parameters[paramName] = paramValue;
    });
    return parameters;
  }

  function gatherPatterns() {
    let patterns = [];
    $('.pattern-field').each(function() {
      patterns.push($(this).val());
    });
    return patterns;
  }

  function gatherConditions() {
    let conditions = [];
    $('.condition-field').each(function() {
      conditions.push({
        conditionType: $(this).attr('data-condition-type'),
        referenceValue: $(this).find('.reference-value').val(),
        compareToIndicator: $(this).find('.compare-to-indicator').val()
      });
    });
    return conditions;
  }

  function gatherStrategyRules() {
    return $('textarea[name="strategyRules"]').val();
  }

  function clearFormFields() {
    $('input[name="strategyName"]').val('');
    $('input[name="assetSymbol"]').val('');
    $('select[name="timeFrame"]').val('');
    $('input[type="text"], input[type="number"], textarea').val('');
    $('select').prop('selectedIndex', 0); // Reset all select boxes to their first option
    $('.dynamic-section').empty(); // Remove dynamically added sections or fields
    clearDynamicFormFields();
  }

  function clearDynamicFormFields() {
    $('.dynamic-field').each(function() {
      $(this).val(''); // Clear input fields
      $(this).prop('selectedIndex',0); // Reset select boxes to their first option
    });
    $('.dynamic-section').empty(); // Ensure dynamically added sections or fields are removed
  }
});