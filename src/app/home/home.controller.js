(function() {
  'use strict';

  angular.module('home').controller('HomeController', HomeController);

  HomeController.$inject = ['$mdDialog', '$state', 'Event', '$scope'];

  function HomeController($mdDialog, $state, Event, $scope) {
    var ctrl = this;
    ctrl.events = [];
    ctrl.text = 'blah';
    ctrl.currentItem = '';
    ctrl.startDay = moment("20161125", "YYYYMMDD");
    ctrl.today = moment();
    ctrl.nextDay = moment();

    ctrl.$onInit = function() {
      ctrl.getNextPay();
      updateEvents();
      $scope.$on('EventsUpdated', updateEvents);
    }

    function updateEvents() {
        ctrl.events = Event.getEvents();
    }

    ctrl.getNextPay = function() {
      var currAttempt = ctrl.startDay;
      while (true) {
        if (currAttempt.isAfter(ctrl.today)) {
          ctrl.nextDay = currAttempt;
          ctrl.nextDayPretty = currAttempt.format("MMMM Do");
          return;
        }
        currAttempt.add(14, 'days').calendar();
      }
    }

    ctrl.goToWeekly = function() {
        var firstDay = ctrl.nextDay.clone().subtract(14, 'days');
        ctrl.nextDay.add(1, 'days');
        var parms = {
            events: ctrl.events,
            firstDay: firstDay,
            nextDay: ctrl.nextDay
        }
        $state.go('weekly', parms);
    }

    ctrl.edit = function(event) {
      var parms = {
            event: event
        }
        $state.go('event', parms);
    }
  }
})();
