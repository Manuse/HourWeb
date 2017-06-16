(function () {

    angular
        .module('app')
        .controller('GeneralController', generalController);

    /**
     * @namespace generalController
     * @description
     * Controlador general de toda la pagina, solo maneja la sesion y un metodo de limpieza de la base de datos
     */
    function generalController(AUTH, DATABASE, $location, userFactory, $log, $timeout) {
        var vm = this;
        vm.location = $location;

        //evento que controla la sesion del usuario
        AUTH.onAuthStateChanged(function (user) {
            if (user) { //el usuario esta logueao 
                if (AUTH.currentUser.emailVerified) {
                    DATABASE.ref("user/").orderByChild("id").equalTo(AUTH.currentUser.uid).once("value", function (snapshot) {
                        if (!snapshot.val()[Object.keys(snapshot.val())[0]].verificado) {//si esta verificado se actualiza el campo en la bd si en la bd tambien lo esta redirecciona directamente
                            DATABASE.ref("user/" + Object.keys(snapshot.val())[0]).update({
                                verificado: true
                            }).then(function () {
                                if ($location.path() == "/login") {
                                    $location.path("/principal/home");
                                }
                                userFactory.getData();
                            });
                        } else {
                            //limpia reservas antiguas antes
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
            } else {//no esta logueado
                if ($location.path() != "/login") {
                    $location.path("/login");
                }
            }
        });

        /**
         * @method limpiar 
         * @memberof generalController
         * @param {String} cod codigo del centro
         * @description
         * Elimina reservas antiguas
         */
        function limpiar(cod){
            DATABASE.ref("centros/" + cod + "/reservas/").once("value", function(snapshot){
                //seleccionamos el sabado pasado para asegurarnos de no borrar ninguna que nos interese
                var dia = new Date(new Date().getTime() - (86400000 * (new Date().getDay()+1)));
                //retrocedemos 2 semanas mas y borramos las reservas de 2 semanas atras
                dia=new Date(dia.getTime()-86400000*14); 
                for(var reserva in snapshot.val()){
                    if(snapshot.val()[reserva].perm==null && new Date(snapshot.val()[reserva].fecha)<dia){
                           DATABASE.ref("centros/" + cod + "/reservas/"+reserva).remove();
                    }
                }
            });
        }

    }
})();