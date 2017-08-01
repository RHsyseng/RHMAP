angular.module('myApp').controller('ProductsCtrl',
        ['$scope', '$state', '$ionicLoading', '$ionicPopup', 'AuthService', 'ProductService',
function ($scope, $state, $ionicLoading, $ionicPopup, AuthService, ProductService) {

    var instance = this;

    $scope.$on('$ionicView.enter', function (e) {

        $ionicLoading.show();

        ProductService.list()
            .then(function (data) {
                    instance.all = data;
                    $ionicLoading.hide();
                },
                function (data) {
                    console.log("Error: " + data);
                    var popup = $ionicPopup.alert({
                        title: 'uh oh!',
                        template: 'Error retrieving products: ' + data
                    });
                    popup.then(function () {
                        $ionicLoading.hide();
                        $state.go('home');
                    });
                });
    });
}]);

angular.module('myApp').controller('ProductDetailCtrl',
        ['$scope', '$stateParams', '$state', '$ionicLoading', '$ionicPopup', '$timeout', 'AuthService', 'ProductService', 'CartService', 'SyncService',
function ($scope, $stateParams, $state, $ionicLoading, $ionicPopup, $timeout, AuthService, ProductService, CartService, SyncService) {

    var instance = this;
    $scope.$on('$ionicView.enter', function (e) {

        $ionicLoading.show();

        ProductService.get($stateParams.sku)
            .then(function (product) {
                    instance.addedToCart = false;
                    instance.name = product.name;
                    instance.price = product.price;
                    instance.description = product.description;
                    instance.taglines = product.taglines;
                    instance.image = product.image;
                    instance.product = product;
                    $ionicLoading.hide();
                },
                function (data) {
                    console.log("Error: " + data);
                    var popup = $ionicPopup.alert({
                        title: 'uh oh!',
                        template: 'Error fetching product detail: ' + data
                    });
                    popup.then(function () {
                        $ionicLoading.hide();
                        $state.go('products');
                    });
                });
    });

    function addToCart(product) {
        CartService.add(product);
        instance.addedToCart = true;
        $timeout(function () {
            instance.addedToCart = false;
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
