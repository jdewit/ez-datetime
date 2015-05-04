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
        from: '=?',
        to: '=?',
        options: '=?'
      },
      replace: true,
      link: function link(scope, element, attrs, ngModel) {

        scope.date = null;

        DatetimeService.resolveConfig(scope, attrs);

        var startOfDecade = function startOfDecade(unixDate) {
          var startYear = (parseInt(moment(unixDate).year() / 10, 10) * 10);
          return moment(unixDate).year(startYear).startOf('year');
        };


        // highlight items that are within the selected range
        var resolveHighlight = function(date, activeDateUnix, dateValue) {
          var dateUnix = moment(date).unix();
          var fromUnix, toUnix;

          if (scope.options.rangeEnabled) {
            // highlight the range of days that are between the from date and the active date
            if (!!attrs.from && !!scope.from) {
              fromUnix = moment(scope.from).unix();

              if (!!activeDateUnix && dateUnix >= fromUnix && dateUnix < activeDateUnix) {
                dateValue.highlight = true;
              }

              if (dateUnix < fromUnix) {
                dateValue.unselectable = true;
              }
            } else if (!!attrs.to && !!scope.to) {
              // highlight the range of days that are between the active date and the to date

              toUnix = moment(scope.to).unix();

              if (!!activeDateUnix && dateUnix <= toUnix && dateUnix > activeDateUnix) {
                dateValue.highlight = true;
              }

              if (dateUnix > toUnix) {
                dateValue.unselectable = true;
              }
            }
          } else {
            if (!!scope.from) {
              fromUnix = moment(scope.from).unix();

              if (dateUnix < fromUnix) {
                dateValue.unselectable = true;
              }
            }

            if (!!scope.to) {
              toUnix = moment(scope.to).unix();

              if (dateUnix > toUnix) {
                dateValue.unselectable = true;
              }
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
            var v = moment(date).format(scope.options.modelFormat);

            if (scope.options.modelFormat === 'x' || scope.options.modelFormat === 'X') {
              v = parseInt(v, 10);
            }

            ngModel.$setViewValue(v);
            ngModel.$render();

            return dataFactory[scope.options.minView](moment(date));
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

            var v = ngModel.$viewValue;

            if (typeof v === 'string' && !isNaN(v)) {
              v = parseInt(v, 10);

              ngModel.$setViewValue(v);
            }

            scope.data = dataFactory[scope.view](v);
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
