angular.module('ez.datetime', []);

angular.module('ez.datetime')

.constant('EzDatetimeConfig', {

  /**
   * The utc offset, leave undefined to use browsers offset
   */
  utcOffset: undefined,

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
   * Set shortcut key as the value
   */
  shortcutAsValue: false,

  /**
   * Prefix for shortcut name
   */
  shortcutNamePrefix: '',

  /**
   * Shortcut range options
   */
  shortcuts: [
    {
      id: 'today',
      name: 'Today',
      from: moment().startOf('day'),
      to: moment().endOf('day')
    }, {
      id: 'tomorrow',
      name: 'Tomorrow',
      from: moment().add(1, 'days').startOf('day'),
      to: moment().add(1, 'days').endOf('day')
    }, {
      id: 'yesterday',
      name: 'Yesterday',
      from: moment().subtract(1, 'days').startOf('day'),
      to: moment().subtract(1, 'days').endOf('day')
    }, {
      id: 'this_week',
      name: 'This Week',
      from: moment().startOf('week'),
      to: moment().endOf('week')
    }, {
      id: 'next_week',
      name: 'Next Week',
      from: moment().add(1, 'week').startOf('week'),
      to: moment().add(1, 'week').endOf('week')
    }, {
      id: 'last_week',
      name: 'Last Week',
      from: moment().subtract(1, 'week').startOf('week'),
      to: moment().subtract(1, 'week').endOf('week')
    }, {
      id: 'this_month',
      name: 'This Month',
      from: moment().startOf('month'),
      to: moment().endOf('month')
    }, {
      id: 'next_month',
      name: 'Next Month',
      from: moment().add(1, 'month').startOf('month'),
      to: moment().add(1, 'month').endOf('month')
    }, {
      id: 'last_month',
      name: 'Last Month',
      from: moment().subtract(1, 'month').startOf('month'),
      to: moment().subtract(1, 'month').endOf('month')
    }, {
      id: 'this_year',
      name: 'This Year',
      from: moment().startOf('year'),
      to: moment().endOf('year')
    }
  ]
});

angular.module('ez.datetime').controller('EzDatetimeModalController', [
  '$scope',
  '$modalInstance',
  function(
    $scope,
    $modalInstance
  ) {
    var min, max, shortcut;

    $scope.shortcuts = [];

    // add quick shortcuts that fall between min & max
    $scope.options.shortcuts.forEach(function(shortcut) {
      if (!!$scope.form.min) {
        min = moment($scope.form.minDate);

        if (shortcut.from < min || shortcut.to < min) {
          return;
        }
      }

      if (!!$scope.form.max) {
        max = moment($scope.form.maxDate);

        if (shortcut.from > max || shortcut.to > max) {
          return;
        }
      }

      $scope.shortcuts.push(shortcut);
    });

    $scope.select = function(index) {
      shortcut = $scope.$parent.options.shortcuts[index];

      $scope.form.shortcut = shortcut.id;
      $scope.form.shortcutName = shortcut.name;

      if (!!shortcut.from) {
        $scope.form.from = shortcut.from.format();
      } else {
        $scope.form.from = null;
      }

      if (!!shortcut.to) {
        $scope.form.to = shortcut.to.format();
      } else {
        $scope.form.to = null;
      }
    };

    $scope.dismiss = function() {
      $modalInstance.dismiss();
    };

    $scope.ok = function() {
      $modalInstance.close();
    };
  }
]);

