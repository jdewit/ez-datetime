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
