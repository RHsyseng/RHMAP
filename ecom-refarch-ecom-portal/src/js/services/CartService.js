angular.module('myApp').factory('CartService',
    ['$q', '$fh', '$rootScope',
        function ($q, $fh, $rootScope) {

            var service = this;
            reset();

            function reset() {
                service.products = [];
                service.distinctProducts = [];
                service.cart_product_id = 0;
                service.total = 0;
            }

            function count() {
                return service.products.length;
            }
            service.count = count;

            function add(product) {

                var newProduct = angular.extend({}, product);

                newProduct.cart_product_id = ++service.cart_product_id;
                service.products.push(newProduct);
                service.total += parseFloat(newProduct.price);
                $rootScope.cartCount = service.products.length;
            }
            service.add = add;

            function flatten() {

                var distinctSkus = [];
                service.distinctProducts = [];

                service.products.forEach(function (product) {
                    if (distinctSkus.indexOf(product.sku) === -1) {
                        distinctSkus.push(product.sku);
                        service.distinctProducts.push(product);
                    }
                });

                var counts = {};
                service.products.forEach(function (product) {
                    counts[product.sku] = (counts[product.sku] || 0) + 1;
                });

                service.distinctProducts.forEach(function (product) {
                    product.count = counts[product.sku];
                });
            }
            service.flatten = flatten;

            function remove(product) {

                for (var i = service.products.length - 1; i >= 0; i--) {
                    if (service.products[i] === product) {
                        service.products.splice(i, 1);
                        break;
                    }
                }
                flatten();
                service.total -= parseFloat(product.price);
                $rootScope.cartCount = service.products.length;
            }
            service.remove = remove;

            function checkout(payment, orderTotal) {

                var defer = $q.defer();
                var userId = $rootScope.user.id;

                var params = {
                    path: '/cloud/customers/' + userId + '/orders',
                    method: "POST",
                    data: {
                        'id': null,
                        'status': 'InProgress',
                        transactionNumber: Math.random() * (10000 - 1000) + 1000,
                        transactionDate: new Date().toUTCString(),
                        customerId: userId,
                        orderItemIds: []
                    },
                    contentType: "application/json",
                    timeout: 15000
                };
                $fh.cloud(params, function (order) {

                    flatten();
                    service.distinctProducts.forEach(function (product) {

                        var params = {
                            path: '/cloud/customers/' + userId + '/orders/' + order.id + "/orderItems",
                            method: "POST",
                            data: {
                                id: null,
                                sku: product.sku,
                                quantity: product.count
                            },
                            contentType: "application/json",
                            timeout: 15000
                        };
                        $fh.cloud(params, function (orderItem) {

                            order.orderItemIds.push(orderItem.id);

                            if (order.orderItemIds.length === service.distinctProducts.length) {
                                var params = {
                                    path: '/cloud/customers/' + userId + '/orders',
                                    method: "PUT",
                                    data: order,
                                    contentType: "application/json",
                                    timeout: 15000
                                };
                                $fh.cloud(params, function (order) {

                                    var params = {
                                        path: '/cloud/billing/process',
                                        method: "POST",
                                        data: {
                                            creditCardNumber: payment.number,
                                            expMonth: payment.month,
                                            expYear: payment.year,
                                            verificationCode: payment.pin,
                                            billingAddress: $rootScope.user.address,
                                            customerId: $rootScope.user.id,
                                            customerName: $rootScope.user.name,
                                            orderNumber: order.id,
                                            amount: orderTotal
                                        },
                                        contentType: "application/json",
                                        timeout: 15000
                                    };
                                    $fh.cloud(params, function (result) {

                                        if (result.status === "SUCCESS") {
                                            reset();
                                            console.log("order saved successfully: " + JSON.stringify(order));
                                            $rootScope.cartCount = 0;
                                            defer.resolve();

                                        } else {
                                            console.error("order payment failed");
                                            defer.reject("payment not authorized");
                                        }

                                    }, function (msg, err) {
                                        console.error("order payment failed with error msg " + msg + ", " + JSON.stringify(err));
                                        defer.reject();
                                    });

                                }, function (msg, err) {
                                    console.error("order update failed with error msg " + msg + ", " + JSON.stringify(err));
                                    defer.reject();
                                });
                            }

                        }, function (msg, err) {
                            console.error("save orderItem failed with error msg " + msg + ", " + JSON.stringify(err));
                            defer.reject();
                        });
                    });

                }, function (msg, err) {
                    console.error("order placement failed with error msg " + msg + ", " + JSON.stringify(err));
                    defer.reject();
                });

                return defer.promise;
            }
            service.checkout = checkout;

            return service;
        }]);