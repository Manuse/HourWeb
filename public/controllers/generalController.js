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
                            $log.log("j")
                            DATABASE.ref("user/" + Object.keys(snapshot.val())[0]).update({
                                verificado: true
                            }).then(function () {
                                if ($location.path() == "/login") {
                                    $location.path("/principal/home");
                                }
                                userFactory.getData();
                            });
                        } else {
                            limpiar(snapshot.val()[Object.keys(snapshot.val())[0]].codcentro);
                            if ($location.path() == "/login") {
                                $location.path("/principal/home");
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

        function limpiar(cod){
            DATABASE.ref("centros/" + cod + "/reservas/").once("value", function(snapshot){
                var dia = new Date(new Date().getTime() - (82800000 * (new Date().getDay()+1)));
                for(var reserva in snapshot.val()){
                    if(snapshot.val()[reserva].perm==null && new Date(snapshot.val()[reserva].fecha)<dia){    
                         DATABASE.ref("centros/" + cod + "/reservas/"+reserva).remove();
                    }
                }
            });
        }

    }
})();