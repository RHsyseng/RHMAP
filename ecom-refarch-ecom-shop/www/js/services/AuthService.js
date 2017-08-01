angular.module('myApp').factory('AuthService',
        ['$q', '$fh', '$rootScope',
function ($q, $fh, $rootScope) {

    var login = function (username, password) {

        var defer = $q.defer();
        var params = {
            path: '/cloud/customers/authenticate',
            data: { username: username , password: password },
            method: "POST",
            contentType: "application/json",
            timeout: 15000
        };
        $fh.cloud(params, defer.resolve, defer.reject);
        return defer.promise;
    };

    var register = function(user) {

        var defer = $q.defer();
        user.id = null;
        var params = {
            path: '/cloud/customers',
            data: user,
            method: "POST",
            contentType: "application/json",
            timeout: 15000
        };
        $fh.cloud(params, defer.resolve, defer.reject);
        return defer.promise;
    };

    var logout = function() {

        var defer = $q.defer();
        if ($rootScope.user) {
            var params = {
                path: '/cloud/customers/' + $rootScope.user.id + '/logout',
                method: "POST",
                contentType: "application/json",
                timeout: 15000
            };
            $fh.cloud(params, defer.resolve, defer.reject);
        }
        return defer.promise;
    };

    var checkToken = function(userId) {

        var defer = $q.defer();
        var params = {
            path: '/cloud/customers/' + userId + '/token',
            method: "GET",
            contentType: "application/json",
            timeout: 15000
        };
        $fh.cloud(params, defer.resolve, defer.reject);
        return defer.promise;
    };

    var checkAvailability = function() {

        var defer = $q.defer();
        var params = {
            path: '/cloud/health',
            method: "GET",
            contentType: "application/json",
            timeout: 15000
        };
        $fh.cloud(params, defer.resolve, defer.reject);
        return defer.promise;
    };

    return {
        login: login,
        register: register,
        logout: logout,
        checkToken: checkToken,
        checkAvailability: checkAvailability
    };
}]);