angular.module('myApp').controller('CartCtrl',
        ['$scope', '$rootScope', '$state', 'CartService', '$timeout',
function($scope, $rootScope, $state, CartService, $timeout) {

    var instance = this;

    CartService.flatten();
    instance.distinctProducts = CartService.distinctProducts;
    instance.total = CartService.total;
    instance.isCheckout = false;
    instance.payment = { number: null, month: null, year: null, pin: null };
    $scope.$emit('event.loadStop');

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

        $scope.$emit('event.loadStart');

        CartService.checkout(instance.payment, instance.total)
            .then(function (data) {

                $scope.$emit('event.loadStop');
                $rootScope.$emit("event.orderPlaced", data);
                instance.success = "Thanks! Your order has been placed. We'll let you know when it's shipped!";
                $timeout(function () {
                    $state.go('account');
                }, 5000);

            }, function(data) {
                $scope.$emit('event.loadStop');
                instance.error = 'Uh oh! We had a problem completing the transaction. Please verify your info and' +
                    ' try again.';
                console.error("error checking out: " + data);
            });
    }
    instance.completeOrder = completeOrder;

    function cancelCheckout() {

        instance.payment = { number: null, month: null, year: null, pin: null };
        instance.isCheckout = false;
    }
    instance.cancelCheckout = cancelCheckout;
}]);