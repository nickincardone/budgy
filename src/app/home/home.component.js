(function() {
    'use strict';

    angular.module('home', ['libraries']);

    angular.module('home').component('home', {
        bindings: {},
        controller: 'HomeController',
        templateUrl: 'home/home.html'
    });

    angular.module('home').config(function($stateProvider) {

        $stateProvider.state('home', {
            url: '/home',
            template: '<home flex></home>'
        });
    });
    
})();