angular.module('ez.datetime').directive('ezDatePicker', [
  'EzDatetimeService',
  function datepickerDirective(
    DatetimeService
  ) {

    return {
      restrict: 'EA',
      require: 'ngModel',
      templateUrl: 'ez_datetime_date_picker.html',
      scope: {
        minDate: '=?',
        maxDate: '=?',
        from: '=?',
        to: '=?',
        options: '=?'
      },
      replace: true,
      link: function link(scope, element, attrs, ngModel) {

        scope.date = null;

        DatetimeService.resolveConfig(scope, attrs);

        var startOfDecade = function(unixDate) {
          var startYear = (parseInt(moment(unixDate).year() / 10, 10) * 10);

          return moment(unixDate).year(startYear).startOf('year');
        };

        var fixDate = function(d) {
          if (!d) {
            return;
          }

          if (!moment.isMoment(d)) {
            if (scope.options.modelFormat === 'x') {
              d = parseInt(d, 10);
            }

            d = moment(d);
          }

          return d;
        };

        // highlight items that are within the selected range
        var setStates = function(date, activeDateUnix, dateValue) {
          var dateUnix = date.unix();

          dateValue.highlight = false;
          dateValue.unselectable = false;

          var view = scope.view === 'setValue' ? scope.options.minView : scope.view;

          var minDate = scope.minDate || scope.from;
          if (!!minDate) {
            var minUnix = fixDate(minDate).startOf(view).unix();

            if (dateUnix < minUnix) {
              dateValue.unselectable = true;
            }
          }

          var maxDate = scope.maxDate || scope.to;
          if (maxDate) {
            var maxUnix = fixDate(maxDate).endOf(view).unix();

            if (dateUnix > maxUnix) {
              dateValue.unselectable = true;
            }
          }

          if (!activeDateUnix) {
            return;
          }

          if (!dateValue.unselectable && !dateValue.active) {
            if (!!scope.from) {
              var from = fixDate(scope.from).startOf(view).unix();

              if (dateUnix >= from && dateUnix < activeDateUnix) {
                dateValue.highlight = true;
              }
            }

            if (!!scope.to) {
              var to = fixDate(scope.to).endOf(view).unix();

              if (dateUnix <= to && dateUnix > activeDateUnix) {
                dateValue.highlight = true;
              }
            }
          }

        };

        var matchTime = function(d1, d2) {
          if (!d1) {
            return;
          }

          if (!d2) {
            d2 = moment();
          }

          d1.hours(d2.hours());
          d1.minutes(d2.minutes());
          d1.seconds(d2.seconds());

          return d1;
        };

        var dataFactory = {
          year: function(newDate, activeDate) {
            var todayDash = moment().format('YYYY');

            // View starts one year before the decade starts and ends one year after the decade ends
            // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
            // Truncate the last digit from the current year and subtract 1 to get the start of the decade
            var startDecade = (parseInt(moment(newDate).startOf('year').year() / 10, 10) * 10);
            var startDateMoment = moment(startOfDecade(newDate)).subtract(1, 'year').startOf('year');

            var activeYear;
            var activeDateUnix;
            if (!!activeDate) {
              activeYear = moment(activeDate).year();
              activeDateUnix = moment(activeDate).unix();
            }

            var result = {
              'currentView': 'year',
              'nextView': scope.options.minView === 'year' ? 'setValue' : 'month',
              'previousViewDate': {
                unselectable: true,
                dateValue: null,
                display: startDecade + '-' + (startDecade + 9)
              },
              'leftDate': {
                dateValue: moment(startDateMoment).subtract(9, 'year')
              },
              'rightDate': {
                dateValue: moment(startDateMoment).add(11, 'year')
              },
              'dates': []
            };

            for (var i = 0; i < 12; i += 1) {
              var yearMoment = moment(startDateMoment).add(i, 'years');
              var dateValue = {
                'dateValue': yearMoment,
                'display': yearMoment.format('YYYY'),
                'past': yearMoment.year() < startDecade,
                'future': yearMoment.year() > startDecade + 9,
                'active': !!ngModel.$modelValue && yearMoment.year() === activeYear,
                'isToday': yearMoment.format('YYYY') === todayDash
              };

              setStates(yearMoment, activeDateUnix, dateValue);

              result.dates.push(dateValue);
            }

            return result;
          },
          month: function(newDate, activeDate) {
            var todayDash = moment().format('YYYY-MM');
            var startDateMoment = moment(newDate).startOf('year');

            var activeMonthDash;
            var activeMonthUnix;

            if (!!activeDate) {
              activeMonthDash = moment(activeDate).format('YYYY-MM');
              activeMonthUnix = moment(activeDate).unix();
            }

            var result = {
              'previousView': 'year',
              'currentView': 'month',
              'nextView': scope.options.minView === 'month' ? 'setValue' : 'day',
              'previousViewDate': {
                dateValue: activeDate || moment(),
                display: startDateMoment.format('YYYY')
              },
              'leftDate': {
                dateValue: moment(startDateMoment).subtract(1, 'year')
              },
              'rightDate': {
                dateValue: moment(startDateMoment).add(1, 'year')
              },
              'dates': []
            };

            for (var i = 0; i < 12; i += 1) {
              var monthMoment = moment(startDateMoment).add(i, 'months');
              var monthDash = moment(monthMoment).format('YYYY-MM');

              var dateValue = {
                'dateValue': monthMoment,
                'display': monthMoment.format('MMM'),
                'active':  !!ngModel.$modelValue && monthDash === activeMonthDash,
                'isToday': monthDash === todayDash
              };

              setStates(monthMoment, activeMonthUnix, dateValue);

              result.dates.push(dateValue);
            }

            return result;
          },
          day: function(newDate, activeDate) {
            var todayDash = moment().format('YYYY-MM-DD');
            var monthStartMoment = moment(newDate).startOf('month');
            var monthEndMoment = moment(newDate).endOf('month');

            var activeDateDash;
            var activeDateUnix;

            if (!!activeDate) {
              activeDateDash = moment(activeDate).format('YYYY-MM-DD');
              activeDateUnix = moment(activeDate).unix();
            }

            monthStartMoment = matchTime(monthStartMoment, activeDate);

            var startDateMoment = moment(monthStartMoment).subtract(Math.abs(monthStartMoment.weekday()), 'days');

            var result = {
              'previousView': 'month',
              'currentView': 'day',
              'nextView': 'setValue',
              'previousViewDate': {
                dateValue: activeDate || moment(),
                display: monthStartMoment.format('YYYY-MMM')
              },
              'leftDate': {
                dateValue: moment(monthStartMoment).subtract(1, 'months')
              },
              'rightDate': {
                dateValue: moment(monthStartMoment).add(1, 'months')
              },
              'dayNames': [],
              'weeks': []
            };

            for (var dayNumber = 0; dayNumber < 7; dayNumber += 1) {
              result.dayNames.push(moment().weekday(dayNumber).format('dd'));
            }

            for (var i = 0; i < 6; i += 1) {
              var week = {
                dates: []
              };

              for (var j = 0; j < 7; j += 1) {
                var dayMoment = moment(startDateMoment).add((i * 7) + j, 'days');
                var dayDash = moment(dayMoment).format('YYYY-MM-DD');

                var dateValue = {
                  'dateValue': dayMoment,
                  'display': moment(dayMoment).format('D'),
                  'active': !!activeDate && dayDash === activeDateDash,
                  'isToday': dayDash === todayDash,
                  'past': dayMoment.isBefore(monthStartMoment),
                  'future': dayMoment.isAfter(monthEndMoment)
                };

                setStates(dayMoment, activeDateUnix, dateValue);

                week.dates.push(dateValue);
              }
              result.weeks.push(week);
            }

            return result;
          },
          setValue: function(date) {
            var v;

            if (!!date) {
              if (!moment.isMoment(date)) {
                date = fixDate(date);
              }

              v = date.format(scope.options.modelFormat);
            }

            ngModel.$setViewValue(v);

            return dataFactory[scope.options.minView](date, date);
          }
        };

        scope.changeView = function(viewName, dateObject, event) {
          if (event) {
            event.stopPropagation();
            event.preventDefault();
          }

          scope.view = viewName;

          if (!!scope.view && !!scope.view && !dateObject.unselectable && dataFactory[scope.view] && !!dateObject.dateValue) {

            var activeDate = fixDate(ngModel.$modelValue);

            if (viewName === 'setValue') {

              if (!!activeDate && dateObject.dateValue.unix() === activeDate.unix()) {
                ngModel.$setViewValue(undefined);
                ngModel.$render();

                return;
              }
            }

            scope.data = dataFactory[scope.view](dateObject.dateValue, activeDate);
          }
        };

        ngModel.$render = function() {
          if (!scope.view) {
            scope.view = scope.options.startView;
          }
          var d = fixDate(ngModel.$modelValue);

          scope.data = dataFactory[scope.view](d, d);
        };

        if (!!attrs.minDate) {
          scope.$watch('minDate', function(n, o) {
            if (n !== o) {
              ngModel.$render();
            }
          });
        }

        if (!!attrs.maxDate) {
          scope.$watch('maxDate', function(n, o) {
            if (n !== o) {
              ngModel.$render();
            }
          });
        }

        if (!!attrs.from) {
          scope.$watch('from', function(n, o) {
            if (n !== o) {
              ngModel.$render();
            }
          });
        }

        if (!!attrs.to) {
          scope.$watch('to', function(n, o) {
            if (n !== o) {
              ngModel.$render();
            }
          });
        }


      }
    };
  }
]);

