(function() {
    'use strict';

    angular.module('weekly', ['libraries']);

    angular.module('weekly').component('weekly', {
        bindings: {},
        controller: 'WeeklyController',
        templateUrl: 'weekly/weekly.html'
    });

    angular.module('weekly').config(function($stateProvider) {

        $stateProvider.state('weekly', {
            url: '/weekly',
            template: '<weekly flex></weekly>',
            params: {
                'events': [],
                'firstDay': null,
                'nextDay': null
            }
        });
    });
})();
