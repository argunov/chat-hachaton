'use strict';
function sideCtrl($scope, $mdSidenav) {
    $scope.toggleMenu = buildToggler('left');
    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }
};
angular.module('id.controllers')
    .controller('SideCtrl', sideCtrl);