
(function () {

    angular
        .module('app')
        .factory('registerFactory', registerFactory);


    function registerFactory(AUTH, DATABASE, $uibModal, errorFactory, modalFactory) {

        var factory = {
            registrarUser: function (dataUser, dataCenter, email, pass) {
                AUTH.createUserWithEmailAndPassword(email, pass).then(function (res) {
                    AUTH.currentUser.updateProfile({
                        displayName: dataUser.nombre, //nombre
                        photoURL: "https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/defecto.png?alt=media&token=e43978a7-9b61-4bb5-8737-e85ffd2e2b56" //foto por defecto
                    });
                    insertarUsuario(dataCenter, dataUser, AUTH.currentUser.uid);
                    AUTH.currentUser.sendEmailVerification();
                    modalFactory.error("Se ha enviado un email de verificacion a su correo",1);
                }, function (err) { //crea el usuario
                    modalFactory.error(errorFactory.getError(err));
                });
            }
        };

        /**
         * Dependiendo del usuario creara el usuario directamente o creara el centro antes
         * @param newcentro objeto con los datos del centro
         * @param newuser objeto con los datos del usuario
         * @param uid id del usuario
         */
        function insertarUsuario(newcentro, newuser, uid) {
            try {
                if (newuser.tipo == "administrador") { //si el usuario es administrador tambien hay que crear el centro y desde la creacion del centro se crea al usuario
                    crearCentro(newcentro, newuser, uid);
                } else { // sino es admnistrador creadmos el usuario directamente
                    newuser.id = uid; //lo ponemos de atributo id el que nos proporciona firebase
                    crearUser(newuser); //metodo que crea el  usuario
                }
            } catch (err) {}
        }

        /**
         * Crea un usuario en la base de datos
         * @param user: objeto con los datos del usuario
         */
        function crearUser(user) {
            var usuario = DATABASE.ref("user"); //recogemos la referencia de la base datos y le añadimos el uid de usuario como nodo
            usuario.push(user); //introducimos los datos dentro del nodo
        }

        /**
         * Inserta el centro en la base de datos
         * @param centro objeto con los datos del centro
         * @return codigo del centro
         */
        function insertarCentro(centro) {
            var cent = DATABASE.ref("centros");
            var key = cent.push(centro).key; //recogemos el nombre del nodo
            return key;
        }

        /**
         * Crea el centro y luego al usuario
         * @param centro: objeto con los daros del centro
         * @param user: objeto con los datos del usuario
         * @param uid:codigo del usuario 
         */
        function crearCentro(centro, user, uid) {
            user.codcentro = insertarCentro(centro);
            user.id = uid;
            crearUser(user); //metodo que crea el nodo en usuario
        }

        return factory;

    }
})();
