angular.module('myApp').factory('ProductService',
        ['$q', '$fh',
function ($q, $fh) {

    return {

        list: function () {

            var defer = $q.defer();
            var params = {
                path: '/cloud/products',
                method: "GET",
                contentType: "application/json",
                timeout: 15000
            };
            $fh.cloud(params, defer.resolve, defer.reject);
            return defer.promise;
        },

        featured: function () {

            var defer = $q.defer();
            var params = {
                path: '/cloud/products/featured',
                method: "GET",
                contentType: "application/json",
                timeout: 15000
            };
            $fh.cloud(params, defer.resolve, defer.reject);
            return defer.promise;
        },

        get: function (sku) {

            var defer = $q.defer();
            var params = {
                path: '/cloud/products/' + sku,
                method: "GET",
                contentType: "application/json",
                timeout: 15000
            };
            $fh.cloud(params, defer.resolve, defer.reject);
            return defer.promise;
        }
    };
}]);