"use strict";
/**
 * @param  {Object} options
 */
function DateOfBirth(options) {
  this.year = new DateOfBirthDateNodeSelectElement(this, options.year);
  this.month = new DateOfBirthDateNodeSelectElement(this, options.month);
  this.day = new DateOfBirthDateNodeSelectElement(this, options.day);
  this.submit = new DateOfBirthDateNodeSubmitElement(options.submit);
  this.date = new DateOfBirthDate(this, options.age);

  // Callbacks
  this.events = new Object();
  this.events.valid = new Function();
  this.events.invalid = new Function();

  // Events

  /** 
   * Year
   * @param  {Event Object} event
   */
  this.year.on("change", function(event) {
    // Remove disable property
    this.day.removeOptionListAttribute("disabled");

    // Execute Runtime
    this.runtime();

    // Callback
    this.executeCallback(event);
  }.bind(this));

  /**
   * Month
   * @param  {Event Object} event
   */
  this.month.on("change", function(event) {
    // Remove disable property
    this.day.removeOptionListAttribute("disabled");

    // Reset day element value
    this.day.reset();

    // Execute Runtime
    this.runtime();

    // Callback
    this.executeCallback(event);
  }.bind(this));

  /** 
   * Day
   * @param  {Event Object} event
   */
  this.day.on("change", function(event) {
    // Disable submit button only if the age is invalid
    this.disableSubmitButton();

    // Callback
    this.executeCallback(event);
  }.bind(this));

  // Init
  this.runtime();

  return this;
};

// Runtime
DateOfBirth.prototype.runtime = function() {
  // Defaults
  var dayOfMonthIndex = 1;
  var dayOfMonthMaxDays = 0;

  // Disable submit button only if the age is invalid
  this.disableSubmitButton();

  // Continue until we are in the next month
  while (this.date.getDefaultDate().getMonth() === this.date.getDateDayOfMonthIndex(dayOfMonthIndex).getMonth()) {
    dayOfMonthMaxDays = dayOfMonthIndex;
    dayOfMonthIndex++;
  };

  this.day.setOptionListRangeByIndex(dayOfMonthMaxDays)
  this.day.setOptionListAttribute("disabled", true);
};

// Disable Submit Button
DateOfBirth.prototype.disableSubmitButton = function() {
  if (this.date.isAgeValid()) {
    this.submit.enable();
  } else {
    this.submit.disable();
  }
}

/**
 * @param  {Event Object} original_event
 */
DateOfBirth.prototype.executeCallback = function(original_event) {
  switch (this.date.isAgeValid()) {
    case true:
      var customEvent = new Event("valid");
      customEvent.originalEvent = original_event;
      this.events.valid(customEvent);
      break;
    case false:
      var customEvent = new Event("invalid");
      customEvent.originalEvent = original_event;
      this.events.invalid(customEvent);
      break;
  }
};

/**
 * @param  {String} event_type
 * @param  {Function} callback
 */
DateOfBirth.prototype.on = function(event_type, callback) {
  switch (event_type) {
    case "invalid":
      this.events.invalid = callback;
      break;
    case "valid":
      this.events.valid = callback;
      break;
    default:
      break;
  }
  return this;
};

/*  
-------
*/

/**
 * @param  {HTMLElement<Object>} element
 */
function DateOfBirthDateNode(element) {
  this.element = element;
}

/**
 * @param  {DateOfBirth<Object>} parent
 * @param  {HTMLElement<Object>} element
 */
function DateOfBirthDateNodeSelectElement(parent, element) {
  DateOfBirthDateNode.call(this, element);
  this.parent = parent;
  this.element.optionsList = Array.prototype.slice.call(this.element.children);
  this.element.optionsListInvalid = new Array();
}

// Extends DateOfBirth
DateOfBirthDateNodeSelectElement.prototype = Object.create(DateOfBirth.prototype);

/**
 * @param  {String} event_type
 * @param  {Function} callback
 */
DateOfBirthDateNodeSelectElement.prototype.on = function(event_type, callback) {
  this.element.addEventListener(event_type, callback);
  return this;
};

DateOfBirthDateNodeSelectElement.prototype.reset = function() {
  this.element.value = this.element.item(0).value;
  return this;
};

/**
 * @param  {Number} start
 */
DateOfBirthDateNodeSelectElement.prototype.setOptionListRangeByIndex = function(start) {
  switch (start) {
    case this.element.optionsList.length:
      this.element.optionsListInvalid = new Array();
      break;
    default:
      this.element.optionsListInvalid = this.element.optionsList.slice(start)
      break;
  };

  return this;
};

/**
 * @param  {String} key
 * @param  {String} value
 */
DateOfBirthDateNodeSelectElement.prototype.setOptionListAttribute = function(key, value) {
  this.element.optionsListInvalid.forEach(function(child) {
    child.setAttribute(key, value);
  });

  return this;
};

/**
 * @param  {String} key
 */
DateOfBirthDateNodeSelectElement.prototype.removeOptionListAttribute = function(key) {
  this.element.optionsListInvalid.forEach(function(child) {
    child.removeAttribute(key);
  });

  return this;
};

/*  
-------
*/

/**
 * @param  {HTMLElement<Object>} element
 */
function DateOfBirthDateNodeSubmitElement(element) {
  DateOfBirthDateNode.call(this, element);
}

DateOfBirthDateNodeSubmitElement.prototype.disable = function() {
  this.element.disabled = true;
};

DateOfBirthDateNodeSubmitElement.prototype.enable = function() {
  this.element.disabled = false;
};

/*  
-------
*/
/**
 * @param  {DateOfBirth<Object>} parent
 * @param  {Number} age
 */
function DateOfBirthDate(parent, age) {
  // Default
  var YEAR_MS = 3.154e+10;

  // Constructor
  this.age = age;
  this.ageYearMilliseconds = this.age * YEAR_MS;
  this.ageYearDate = new Date(Date.now() - this.ageYearMilliseconds);
  this.parent = parent;
}

DateOfBirthDate.prototype.isAgeValid = function() {
  return this.ageYearDate.getTime() >= this.getSelectedDate().getTime()
};

DateOfBirthDate.prototype.getSelectedDate = function() {
  return new Date(this.parent.year.element.value, this.parent.month.element.value, this.parent.day.element.value);
}

DateOfBirthDate.prototype.getDefaultDate = function() {
  return new Date(this.parent.year.element.value, this.parent.month.element.value, 1);
}

/**
 * @param  {Number} day_of_month_index
 */
DateOfBirthDate.prototype.getDateDayOfMonthIndex = function(day_of_month_index) {
  return new Date(this.parent.year.element.value, this.parent.month.element.value, day_of_month_index);
}

/*  
-------
*/