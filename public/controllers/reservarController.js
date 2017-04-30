(function () {

    angular
        .module('app')
        .controller('ReservarController', reservarController);

    function reservarController(userFactory, DATABASE, $timeout) {
        var vm = this;
        var interval = setInterval(recarga, 1000);
        vm.recursos = [];
        vm.tipos = [{
            name: 'Selecciones un tipo',
            value: '?'
        }, {
            name: 'clase',
            value: 'clase'
        }, {
            name: 'objeto',
            value: 'objeto'
        }];
        vm.tipo = vm.tipos[0].value;
        vm.semana = '0';
        function recarga() {
            if (userFactory.getUser() != null) {
                $timeout(function () {
                    vm.getUser = userFactory.getUser();
                    clearInterval(interval);
                });
            }
        }

        function cargarFecha() {
            var dia = new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() - 1)));
            for (var j = 0; j < 5; j++) {
                dia.setDate(dia.getDate() + j);
                if (vm.semana == 1) {
                    dia.setDate(dia.getDate() + 7);
                }
                vm.dias.push(dia);
            }
        }

        vm.cargarRecursos = function () {
            DATABASE.ref("centros/" + vm.getUser.codcentro + "/recursos/").orderByChild("tipo").equalTo(vm.tipo).on("value", function (snapshot) {
                var recurso = snapshot.val();
                vm.recursos = [];
                $timeout(function () {
                    for (var data in recurso) {
                        vm.recursos.push({name:data, value:data});
                    }
                    try{
                vm.recurso = vm.recursos[0].value;
                    }catch(err){}
                }, 0);
            });
        };


        function cargarTipo() {
            DATABASE.ref("tipos/").once("value", function (snapshot) {
                vm.tipos = snapshot.val();
            });
        }

        function cargarDisponible() {
            DATABASE.ref("centros/" + vm.getUser.codcentro + "/reservas/").orderByChild("recurso").equalTo(vm.recurso).on("value", function (snapshot) {
                var reservas = snapshot.val();
                vm.tabla = [];
                DATABASE.ref("centros/" + vm.getUser.codcentro + "/horas").once("value", function (hor) {
                    var horas = hor.val().split("-");
                    for (var i = new Date('1/1/1 ' + horas[0]).getTime(); i <= new Date('1/1/1 ' + horas[1]); i += 1800000) { //fila
                        var fila = {};
                        fila.hora = new Date(a).getHours() + ':' + (new Date(a).getMinutes() != 0 ? new Date(a).getMinutes() : new Date(a).getMinutes() + '0');
                        for (var j = 0; j < 5; j++) { //columnas
                            vm.dias[j].setHours(new Date(a).getHours());
                            vm.dias[j].setMinutes(new Date(a).getMinutes());
                            var celda = {};
                            celda.activo = true;
                            celda.fecha = vm.dias[j];
                            for (var data in reservas) {
                                if (vm.dias[j] - new Date(reservas[data].fecha) < 3600000 || reservas[data].perm) {
                                    celda.activo = false;
                                    celda.nombre = reservas[data].nombre;
                                    celda.curso = reservas[data].curso;
                                } else if (new Date(reservas[data].fecha) < new Date()) {
                                    celda.activo = false;
                                }
                            }
                            switch (j) {
                                case 0:
                                    fila.lunes = celda;
                                    break;
                                case 1:
                                    fila.martes = celda;
                                    break;
                                case 2:
                                    fila.miercoles = celda;
                                    break;
                                case 3:
                                    fila.jueves = celda;
                                    break;
                                case 4:
                                    fila.viernes = celda;
                                    break;
                            }
                            vm.tabla.push(fila);
                        }
                    }
                });
            });
        }


    }
})();


