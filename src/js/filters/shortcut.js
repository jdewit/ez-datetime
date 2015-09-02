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
