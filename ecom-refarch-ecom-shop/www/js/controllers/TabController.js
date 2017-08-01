angular.module('myApp').controller('TabCtrl',
        ['$scope', 'CartService',
function($scope, CartService) {

    var instance = this;
    instance.count = CartService.count();

    $scope.$watch(
        function () {
            return CartService.count();

        }, function (current, original) {
            instance.count = current;
        });
}]);