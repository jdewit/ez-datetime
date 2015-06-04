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
   * Modal heading text
   */
  headingText: 'Select a Date',

  /**
   * Range heading text
   */
  rangeHeadingText: 'Select a Start & End Date',

  /**
   * Ok Button text
   */
  okBtnText: 'Ok',

  /**
   * Cancel Button text
   */
  cancelBtnText: 'Cancel',

  /**
   * Shortcut Button text
   */
  shortcutBtnText: 'Shortcuts',

  /**
   * no date value text
   */
  noValueText: 'No date selected',

  /**
   * Ok btn icon class
   */
  okBtnIcon: 'glyphicon glyphicon-ok',

  /**
   * Cancel btn icon class
   */
  cancelBtnIcon: 'glyphicon glyphicon-remove',

  /**
   * Shortcut btn icon class
   */
  shortcutBtnIcon: 'glyphicon glyphicon-flash',

  /**
   * Clear btn icon class
   */
  clearBtnIcon: 'glyphicon glyphicon-trash',

  /**
   * Heading btn icon class
   */
  headingIcon: 'glyphicon glyphicon-calendar',

  /**
   * Show shortcut selector
   */
  shortcutsEnabled: true,

  /**
   * Shortcut range options
   */
  shortcuts: [
    {
      name: 'Today',
      from: moment().startOf('day'),
      to: moment().endOf('day')
    }, {
      name: 'Tomorrow',
      from: moment().add(1, 'days').startOf('day'),
      to: moment().add(1, 'days').endOf('day')
    }, {
      name: 'Yesterday',
      from: moment().subtract(1, 'days').startOf('day'),
      to: moment().subtract(1, 'days').endOf('day')
    }, {
      name: 'This Week',
      from: moment().startOf('week'),
      to: moment().endOf('week')
    }, {
      name: 'Next Week',
      from: moment().add(1, 'week').startOf('week'),
      to: moment().add(1, 'week').endOf('week')
    }, {
      name: 'Last Week',
      from: moment().subtract(1, 'week').startOf('week'),
      to: moment().subtract(1, 'week').endOf('week')
    }, {
      name: 'This Month',
      from: moment().startOf('month'),
      to: moment().endOf('month')
    }, {
      name: 'Next Month',
      from: moment().add(1, 'month').startOf('month'),
      to: moment().add(1, 'month').endOf('month')
    }, {
      name: 'Last Month',
      from: moment().subtract(1, 'month').startOf('month'),
      to: moment().subtract(1, 'month').endOf('month')
    }, {
      name: 'This Year',
      from: moment().startOf('year'),
      to: moment().endOf('year')
    }
  ]
});
