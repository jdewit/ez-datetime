angular.module('ez.datetime').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ez_datetime_date_picker.html',
    "<div class=\"datepicker table-responsive\"><table class=\"table {{ data.currentView }}-view\"><thead><tr><th class=\"left\" ng-click=\"changeView(data.currentView, data.leftDate, $event)\" ng-hide=\"data.leftDate.unselectable\"><i class=\"glyphicon glyphicon-arrow-left\"></i></th><th class=\"switch\" colspan=\"5\" ng-class=\"{disabled: data.previousViewDate.unselectable}\" ng-click=\"changeView(data.previousView, data.previousViewDate, $event)\">{{ data.previousViewDate.display }}</th><th class=\"right\" ng-click=\"changeView(data.currentView, data.rightDate, $event)\" ng-hide=\"data.rightDate.unselectable\"><i class=\"glyphicon glyphicon-arrow-right\"></i></th></tr><tr><th class=\"dow\" ng-repeat=\"day in data.dayNames\">{{ day }}</th></tr></thead><tbody><tr ng-if=\"data.currentView !== 'day'\"><td colspan=\"7\"><span class=\"{{ data.currentView }}\" ng-repeat=\"dateObject in data.dates\" ng-class=\"{active: dateObject.active, past: dateObject.past, future: dateObject.future, disabled: dateObject.unselectable, highlight: dateObject.highlight, current: dateObject.isToday}\" ng-click=\"changeView(data.nextView, dateObject, $event)\">{{ dateObject.display }}</span></td></tr><tr ng-if=\"data.currentView === 'day'\" ng-repeat=\"week in data.weeks\"><td ng-repeat=\"dateObject in week.dates\" ng-click=\"changeView(data.nextView, dateObject, $event)\" class=\"day\" ng-class=\"{active: dateObject.active, past: dateObject.past, future: dateObject.future, disabled: dateObject.unselectable, highlight: dateObject.highlight, current: dateObject.isToday}\" title=\"{{ dateObject.unselectable ? 'This date is out of range' : '' }}\">{{ dateObject.display }}</td></tr></tbody></table></div>"
  );


  $templateCache.put('ez_datetime_modal.html',
    "<div class=\"ez-datetime-modal\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" ng-click=\"dismiss()\"><span>×</span></button><h4 class=\"modal-title\"><i class=\"{{ options.headingIcon }}\"></i> {{ options.headingText }}</h4></div><div class=\"modal-body\"><div ez-date-picker ng-model=\"form.value\" min-date=\"form.minDate\" max-date=\"form.maxDate\" options=\"options\"></div><div ng-if=\"options.timepickerEnabled && !!form.value\"><hr><div ez-time-picker ng-model=\"form.value\" options=\"options\"></div></div></div><div class=\"modal-footer\"><div class=\"left-btn-group\"><a class=\"btn btn-default clear-btn\" title=\"Clear Date\" ng-click=\"clear()\" ng-if=\"!!form.value\"><span class=\"{{ options.clearBtnIcon }}\"></span></a></div><a class=\"btn btn-default\" ng-click=\"dismiss()\"><i class=\"{{ options.cancelBtnIcon }}\"></i> {{ options.cancelBtnText }}</a> <a class=\"btn btn-lg btn-primary\" ng-click=\"ok()\"><i class=\"{{ options.okBtnIcon }}\"></i> {{ options.okBtnText }}</a></div></div>"
  );


  $templateCache.put('ez_datetime_range_modal.html',
    "<div class=\"ez-datetime-modal\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" ng-click=\"dismiss()\"><span>×</span></button><h4 class=\"modal-title\"><i class=\"{{ options.headingIcon }}\"></i> {{ options.rangeHeadingText }}</h4></div><div class=\"modal-body\"><div class=\"row\"><div class=\"range-from col-lg-6 col-md-6 col-sm-6\"><div ez-date-picker ng-model=\"form.from\" max-date=\"form.maxDate\" to=\"form.to\" options=\"options\"></div><div ng-if=\"options.timepickerEnabled && !!form.from\"><hr><div ez-time-picker ng-model=\"form.from\" options=\"options\"></div></div></div><div class=\"range-to col-lg-6 col-md-6 col-sm-6\"><div ez-date-picker ng-model=\"form.to\" min-date=\"form.minDate\" from=\"form.from\" options=\"options\"></div><div ng-if=\"options.timepickerEnabled && !!form.to\"><hr><div ez-time-picker ng-model=\"form.to\" options=\"options\"></div></div></div></div></div><div class=\"modal-footer\"><div class=\"left-btn-group\"><span class=\"quick-select dropdown dropup\" ng-if=\"options.shortcutsEnabled && shortcuts.length > 0\"><a class=\"btn btn-default dropdown-toggle\"><i class=\"{{ options.shortcutBtnIcon }}\"></i> <span ng-if=\"!form.shortcut\">{{ options.shortcutBtnText }}</span> <span ng-if=\"!!form.shortcut\">{{ form.shortcutName }}</span> <span class=\"caret\"></span></a><ul class=\"dropdown-menu\"><li ng-repeat=\"shortcut in shortcuts\"><a ng-click=\"select($index)\">{{ options.shortcutNamePrefix }}{{ shortcut.name }}</a></li></ul></span> <a class=\"btn btn-default clear-btn\" title=\"Clear Date\" ng-click=\"clear()\" ng-if=\"!!form.from || !!form.to\"><span class=\"{{ options.clearBtnIcon }}\"></span></a></div><a class=\"btn btn-default\" ng-click=\"dismiss()\"><i class=\"{{ options.cancelBtnIcon }}\"></i> {{ options.cancelBtnText }}</a> <a class=\"btn btn-lg btn-primary\" ng-click=\"ok()\"><i class=\"{{ options.okBtnIcon }}\"></i> {{ options.okBtnText }}</a></div></div>"
  );


  $templateCache.put('ez_datetime_time_picker.html',
    "<table class=\"ez-time-picker\"><tr><td><div class=\"dropdown\"><a class=\"btn btn-default dropdown-toggle\">{{ ngModel | ezDate:options.hourFormat }}</a><ul class=\"dropdown-menu dropdown-pointer\"><li ng-repeat=\"hour in data.hours\"><a ng-click=\"setHour(hour)\">{{ hour }}</a></li></ul></div></td><td>:</td><td><div class=\"dropdown\"><a class=\"btn btn-default dropdown-toggle\">{{ ngModel | ezDate:options.minuteFormat }}</a><ul class=\"dropdown-menu dropdown-pointer\"><li ng-repeat=\"minute in data.minutes\"><a ng-click=\"setMinute(minute)\">{{ minute }}</a></li><li ng-hide=\"data.minuteStep == 1\"><a ng-click=\"increaseMinuteStep($event)\"><i class=\"glyphicon glyphicon-option-horizontal\"></i></a></li></ul></div></td><td ng-if=\"options.secondsEnabled\">:</td><td ng-if=\"options.secondsEnabled\"><div class=\"dropdown\"><a class=\"btn btn-default dropdown-toggle\">{{ ngModel | ezDate:options.secondFormat }}</a><ul class=\"dropdown-menu dropdown-pointer\"><li ng-repeat=\"second in data.seconds\"><a ng-click=\"setSecond(second)\">{{ second }}</a></li><li ng-hide=\"data.secondStep == 1\"><a ng-click=\"increaseSecondStep($event)\"><i class=\"glyphicon glyphicon-option-horizontal\"></i></a></li></ul></div></td><td></td><td><a class=\"btn btn-default meridiem-btn\" ng-click=\"toggleMeridiem()\">{{ ngModel | ezDate:options.meridiemFormat }}</a></td></tr></table>"
  );

}]);
