(function () {


    angular
        .module('app')
        .controller('ConfiguracionController', configuracionController);

    function configuracionController($timeout, userFactory, DATABASE, AUTH, STORAGE, $log) {
        var vm = this;

        var interval = function () {
            $timeout(recarga, 1000);
        };
        interval();

        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser();
                    vm.photo = userFactory.getPhoto();
                    vm.email = AUTH.currentUser.email;
                    vm.nombre = vm.getUser.nombre;
                    vm.apellido = vm.getUser.apellido;
                    vm.fijo = vm.getUser.tel_fijo;
                    vm.movil = vm.getUser.tel_movil;
                }, 0);
            } else {
                interval();
            }
        }

        /**
         * 
         */
        vm.visualizar = function () {
            vm.eye = !vm.eye;
            $timeout(function () {
                vm.eye = false;
            }, 800);
            // vm.updateUser();
        }

        /**
         * 
         */
        vm.cambiarContraseña = function () {
            if(vm.nPass1 == vm.nPass2){
            var credential = firebase.auth.EmailAuthProvider.credential(
                AUTH.currentUser.email,
                vm.oldPass
            );
            AUTH.currentUser.reauthenticate(credential).then(function () {
                user.updatePassword(vm.nPass2).then(function(){

                }, function(err){
                    vm.error(err)
                });
                $log.log("exito")
            }, function (err) {
                $log.log(err)
            });
            }
        };

        /**
         * 
         */
        vm.cambiarFoto = function () {

           /* var uploadTask = STORAGE.child("imgperfil/" + getCurrentUser().uid + ".jpeg").put(vm.file); //añadimos el archivo a la carpeta de imgperfil de firebase y el archivo tendra el id del usuario 
            uploadTask.on("state_changed", function (snapshot) { //mientras se ejecuta la subida
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //obtencion del progreso
                console.log("subida al " + progress); //muestra el progreso de subida
            }, function (error) { //en caso de error
                alert("Ha ocurrido un error");
            }, function () { //cuando finaliza
                getCurrentUser().updateProfile({ //actualizamos la url de la foto de perfil del usuario por si tuviera otra distinta
                    photoURL: uploadTask.snapshot.downloadURL
                });
                setTimeout(function () {
                    vm.photo = AUTH.currentUser.photoURL;
                }, 1000); //refresca  la foto de la configuracion
            });*/
        };

        /**
         * 
         */
        vm.updateUser = function () {
            DATABASE.ref("user/").orderByChild("id").equalTo(AUTH.currentUser.uid).once("value", function (snapshot) {
                //$log.log(Object.keys(snapshot.val())[0])
                if (vm.nombre != 0 && vm.apellido != 0) {
                    DATABASE.ref("user/" + Object.keys(snapshot.val())[0]).update({
                        nombre: vm.nombre,
                        apellido: vm.apellido,
                        tel_fijo: vm.fijo,
                        tel_movil: vm.movil
                    });
                    $timeout(function () {
                        vm.datos = !vm.datos;
                    }, 0);

                } else {
                    vm.error("El nombre y el apellidos son obligatorios");
                }
                /*AUTH.currentUser.updateProfile({
                    displayName: nom
                });*/
            });

        }

        vm.error = function (err) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'modal/mError.html',
                controller: 'ErrorController',
                controllerAs: 'vmmm',
                resolve: {
                    item: function () {
                        return err;
                    }
                }
            });

            modalInstance.result.then(function () {

            }, function () {

            });
        };
    }
})();

/*
function actualizarFoto(archivo){
  var uploadTask = STORAGE.child("imgperfil/"+getCurrentUser().uid+".jpeg").put(archivo);//añadimos el archivo a la carpeta de imgperfil de firebase y el archivo tendra el id del usuario 
  uploadTask.on("state_changed", function(snapshot){//mientras se ejecuta la subida
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //obtencion del progreso
    console.log("subida al "+progress);//muestra el progreso de subida
  }, function(error){//en caso de error
    alert("Ha ocurrido un error");
  },function(){//cuando finaliza
    getCurrentUser().updateProfile({//actualizamos la url de la foto de perfil del usuario por si tuviera otra distinta
      photoURL : uploadTask.snapshot.downloadURL
    });
    setTimeout(function(){document.getElementById("config_foto").setAttribute("src",getCurrentUser().photoURL);}, 1000);//refresca  la foto de la configuracion
  });
}

function actualizarUser(nom, apel) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(codi) {
        var data = codi.val();
        for (var data1 in data) {
            REF.ref("user/" + data1).update({
                nombre: nom,
                apellido: apel
            });
            getCurrentUser().updateProfile({
                displayName: nom
            });
            montarNavigation();
        }
    });
}
*/