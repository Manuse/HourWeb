(function () {

    angular
        .module('app')
        .factory('registerFactory', registerFactory);


    function registerFactory(AUTH, DATABASE) {

        var factory = {
            registrarUser: function (dataUser, dataCenter, email, pass) {
                AUTH.createUserWithEmailAndPassword(ema, pass).then(function (res) {
                    AUTH.currentUser.updateProfile({
                        displayName: dataUser.nombre, //nombre
                        photoURL: "https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/defecto.png?alt=media&token=e43978a7-9b61-4bb5-8737-e85ffd2e2b56" //foto por defecto
                    });
                    insertarUsuario(dataCenter, dataUser, AUTH.getcurrentUser.uid);
                    AUTH.currentUser.sendEmailVerification();
                    error("Se ha enviado un email de verificacion a su correo");
                    AUTH.signOut();
                }, function (error) { //crea el usuario
                    switch (error.code) { //dependiendo del error ejecutara un error u otro
                        case "auth/email-already-in-use":
                            error("El email es usado");
                            break;
                        case "auth/operation-not-allowed":
                            error("Operacion no permitida");
                            break;
                        case "auth/invalid-email":
                            error("Email invalido");
                            break;
                        default:
                            error("Ha ocurrido un error");
                    }
                });
            }
        };

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

        function crearUser(user) {
            var usuario = DATABASE.ref("user"); //recogemos la referencia de la base datos y le añadimos el uid de usuario como nodo
            usuario.push(user); //introducimos los datos dentro del nodo
        }

        function insertarCentro(centro) {
            var cent = REF.ref("centros");
            var key = cent.push({ //inserta el nodo
                nombre: centro.nombre,
                horas: centro.horas
            }).key; //recogemos el nombre del nodo
            return key;
        }

        function crearCentro(centro, user, uid) {
            //insertarCentro(centro);
            user.codcentro = insertarCentro(centro);
            user.id = uid;
            crearUser(user); //metodo que crea el nodo en usuario
        }

         function error(err){
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'modal/mError.html',
                controller: 'ErrorController',
                controllerAs: 'vmmm',
                resolve:{
                    item: function(){
                        return err;
                    }
                }
            });

            modalInstance.result.then(function () {
     
            }, function () {
      
            });
        }

        return factory;

    }
})();