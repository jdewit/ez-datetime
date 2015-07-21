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
