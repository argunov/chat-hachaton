'use strict';
var web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider('http://100.90.7.38:8545'));
}
var vox = VoxImplant.getInstance();

vox.init({ micRequired: true });
vox.addEventListener(VoxImplant.Events.SDKReady, handleSDKReady);

function handleSDKReady() {
    vox.connect();
}

vox.addEventListener(VoxImplant.Events.ConnectionEstablished, handleConnectionEstablished);
vox.addEventListener(VoxImplant.Events.ConnectionFailed, handleConnectionFailed);
vox.addEventListener(VoxImplant.Events.ConnectionClosed, handleConnectionClosed);

function handleConnectionEstablished() {
    if (typeof console != "undefined") console.log("Connected to VoxImplant:" + vox.connected());
}

function handleConnectionFailed(e) {
    if (typeof console != "undefined") console.log("Connection to VoxImplant failed:" + e.message);
}

function handleConnectionClosed() {
    if (typeof console != "undefined") console.log("Connected to VoxImplant:" + vox.closed());
}

function appCtrl(Auth, $mdToast, $scope, $rootScope, $route, $location, $window) {
    $rootScope.web3 = web3;
    $rootScope.vox = vox;
    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({}, last);
    $scope.getToastPosition = function () {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
            .filter(function (pos) { return $scope.toastPosition[pos]; })
            .join(' ');
    };
    function sanitizePosition() {
        var current = $scope.toastPosition;
        if (current.bottom && last.top) { current.top = false; }
        if (current.top && last.bottom) { current.bottom = false; }
        if (current.right && last.left) { current.left = false; }
        if (current.left && last.right) { current.right = false; }
        last = angular.extend({}, current);
    }
    if (Auth.logged()) { $rootScope.logged = true; }
    else { $rootScope.logged = false; }
    $rootScope.$on('alert', function (event, data) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(data)
                .position($scope.getToastPosition())
                .hideDelay(3000)
        );
    });
    $rootScope.$on('$routeChangeStart', function () {
        if (Auth.logged()) { $rootScope.logged = true; }
        else { $rootScope.logged = false; }
    });
}
angular.module('id.controllers', ['id.services'])
    .controller('AppCtrl', appCtrl);