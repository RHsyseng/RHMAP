angular.module('myApp').factory('SalesService',
        ['$q', '$fh',
function ($q, $fh) {


    var listOrders = function(userId) {

        var defer = $q.defer();
        var params = {
            path: '/cloud/customers/' + userId + '/orders',
            method: "GET",
            contentType: "application/json",
            timeout: 15000
        };
        $fh.cloud(params, defer.resolve, defer.reject);
        return defer.promise;
    };

    var getOrder = function(userId, orderId) {

        var defer = $q.defer();
        var params = {
            path: '/cloud/customers/' + userId + '/orders/' + orderId,
            method: "GET",
            contentType: "application/json",
            timeout: 15000
        };
        $fh.cloud(params, defer.resolve, defer.reject);
        return defer.promise;
    };

    var getOrderItem = function(userId, orderId, orderItemId) {

        var defer = $q.defer();
        var params = {
            path: '/cloud/customers/' + userId + '/orders/' + orderId + '/orderItems/' + orderItemId,
            method: "GET",
            contentType: "application/json",
            timeout: 15000
        };
        $fh.cloud(params, defer.resolve, defer.reject);
        return defer.promise;
    };

    return {
        listOrders: listOrders,
        getOrder: getOrder,
        getOrderItem: getOrderItem
    };
}]);
