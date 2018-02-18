'use strict';
function loginCtrl(Auth, $scope, $window, $location, $rootScope) {
    $rootScope.processing = false;
    $scope.login = {};
    $scope.doLogin = function () {
        $rootScope.processing = true;
        Auth.login($scope.login)
            .then(function (r) {
                $rootScope.processing = false;
                $window.localStorage.setItem('access', r.access);
                $location.path('/');
            }, function (e) {
                $rootScope.processing = false;
                $rootScope.$broadcast('alert', e.message);
                $location.path('/');
            });
    };
};
angular.module('id.controllers')
    .controller('LoginCtrl', loginCtrl);