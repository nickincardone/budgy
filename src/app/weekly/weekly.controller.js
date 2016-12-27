(function() {
  'use strict';

  angular.module('weekly').controller('WeeklyController', WeeklyController);

  WeeklyController.$inject = ['$stateParams', 'Event', '$scope'];

  function WeeklyController($stateParams, Event, $scope) {
    var ctrl = this;
    ctrl.basePay = 2445.53;
    ctrl.events = [];
    ctrl.startDate = moment('2016-11-25');
    ctrl.endDate = moment('2016-12-08');
    ctrl.balance = 0;

    ctrl.$onInit = function() {
      updateEvents();
      $scope.$on('EventsUpdated', updateEvents);
      if ($stateParams.firstDay) {
        ctrl.startDate = $stateParams.firstDay;
        ctrl.endDate = $stateParams.nextDay;
      }
    }

    ctrl.next = function() {
      ctrl.startDate.add(14, 'days');
      ctrl.endDate.add(14, 'days');
      updateEvents();
    }

    ctrl.back = function() {
      ctrl.startDate.subtract(14, 'days');
      ctrl.endDate.subtract(14, 'days');
      updateEvents();
    }

    function updateEvents() {
      ctrl.events = [];
      ctrl.events = Event.getEvents(ctrl.startDate, ctrl.endDate)
      calculateBalance();
    }

    function calculateBalance() {
      ctrl.balance = ctrl.basePay;
      for (var i = 0; i < ctrl.events.length; i++) {
        var curr = ctrl.events[i];
        ctrl.balance -= curr.amount;
      }
      ctrl.balance = +ctrl.balance.toFixed(2);
    }


  }
})();
