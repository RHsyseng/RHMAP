window.angular = require("angular");
require("angular-animate");
require("angular-resource");
require("angular-ui-router");
require("angular-route");
require("angular-sanitize");
require('angular-ui-bootstrap');

angular.module('myApp', [
    'ui.router',
    'ui.bootstrap',
    'ngSanitize'
])
    .constant('$fh', require("fh-js-sdk"))
    .constant('moment', require('moment'))

    .run(function($rootScope, $interval, AuthService, SalesService, SyncService) {

        SyncService.init();

        $rootScope.user = null;
        $rootScope.logged_in = false;
        $rootScope.loading = false;
        $rootScope.availability = true;

        $rootScope.$on('event.userAuth', function(event, user) {
            SalesService.listOrders(user.id).then(function(data) {
                $rootScope.user = user;
                $rootScope.user.orders = data;
                $rootScope.logged_in = true;
                $rootScope.$emit('event.userAuthComplete');
            });
        });

        $rootScope.$on('event.orderPlaced', function(event) {
            SalesService.listOrders($rootScope.user.id).then(function(data) {
                $rootScope.user.orders = data;
            });
        });

        $rootScope.$on('event.userPart', function(event, user) {
            $rootScope.user = null;
            $rootScope.logged_in = false;
        });

        $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
            $rootScope.loading = true;
        });

        $rootScope.$on('event.loadStart', function(event) {
            $rootScope.loading = true;
        });

        $rootScope.$on('event.loadStop', function(event) {
            $rootScope.loading = false;
        });

        $interval(function() {
            if ($rootScope.user) {
                AuthService.checkToken($rootScope.user.id).then(function(data) {

                    $rootScope.logged_in = data.tokenFound;
                    if (!$rootScope.logged_in) {
                        console.log("token check...auth'd user timed out");
                        $rootScope.$emit("event.userPart", $rootScope.user);
                    } else {
                        console.log("token check...auth'd user found on scope")
                    }
                });
            } else {
                console.log("token check...no user on scope");
            }
        }, 5000);

        $interval(function() {
            AuthService.checkAvailability().then(function(data) {

                $rootScope.availability = (data.result === 'ok');
                console.log("health check..." + data.result + ' response to bool ' + $rootScope.availability);
            });
        }, 5000);
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                cache: false,
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl as home'
            })

            .state('products', {
                cache: false,
                url: '/products',
                templateUrl: 'templates/products.html',
                controller: 'ProductsCtrl as products'
            })

            .state('cart', {
                cache: false,
                url: '/cart',
                templateUrl: 'templates/cart.html',
                controller: 'CartCtrl as cart'
            })

            .state('account', {
                cache: false,
                url: '/account',
                templateUrl: 'templates/account.html',
                controller: 'AccountCtrl as account'
            })

            .state('logout', {
                cache: false,
                url: '/account/:action',
                templateUrl: 'templates/account.html',
                controller: 'AccountCtrl as account'
            })

            .state('favorites', {
                cache: false,
                url: '/favorites',
                templateUrl: 'templates/favorites.html',
                controller: 'FavoritesCtrl as favorites'
            });

            $urlRouterProvider.otherwise('/home');
    });