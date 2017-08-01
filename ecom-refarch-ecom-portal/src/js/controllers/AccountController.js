angular.module('myApp').controller('AccountCtrl',
    ['$scope', '$rootScope', '$state', '$stateParams', 'AuthService', 'SalesService', 'ProductService',
        function ($scope, $rootScope, $state, $stateParams, AuthService, SalesService, ProductService) {

        var instance = this;
        instance.isRegister = false;

        if($stateParams.action === 'logout') {
            AuthService.logout();
            $rootScope.$emit("event.userPart");
            $state.go('account');
        }

        $scope.$emit('event.loadStop');

        function orderDetail(order) {

            $scope.$emit('event.loadStart');
            instance.order = order;
            instance.order.show = false;
            instance.order.distinctProducts = [];
            instance.order.total = 0;
            instance.showOrder = 0;

            order.orderItemIds.forEach(function (orderItemId) {

                SalesService.getOrderItem($rootScope.user.id, order.id, orderItemId).then(function (orderItem) {

                    ProductService.get(orderItem.sku).then(function(product) {

                        product.count = orderItem.quantity;
                        instance.order.distinctProducts.push(product);
                        instance.order.total += (product.count * product.price);

                        if (instance.order.distinctProducts.length === order.orderItemIds.length) {
                            instance.order.show = order.transactionNumber;
                            $scope.$emit('event.loadStop');
                        }
                    }, function(error) {
                        $scope.$emit('event.loadStop');
                        instance.error = 'Uh oh! We had a problem loading order items. Try again later.';
                        console.error("error getting order items: " + data);
                    });
                }, function(data) {
                    $scope.$emit('event.loadStop');
                    instance.error = 'Uh oh! We had a problem loading order details. Try again later.';
                    console.error("error getting order details: " + data);
                });
            });
        }
        instance.orderDetail = orderDetail;

        function login(user) {

            $scope.$emit('event.loadStart');

            AuthService.login(user.username, user.password).then(
                function (data) {

                    console.log("successful login");
                    $rootScope.$emit("event.userAuth", data);

                    $state.go("account");
                    $scope.$emit('event.loadStop');
                },
                function (data) {
                    $scope.$emit('event.loadStop');
                    instance.error = 'Uh oh! We had a problem logging you in. Try again later.';
                    console.error("error logging in: " + data);
                });
        }
        instance.login = login;

        function register(user) {

            $scope.$emit('event.loadStart');

            AuthService.register(user).then(
                function (data) {

                    console.log("successful registration");
                    $rootScope.$emit("event.userAuth", data);

                    $state.go("account");
                    $scope.$emit('event.loadStop');
                },
                function (data) {
                    $scope.$emit('event.loadStop');
                    instance.error = 'Uh oh! We had a problem registering your new account. Try again later.';
                    console.error("error registering: " + data);
                });
        }
        instance.register = register;

        function logout() {

            AuthService.logout();
            $rootScope.$emit("event.userPart");
            $state.go("account");
        }
        instance.logout = logout;
    }]);