angular.module('ez.datetime').directive('ezDatetimeControl', [
  'EzDatetimeService',
  '$timeout',
  '$modal',
  '$parse',
  function(
    DatetimeService,
    $timeout,
    $modal,
    $parse
  ) {
    return {
      restrict: 'EA',
      require: 'ngModel',
      scope: {
        ngModel: '=',
        minDate: '=?',
        maxDate: '=?',
        from: '=?',
        to: '=?',
        config: '=?'
      },
      link: function(scope, $element, attrs, modelCtrl) {
        $element.addClass('ez-datetime-control');

        DatetimeService.resolveConfig(scope, attrs);

        modelCtrl.$formatters.push(function(v) {
          if (!v) {
            return;
          }

          if (scope.options.modelFormat === 'x') {
            v = parseInt(v, 10);
          }

          return moment(v).format(scope.options.viewFormat);
        });

        scope.clear = function() {
          scope.form.value = undefined;
        };

        $element.bind('click', function() {
          if (attrs.disabled) {
            return;
          }

          scope.form = {
            value: modelCtrl.$modelValue,
            minDate: scope.minDate,
            maxDate: scope.maxDate,
            from: scope.from,
            to: scope.to
          };

          $modal.open({
            templateUrl: 'ez_datetime_modal.html',
            controller: 'EzDatetimeModalController',
            scope: scope,
          }).result.then(function() {
            scope.ngModel = scope.form.value;
            modelCtrl.$setDirty();

            if (attrs.ngChange) {
              $timeout(function() {
                $parse(attrs.ngChange)(scope.$parent);
              });
            }
          });
        });

      }
    };
  }
]);

