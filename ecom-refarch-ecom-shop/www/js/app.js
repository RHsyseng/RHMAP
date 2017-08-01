window.angular = require("angular");
require("angular-animate");
require("angular-resource");
require("angular-ui-router");
require("ionic-scripts");
require("angular-route");
require("angular-sanitize");

var myApp = angular.module('myApp',
    [
        'ionic',
        'ngRoute',
        'ngSanitize'
    ])

    .constant('$fh', require("fh-js-sdk"))
    .constant('moment', require("moment"))

    .constant('$ionicLoadingConfig', {
        template: '<ion-spinner></ion-spinner>',
        noBackdrop: false
    })

    .run(function($rootScope, $interval, AuthService, SalesService, SyncService, $ionicPopup) {

        SyncService.init();

        $rootScope.user = null;
        $rootScope.logged_in = false;
        $rootScope.availabilityNotified = false;

        $rootScope.$on('event.userAuth', function(event, user) {
            SalesService.listOrders(user.id).then(function(data) {
                $rootScope.user = user;
                $rootScope.user.orders = data;
                $rootScope.logged_in = true;
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

        AuthService.login("bobdole", "password").then(function(data) {
            $rootScope.$emit("event.userAuth", data);
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
                if (!$rootScope.availability && !$rootScope.availabilityNotified) {
                    $rootScope.availabilityNotified = true;
                    $ionicPopup.alert({
                        title: 'Houston, we have a problem...',
                        template: "Some of our services seem to be misbehaving right now and your experience is" +
                        " likely to be affected. We apologize for the inconvenience!"
                    });
                }
            });
        }, 5000);
    })

    .config(
        function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('tab', {
                    cache: false,
                    url: '/tab',
                    abstract: true,
                    templateUrl: 'templates/tabs.html',
                    controller: 'TabCtrl as tabs'
                })

                .state('tab.home', {
                    cache: false,
                    url: '/home',
                    views: {
                        'tab-home': {
                            templateUrl: 'templates/home.html',
                            controller: 'HomeCtrl as home'
                        }
                    }
                })

                .state('tab.products', {
                    cache: false,
                    url: '/products',
                    views: {
                        'tab-products': {
                            templateUrl: 'templates/products.html',
                            controller: 'ProductsCtrl as products'
                        }
                    }
                })

                .state('tab.products-detail', {
                    cache: false,
                    url: '/products/:sku',
                    views: {
                        'tab-products': {
                            templateUrl: 'templates/products.detail.html',
                            controller: 'ProductDetailCtrl as product'
                        }
                    }
                })

                .state('tab.cart', {
                    cache: false,
                    url: '/cart',
                    views: {
                        'tab-cart': {
                            templateUrl: 'templates/cart.html',
                            controller: 'CartCtrl as cart'
                        }
                    }
                })

                .state('tab.account', {
                    cache: false,
                    url: '/account',
                    views: {
                        'tab-account': {
                            templateUrl: 'templates/account.html',
                            controller: 'AccountCtrl as account'
                        }
                    }
                })

                .state('tab.order-detail', {
                    cache: false,
                    url: '/account/:orderId',
                    views: {
                        'tab-account': {
                            templateUrl: 'templates/account.order.html',
                            controller: 'OrderDetailCtrl as order'
                        }
                    }
                })

                .state('tab.favorites', {
                    cache: false,
                    url: '/favorites',
                    views: {
                        'tab-favorites': {
                            templateUrl: 'templates/favorites.html',
                            controller: 'FavoritesCtrl as favorites'
                        }
                    }
                });

            $urlRouterProvider.otherwise('/tab/home');
        });