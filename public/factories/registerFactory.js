(function () {

    angular
        .module('app')
        .factory('registerFactory', registerFactory);

    /**
     * @namespace registerFactory
     * @description 
     * Factoria para compartir los metodos de registro
     */

    /**
     * @method registerFactory
     * @memberof factories
     * @param {object} AUTH constante de firebase.auth()
     * @param {object} DATABASE constante de firebase.database()
     * @param {object} errorFactory factoria con los mensajes de error
     * @param {object} modalFactory factoria de modales
     * @description 
     * Factoria para compartir los metodos de registro
     */
    function registerFactory(AUTH, DATABASE, errorFactory, modalFactory) {

        var factory = {
            /**
             * @method registrarUser 
             * @memberof registerFactory
             * @param {object} dataUser objecto con los datos del usuario
             * @param {object} dataCenter objecto con los datos del centro
             * @param {String} email email del usuario
             * @param {String} pass contraseña del usuario
             * @description
             * Registra un usuario
             */
            registrarUser: function (dataUser, dataCenter, email, pass) {
                AUTH.createUserWithEmailAndPassword(email, pass).then(function (res) {
                    AUTH.currentUser.updateProfile({
                        displayName: dataUser.nombre, //nombre
                        photoURL: "https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/defecto.png?alt=media&token=e43978a7-9b61-4bb5-8737-e85ffd2e2b56" //foto por defecto
                    });
                    insertarUsuario(dataCenter, dataUser, AUTH.currentUser.uid);
                    AUTH.currentUser.sendEmailVerification();
                    modalFactory.error("Se ha enviado un email de verificacion a su correo", 1);
                }, function (err) { //crea el usuario
                    modalFactory.error(errorFactory.getError(err));
                });
            }
        };

        /**
         * @method insertarUsuario 
         * @memberof registerFactory
         * @param {object} newcentro objeto con los datos del centro
         * @param {object} newuser objeto con los datos del usuario
         * @param {String} uid id del usuario
         * @description
         * Dependiendo del usuario creara el usuario directamente o creara el centro antes
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
         * @method crearUser 
         * @memberof registerFactory
         * @param {object} user objeto con los datos del usuario
         * @description
         * Crea un usuario en la base de datos
         */
        function crearUser(user) {
            var usuario = DATABASE.ref("user"); //recogemos la referencia de la base datos y le añadimos el uid de usuario como nodo
            usuario.push(user); //introducimos los datos dentro del nodo
        }

        /**
         * @method insertarCentro 
         * @memberof registerFactory
         * @param {object} centro objeto con los datos del centro
         * @return codigo del centro
         * @description
         * Inserta el centro en la base de datos
         */
        function insertarCentro(centro) {
            var cent = DATABASE.ref("centros");
            var key = cent.push(centro).key; //recogemos el nombre del nodo
            return key;
        }

        /**
         * @method crearCentro 
         * @memberof registerFactory
         * @param {object} centro: objeto con los daros del centro
         * @param {object} user: objeto con los datos del usuario
         * @param {String} uid:codigo del usuario 
         * @description
         * Crea el centro y luego al usuario
         */
        function crearCentro(centro, user, uid) {
            user.codcentro = insertarCentro(centro);
            user.id = uid;
            crearUser(user); //metodo que crea el nodo en usuario
        }

        return factory;

    }
})();