(function () {

    angular
        .module('app')
        .controller('AdministradorController', administradorController);

    function administradorController(userFactory, DATABASE, AUTH, $log, $timeout, $location, modalFactory, errorFactory) {
        var vm = this;
        var centro;
        // Timepicker reservas permanentes       
        vm.hstep = 1;
        vm.mstep = 30;
        vm.bRP = '';
        vm.error = modalFactory.error;
        vm.confirmacion = modalFactory.confirmacion;

        //Accordion
        vm.oneAtATime = true;
        vm.open = [];
        //vm.mostrarX=[];
        vm.cursosRP = [];
        vm.RP = [];
        vm.dayRP = "6";
        var interval = function () {
            $timeout(recarga, 100)
        };
        interval();

        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser;
                    cargarRecursos();
                    cargarUsuarios();
                    getTipologias();
                    horaYNombreCentro()
                    cargarCursos();
                    cargarRP();
                }, 0);
            } else {
                interval();
            }
        }

        function horaYNombreCentro() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/horas").once("value", function (snapshot) {
                $timeout(function () {
                    vm.mytimeRP = new Date("1/1/3000 " + snapshot.val().split("-")[0] + ":00");
                    vm.max = new Date("1/1/3000 " + snapshot.val().split("-")[1] + ":00") - 3600000;
                    vm.min = vm.mytimeRP;
                    vm.inicio = vm.min;
                    vm.final = vm.max + 3600000;
                }, 0);
            });
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/nombre").once("value", function (snapshot) {
                $timeout(function () {
                    vm.nCentro = snapshot.val();
                    centro = snapshot.val();
                }, 0);
            });
        }


        vm.crearRecurso = function () {
            var re = DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/" + vm.recurso); //decimos el nodo del recurso
            if (vm.recurso != 0 && vm.recurso != null) {
                re.once("value", function (snapshot) {
                    if (!snapshot.exists()) { //sino existe lo creamos
                        re.set({
                            tipo: vm.tipo
                        });
                        vm.recursos.push({
                            recurso: vm.recurso,
                            tipo: vm.tipo
                        });
                        vm.recurso = "";
                    } else {
                        vm.error(errorFactory.getError("noRecurso"));
                    }
                });
            } else {
                vm.error(errorFactory.getError("campoVacio"));
            }
        };

        function getTipologias() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos/").once("value", function (snapshot) {
                $timeout(function () {
                    vm.tipologias = snapshot.val();
                    vm.open.fill(false, 0, vm.tipologias.length);
                    // vm.mostrarX.fill(false, 0, vm.tipologias.length);
                    vm.tipo = vm.tipologias[0];
                }, 0);

            });
        }


        vm.borrarTipo = function (index) {
            var funcion = function () {
                var tipo = vm.tipologias[index];
                vm.tipologias.splice(index, 1);
                vm.open.splice(index, 1);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos/").set(vm.tipologias);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/").orderByChild("tipo").equalTo(tipo).once("value", function (snapshot) {
                    var recursos = snapshot.val();
                    for (var data in recursos) {
                        $log.log(data);
                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("recurso").equalTo(data).once("value", function (data1) {
                            var reserva = data1.val();
                            for (var data2 in reserva) {
                                $log.log(data2);
                                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + data2).remove();
                            }
                        });
                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/" + data).remove();
                    }
                })
            }

            vm.confirmacion("¿Borrar este tipo?", funcion);
        };


        vm.crearTipo = function () {

            if (vm.ntipo != 0 && vm.ntipo != null) {
                if (!vm.tipologias.includes(vm.ntipo)) {
                    vm.tipologias.push(vm.ntipo);
                    vm.open.push(false);
                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos/").set(vm.tipologias);
                    vm.ntipo = "";
                } else {
                    vm.error(errorFactory.getError("noTipo"));
                }
            } else {
                vm.error(errorFactory.getError("campoVacio"));
            }
        };

        vm.borrarRecurso = function (recurso) {
            var funcion = function () {
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/" + recurso).remove();
            };
            vm.confirmacion("¿Borrar el recurso " + recurso + "?", funcion);
        };

        function cargarRecursos() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/").on("value", function (snapshot) {
                $timeout(function () {
                    vm.recursos = Object.keys(snapshot.val()).map(function (key) {
                        return {
                            recurso: key,
                            tipo: snapshot.val()[key].tipo
                        };
                    });
                    vm.recursoRP = vm.recursos[0].recurso;
                }, 0);
            });
        }

        function cargarUsuarios() {
            DATABASE.ref("user/").orderByChild("codcentro").equalTo(vm.getUser().codcentro).on("value", function (snapshot) {
                $timeout(function () {
                    vm.usuarios = Object.keys(snapshot.val()).map(function (key) {
                        return {
                            id: snapshot.val()[key].id,
                            nombre: snapshot.val()[key].nombre + ' ' + snapshot.val()[key].apellido,
                            verificado: snapshot.val()[key].verificado,
                            tel_fijo: snapshot.val()[key].tel_fijo,
                            email: snapshot.val()[key].email,
                            tipo: snapshot.val()[key].tipo,
                            tel_movil: snapshot.val()[key].tel_movil
                        };
                    });
                    vm.usuarioRP = vm.usuarios[0];
                }, 0);
            });
        }

        /*
         *devuelve el numero de recursos segun el tipo
         * tip: tipo
         * return numero
         */
        vm.filtrar = function (tip) {
            return vm.recursos.filter(function (x) {
                return x.tipo == tip;
            }).length;
        };


        vm.hacerReservaPermanente = function () {
            vm.mytimeRP.setDate(parseInt(vm.dayRP));
            var existe = false,
                i = 0;

            while (i < vm.RP.length && !existe) {
                if (vm.RP[i].recurso == vm.recursoRP && new Date(vm.RP[i].fecha).getDay() == vm.mytimeRP.getDay() && new Date(vm.RP[i].fecha).getHours() == vm.mytimeRP.getHours() && new Date(vm.RP[i].fecha).getMinutes() == vm.mytimeRP.getMinutes()) {
                    existe = true;
                }
                i++;
            }

            if (vm.recursoRP != null) {
                if (!existe) {
                    var funcion = function () {
                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("recurso").equalTo(vm.recursoRP).once("value", function (snapshot) {

                            for (var data in snapshot.val()) {
                                if (new Date(snapshot.val()[data].fecha).getDay() == vm.mytimeRP.getDay() && new Date(snapshot.val()[data].fecha).getHours() == vm.mytimeRP.getHours() && new Date(snapshot.val()[data].fecha).getMinutes() == vm.mytimeRP.getMinutes()) {
                                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + data).remove();
                                }
                            }
                            var rp = {
                                fecha: vm.mytimeRP.getTime(),
                                recurso: vm.recursoRP,
                                usuario: vm.usuarioRP.id,
                                nombre: vm.usuarioRP.nombre,
                                curso: vm.cursoRP == null ? '' : vm.cursoRP,
                                perm: true
                            };
                            var key = DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").push(rp).key;
                            rp.hora = (vm.mytimeRP.getHours() < 10 ? '0' + vm.mytimeRP.getHours() : vm.mytimeRP.getHours()) + ':' + (vm.mytimeRP.getMinutes() != 0 ? vm.mytimeRP.getMinutes() : vm.mytimeRP.getMinutes() + '0') + "-" + (new Date(vm.mytimeRP.getTime() + 3600000).getHours() < 10 ? '0' + new Date(vm.mytimeRP.getTime() + 3600000).getHours() : new Date(vm.mytimeRP.getTime() + 3600000).getHours()) + ':' + (vm.mytimeRP.getMinutes() != 0 ? vm.mytimeRP.getMinutes() : vm.mytimeRP.getMinutes() + '0')
                            rp.code = key;
                            $timeout(function () {
                                vm.RP.push(rp);
                            }, 0);
                        })

                    }
                    vm.confirmacion("Se borraran todas las reservas normales que coincidan con esta reserva ¿Está seguro?", funcion);
                } else {
                    vm.error(errorFactory.getError("existeRP"));
                }
            } else {
                vm.error(errorFactory.getError("debeRecurso"));
            }
        };


        function cargarCursos() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/cursos/").once("value", function (snapshot) {
                $timeout(function () {
                    vm.cursos = snapshot.val();
                    vm.cursosRP = snapshot.val().map(function (key) {
                        return {
                            label: key,
                            value: key
                        }
                    });
                    try {
                        vm.cursosRP.unshift({
                            label: 'Seleccione el curso (Opcional)',
                            value: null
                        });
                        vm.cursoRP = vm.cursosRP[0].value;
                    } catch (err) {}
                }, 0)
            });
        }

        vm.addCurso = function () {
            if (vm.nCurso != 0 && vm.nCurso != null) {
                if (!vm.cursos.includes(vm.nCurso)) {
                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/cursos/").set(vm.cursos);
                    vm.cursosRP.push({
                        label: vm.nCurso,
                        value: vm.nCurso
                    });
                    vm.cursos.push(vm.nCurso);
                } else {
                    vm.error(errorFactory.getError("noCurso"));
                }
            } else {
                vm.error(errorFactory.getError("campoVacio"));
            }
        }

        vm.borrarCurso = function (index, curso) {
            var funcion = function () {
                vm.cursosRP.splice(index + 1, 1);
                vm.cursos.splice(index, 1);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/cursos/").set(vm.cursos);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("curso").equalTo(curso).once("value", function (snapshot) {
                    var reservas = snapshot.val();
                    for (var data in reservas) {
                        DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + data).update({
                            curso: ''
                        })
                    }
                });
                for (var i = 0; i < vm.usuarios; i++) {
                    DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.usuarios[i].id).once("value", function (data) {
                        var horarios = data.val();
                        for (var data1 in horarios) {
                            DATABASE.ref("horarios/" + data1).remove();
                        }
                    })
                }
            }
            vm.confirmacion("¿Borrar el curso " + curso + "? eso también borrará el curso de las reservas y de los horarios", funcion);
        }


        function cargarRP() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").orderByChild("perm").equalTo(true).once("value", function (snapshot) {
                $timeout(function () {
                    vm.RP = Object.keys(snapshot.val()).map(function (key) {
                        var date = new Date(snapshot.val()[key].fecha);

                        function day(key) {
                            switch (parseInt(key)) {
                                case 1:
                                    return "Lunes";
                                case 2:
                                    return "Martes";
                                case 3:
                                    return "Miercoles";
                                case 4:
                                    return "Jueves";
                                case 5:
                                    return "Viernes";
                            }
                        }
                        return {
                            fecha: date,
                            code: key,
                            dia: day(date.getDay()),
                            nombre: snapshot.val()[key].nombre,
                            recurso: snapshot.val()[key].recurso,
                            hora: (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0') + "-" + (new Date(date.getTime() + 3600000).getHours() < 10 ? '0' + new Date(date.getTime() + 3600000).getHours() : new Date(date.getTime() + 3600000).getHours()) + ':' + (date.getMinutes() != 0 ? date.getMinutes() : date.getMinutes() + '0'),
                            perm: true,
                            curso: snapshot.val()[key].curso
                        }
                    });
                }, 0)
            });
        }

        /**
         * Borra una reserva permanente
         * @param rp: reserva permanente
         */
        vm.borrarRP = function (rp) {
            funcion = function () {
                vm.RP.splice(vm.RP.indexOf(rp), 1);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + rp.code).remove();
            }
            vm.confirmacion("¿Borrar esta reserva permanente?", funcion);
        };

        /**
         * Cambia el tipo de usuario de administrador a estandar y viceversa
         * @param user: usuario con los datos 
         */
        vm.cambiarTipo = function (user) {
            DATABASE.ref("user/").orderByChild("id").equalTo(user.id).once("value", function (codi) {
                var data = codi.val();
                for (var data1 in data) {
                    if (user.tipo != 'administrador') {
                        DATABASE.ref("user/" + data1).update({
                            tipo: "administrador"
                        });
                        // vm.usuarios[vm.usuarios.indexOf(user)].tipo = "administrador";
                    } else {
                        DATABASE.ref("user/" + data1).update({
                            tipo: "estandar"
                        });
                        // vm.usuarios[vm.usuarios.indexOf(user)].tipo = "estandar";
                    }
                }
            });
        }

        vm.cambiarNombreCentro = function () {
            if (vm.nCentro != 0 && vm.nCentro != null) {
                DATABASE.ref("centros/" + vm.getUser().codcentro).update({
                    nombre: vm.nCentro
                });
                vm.datos = !vm.datos;
            } else {
                vm.error(errorFactory.getError("campoVacio"));
            }
        }

        vm.cancelarNombreCentro = function () {
            vm.nCentro = centro;
            vm.datos = !vm.datos;
        }

        vm.cambiarHora = function () {
            if (vm.inicio >= vm.fin || vm.fin - vm.inicio < 7200000) {
                vm.error(errorFactory.getError("errorHoraRegistro"));
            } else {
                var funcion = function () {
                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/").once("value", function (snapshot) {
                        var reservas = snapshot.val();
                        DATABASE.ref("centros/" + vm.getUser().codcentro).update({
                            horas: vm.inicio.getHours() + ':' + (vm.inicio.getMinutes() != 0 ? vm.inicio.getMinutes() : vm.inicio.getMinutes() + '0') + '-' + vm.fin.getHours() + ':' + (vm.fin.getMinutes() != 0 ? vm.fin.getMinutes() : vm.fin.getMinutes() + '0'),
                            rango_horas: vm.fin.getHours() - vm.inicio.getHours()
                        })
                        for (var data in reservas) {
                            if (new Date(reservas[data].fecha).getHours() < vm.inicio.getHours() || new Date(reservas[data].fecha).getHours() >= vm.final.getHours() && new Date(reservas[data].fecha).getMinutes() >= vm.final.getMinutes()) {
                                DATABASE.ref("centros/" + vm.getUser().codcentro + "/reservas/" + data).remove();
                            }
                        }
                        vm.hora = !vm.hora;
                    });
                    for (var i = 0; i < vm.usuarios.length; i++) {
                        DATABASE.ref("horarios/").orderByChild("usuario").equalTo(vm.usuarios[i].id).once("value", function (snapshot) {
                            for (var data in snapshot.val()) {
                                if (snapshot.val()[data].hora > vm.fin.getHours() - vm.inicio.getHours()) {
                                    DATABASE.ref("horarios/" + data).remove();
                                }
                            }
                        })
                    }
                }
                vm.confirmacion("Se borraran los horarios y reservas fuera del horario¿Esta seguro?", funcion);
            }
        };

        vm.cancelarCambiarHora = function () {
            vm.hora = !vm.hora;
            vm.inicio = vm.min;
            vm.final = vm.max + 3600000;
        }

    }

})();

