angular.module('myApp').controller('HomeCtrl',
    ['$scope', '$rootScope', '$timeout', 'ProductService', 'CartService', 'SyncService',
function ($scope, $rootScope, $timeout, ProductService, CartService, SyncService) {

    var instance = this;

    instance.show_featured = false;
    instance.addedToCart = false;

    $rootScope.$on('sync', function(event, list) {
        instance.list = list;
    });

    ProductService.featured().then(
        function (data) {

            instance.show_featured = true;
            instance.featured = data;
            $scope.$emit('event.loadStop');
        },
        function (data) {

            $scope.$emit('event.loadStop');
            instance.error = 'Uh oh! We had a problem loading featured products. Try again later.';
            console.error("error loading featured products: " + data);
        });

    function addToCart(product, $event) {

        $event.stopPropagation();
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