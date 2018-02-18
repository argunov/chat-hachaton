'use strict';
function signupCtrl(Auth, $scope, $location, $rootScope) {
    $rootScope.processing = false;
    $scope.register = {};
    $scope.doRegister = function () {
        $rootScope.processing = true;
        Auth.signup($scope.register)
            .then(function (r) {
                $rootScope.$broadcast('alert', 'Запрос отправлен');
                $rootScope.processing = false;
                $location.path('/email');
            }, function (e) {
                $rootScope.$broadcast('alert', e.message);
                $rootScope.processing = false;
                $location.path('/');
            });
    };
};
angular.module('id.controllers')
    .controller('SignupCtrl', signupCtrl);