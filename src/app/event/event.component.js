(function() {
    'use strict';

    angular.module('event', ['libraries']);

    angular.module('event').component('event', {
        bindings: {},
        controller: 'EventController',
        templateUrl: 'event/event.html'
    });

    angular.module('event').config(function($stateProvider) {

        $stateProvider.state('event', {
            url: '/event',
            template: '<event flex></event>',
            params: {
                'event': {}
            }
        });
    });
    
})();
