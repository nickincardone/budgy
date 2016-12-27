(function() {
  'use strict';

  angular.module('event').controller('EventController', EventController);

  EventController.$inject = ['$stateParams', '$state', '$mdDialog', 'Event'];

  function EventController($stateParams, $state, $mdDialog, Event) {
    var ctrl = this;
    ctrl.event = {};

    ctrl.$onInit = function() {
      if (angular.equals($stateParams.event, {})) {
        $state.go('home');
      } else {
        ctrl.event = $stateParams.event;
        ctrl.day = ctrl.event.date.date();
      }
    }

    ctrl.cancel = function() {
      $state.go('home');
    }

    ctrl.delete = function(ev) {
      var confirm = $mdDialog.confirm()
        .title('Would you like to delete this payment?')
        .ariaLabel('Lucky day')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function() {
        Event.deleteEvent(ctrl.event.id);
        $state.go('home');
      }, function() {
      });
    };

    ctrl.save = function() {
      ctrl.event.date.date(ctrl.day);
      Event.editEvent(ctrl.event.id, ctrl.event);
      $state.go('home');
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
