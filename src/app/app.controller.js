(function() {
    'use strict';

    angular.module('budgy').controller('AppController', AppController);

    AppController.$inject = ['$rootScope', '$state'];

    function AppController($rootScope, $state) {
        var ctrl = this;
        var showHandler, hideHandler;

        ctrl.showLoader = showLoader;
        ctrl.hideLoader = hideLoader;

        ctrl.loading = false;

        showHandler = $rootScope.$on('globalLoader.show', ctrl.showLoader);
        hideHandler = $rootScope.$on('globalLoader.hide', ctrl.hideLoader);

        function showLoader(event) {
            ctrl.loading = true;
        }

        function hideLoader(event) {
            ctrl.loading = false;
        }
    }
})();