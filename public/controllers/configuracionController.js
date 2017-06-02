(function () {


        angular
            .module('app')
            .controller('ConfiguracionController', configuracionController);

        function configuracionController($timeout, userFactory, DATABASE, AUTH, STORAGE, $log, errorFactory, $uibModal) {
            var vm = this;
            vm.nPass1 = "";
            vm.nPass2 = "";
            vm.oldPass = "";
            var interval = function () {
                $timeout(recarga, 100);
            };
            interval();

            function recarga() {
                if (userFactory.getUser() != null) {
                    $timeout(function () {
                        vm.getUser = userFactory.getUser;
                        vm.photo = userFactory.getPhoto;
                        vm.email = AUTH.currentUser.email;
                        vm.nombre = vm.getUser().nombre;
                        vm.apellido = vm.getUser().apellido;
                        vm.fijo = vm.getUser().tel_fijo;
                        vm.movil = vm.getUser().tel_movil;
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

            }

            /**
             * 
             */
            vm.cambiarPass = function () {
                if (vm.nPass1 != 0 && vm.nPass2 != 0 && vm.oldPass != 0) {
                    if (vm.nPass1 == vm.nPass2) {
                        var credential = firebase.auth.EmailAuthProvider.credential(
                            vm.email,
                            vm.oldPass
                        );
                        AUTH.currentUser.reauthenticate(credential).then(function () {
                            AUTH.currentUser.updatePassword(vm.nPass2).then(function () {
                                $timeout(function () {
                                    vm.bContrasena = !vm.bContrasena;
                                    vm.nPass1 = "";
                                    vm.nPass2 = "";
                                    vm.oldPass = "";
                                }, 0);
                            }, function (err) {
                                $timeout(function () {
                                    vm.error(errorFactory.getError(err));
                                }, 0)
                            });
                        }, function (err) {
                            $timeout(function () {
                                vm.error(errorFactory.getError(err));
                            }, 0);

                        });
                    } else {
                        vm.error(errorFactory.getError("contraseñaDistinta"));
                    }
                } else {
                    vm.error(errorFactory.getError("campoVacio"));
                }
            };

            /**
             * 
             */
            vm.cancelarPass = function () {
                vm.nPass1 = "";
                vm.nPass2 = "";
                vm.oldPass = "";
                vm.bContrasena = !vm.bContrasena;
            }
            /**
             * 
             */
            vm.cambiarFoto = function (file) {
                if (file.size < 300000) {
                    var uploadTask = STORAGE.child("imgperfil/" + vm.getUser().id + ".jpeg").put(file); //añadimos el archivo a la carpeta de imgperfil de firebase y el archivo tendra el id del usuario 
                    uploadTask.on("state_changed", function (snapshot) { //mientras se ejecuta la subida
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; //obtencion del progreso
                        console.log("subida al " + progress); //muestra el progreso de subida
                    }, function (err) { //en caso de error
                        vm.error(errorFactory.getError(err));
                    }, function () { //cuando finaliza
                        AUTH.currentUser.updateProfile({ //actualizamos la url de la foto de perfil del usuario por si tuviera otra distinta
                            photoURL: uploadTask.snapshot.downloadURL
                        }).then(function (value) {
                            $timeout(function () {
                                userFactory.setPhoto(AUTH.currentUser.photoURL);
                            }, 0);
                        }, function (err) {
                            vm.error(errorFactory.getError(err));
                        });
                        //refresca  la foto de la configuracion
                    });
                } else {
                    vm.error(errorFactory.getError("bigImg"));
                }
            };

            /**
             * 
             */
            vm.updateUser = function () {
                if (vm.nombre != 0 && vm.apellido != 0) {
                    $log.log(isNaN(vm.movil))
                    $log.log(vm.movil)
                    if (!isNaN(vm.fijo) && !isNaN(vm.movil) || vm.fijo == 0 && !isNaN(vm.movil) || !isNaN(vm.fijo) && vm.movil == 0 || vm.fijo == 0 && vm.movil == 0) {
                        if (vm.fijo.length <= 12 && vm.movil.length <= 12) {
                            DATABASE.ref("user/").orderByChild("id").equalTo(vm.getUser().id).once("value", function (snapshot) {
                                //$log.log(Object.keys(snapshot.val())[0])
                                DATABASE.ref("user/" + Object.keys(snapshot.val())[0]).update({
                                    nombre: vm.nombre,
                                    apellido: vm.apellido,
                                    tel_fijo: vm.fijo == null ? "" : vm.fijo,
                                    tel_movil: vm.movil == null ? "" : vm.movil
                                }).then(function () {
                                    $timeout(function () {
                                        vm.datos = !vm.datos;
                                        user = {
                                            nombre: vm.nombre,
                                            apellido: vm.apellido,
                                            tel_fijo: vm.fijo,
                                            tel_movil: vm.movil,
                                            codcentro: vm.getUser().codcentro,
                                            id: vm.getUser().id,
                                            tipo: vm.getUser().tipo,
                                            verificado: vm.getUser().verificado
                                        };
                                        userFactory.setUser(user);
                                    }, 0);
                                }, function (err) {
                                    vm.error(errorFactory.getError(err));
                                });
                                AUTH.currentUser.updateProfile({
                                    displayName: vm.nombre
                                });
                            });
                        } else {
                            vm.error(errorFactory.getError("telefono/largo"));
                        }
                    } else {
                        vm.error(errorFactory.getError("telefono/formato"));
                    }
                } else {
                    vm.error(errorFactory.getError("nombre/apellido"));
                }

            }

            vm.cancelarUser = function () {
                vm.nombre = vm.getUser().nombre;
                vm.apellido = vm.getUser().apellido;
                vm.fijo = vm.getUser().tel_fijo;
                vm.movil = vm.getUser().tel_movil;
                vm.datos = !vm.datos;
            }

            vm.cambiarMail = function () {
                if (vm.passMail != 0 && vm.nMail != 0) {
                    var credential = firebase.auth.EmailAuthProvider.credential(
                        vm.email,
                        vm.passMail
                    );
                    AUTH.currentUser.reauthenticate(credential).then(function () {
                        AUTH.currentUser.updateEmail(vm.nMail).then(function () {
                            $timeout(function () {
                                vm.mMail = !vm.mMail;
                                vm.passMail = "";
                                vm.nMail = "";
                                vm.email=AUTH.currentUser.email;
                            }, 0);
                        }, function (err) {
                            $timeout(function () {
                                vm.error(errorFactory.getError(err));
                            }, 0)
                        });
                    }, function (err) {
                        $timeout(function () {
                            vm.error(errorFactory.getError(err));
                        }, 0);

                    });
                } else {
                    vm.error(errorFactory.getError("campoVacio"));
                }
            };
        }

        vm.cancelarMail = function(){
            vm.mMail = !vm.mMail;
                                vm.passMail = "";
                                vm.nMail = "";
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