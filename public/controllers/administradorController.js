(function () {

    angular
        .module('app')
        .controller('AdministradorController', administradorController);

    function administradorController(userFactory, DATABASE, AUTH, $log, $timeout, $location, modalFactory, errorFactory) {
        var vm = this;

        // Timepicker reservas permanentes       
        vm.hstep = 1;
        vm.mstep = 30;

        vm.error = modalFactory.error;
        vm.confirmacion = modalFactory.confirmacion;

        //Accordion
        vm.oneAtATime = true;
        vm.open = [];
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
                    horaCentro();
                }, 0);
            } else {
                interval();
            }
        }

        function horaCentro() {
            DATABASE.ref("centros/" + vm.getUser().codcentro + "/horas").once("value", function (snapshot) {
                $timeout(function () {
                    vm.mytimeRP = new Date("1/1/3000 " + snapshot.val().split("-")[0]);
                    vm.max=new Date("1/1/3000 " + snapshot.val().split("-")[1])-1800000;
                    vm.min=new Date("1/1/3000 " + snapshot.val().split("-")[0]);
                }, 0);
            });
        }


        vm.crearRecurso = function () {
            var re = DATABASE.ref("centros/" + vm.getUser().codcentro + "/recursos/" + vm.recurso); //decimos el nodo del recurso
            if (vm.recurso != 0) {
                re.once("value", function (snapshot) {
                    if (!snapshot.exists()) { //sino existe lo creamos
                        re.set({
                            tipo: vm.tipo
                        });
                        vm.recursos.push({
                            recurso: vm.recurso,
                            tipo: vm.tipo
                        });
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
                    vm.tipo = vm.tipologias[0];
                }, 0);

            });
        }


        vm.borrarTipo = function (index) {
            var funcion = function () {
                vm.tipologias.splice(index, 1);
                vm.open.splice(index, 1);
                DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos/").set(vm.tipologias);
            }

            vm.confirmacion("¿Borrar este tipo?", funcion);
        };

        vm.crearTipo = function () {
            if (vm.ntipo != 0) {
                if (!vm.tipologias.includes(vm.ntipo)) {
                    vm.tipologias.push(vm.ntipo);
                    vm.open.push(false);
                    DATABASE.ref("centros/" + vm.getUser().codcentro + "/tipos/").set(vm.tipologias);
                } else {
                    vm.error(errorFactory.getError("campoVacio"));
                }
            } else {
                vm.error(errorFactory.getError("noTipo"));
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

        function cargarUsuarios(){
            DATABASE.ref("user/").orderByChild("codcentro").equalTo(vm.getUser().codcentro).on("value", function (snapshot) {
                $timeout(function () {
                    vm.usuarios = Object.keys(snapshot.val()).map(function (key) {
                        return {
                            id: snapshot.val()[key].id,
                            nombre: snapshot.val()[key].nombre+' '+snapshot.val()[key].apellido,
                            verificado:snapshot.val()[key].verificado,
                            tel_fijo:snapshot.val()[key].tel_fijo,
                            tel_movil:snapshot.val()[key].tel_movil
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

        function hacerReservaPermanente(){
            vm.mytimeRP.setDate(vm.dayRP);
            var rp = {
                fecha:vm.mytimeRP.getTime(),
                recurso:vm.recursoRP,
                usuario:vm.usuarioRP.id,
                nombre:vm.usuarioRP.nombre,
                curso:vm.cursoRP==null ? '':vm.cursoRP,
                perm:true
            };
            DATABASE.ref("centros/"+vm.getUser().codcentro+"reservas").push(rp);
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
                                    break;
                                case 2:
                                    dia = "Martes";
                                    break;
                                case 3:
                                    dia = "Miercoles";
                                    break;
                                case 4:
                                    dia = "Jueves";
                                    break;
                                case 5:
                                    dia = "Viernes";
                                    break;
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