(function() {
  'use strict';

  angular.module('home').controller('AddEventController', AddEventController);

  AddEventController.$inject = ['$mdDialog'];

  function AddEventController($mdDialog) {
    var ctrl = this;
    ctrl.event = {
      'name': '',
      'amount': 0,
      'date': false,
      'oneTime': false,
      'dayOfMonth': 1
    };
    ctrl.hide = function() {
      $mdDialog.hide();
    };

    ctrl.cancel = function() {
      $mdDialog.cancel();
    };

    ctrl.add = function(event) {
      $mdDialog.hide(event);
    };

    ctrl.getOrdinal = function(n) {
      var s=["th","st","nd","rd"],
      v=n%100;
      return n+(s[(v-20)%10]||s[v]||s[0]);
    }

    ctrl.range = function(start, end) {
      var result = [];
      for (var i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    };
  }
})();
