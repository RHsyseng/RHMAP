angular.module('myApp').factory('SyncService',
        ['$q', '$fh', '$rootScope', 'moment',
function ($q, $fh, $rootScope, moment) {

    var datasetId = "favoritesList";

    function unwrapList(r) {
        var result = [];
        for (var i in r) {
            result.push(unwrap(r[i], i));
        }
        return result.reverse();
    }

    function unwrap(obj, id) {
        obj.id = id;
        obj.moment = moment(obj.data.created).fromNow();
        return obj;
    }

    function promiseWrap(block) {
        var deferred = $q.defer();
        var success = function (r) {
            deferred.resolve(r);
        };
        var fail = function (code, msg) {
            console.log("error msg" + msg);
            console.log("error code " + code);
            deferred.reject(msg);
        };

        block(success, fail);
        return deferred.promise;
    }

    return {
        init: function () {

            var deferred = $q.defer();

            console.log('initializing sync service');
            $fh.sync.init({
                "do_console_log": true,
                "storage_strategy": "dom"
            });

            var success = function (r) {
                var result = unwrapList(r);
                $rootScope.$emit('sync', result);
                deferred.resolve(result);
            };

            var fail = function (error) {
                console.log("error " + error);
                console.log("error source " + error.source);
                console.log("error target " + error.target);
                deferred.reject(error);
            };

            $fh.sync.manage(datasetId);
            $fh.sync.notify(function (notification) {
                if ('sync_complete' === notification.code) {
                    $fh.sync.doList(datasetId, success, fail);
                }
                else if ('local_update_applied' === notification.code) {
                    $fh.sync.doList(datasetId, success, fail);
                }
                else if ('remote_update_failed' === notification.code) {
                    var errorMsg = notification.message ? notification.message.msg ? notification.message.msg : undefined : undefined;
                    fail(errorMsg);
                }
            });
            return deferred.promise;
        },

        getList: function() {
            return promiseWrap(function (success, fail) {
                $fh.sync.doList(datasetId, function (r) {
                    success(unwrapList(r));
                }, fail);
            });
        },

        update: function (item) {
            return promiseWrap(function (success, fail) {
                $fh.sync.doUpdate(datasetId, item.id, item.data, success, fail);
            });
        },

        deleteItem: function (product) {

            var parent = this;
            this.getList().then(function (entryList) {
                entryList.forEach(function (userList) {
                    if (userList.data.userId === $rootScope.user.id) {
                        for (var i=0; i < userList.data.entries.length; i++) {
                            if (userList.data.entries[i].sku === product.sku) {
                                userList.data.entries.splice(i, 1);
                                break;
                            }
                        }
                        parent.update(userList);
                    }
                });
            });
        },

        save: function (product) {

            if (!$rootScope.user) throw 'no user found for favorites list';

            var userId = $rootScope.user.id;
            var timestamp = new Date().getTime();
            var userFavorites = null;
            var parent = this;

            this.getList().then(function (entryList) {
                entryList.forEach(function (entry) {
                    if (entry.data.userId === userId) {
                        userFavorites = entry;
                    }
                });
                if (!userFavorites) {
                    console.log('first favorites entry for user');
                    userFavorites = {
                        data: {
                            userId: userId,
                            entries: [],
                            created: timestamp,
                            updated: timestamp
                        }
                    };
                    userFavorites.data.entries.push(JSON.parse(angular.toJson(product))); //strip angular props
                    return promiseWrap(function (success, fail) {
                        $fh.sync.doCreate(datasetId, userFavorites.data, success, fail);
                    });

                } else {
                    userFavorites.data.updated = timestamp;
                    product = JSON.parse(angular.toJson(product)); //strip angular props
                    var found = false;
                    userFavorites.data.entries.forEach(function (existingProduct) {
                       if (product.sku === existingProduct.sku) {
                           found = true;
                       }
                    });
                    if (!found) {
                        userFavorites.data.entries.push(product);
                        return promiseWrap(function (success, fail) {
                            parent.update(userFavorites).then(function() {
                                console.log('saved favorites for user ' + userId + ', entry: ' + JSON.stringify(userFavorites))
                            });
                        });
                    }
                }
            });
        }
    };
}]);
