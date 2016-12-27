(function() {
  'use strict';

  angular.module('header', ['libraries']);

  angular.module('header').component('header', {
    templateUrl: 'header/header.html',
    controller: 'HeaderController'
  });
})();
