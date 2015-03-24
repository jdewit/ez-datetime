angular.module('ez.datetime')

  .constant('EzDatetimeConfig', {

    /**
     * The minimum view of the calendar
     * @options [year, month, day]
     */
    minView: 'day',

    /**
     * The start view of the calendar
     * @options [year, month, day]
     */
    startView: 'day',

    /**
     * The momentjs date format for the model data
     */
    modelFormat: undefined, // defaults to ISO-8601

    /**
     * The momentjs date format for the view data
     */
    viewFormat: 'MMM Do YYYY [at] h:mma',

    /**
     * Enable time selection
     */
    timepickerEnabled: true,

    /**
     * Seconds enabled?
     */
    secondsEnabled: false,

    /**
     * Show AM/PM ?
     */
    meridiemEnabled: true,

    /**
     * Increment/decrement hour options by...
     */
    hourStep: 1,

    /**
     * Increment/decrement minute options by...
     */
    minuteStep: 15,

    /**
     * Increment/decrement second options by...
     */
    secondStep: 15,

    /**
     * Timepicker hour format
     */
    hourFormat: 'h',

    /**
     * Timepicker minute format
     */
    minuteFormat: 'mm',

    /**
     * Timepicker second format
     */
    secondFormat: 'ss',

    /**
     * Timepicker meridiem format
     */
    meridiemFormat: 'A',

    /**
     * Modal heading
     */
    heading: 'Select a Date',

    /**
     * Modal range heading
     */
    rangeHeading: 'Select a Start & End Date',

    /**
     * Modal ok button text
     */
    okBtnText: 'OK',

    /**
     * Modal cancel button text
     */
    cancelBtnText: 'Cancel'


  })
;
