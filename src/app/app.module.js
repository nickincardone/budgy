(function() {
    'use strict';

    angular.module('libraries', ['ngCookies', 'ngMaterial', 'ngSanitize', 'ui.router', 'angularMoment']);

    angular.module('budgy', ['html-templates', 'home', 'header', 'weekly', 'event', 'libraries']);

    angular.module('budgy').run(function(Event) {
        Event.initEvents();
    })
})();
