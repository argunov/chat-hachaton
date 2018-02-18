'use strict';
function httpRequestInterceptor($q, $location, $window) {
    var authInterceptorFactory = {};
    authInterceptorFactory.request = function (config) {
        var access = $window.localStorage.getItem('access');
        if (access) {
            config.headers['x-access-token'] = access;
        }
        return config;
    };
    authInterceptorFactory.responseError = function (response) {
        if (response.status == 403) { $location.path('login'); }
        return $q.reject(response);
    };
    return authInterceptorFactory;
}
angular.module('id.services', [])
    .factory('HttpRequestInterceptor', httpRequestInterceptor);