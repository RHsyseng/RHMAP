angular.module('myApp').controller('ProductsCtrl',
        ['$scope', '$location', 'ProductService', 'CartService', '$timeout', 'SyncService',
function ($scope, $location,  ProductService, CartService, $timeout, SyncService) {

    var instance = this;

    ProductService.list()
        .then(function (data) {
                instance.all = data;
                $scope.$emit('event.loadStop');
            },
            function (data) {
                $scope.$emit('event.loadStop');
                instance.error = 'Uh oh! We had a problem loading products list. Try again later.';
                console.error("error loading products list: " + data);
            });

    function addToCart(product) {

        CartService.add(product);
        product.addedToCart = true;

        $timeout(function () {
            product.addedToCart = false;
        }, 700);
    }
    instance.addToCart = addToCart;

    function addToFavorites(product) {
        SyncService.save(product);
        product.addedToFavorites = true;
        $timeout(function () {
            product.addedToFavorites = false;
        }, 700);
    }
    instance.addToFavorites = addToFavorites;
}]);