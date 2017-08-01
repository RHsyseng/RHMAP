angular.module('myApp').controller('AccountCtrl',
    ['$scope', '$rootScope', '$state', '$ionicLoading', '$ionicPopup', 'AuthService',
        function ($scope, $rootScope, $state, $ionicLoading, $ionicPopup, AuthService) {

            var instance = this;

            $scope.$on('$ionicView.enter', function (e) {
                instance.isRegister = false;
            });


            function login(user) {

                $ionicLoading.show();

                AuthService.login(user.username, user.password).then(
                    function (data) {

                        console.log("successful login");
                        $rootScope.$emit("event.userAuth", data);

                        $state.go('tab.account', {}, {reload: true});
                        $ionicLoading.hide();
                    },
                    function (data) {
                        console.log("login failed", data);
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Login failed!'
                        });
                    });
            }

            instance.login = login;

            function register(user) {

                $ionicLoading.show();

                AuthService.register(user).then(
                    function (data) {

                        console.log("successful registration");
                        $rootScope.$emit("event.userAuth", data);

                        $state.go('tab.account', {}, {reload: true});
                        $ionicLoading.hide();
                    },
                    function (data) {
                        console.log("Registration failed", data);
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Registration failed!'
                        });
                    });
            }

            instance.register = register;

            function logout() {

                AuthService.logout();
                $rootScope.$emit("event.userPart");
                $state.reload('tab.account');
            }

            instance.logout = logout;
        }]);

angular.module('myApp').controller('OrderDetailCtrl',
    ['$scope', '$rootScope', '$stateParams', '$state', '$ionicLoading', '$ionicPopup', 'SalesService', 'ProductService',
        function ($scope, $rootScope, $stateParams, $state, $ionicLoading, $ionicPopup, SalesService, ProductService) {

            var instance = this;
            $scope.$on('$ionicView.enter', function (e) {

                $ionicLoading.show();

                SalesService.getOrder($rootScope.user.id, $stateParams.orderId)
                    .then(function (order) {

                            instance.products = [];
                            instance.order = order;
                            instance.order.distinctProducts = [];
                            instance.order.total = 0;

                            order.orderItemIds.forEach(function (orderItemId) {

                                SalesService.getOrderItem($rootScope.user.id, order.id, orderItemId).then(function (orderItem) {

                                    ProductService.get(orderItem.sku).then(function(product) {

                                        product.count = orderItem.quantity;
                                        instance.order.distinctProducts.push(product);
                                        instance.order.total += (product.count * product.price);

                                        if (instance.order.distinctProducts.length === order.orderItemIds.length) {
                                            $ionicLoading.hide();
                                        }
                                    }, function(data) {
                                        console.log("Error: " + data);
                                        var popup = $ionicPopup.alert({
                                            title: 'uh oh!',
                                            template: 'Error fetching order detail: ' + data
                                        });
                                    });
                                }, function(data) {
                                    console.log("Error: " + data);
                                    var popup = $ionicPopup.alert({
                                        title: 'uh oh!',
                                        template: 'Error fetching order detail: ' + data
                                    });
                                });
                            });
                        },
                        function (data) {
                            console.log("Error: " + data);
                            var popup = $ionicPopup.alert({
                                title: 'uh oh!',
                                template: 'Error fetching order detail: ' + data
                            });
                            popup.then(function () {
                                $ionicLoading.hide();
                                $state.go('tab.account');
                            });
                        });
            });
        }]);
