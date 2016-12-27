(function() {
  'use strict';

  angular.module('budgy').factory('Event', Event);

  Event.$inject = ['$rootScope'];

  function Event($rootScope) {
    var factory = {
      addEvent: addEvent,
      getEvents: getEvents,
      getEvent: getEvent,
      events: [],
      startDate: moment(),
      nextDate: moment(),
      initEvents: initEvents,
      deleteEvent: deleteEvent,
      editEvent: editEvent
    };

    return factory;

    function addEvent(event) {
      if (!event.oneTime) {
        event.date = moment().date(event.dayOfMonth);
      } else {
        event.date = moment(event.date);
      }
      event.prettyDate = event.date.format("MMM Do");
      factory.events.push(event);
      event.id = Math.random();
      updateEvents();
      $rootScope.$broadcast('EventsUpdated');
    }

    function getEvents(start, end) {
      if (typeof start === "undefined")
        return _.sortBy(factory.events, [function(o) {return o.date.date()}]);
      return _.sortBy(filterEvents(start, end), [function(o) {return o.date.date()}]);
    }

    function filterEvents(start, end) {
      var filteredEvents = [];
      for (var i = 0; i < factory.events.length; i++) {
        var eventInRange = filterDate(start, end, factory.events[i])
        if (eventInRange)
          filteredEvents.push(eventInRange);
      }
      return filteredEvents;
    }

    function filterDate(start, end, event) {
      var endDate = end.date();
      var startDate = start.date();
      if (event.oneTime) {
        return filterOneTime(start, end, event);
      }
      if (end.daysInMonth() === endDate)
        endDate = 31;
      return filterRecurring(startDate, endDate, event);
    }

    function filterOneTime(start, end, event) {
      if (event.date.isBetween(start, end, null, '[]'))
        return event;
      return false;
    }

    function filterRecurring(startDate, endDate, event) {
      var date = event.date.date();
      if (endDate > startDate) {
        if (date <= endDate && date >= startDate) {
          return event;
        }
      } else {
        if (date <= endDate || date >= startDate) {
          return event;
        }
      }
      return false;
    }

    function updateEvents() {
      var data = JSON.stringify(factory.events);
      localStorage.setItem("events", data);
    }

    function getEvent(id) {
      for (var i = 0; i < factory.events.length; i++) {
        if (factory.events[i].id === id) {
          return factory.events[i];
        }
      }
      return false;
    }

    function deleteEvent(id) {
      for (var i = 0; i < factory.events.length; i++) {
        if (factory.events[i].id === id) {
          factory.events.splice(i, 1);
        }
      }
      updateEvents();
    }

    function initEvents() {
      var data = localStorage.getItem("events");
      if (data) {
        factory.events = JSON.parse(data);
      }
      for (var i = 0; i < factory.events.length; i++) {
        factory.events[i].date = moment(factory.events[i].date);
        factory.events[i].id = Math.random();
      }
    }

    function editEvent(id, updatedInfo) {
      var event = getEvent(id);
      if (!event) return;
      for (var key in updatedInfo) {
        if (event[key] !== undefined) {
          event[key] = updatedInfo[key];
        }
      }
      if (!event.oneTime) {
        event.date = moment().date(event.dayOfMonth);
      }
      updateEvents();
    }

  }
})();
