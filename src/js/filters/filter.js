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
