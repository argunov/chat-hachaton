'use strict';
var apiURL = 'http://localhost:3000/';
angular.module('id', ['ngSanitize', 'ngRoute', 'ngMaterial', 'ngMdIcons', 'ngMessages', 'ngAria', 'ngAnimate', 'id.services', 'id.controllers'])
    .constant('$apiEndpoint', {
        url: apiURL
    })
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey', {
                'default': '800',
                'hue-1': '400',
                'hue-2': '700',
                'hue-3': 'A100'
            })
            .accentPalette('orange');
        $mdThemingProvider.theme('second')
            .primaryPalette('blue-grey', {
                'default': 'A400',
                'hue-1': 'A100',
                'hue-2': 'A200',
                'hue-3': 'A100'
            })
            .accentPalette('orange');
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('HttpRequestInterceptor');
    })
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/body.html',
                controller: 'AppCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl'
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl'
            })
            .when('/email', {
                templateUrl: 'views/email.html'
            })
            .when('/help', {
                templateUrl: 'views/help.html'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    });