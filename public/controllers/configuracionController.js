(function () {


    angular
        .module('app')
        .controller('ConfiguracionController', configuracionController);

    /**
     * @namespace configuracionController
     * @description
     * Controlador de la vista configuracion.html
     */

    /**
     * @method configuracionController
     * @memberof controllers
     * @param {object} uibModalInstance servicio de modales del angular
     * @param {object} userFactory factoria con los datos del usuario
     * @param {object} DATABASE constante de firebase.database()
     * @param {object} AUTH constante de firebase.auth()
     * @param {object} STORAGE constante de firebase.storage
     * @param {object} log servicio de logging de angular
     * @param {object} textFactory factoria con los mensajes de
     * @param {object} modalFactory factoria de modales
     * @param {object} progressBarFactory factoria para manejar la progress bar
     * @description
     * Controlador de la vista configuracion.html
     */
    function configuracionController($timeout, userFactory, DATABASE, AUTH, STORAGE, $log, textFactory, modalFactory, progressBarFactory) {
        var vm = this;
        vm.nPass1 = "";
        vm.nPass2 = "";
        vm.oldPass = "";
        vm.error = modalFactory.error;
        vm.confirmacion = modalFactory.confirmacion;
        vm.progressBar = modalFactory.progressBar;

        /*
         * Intervalo para cargar
         */
        var interval = function () {
            $timeout(recarga, 100);
        };
        interval();

        /**
         * @method recarga 
         * @memberof configuracionController
         * @description
         * carga los datos de la pagina cuando carga el usuario
         */
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
         * @method visualizar 
         * @memberof configuracionController
         * @description
         * Cambia el icono del ojo temporalmente
         */
        vm.visualizar = function () {
            vm.eye = !vm.eye;
            $timeout(function () {
                vm.eye = false;
            }, 800);

        }

        /**
         * @method cambiarPass
         * @memberof configuracionController
         * @description
         * Cambia la contraseña del usuario
         */
        vm.cambiarPass = function () {
            if (vm.nPass1 != 0 && vm.nPass2 != 0 && vm.oldPass != 0) {
                if (vm.nPass1 == vm.nPass2) {
                    var credential = firebase.auth.EmailAuthProvider.credential(
                        vm.email,
                        vm.oldPass
                    );
                    //si reatentica actualiza la contraseña
                    AUTH.currentUser.reauthenticate(credential).then(function () {
                        AUTH.currentUser.updatePassword(vm.nPass2).then(function () {
                            $timeout(function () {
                                vm.bContrasena = !vm.bContrasena;
                                vm.nPass1 = "";
                                vm.nPass2 = "";
                                vm.oldPass = "";
                                vm.error(textFactory.getAviso("passCambiada"), 1);
                            }, 0);
                        }, function (err) {
                            $timeout(function () {
                                vm.error(textFactory.getError(err));
                            }, 0)
                        });
                    }, function (err) {
                        $timeout(function () {
                            vm.error(textFactory.getError(err));
                        }, 0);

                    });
                } else {
                    vm.error(textFactory.getError("contraseñaDistinta"));
                }
            } else {
                vm.error(textFactory.getError("campoVacio"));
            }
        };

        /**
         * @method cancelarPass 
         * @memberof configuracionController
         * @description
         * Cancela el cambio de contraseña
         */
        vm.cancelarPass = function () {
            vm.nPass1 = "";
            vm.nPass2 = "";
            vm.oldPass = "";
            vm.bContrasena = !vm.bContrasena;
        }
        /**
         * @method cambiarFoto 
         * @memberof configuracionController
         * @param {object} file archivo imagen para subir
         * @description
         * Cambia la foto de perfil
         */
        vm.cambiarFoto = function (file) {
            if (file.size < 300000) {
                progressBarFactory.initProgress(); //muestra el progreso de subida
                vm.progressBar();
                var uploadTask = STORAGE.child("imgperfil/" + vm.getUser().id + ".jpeg").put(file); //añadimos el archivo a la carpeta de imgperfil de firebase y el archivo tendra el id del usuario 
                uploadTask.on("state_changed", function (snapshot) { //mientras se ejecuta la subida                  
                    progressBarFactory.setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100 - 1);
                }, function (err) { //en caso de error
                    progressBarFactory.setProgress(100);
                    vm.error(textFactory.getError(err));
                }, function () { //cuando finaliza
                    AUTH.currentUser.updateProfile({ //actualizamos la url de la foto de perfil del usuario por si tuviera otra distinta
                        photoURL: uploadTask.snapshot.downloadURL
                    }).then(function (value) {
                        $timeout(function () {
                            userFactory.setPhoto(AUTH.currentUser.photoURL);
                            progressBarFactory.setProgress(100);
                        }, 0);
                    }, function (err) {
                        progressBarFactory.setProgress(100);
                        vm.error(textFactory.getError(err));
                    });
                    //refresca  la foto de la configuracion
                });
            } else {
                vm.error(textFactory.getError("bigImg"));
            }
        };

        /**
         * @method updateUser 
         * @memberof configuracionController
         * @description
         * Actualiza el usuario
         */
        vm.updateUser = function () {
            if (vm.nombre != 0 && vm.apellido != 0) {
                //if con las posibles combinaciones de valores
                if (!isNaN(vm.fijo) && !isNaN(vm.movil) || vm.fijo == 0 && !isNaN(vm.movil) || !isNaN(vm.fijo) && vm.movil == 0 || vm.fijo == 0 && vm.movil == 0
                || vm.fijo == null && !isNaN(vm.movil) || !isNaN(vm.fijo) && vm.movil == null || vm.fijo == null && vm.movil == null) {
                    if (vm.fijo.length <= 12 && vm.movil.length <= 12) {
                        progressBarFactory.initProgress();
                        vm.progressBar();
                        DATABASE.ref("user/").orderByChild("id").equalTo(vm.getUser().id).once("value", function (snapshot) {
                            DATABASE.ref("user/" + Object.keys(snapshot.val())[0]).update({
                                nombre: vm.nombre,
                                apellido: vm.apellido,
                                tel_fijo: vm.fijo == null ? "" : vm.fijo,
                                tel_movil: vm.movil == null ? "" : vm.movil
                            }).then(function () {
                                progressBarFactory.sumProgress(30)
                                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (data) {
                                    try{
                                    var reservas = Object.keys(data.val());
                                    for (var i = 0; i < reservas.length; i++) {
                                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + reservas[i]).update({
                                            nombre: vm.nombre + ' ' + vm.apellido
                                        })
                                    }
                                    }catch(err){}
                                    progressBarFactory.sumProgress(30)

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
                                        progressBarFactory.sumProgress(30)
                                        AUTH.currentUser.updateProfile({
                                            displayName: vm.nombre
                                        });
                                        progressBarFactory.sumProgress(10)
                                        vm.error(textFactory.getAviso("updateDatos"),1);
                                    }, 0);
                                }, function (err) {
                                    progressBarFactory.setProgress(100)
                                    vm.error(textFactory.getError(err));
                                });

                            });
                        });
                    } else {
                        vm.error(textFactory.getError("telefono/largo"));
                    }
                } else {
                    vm.error(textFactory.getError("telefono/formato"));
                }
            } else {
                vm.error(textFactory.getError("nombre/apellido"));
            }

        }

        /**
         * @method cancelarUser 
         * @memberof configuracionController
         * @description
         * Cancela la actualizacion del usuario
         */
        vm.cancelarUser = function () {
            vm.nombre = vm.getUser().nombre;
            vm.apellido = vm.getUser().apellido;
            vm.fijo = vm.getUser().tel_fijo;
            vm.movil = vm.getUser().tel_movil;
            vm.datos = !vm.datos;
        }

        /**
         * @method cambiarCentro 
         * @memberof configuracionController
         * @description
         * Cambia de centro al usuario borrando toda su informacion del actual
         */
        vm.cambiarCentro = function () {
            DATABASE.ref("centros/" + vm.centro).once("value", function (snapshot) {
                if (snapshot.exists() && vm.centro != vm.getUser().codcentro) {
                    //un usuario que se cambia de centro no puede ser administrador del nuevo por lo que se cambia a estandar
                    DATABASE.ref("user/").orderByChild("codcentro").equalTo(vm.getUser().codcentro).once("value", function (user) { 
                        //si solo hay un usuario se borra el centro
                        if (Object.keys(user.val()).length > 1) {
                            funcion1 = function () {
                                progressBarFactory.initProgress();
                                vm.progressBar();
                                //se comprueba que haya un administrador en caso de que el usuario sea un admin
                                if (vm.getUser().tipo == "administrador") {
                                    usuarios = user.val(),
                                        hay = false;
                                    for (var data in usuarios) {
                                        if (usuarios[data].tipo == "administrador" && usuarios[data].id != vm.getUser().id) { //si hay se cambia el valor del boleano
                                            hay = true;
                                            break;
                                        }
                                    }
                                    progressBarFactory.sumProgress(10);
                                    if (!hay) { //sino hay se selecciona a un usuario aleatorio como administrador y se envia un mensaje
                                        var id = user.val()[Object.keys(user.val())[0]].id == vm.getUser().id ? Object.keys(user.val())[1] : Object.keys(user.val())[0];
                                        DATABASE.ref("user/" + id).update({
                                            tipo: "administrador"
                                        }).then(function () {
                                            DATABASE.ref("mensajes").push({
                                                asunto: "Nuevo administrador",
                                                texto: "El usuario " + user.val()[id].nombre + " " + user.val()[id].apellido + " se ha convertido en admnistrado del centro",
                                                codcentro: user.val()[id].codcentro,
                                                remitente: "Sistema de HourWeb",
                                                fecha: new Date().getTime(),
                                                destinatario: user.val()[id].codcentro,
                                                cod_remitente: user.val()[id].codcentro,
                                            });
                                        }, function (err) {
                                            vm.error(textFactory.getError(err));
                                        });
                                    }
                                } else {
                                    progressBarFactory.sumProgress(10);
                                }
                                progressBarFactory.sumProgress(30);
                                //se borran las reservas, horarios y se cambia el tipo a ese usuario
                                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (res) { //se borran las reservas que tuviera ese usuario
                                    var reserva = res.val();
                                    for (var r in reserva) {
                                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + r).remove();
                                    }
                                    progressBarFactory.sumProgress(20);
                                    DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (resp) {
                                        var horario = resp.val();
                                        for (var r in horario) {
                                            DATABASE.ref("horarios/" + r).remove();
                                        }
                                        progressBarFactory.sumProgress(30);
                                        DATABASE.ref("user/" + userFactory.getCode()).update({
                                            tipo: "estandar",
                                            codcentro: vm.centro
                                        }).then(function () {
                                            user = {
                                                nombre: vm.getUser().nombre,
                                                apellido: vm.getUser().apellido,
                                                tel_fijo: vm.getUser().fijo,
                                                tel_movil: vm.getUser().movil,
                                                codcentro: vm.centro,
                                                id: vm.getUser().id,
                                                tipo: "estandar",
                                                verificado: vm.getUser().verificado
                                            };
                                            userFactory.setUser(user);
                                            progressBarFactory.sumProgress(10);
                                        }, function (err) {
                                            vm.error(textFactory.getError(err));
                                        });
                                    });
                                });
                            };
                            vm.confirmacion(textFactory.getAviso("cambioCentro1"), funcion1)
                        } else {
                            var funcion2 = function () {
                                vm.progressBar();
                                progressBarFactory.initProgress();
                                DATABASE.ref("centros" + vm.getUser().codcentro).remove().then(function () {
                                    progressBarFactory.sumProgress(45);
                                    DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.getUser().id).once("value", function (resp) {
                                        var horario = resp.val();
                                        for (var r in horario) {
                                            DATABASE.ref("horarios/" + r).remove();
                                        }
                                        progressBarFactory.sumProgress(20);
                                    });
                                    DATABASE.ref("mensajes/").orderByChild("codcentro").equalTo(vm.getUser().codcentro).once("value", function (resp) {
                                        var horario = resp.val();
                                        for (var r in horario) {
                                            DATABASE.ref("horarios/" + r).remove();
                                        }
                                        progressBarFactory.sumProgress(20);
                                        DATABASE.ref("user/" + userFactory.getCode()).update({
                                            tipo: "estandar",
                                            codcentro: vm.centro
                                        }).then(function () {
                                            user = {
                                                nombre: vm.getUser().nombre,
                                                apellido: vm.getUser().apellido,
                                                tel_fijo: vm.getUser().fijo,
                                                tel_movil: vm.getUser().movil,
                                                codcentro: vm.centro,
                                                id: vm.getUser().id,
                                                tipo: "estandar",
                                                verificado: vm.getUser().verificado
                                            };
                                            userFactory.setUser(user);
                                            progressBarFactory.sumProgress(15);
                                        }, function (err) {
                                            vm.error(textFactory.getError(err));
                                        });
                                    });
                                }, function (err) {
                                    vm.error(textFactory.getError(err));
                                });
                            };
                            vm.confirmacion(textFactory.getAviso("cambioCentro2"), funcion2);
                        }
                    });
                } else { //si el codigo del centro no es valido
                    vm.error(textFactory.getError("cambioCentro"));
                }
            });
        }
    }
})();