angular.module('ez.datetime').directive('ezDatetimeRangeControl', [
  'EzDatetimeService',
  '$parse',
  '$timeout',
  '$modal',
  function(
    DatetimeService,
    $parse,
    $timeout,
    $modal
  ) {
    return {
      restrict: 'EA',
      scope: {
        from: '=',
        to: '=',
        shortcut: '=?',
        minDate: '=?',
        maxDate: '=?',
        config: '=?'
      },
      link: function(scope, $element, attrs) {
        var text;
        var shortcut;
        var setDirty = angular.noop;
        var setInput = angular.noop;

        $element.addClass('ez-datetime-control');

        DatetimeService.resolveConfig(scope, attrs);

        function getShortcut() {
          for (var i = 0, l = scope.options.shortcuts.length; i < l; i++) {
            if (scope.options.shortcuts[i].id === scope.shortcut) {
              return scope.options.shortcuts[i];
            }
          }

          return null;
        }

        // implement input formatter
        if ($element.is('input')) {
          var from, to;

          setInput = function() {
            if (scope.options.modelFormat === 'x') {
              from = parseInt(scope.from, 10);
              to = parseInt(scope.to, 10);
            } else {
              from = scope.from;
              to = scope.to;
            }

            if (!!from) {
              text = moment(from).format(scope.options.viewFormat);
            } else {
              text = scope.options.noValueText;
            }

            text += ' - ';

            if (!!to) {
              text += moment(to).format(scope.options.viewFormat);
            } else {
              text += scope.options.noValueText;
            }

            $element.val(text);
          };

          setDirty = function() {
            setInput();

            var parentForm = $element.inheritedData('$formController');

            parentForm.$setDirty();
          };

          // init
          setInput();
        }

        scope.$watch('from', function(n, o) {
          if (n !== o) {
            setInput();
          }
        });

        scope.$watch('to', function(n, o) {
          if (n !== o) {
            setInput();
          }
        });

        scope.clear = function() {
          scope.form.from = undefined;
          scope.form.to = undefined;
          scope.form.shortcut = undefined;
        };

        $element.bind('click', function() {
          if (attrs.disabled) {
            return;
          }

          scope.form = {
            min: scope.minDate,
            max: scope.maxDate
          };

          if (!!scope.shortcut) {
            shortcut = getShortcut(scope.shortcut);

            if (!!shortcut.from) {
              scope.form.from = shortcut.from.format();
            } else {
              scope.form.from = null;
            }

            if (!!shortcut.to) {
              scope.form.to = shortcut.to.format();
            } else {
              scope.form.to = null;
            }

            scope.form.shortcut = shortcut.id;
            scope.form.shortcutName = shortcut.name;
          } else {
            scope.form.from = scope.from;
            scope.form.to = scope.to;
          }

          $modal.open({
            templateUrl:'ez_datetime_range_modal.html',
            controller: 'EzDatetimeModalController',
            scope: scope,
          }).result.then(function() {
            if (scope.form === scope.form.from && scope.to === scope.form.to) {
              return;
            }

            scope.from = scope.form.from;
            scope.to = scope.form.to;
            scope.shortcut = scope.form.shortcut;
            scope.shortcutName = scope.form.shortcutName;

            setDirty();

            if (!!attrs.onChange) {
              $timeout(function() {
                $parse(attrs.onChange)(scope.$parent);
              });
            }
          });
        });

      }
    };
  }
]);

