(function () {

    angular
        .module('app')
        .controller('GeneralController', generalController);

    function generalController(AUTH, DATABASE, $location, userFactory, $log, $timeout) {
        var vm = this;
        vm.location = $location;

        AUTH.onAuthStateChanged(function (user) {
            if (user) { //el usuario esta logueao 
               // $log.log($location.path())
                if (AUTH.currentUser.emailVerified) {
                    DATABASE.ref("user/").orderByChild("id").equalTo(AUTH.currentUser.uid).once("value", function (snapshot) {
                        if (!snapshot.val()[Object.keys(snapshot.val())[0]].verificado) {
                            DATABASE.ref("user/" + Object.keys(snapshot.val())[0]).update({
                                verificado: true
                            }).then(function () {
                                if ($location.path() == "/login") {
                                    $location.path("/home/principal");
                                }
                                userFactory.getData();
                            });
                        } else {
                            if ($location.path() == "/login") {
                                $location.path("/home/principal");
                            }
                            userFactory.getData();
                        }
                    });
                } else {
                    AUTH.signOut();
                }
            } else {
                if ($location.path() != "/login") {
                    $location.path("/login");
                }
            }
        });

    }
})();