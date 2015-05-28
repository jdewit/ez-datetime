ez-datetime-picker
==================

Angular datetime picker directive with range support.

Builds upon Dale Lotts' <a href="https://github.com/dalelotts/angular-bootstrap-datetimepicker">angular-bootstrap-datetimepicker</a> directive.

##Demo
View the <a href="http://rawgit.com/jdewit/ez-datetime/master/demo.html">DEMO</a>.

##Usage

Datetime picker
```html
<input type="text" ez-datetime-control ng-model="form.date" min-date="someMinDate" max-date="someMaxDate" config="someConfigOverridingObject"/>
```

Datetime range picker
```html
<input type="text" ez-datetime-range-control from="form.startDate" to="form.dueDate" config="someConfigOverridingObject"/>
```

###Configuration

See <a href="src/js/constants/DatetimeConfig.js">Config Constant</a> for options you can override via data attributes or with an object passed into the "config" attribute as shown above.

##Dependencies

1. <a href="http://momentjs.com">Moment.js</a>

2. Either

  - <a href="https://github.com/angular-ui/bootstrap">Angular Bootstrap</a>

  OR 

  - <a href="https://github.com/jdewit/ez-modal">ez-modal</a>
  - <a href="https://github.com/jdewit/ez-dropdown">ez-dropdown</a>
  - <a href="https://github.com/jdewit/ez-transition">ez-transition</a>