angular.module('ez.datetime').directive('ezTimePicker', [
  'EzDatetimeService',
  function(
    DatetimeService
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

        DatetimeService.resolveConfig(scope, attrs);

        function init() {
          scope.data = {
            minuteStep: 15,
            secondStep: 15,
            hours: [],
            minutes: [],
            seconds: []
          };

          setOptions();
        }

        function setOptions() {
          scope.data.minutes = [];
          scope.data.seconds = [];

          if (!scope.data.hours.length) {
            // set hour options
            var h = scope.options.meridiemEnabled ? 1 : 0;
            var limitH = scope.options.meridiemEnabled ? 12 : 23;
            while (h <= limitH) {
              scope.data.hours.push(h);

              h = h + 1;
            }
          }

          // set minute options
          var m = 0;
          while (m < 60) {
            scope.data.minutes.push(m);

            m = m + scope.data.minuteStep;
          }

          // set second options
          var s = 0;
          while (s < 60) {
            scope.data.seconds.push(s);

            s = s + scope.data.secondStep;
          }
        }

        function update(date) {
          ngModel.$setViewValue(date.format(scope.options.modelFormat));
          ngModel.$render();
        }

        function getDate() {
          if (!scope.ngModel) {
            return;
          }

          if (scope.options.modelFormat === 'x') {
            return moment(parseInt(scope.ngModel, 10));
          } else {
            return moment(scope.ngModel);
          }
        }

        scope.setHour = function(v) {
          var date = getDate();

          if (!date) {
            return;
          }

          date.hours(v);

          update(date);
        };

        scope.setMinute = function(v) {
          var date = getDate();

          if (!date) {
            return;
          }

          date.minutes(v);

          update(date);
        };

        scope.setSecond = function(v) {
          var date = getDate();

          if (!date) {
            return;
          }

          date.seconds(v);

          update(date);
        };

        scope.toggleMeridiem = function() {
          var date = getDate();

          if (!date) {
            return;
          }

          if (date.hours() > 12) {
            date.hours(date.hours() - 12);
          } else {
            date.hours(date.hours() + 12);
          }

          update(date);
        };

        scope.increaseMinuteStep = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          switch(scope.data.minuteStep) {
            case 15:
              scope.data.minuteStep = 5;
            break;
            case 5:
              scope.data.minuteStep = 1;
            break;
          }

          setOptions();
        };

        scope.increaseSecondStep = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          switch(scope.data.secondStep) {
            case 15:
              scope.data.secondStep = 5;
            break;
            case 5:
              scope.data.secondStep = 1;
            break;
          }

          setOptions();
        };

        init();
      }
    };
  }
]);

angular.module('ez.datetime').filter('ezDateAgo', [
  'EzDatetimeConfig',
  function(
    EzDatetimeConfig
  ) {
    return function(v, format) {
      if (!v) {
        return;
      }

      if (!format) {
        format = EzDatetimeConfig.viewFormat;
      }

      if (!isNaN(v)) {
        v = parseInt(v, 10);
      }

      if (moment().diff(moment(v), 'h') < 24) {
        return moment(v).fromNow();
      } else {
        return moment(v).format(format);
      }
    };
  }
]);

angular.module('ez.datetime').filter('ezDate', [
  'EzDatetimeConfig',
  function(
    EzDatetimeConfig
  ) {
    return function(v, viewFormat, utcOffset) {
      if (!v) {
        return;
      }

      if (!isNaN(v)) {
        v = parseInt(v, 10);
      }

      if (viewFormat === undefined) {
        viewFormat = EzDatetimeConfig.viewFormat;
      }

      if (utcOffset === undefined) {
        utcOffset = EzDatetimeConfig.utcOffset;
      }

      if (typeof utcOffset !== 'undefined') {
        return moment(v).utcOffset(utcOffset).format(viewFormat);
      } else {
        return moment(v).format(viewFormat);
      }

    };
  }
]);

angular.module('ez.datetime').filter('ezDatetimeShortcut', [
  'EzDatetimeConfig',
  function(
    EzDatetimeConfig
  ) {
    return function(v) {
      if (!v) {
        return '';
      }

      for (var i = 0, l = EzDatetimeConfig.shortcuts.length; i < l; i++) {
        if (EzDatetimeConfig.shortcuts[i].id === v) {
          return EzDatetimeConfig.shortcuts[i].name;
        }
      }

      return '';
    };
  }
]);

angular.module('ez.datetime').service('EzDatetimeService', [
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
      resolveConfig: function(scope, attrs) {
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