/*
function cargarRecursosDisponibleYReservar(tipo, node, lista, fecha, nrecurso) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/recursos/").orderByChild("tipo").equalTo(tipo).on("value", function(data) {
            while (node.hasChildNodes()) { //remuevo todos los hijos los de la lista de recursos para que no se monte
                node.removeChild(node.firstChild);
            }
            var cab = document.createElement("li");//primer elemento de la lista
            cab.setAttribute("class", "list-group-item lista_recurso");
            cab.setAttribute("style", "font-family:'Verdana',sans-serif;font-size:20px;background-color:skyblue;");
            cab.innerHTML = "<u><strong>RECURSOS</strong></u>";
            node.appendChild(cab)
            var recur = data.val(); //recojo el valor
            for (var data1 in recur) { //recorro todos los objetos recursos
                var hijo = document.createElement("li"); //creo un elemento li
                hijo.setAttribute("class", "list-group-item lista_recurso");
                hijo.setAttribute("value", data1); //le ponemos el atributo  value con el nombre del recurso
                hijo.textContent = data1; //se le añade el contenido de texto
                hijo.addEventListener("click", function() { //le añadimos un listener con un funcion para que cargue las horas disponible segun una fecha
                    var fech = fecha.value, //recogermos la fecha del combobox
                        recurso = this.getAttribute("value"); //recogermos su atributo value el cual es el nombre del recurso
                    nrecurso.textContent = recurso;
                    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
                        var a = snapshot.val(),
                            cod;
                        for (var i in a) {
                            cod = a[i].codcentro;
                        }
                        REF.ref("centros/" + cod + "/horas").once("value", function(hora) { //recogemos las horas del centro
                            var horas = hora.val();
                            REF.ref("centros/" + cod + "/reservas/").orderByChild("recurso").equalTo(recurso).on("value", function(reservas) { //recogemos las reservas filtrando por la fecha
                                while (lista.hasChildNodes()) { //borramos los nodos q tenga dentro si los tuviera
                                    lista.removeChild(lista.firstChild);
                                }
                                var t = document.createElement("li");//primer elemento de lo lista de horas
                                t.setAttribute("class", "list-group-item lista_hora");
                                t.setAttribute("style", "font-family:'Verdana',sans-serif;font-size:20px;background-color:skyblue;");
                                t.setAttribute("data-toggle", "tooltip");
                                t.setAttribute("data-placement", "top")
                                t.setAttribute("title", "LISTA DE HORAS DISPONIBLES")
                                t.innerHTML = "<u><strong>HORAS</strong></u>";
                                lista.appendChild(t);
                                var res = reservas.val(),
                                    thoras = [1];
                                for (var i = 2; i <= horas; i++) { //rellenamos el arrar thoras con las horas que tiene el centro
                                    thoras.push(i);
                                }
                                for (var data2 in res) { //recorremos los objecto reserva
                                    if (res[data2].fecha === fech || res[data2].fecha == new Date(fech).getDay()) { //comparamos la fecha y comprobamos si es permanente
                                        for (var s = 0; s < thoras.length; s++) { //buscamos la hora es la de la reserva y la quitamos del array si hubiera una reserva a esa hora
                                            if (thoras[s] == res[data2].hora) {
                                                thoras.splice(s, 1);
                                            }
                                        }
                                    }
                                }
                                for (var a = 0; a < thoras.length; a++) { //creamos tantos elementos li como horas haya
                                    var hijolista = document.createElement("li");
                                    hijolista.setAttribute("value", thoras[a] + "-" + recurso + "-" + fech); // le ponemos un atributo value con la hora el recurso que es y la fecha
                                    hijolista.textContent = thoras[a];
                                    hijolista.setAttribute("class", "list-group-item lista_hora");
                                    hijolista.setAttribute("data-toggle", "tooltip");
                                    hijolista.setAttribute("title", "Reservar");
                                    hijolista.setAttribute("data-placement", "");
                                    hijolista.addEventListener("click", function() { // le añadimos un evento a cada li para que cuando clickees se realice una reserva
                                        var datos = this.getAttribute("value").split("-"); // recogemos el atributo value y lo separamos en un array
                                        REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
                                            var a = snapshot.val(),
                                                cod;
                                            for (var i in a) {
                                                cod = a[i].codcentro;
                                            }
                                            var re = REF.ref("centros/" + cod + "/reservas/");
                                            re.push({
                                                recurso: datos[1],
                                                usuario: getCurrentUser().uid,
                                                fecha: datos[2],
                                                hora: datos[0]
                                            }); //insertamos la reserva
                                        });
                                    });
                                    lista.appendChild(hijolista); //añadimos el hijo a la lista de horas
                                }
                                $(document).ready(function() {// le ponemos los tooltip
                                    $('[data-toggle="tooltip"]').tooltip();
                                });
                            });
                        });
                    });
                });
                node.appendChild(hijo); //añadimos el hijo a la lista de recursos
            }
        });
    });
}*/