/*
function crearRecurso(nom, tip) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {//recogemos codigo del centro
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        var re = REF.ref("centros/" + cod + "/recursos/" + nom);//decimos el nodo del recurso
        re.once("value", function(data) {
            if (!data.exists()) {//sino existe lo creamos
                re.set({
                    tipo: tip
                });
                montarComboboxes();//actualizacion de los combobox
            } else {
                vm.error("El recurso ya existe");
            }
        });
    });
}

function borrarRecurso(recurso) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {//cogemos el codigo del centro del usuario actual
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/recursos/" + recurso).remove();//borramos el nodo
    });
}

function hacerReservaPermanente(recurso, hora, dia, usuario) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/reservas/").orderByChild("recurso").equalTo(recurso).once("value", function(data) {//borramos las reservas normales que coincidan con la reserva permante en recurso, fecha y hora
            var data1 = data.val();
            for (var o in data1) {
                var nod = REF.ref("centros/" + cod + "/reservas/" + o);
                nod.once("value", function(dat) {
                    var re = dat.val();
                    if (new Date(re.fecha).getDay() == dia && re.hora == hora) { //borras las reservas existente en ese dia y a esa hora de ese recurso

                        nod.remove(); //lo borramos
                    }
                });
            }
            REF.ref("centros/" + cod + "/reservas").push({ //inserta la reserva permanente
                recurso: recurso,
                usuario: usuario,
                fecha: dia,
                hora: hora,
                perm: true //es el atributo que nos va a indicar que es permanente
            });
            montarListaReservasPermanentes();//montamos la lista otra vez
        });
    });
}
function recogerListaRecursoAdmin(nodo) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/recursos/").on("value", function(data) {
            var data2 = data.val();
            while (nodo.hasChildNodes()) {
                nodo.removeChild(nodo.firstChild);
            }
            for (var data1 in data2) {
                var hijo = document.createElement("li");
                hijo.setAttribute("value", data1);
                hijo.setAttribute("class", "list-group-item lista_administrador");
                hijo.textContent = data1;
                hijo.addEventListener("click", function() { //añade el listener para borrar cuando clickas
                    var a = this.getAttribute("value");
                    borrarRecurso(a);
                    borrarReservasRecurso(a);//borra las reservas de ese recurso ya que no existe
                });
                nodo.appendChild(hijo);
            }
        });
    });
}


function cambiarTipo(usuario, activo) {
    REF.ref("user/").orderByChild("id").equalTo(usuario).once("value", function(codi) {
        var data = codi.val();
        for (var data1 in data) {
            if (activo) {
                REF.ref("user/" + data1).update({
                    tipo: "administrador"
                });
            } else {
                REF.ref("user/" + data1).update({
                    tipo: "estandar"
                });
            }
        }
    });
}


function tablaUsuarios(tabla) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(sna) {
        var a = sna.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("user/").orderByChild("codcentro").equalTo(cod).once("value", function(snapshot) {
            var data = snapshot.val();
            while (tabla.hasChildNodes()) {
                tabla.removeChild(tabla.firstChild);
            }
            tabla.innerHTML = '<tr class="bg-primary"><th>Nombre</th><th>Estandar/Administrador</th></tr>'
            for (var data1 in data) {
                if (data[data1].id != getCurrentUser().uid && data[data1].verificado == true) {
                    var fila = document.createElement("tr"), //creamos la fila
                        columnombre = document.createElement("td"), //creamos las columnas
                        columtipo = document.createElement("td");
                    columnombre.textContent = data[data1].nombre + " " + data[data1].apellido; //texto de la primera columna
                    var label = document.createElement("label"); //creamos label del para el toggle switch
                    label.setAttribute("class", "switch");
                    var input = document.createElement("input"); // creamos el input
                    input.setAttribute("type", "checkbox");
                    input.setAttribute("value", data[data1].id);
                    if (data[data1].tipo == "administrador") { //si es administrador lo ponemos como seleccionado
                        input.setAttribute("checked", "");
                    }
                    input.addEventListener("change", function() { //le añadimos el listener para que cambie de tipo
                        var usuario = this.getAttribute("value");
                        cambiarTipo(usuario, this.checked);
                    });
                    var div = document.createElement("div"); //creamos el div
                    div.setAttribute("class", "slider round");
                    label.appendChild(input); //añadimos el input y el div al label
                    label.appendChild(div);
                    columtipo.appendChild(label); //añadimos el label a la columna
                    fila.appendChild(columnombre); //añadimos la columna a la fila
                    fila.appendChild(columtipo);
                    tabla.appendChild(fila); //añadimos al fila a la tabla
                }
            }
        });
    });
}


function recogerListaReservasPermanentes(lista) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/reservas/").orderByChild("perm").equalTo(true).once("value", function(snapshot) { //buscamos las reservas permanentes
            var data = snapshot.val();
            while (lista.hasChildNodes()) {
                lista.removeChild(lista.firstChild);
            }
            REF.ref("user/").orderByChild("codcentro").equalTo(cod).once("value", function(user) {
                var use = user.val();
                for (var data1 in data) {
                    for (var us in use) {
                        if (data[data1].usuario == use[us].id) {
                            var li = document.createElement("li");
                            li.setAttribute("value", data1 + " - " + cod);//ponemos el de value su nodo y su codigo de centro
                            li.setAttribute("class", "list-group-item lista_permanente");
                            var dia;
                            switch (parseInt(data[data1].fecha)) { //segun el dia tomara un valor
                                case 1:
                                    dia = "Lunes";
                                    return;
                                case 2:
                                    dia = "Martes";
                                    return;
                                case 3:
                                    dia = "Miercoles";
                                    return;
                                case 4:
                                    dia = "Jueves";
                                    return;
                                case 5:
                                    dia = "Viernes";
                                    return;
                            }
                            li.textContent = "Usuario: " + use[us].nombre + " " + use[us].apellido + ", Recurso: " + data[data1].recurso + ", Dia: " + dia + " y Hora: " + data[data1].hora;
                            li.addEventListener("click", function() {// asignamos funcion de borrar para cuando clickeas sobre el
                                var a = this.getAttribute("value").split(" - ");
                                REF.ref("centros/" + a[1] + "/reservas/" + a[0]).remove();
                                montarListaReservasPermanentes();//despues de borrar vuelve a montar la lista
                            });
                            lista.appendChild(li);
                        }
                    }
                }
            });
        });
    });
}


function comboUsuarios(combo) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("user/").orderByChild("codcentro").equalTo(cod).once("value", function(usuario) {
            while (combo.hasChildNodes()) {
                combo.removeChild(combo.firstChild);
            }
            var data = usuario.val();
            for (var data1 in data) {
                if (data[data1].verificado === true) {//tiene que estar verificado para aparecer
                    var option = document.createElement("option");
                    option.setAttribute("value", data[data1].id);
                    option.setAttribute("class", "opcion_combo");
                    option.textContent = data[data1].nombre + " " + data[data1].apellido;
                    combo.appendChild(option);
                }
            }
        });
    });
}


function comboRecursos(combo) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/recursos/").once("value", function(snapshot) {
            while (combo.hasChildNodes()) {
                combo.removeChild(combo.firstChild);
            }
            var data = snapshot.val();
            for (var data1 in data) {
                var option = document.createElement("option");
                option.setAttribute("value", data1);
                option.setAttribute("class", "opcion_combo");
                option.textContent = data1;
                combo.appendChild(option);
            }
        });
    });
}*/