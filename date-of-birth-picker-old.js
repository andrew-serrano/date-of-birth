  void

  function() {
    // Defaults
    var monthElement = document.getElementById("month");
    var yearElement = document.getElementById("year");
    var dayOfMonthElement = document.getElementById("day");
    var dayOfMonthElementOptions = Array.from(dayOfMonthElement.options);
    var submitElement = document.getElementById("submit-button");
    var maxDayDisabled = [];

    /**
     * @param  {Date Object} compare_date
     */
    function isTwentyOneYearsOfAge() {
      var twentyOneYearsMilliseconds = 6.623e+11;
      var twentyOneYearsOldDate = new Date(Date.now() - twentyOneYearsMilliseconds);
      var setDate = new Date(yearElement.value, monthElement.value, dayOfMonthElement.value);
      return twentyOneYearsOldDate.getTime() >= setDate.getTime();
    }

    /**
     * * Toggle Disable Property
     * @param  {Date Object} compare_date
     */
    function toggleDisableSubmitButton() {
      if (isTwentyOneYearsOfAge()) {
        submitElement.disabled = false;
      } else {
        submitElement.disabled = true;
      }
    }

    /**
     * Returns a date object from the select values
     */
    function dateFromValues() {
      return new Date(yearElement.value, monthElement.value, 1);
    };


    /**
     * Runtime
     */
    function init() {
      // Defaults
      var dayIndex = 1;
      var maxDay = 0;

      // Return date from select values
      var setDate = dateFromValues();

      toggleDisableSubmitButton();

      // Continue until we are in the next month
      while (setDate.getMonth() === new Date(yearElement.value, monthElement.value, dayIndex).getMonth()) {
        maxDay = dayIndex;
        dayIndex++;
      };

      console.log("Max Day" + maxDay);

      // Don't do anything
      if (dayOfMonthElementOptions.length === maxDay) return;

      // Disable
      maxDayDisabled = dayOfMonthElementOptions.slice(maxDay);

      maxDayDisabled.forEach(function(option) {
        option.disabled = true;
      });
    };

    /**
     * On Change
     */
    function onChange() {
      // Enabled
      maxDayDisabled.forEach(function(option) {
        option.disabled = false;
      });

      init();
    };

    /**
     * Event Listeners
     */
    monthElement.addEventListener("change", function() {
      dayOfMonthElement.value = 1;
      onChange();
    });
    yearElement.addEventListener("change", onChange);
    dayOfMonthElement.addEventListener("change", function() {
      toggleDisableSubmitButton();
    });

    /**
     * Runtime Execution
     */
    init();
  }();