angular.module('myApp').controller('FavoritesCtrl',
        ['$scope', '$rootScope', 'SyncService',
function ($scope, $rootScope, SyncService) {

    var instance = this;
    instance.list = [];
    $scope.$emit('event.loadStop');

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