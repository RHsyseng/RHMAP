angular.module('myApp').controller('FavoritesCtrl',
        ['$scope', '$state', '$rootScope', 'SyncService', '$timeout',
function ($scope, $state, $rootScope, SyncService, $timeout) {

    var instance = this;
    instance.list = [];
    $scope.$emit('event.loadStop');

    if (!$rootScope.logged_in) {
        instance.redirect = true;
        $timeout(function () {
            instance.redirect = false;
            $state.go('tab.account');
        }, 2000);
    }

    $rootScope.$on('sync', function(event, list) {
        updateList();
    });

    $rootScope.$on('event.userAuthComplete', function(event, user) {
        updateList();
    });

    updateList();

    function updateList() {

        if ($rootScope.user) {
            SyncService.getList().then(function (list) {

                list.forEach(function (userList) {
                    if (userList.data.userId === $rootScope.user.id) {
                        instance.list = userList.data.entries;
                    }
                });
                $scope.$emit('event.loadStop');
            });
        }
    }
    instance.updateList = updateList;

    function remove(item) {
        SyncService.deleteItem(item).then(function() {
            updateList();
        });
    }
    instance.remove = remove;
}]);