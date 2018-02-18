'use strict';
function composeReq(method, api, url, hdrs, data, q, http, rs) {
    var d = q.defer();
    var req = {
        method: method,
        url: api.url + url,
        headers: (hdrs),
        data: (data)
    };
    http(req).then(
        function (r) { d.resolve(r.data); },
        function (e) { d.reject(e.data); }
    );
    return d.promise;
}
function auth($q, $http, $apiEndpoint, $location, $window, $rootScope) {
    var authFactory = {};
    authFactory.login = function (data) {
        return composeReq('POST', $apiEndpoint, 'api/account/login', null, data, $q, $http, $rootScope);
    };
    authFactory.signup = function (data) {
        return composeReq('POST', $apiEndpoint, 'api/account/signup', null, data, $q, $http, $rootScope);
    };
    authFactory.me = function () {
        return composeReq('GET', $apiEndpoint, 'api/account/me', null, null, $q, $http, $rootScope);
    };
    authFactory.logged = function () {
        var token = $window.localStorage.getItem('access');
        if (token) { return true; }
        return false;
    };
    authFactory.logout = function () {
        $window.localStorage.removeItem('access');
        $location.path('/');
    };
    return authFactory;
}
angular.module('id.services')
    .factory('Auth', auth);