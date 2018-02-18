'use strict';
function profileCtrl(Auth, $scope, $location, $rootScope, $window) {
    $rootScope.processing = false;
    $scope.me = {};
    $scope.initMe = function () {
        $rootScope.processing = true;
        Auth.me()
            .then(function (r) {
                $rootScope.processing = false;
                $scope.me = r.account;
            }, function (e) {
                $rootScope.processing = false;
                $rootScope.$broadcast('alert', e.message);
                $location.path('/');
            });
    };
    $scope.doLogout = function () {
        Auth.logout();
    };
};
angular.module('id.controllers')
    .controller('ProfileCtrl', profileCtrl);