angular.module('ez.datetime', []);

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
     * The date to bind ng-model with
     *
     * options: ["default", "from", "to"]
     */
    modelBinding: 'default',

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

angular.module('ez.datetime').controller('EzDatetimeModalController', [
  '$scope',
  '$modalInstance',
  function(
    $scope,
    $modalInstance
  ) {


    $scope.dismiss = function() {
      $modalInstance.dismiss();
    };

    $scope.ok = function() {
      $modalInstance.close();
    };
  }
]);

angular.module('ez.datetime').directive('ezDatePicker', [
  'EzDatetimeConfigService',
  function datepickerDirective(
    ConfigService
  ) {

    return {
      restrict: 'EA',
      require: 'ngModel',
      templateUrl: 'ez_datetime_date_picker.html',
      scope: {
        from: '=?',
        to: '=?',
        options: '=?'
      },
      replace: true,
      link: function link(scope, element, attrs, ngModel) {

        scope.date = null;

        ConfigService.resolve(scope, attrs);

        var startOfDecade = function startOfDecade(unixDate) {
          var startYear = (parseInt(moment(unixDate).year() / 10, 10) * 10);
          return moment(unixDate).year(startYear).startOf('year');
        };


        // highlight items that are within the selected range
        var resolveHighlight = function(date, activeDateUnix, dateValue) {
          var dateUnix;

          // highlight the range of days that are between the from date and the active date
          if (!!attrs.from && !!scope.from) {
            dateUnix = moment(date).unix();

            var fromUnix = moment(scope.from).unix();

            if (!!activeDateUnix && dateUnix >= fromUnix && dateUnix < activeDateUnix) {
              dateValue.highlight = true;
            }

            if (dateUnix < fromUnix) {
              dateValue.unselectable = true;
            }
          } else if (!!attrs.to && !!scope.to) {
            // highlight the range of days that are between the active date and the to date

            dateUnix = moment(date).unix();

            var toUnix = moment(scope.to).unix();

            if (!!activeDateUnix && dateUnix <= toUnix && dateUnix > activeDateUnix) {
              dateValue.highlight = true;
            }

            if (dateUnix > toUnix) {
              dateValue.unselectable = true;
            }
          }
        };

        var dataFactory = {
          year: function year(date) {
            var today = moment().format('YYYY');
            var selectedDate = moment(date).startOf('year');
            // View starts one year before the decade starts and ends one year after the decade ends
            // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
            // Truncate the last digit from the current year and subtract 1 to get the start of the decade
            var startDecade = (parseInt(selectedDate.year() / 10, 10) * 10);
            var startDate = moment(startOfDecade(date)).subtract(1, 'year').startOf('year');

            var activeYear = moment(ngModel.$viewValue).year();
            var activeDateUnix = moment(ngModel.$viewValue).unix();

            var result = {
              'currentView': 'year',
              'nextView': scope.options.minView === 'year' ? 'setTime' : 'month',
              'previousViewDate': {
                unselectable: true,
                dateValue: null,
                display: startDecade + '-' + (startDecade + 9)
              },
              'leftDate': {
                dateValue: moment(startDate).subtract(9, 'year').valueOf()
              },
              'rightDate': {
                dateValue: moment(startDate).add(11, 'year').valueOf()
              },
              'dates': []
            };

            for (var i = 0; i < 12; i += 1) {
              var yearMoment = moment(startDate).add(i, 'years');
              var dateValue = {
                'dateValue': yearMoment,
                'display': yearMoment.format('YYYY'),
                'past': yearMoment.year() < startDecade,
                'future': yearMoment.year() > startDecade + 9,
                'active': !!ngModel.$viewValue && yearMoment.year() === activeYear,
                'current': yearMoment.format('YYYY') === today
              };

              resolveHighlight(yearMoment, activeDateUnix, dateValue);

              result.dates.push(dateValue);
            }

            return result;
          },

          month: function month(date) {
            var today = moment().format('YYYY-MMM');
            var startDate = moment(date).startOf('year');
            var previousViewDate = startOfDecade(date);

            var activeDate = moment(ngModel.$viewValue).format('YYYY-MMM');
            var activeDateUnix = moment(ngModel.$viewValue).unix();

            var result = {
              'previousView': 'year',
              'currentView': 'month',
              'nextView': scope.options.minView === 'month' ? 'setTime' : 'day',
              'previousViewDate': {
                dateValue: previousViewDate.valueOf(),
                display: startDate.format('YYYY')
              },
              'leftDate': {
                dateValue: moment(startDate).subtract(1, 'year').valueOf()
              },
              'rightDate': {
                dateValue: moment(startDate).add(1, 'year').valueOf()
              },
              'dates': []
            };

            for (var i = 0; i < 12; i += 1) {
              var monthMoment = moment(startDate).add(i, 'months');
              var dateValue = {
                'dateValue': monthMoment,
                'display': monthMoment.format('MMM'),
                'active': !!ngModel.$viewValue && monthMoment.format('YYYY-MMM') === activeDate,
                'current': monthMoment.format('YYYY-MMM') === today
              };

              resolveHighlight(monthMoment, activeDateUnix, dateValue);

              result.dates.push(dateValue);
            }

            return result;
          },

          day: function day(date) {
            var selectedDate = date;
            var today = moment().format('YYYY-MMM-DD');

            var startOfMonth = moment(selectedDate).startOf('month');

            if (scope.options.timepickerEnabled) {
              var currentDate = moment(ngModel.$viewValue);
              // make time match current time
              startOfMonth.hours(currentDate.hours());
              startOfMonth.minutes(currentDate.minutes());
              startOfMonth.seconds(currentDate.seconds());
            }

            var previousViewDate = moment(selectedDate).startOf('year');
            var endOfMonth = moment(selectedDate).endOf('month');

            var startDate = moment(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days');

            var activeDate = moment(ngModel.$viewValue).format('YYYY-MMM-DD');
            var activeDateUnix = moment(ngModel.$viewValue).unix();

            var result = {
              'previousView': 'month',
              'currentView': 'day',
              'nextView': 'setTime',
              'previousViewDate': {
                dateValue: previousViewDate.valueOf(),
                display: startOfMonth.format('YYYY-MMM')
              },
              'leftDate': {
                dateValue: moment(startOfMonth).subtract(1, 'months').valueOf()
              },
              'rightDate': {
                dateValue: moment(startOfMonth).add(1, 'months').valueOf()
              },
              'dayNames': [],
              'weeks': []
            };

            for (var dayNumber = 0; dayNumber < 7; dayNumber += 1) {
              result.dayNames.push(moment().weekday(dayNumber).format('dd'));
            }

            for (var i = 0; i < 6; i += 1) {
              var week = {dates: []};
              for (var j = 0; j < 7; j += 1) {
                var dayMoment = moment(startDate).add((i * 7) + j, 'days');

                var dateValue = {
                  'dateValue': dayMoment,
                  'display': dayMoment.format('D'),
                  'active': !!ngModel.$viewValue && dayMoment.format('YYYY-MMM-DD') === activeDate,
                  'current': !ngModel.$viewValue && dayMoment.format('YYYY-MMM-DD') === today,
                  'past': dayMoment.isBefore(startOfMonth),
                  'future': dayMoment.isAfter(endOfMonth)
                };

                resolveHighlight(dayMoment, activeDateUnix, dateValue);

                week.dates.push(dateValue);
              }
              result.weeks.push(week);
            }

            return result;
          },

          setTime: function setTime(date) {
            if (typeof date === 'string') {
              date = moment(date);
            }

            ngModel.$setViewValue(moment(date).format(scope.options.modelFormat));
            ngModel.$render();

            return dataFactory[scope.options.minView](date);
          }
        };

        scope.changeView = function changeView(viewName, dateObject, event) {
          if (event) {
            event.stopPropagation();
            event.preventDefault();
          }

          scope.view = viewName;

          if (!!scope.view && !!scope.view && !dateObject.unselectable && dataFactory[scope.view] && !!dateObject.dateValue) {
            scope.data = dataFactory[scope.view](dateObject.dateValue);
          }
        };

        ngModel.$render = function $render() {
          if (!scope.view) {
            scope.view = scope.options.startView;

            scope.data = dataFactory[scope.view](ngModel.$viewValue);
          }
        };

        if (!!attrs.from) {
          scope.$watch('from', function(newVal, oldVal) {
            if (newVal !== oldVal) {
              scope.changeView(scope.view, {
                dateValue: ngModel.$viewValue
              });
            }
          });
        }

        if (!!attrs.to) {
          scope.$watch('to', function(newVal, oldVal) {
            if (newVal !== oldVal) {
              scope.changeView(scope.view, {
                dateValue: ngModel.$viewValue
              });
            }
          });
        }

      }
    };
  }
]);

angular.module('ez.datetime').directive('ezDatetimeControl', [
  'EzDatetimeConfigService',
  '$parse',
  '$timeout',
  '$modal',
  function(
    ConfigService,
    $parse,
    $timeout,
    $modal
  ) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        ngModel: '=',
        from: '=?',
        to: '=?',
        config: '=?'
      },
      link: function(scope, $element, attrs, ngModel) {
        var rangeEnabled = false;

        scope.form = {};

        $element.addClass('ez-datetime-control');

        ConfigService.resolve(scope, attrs);

        if (!!attrs.from && !!attrs.to) {
          rangeEnabled = true;
        }

        ngModel.$formatters.push(function(v) {
          if (v) {
            if (rangeEnabled && scope.options.modelBinding === 'default') {
              v = moment(v.from).format(scope.options.viewFormat) + ' - ' + moment(v.to).format(scope.options.viewFormat);
            } else {
              v = moment(v).format(scope.options.viewFormat);
            }
          }

          return v;
        });

        $element.bind('click', function() {

          scope.form.date = ngModel.$modelValue;

          // try to init from ngModel value first
          if (!!scope.form.date) {
            if (!!scope.form.date.from) {
              scope.form.from = scope.form.date.from;
            }

            if (!!scope.form.date.to) {
              scope.form.to = scope.form.date.to;
            }
          }

          // try to init from from/to scope attributes
          //
          scope.form.from = scope.from;
          scope.form.to = scope.to;

          scope.form.isFrom = !!attrs.to && !!scope.form.to;
          scope.form.isTo = !!attrs.from && !!scope.form.from;

          if (!scope.form.from && !scope.from) {
            scope.form.from = moment().format(scope.options.modelFormat);
          }

          if (!scope.form.to && !scope.to) {
            scope.form.to = moment().format(scope.options.modelFormat);
          }

          $modal.open({
            templateUrl: rangeEnabled ? 'ez_datetime_range_modal.html' : 'ez_datetime_modal.html',
            controller: 'EzDatetimeModalController',
            scope: scope,
          }).result.then(function() {
            scope.from = scope.form.from;
            scope.to = scope.form.to;

            if (rangeEnabled) {
              switch(scope.options.modelBinding) {
              case 'default':
                scope.ngModel = {
                  from: scope.from,
                  to: scope.to
                };
                break;
              case 'from':
                scope.ngModel = scope.from;
                break;
              case 'to':
                scope.ngModel = scope.to;
                break;
              }
            } else {
              scope.ngModel = scope.form.date;
            }

            if (!!attrs.ngChange) {
              $timeout(function() {
                $parse(attrs.ngChange)(scope.$parent);
              });
            }

            ngModel.$setDirty();
          });
        });

      }
    };
  }
]);


