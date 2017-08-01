angular.module('myApp').controller('CartCtrl',
        ['$scope', '$rootScope', '$state', '$ionicLoading', '$ionicPopup', 'CartService',
function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, CartService) {

    var instance = this;

    $scope.$on('$ionicView.enter', function (e) {

        CartService.flatten();
        instance.distinctProducts = CartService.distinctProducts;
        instance.total = CartService.total;
        instance.isCheckout = false;
        instance.payment = { number: null, month: null, year: null, pin: null };
    });

    function remove(product) {
        CartService.remove(product);
        instance.total = CartService.total;
        $state.reload();
    }
    instance.remove = remove;

    function checkout() {
        instance.isCheckout = true;
    }
    instance.checkout = checkout;

    function completeOrder() {

        $ionicLoading.show();

        CartService.checkout(instance.payment, instance.total)
            .then(function (data) {

                $rootScope.$emit("event.orderPlaced", data);
                var popup = $ionicPopup.alert({
                    title: 'Thanks!!',
                    template: "Your order has been placed. We'll let you know when it's shipped!"
                });
                popup.then(function () {
                    $ionicLoading.hide();
                    $state.go('tab.account');
                });
                $ionicLoading.hide();

            }, function(data) {
                console.log("Error checking out: " + data);
                $ionicLoading.hide();
                var popup = $ionicPopup.alert({
                    title: 'uh oh!',
                    template: 'Error checking out: ' + data
                });
                popup.then(function () {
                    $state.go('tab.cart');
                });
            });
    }
    instance.completeOrder = completeOrder;

    function cancelCheckout() {

        instance.payment = { number: null, month: null, year: null, pin: null };
        instance.isCheckout = false;
    }
    instance.cancelCheckout = cancelCheckout;
}]);