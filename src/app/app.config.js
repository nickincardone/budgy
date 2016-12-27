(function() {
    'use strict';

    angular.module('budgy').config(function($urlRouterProvider) {
        $urlRouterProvider.when('', '/home');
    });

})();