angular.module('ez.datetime').directive('ezTimePicker', [
  'EzDatetimeConfigService',
  function(
    ConfigService
  ) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      templateUrl: 'ez_datetime_time_picker.html',
      scope: {
        ngModel: '=',
        options: '=?'
      },
      link: function(scope, $element, attrs, ngModel) {

        ConfigService.resolve(scope, attrs);

        function init() {
          scope.data = {
            hours: [],
            minutes: [],
            seconds: []
          };

          // set hour options
          var h = scope.options.meridiemEnabled ? 1 : 0;
          var limitH = scope.options.meridiemEnabled ? 12 : 23;
          while (h <= limitH) {
            scope.data.hours.push(h);

            h = h + scope.options.hourStep;
          }

          // set minute options
          var m = 0;
          while (m <= 60) {
            scope.data.minutes.push(m);

            m = m + scope.options.minuteStep;
          }

          // set second options
          var s = 0;
          while (s <= 60) {
            scope.data.seconds.push(s);

            s = s + scope.options.secondStep;
          }

          ngModel.$render = function() {
            if (!ngModel.$viewValue) {
              scope.ngModel = moment().format(scope.options.modelFormat);
            }
          };

        }

        function update(date) {
          ngModel.$setViewValue(date.format(scope.options.modelFormat));
          ngModel.$render();
        }

        scope.setHour = function(v) {
          var date = moment(scope.ngModel);

          date.hours(v);

          update(date);
        };

        scope.setMinute = function(v) {
          var date = moment(scope.ngModel);

          date.minutes(v);

          update(date);
        };

        scope.setSecond = function(v) {
          var date = moment(scope.ngModel);

          date.seconds(v);

          update(date);
        };

        scope.toggleMeridiem = function() {
          var date = moment(scope.ngModel);

          if (date.hours() > 12) {
            date.hours(date.hours() - 12);
          } else {
            date.hours(date.hours() + 12);
          }

          update(date);
        };

        init();
      }
    };
  }
]);



angular.module('ez.datetime').filter('ezDate', [
  function(
  ) {
    return function(v, format) {
      if (!v) {
        return;
      }

      return moment(v).format(format);
    };
  }
]);


angular.module('ez.datetime').service('EzDatetimeConfigService', [
  '$parse',
  'EzDatetimeConfig',
  function(
    $parse,
    EzDatetimeConfig
  ) {
    return {

      /**
       * Resolve options passed into "config" attr or any options set via attrs
       */
      resolve: function(scope, attrs) {
        if (attrs.options) {
          return scope.options;
        } else {
          scope.options = angular.extend({}, EzDatetimeConfig, scope.config);

          for (var option in EzDatetimeConfig) {
            if (attrs.hasOwnProperty(option)) {
              if (typeof EzDatetimeConfig[option] === 'boolean') {
                scope.options[option] = $parse(attrs[option])(scope.$parent);
              } else {
                scope.options[option] = attrs[option];
              }
            }
          }
        }
      }
    };
  }
]);

