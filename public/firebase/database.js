const REF = firebase.database();

/**
 * getter
 * return ref
 */
function getDatabase() {
    return this.REF;
}

/**
 * genera codigos de centro sino existe lo crea sino vuelve a lanzarse el metodo hasta que genere un codigo que no exista
 * centro: objeto con los datos del centro
 * user: objeto con los datos de usuario
 */
function crearCentro(centro, user, uid) {
    //insertarCentro(centro);
    user.codcentro = insertarCentro(centro);
    user.id = uid;
    crearUser(user); //metodo que crea el nodo en usuario
}

/**
 * actualiza un centro(administrador)
 * nom: nombre del centro
 * hor: numero de horas
 */
function actualizarCentro(nom, hor) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var data = snapshot.val(),
            cod;
        for (var data1 in data) {
            cod = data[data1];
        }
        var cent = REF.ref("centros/" + cod);
        cent.update({
            nombre: nom,
            horas: hor
        });
    });
}

/**
 * actualiza el usuario(estandar)
 * nom: nombre nuevo
 * apel: apellido nuevo
 */
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

/**
 * cambia el centro del usuario(estandar)
 * centro: nuevo codigo de centro
 */
function cambiarCentro(centro) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(usuario) {
        var user;
        for (var i in usuario.val()) {
            user = REF.ref("user/" + i);
        }
        REF.ref("centros/" + centro).once("value", function(snapshot) {
            var exist = snapshot.exists();
            user.once("value", function(dat) { //recogemos el antiguo codigo
                var cod = dat.val().codcentro;//recogemos el codigo del centro
                if (exist && centro != cod) {
                    user.update({//actualizamos el nodo del usuario
                        tipo: "estandar",
                        codcentro: centro
                    }); //un usuario que se cambia de centro no puede ser administrador del nuevo por lo que se cambia a estandar
                    REF.ref("user/").orderByChild("codcentro").equalTo(cod).once("value", function(user) { //comprobamos si hay administradores
                        var usuarios = user.val(),
                            hay = false; //en principio no hay
                        var data1;
                        for (data1 in usuarios) {
                            if (usuarios[data1].tipo == "administrador") { //si hay se cambia el valor del boleano
                                hay = true;
                                break;
                            }
                        }
                        if (!hay) { //sino hay se selecciona a un usuario aleatorio como administrador
                            REF.ref("user/" + data1).update({
                                tipo: "administrador"
                            });
                        }
                    });
                    REF.ref("centros/" + cod + "/reservas/").orderByChild("usuario").equalTo(getCurrentUser().uid).once("value", function(res) {//se borran las reservas que tuviera ese usuario
                        var reserva = res.val();
                        for (var r in reserva) {
                            REF.ref("centros/" + cod + "/reservas/" + r).removed();
                        }
                    });
                } else {//si el codigo del centro no es valido
                    alert("El centro nuevo no existe o ya estas añadido");
                }
            });
        });
    });
}

/**
 * comprueba si existe el centro y si existe inserta el usuario estandar
 * span: elemento en el que se muestra el error
 * nombre: nombre del usuario
 * apellido: apellido del usuario
 * centro: codigo del centro en el que se regitra
 * email: email del usuario
 * pass1: contraseña del usuario
 */
function comprobarCentro(span, nombre, apellido, centro, email, pass1) {
    REF.ref("centros/" + centro).once("value", function(snapshot) {
        if (snapshot.exists()) {//si existe registra el usuario
            registrarUser(nombre, apellido, centro, email, pass1);
        } else {
            span.textContent = "El centro no existe";
        }
    });
}

/**
 * inserta un recurso a un instituto
 * nom: nombre del recurso
 * tip: tipo del recurso
 */
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
                alert("El recurso ya existe");
            }
        });
    });
}

/**
* Crea un usuario o lanza el metodo de creacion de centro si es admnistrador
* newcentro: contiene los datos del centro
* newuser: contiene la informacion del usuario
* uid: id de usuario proporcionado por firebase
*/
function insertarUsuario(newcentro, newuser, uid) {
    try {
        if (newuser.tipo == "administrador") {//si el usuario es administrador tambien hay que crear el centro y desde la creacion del centro se crea al usuario
            crearCentro(newcentro, newuser, uid);
        } else { // sino es admnistrador creadmos el usuario directamente
            newuser.id = uid;//lo ponemos de atributo id el que nos proporciona firebase
            crearUser(newuser); //metodo que crea el  usuario
        }
    } catch (err) {}
}

/**
 * si el usuario se ha verificado cambia su estado de verificado a true y redirige al home
 * id: id de la pagina
 */
function redireccion(id) {
    if (id == 1) {
        REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(us) {
            var data = us.val();
            for (var data1 in data) {
                REF.ref("user/" + data1).update({//cambia el estado de verificado a true
                    verificado: true
                });
            }
            window.location = "home.html"; //si se loguea que sea enviado a este html
        });
    }

}

/**
 * crea un nodo usuario y lo rellena
 * user: objecto con los datos del usuario
 */
function crearUser(user) {
    var usuario = REF.ref("user"); //recogemos la referencia de la base datos y le añadimos el uid de usuario como nodo
    usuario.push(user); //introducimos los datos dentro del nodo
}

/**
 * crea un nodo centro y lo rellena
 * centro: objeto con los dato
 * return el nombre del nodo en el que se inserta
 */
function insertarCentro(centro) {
    var cent = REF.ref("centros");
    var key = cent.push({//inserta el nodo
        nombre: centro.nombre,
        horas: centro.horas
    }).key;//recogemos el nombre del nodo
    return key;
}


/**
 * borra un recurso
 * recurso: nombre del recurso
 */
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

/**
 * Monta las reservas de un usuario
 * lunes: elemento ul en el que se meteran las reservas del lunes
 * martes: elemento ul en el que se meteran las reservas del martes
 * miercoles: elemento ul en el que se meteran las reservas del miercoles
 * jueves: elemento ul en el que se meteran las reservas del jueves
 * viernes: elemento ul en el que se meteran las reservas del viernes
 */
function RecogerMisReservas(lunes, martes, miercoles, jueves, viernes) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/reservas/").orderByChild("usuario").equalTo(getCurrentUser().uid).on("value", function(data) { //filtramos las reservas por los usuarios
            var reser = data.val();

            while (lunes.hasChildNodes()) { //remuevo todos los hijos los de la lista de las reservas del lunes para que no se monte
                lunes.removeChild(lunes.firstChild);
            }
            while (martes.hasChildNodes()) { //remuevo todos los hijos los de la lista de las reservas del martes para que no se monte
                martes.removeChild(martes.firstChild);
            }
            while (miercoles.hasChildNodes()) { //remuevo todos los hijos los de la lista de las reservas del miercoles para que no se monte
                miercoles.removeChild(miercoles.firstChild);
            }
            while (jueves.hasChildNodes()) { //remuevo todos los hijos los de la lista de las reservas del jueves para que no se monte
                jueves.removeChild(jueves.firstChild);
            }
            while (viernes.hasChildNodes()) { //remuevo todos los hijos los de la lista de las reservas del viernes para que no se monte
                viernes.removeChild(viernes.firstChild);
            }
            for (var data1 in reser) {
                var hijo = document.createElement("li");//creamos elemento li
                hijo.setAttribute("value", data1); //añadir atributos
                hijo.setAttribute("class", "list-group-item dias");
                hijo.addEventListener("click", function() { //añadimos listener y funcion las cual sera el borrado de la reserva
                    var reserva = this.getAttribute("value");
                    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(sna) {
                        var a = sna.val(),
                            cod;
                        for (var i in a) {
                            cod = a[i].codcentro;
                        }
                        var reser = REF.ref("centros/" + cod + "/reservas/" + reserva);
                        reser.once("value", function(datos) {
                            var a = datos.val();
                            if (a.perm == null) { // si perm es null es porque no es permanente y se puede borrar
                                reser.remove();
                            } else {
                                alert("No puedes borrar las asignaciones permanentes");
                            }
                        });
                    });
                });

                var fecha = reser[data1].fecha;
                if (fecha.length > 1) { //si la fecha es mayor que uno es una reserva normal si no la fecha es el dia de la semana solo y por tanto es permanente
                    var date = new Date(fecha);
                    if (new Date() < date || new Date().getDate() == date.getDate() && new Date().getMonth() == date.getMonth()) {
                        hijo.innerHTML = reser[data1].recurso + "<p></p>Fecha: " + date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " Hora: " + reser[data1].hora;//texto
                        if (date.getDay() == 1) { //filtramos a que lista lo vamos a añadir
                            lunes.appendChild(hijo);
                        } else if (date.getDay() == 2) {
                            martes.appendChild(hijo);
                        } else if (date.getDay() == 3) {
                            miercoles.appendChild(hijo);
                        } else if (date.getDay() == 4) {
                            jueves.appendChild(hijo);
                        } else {
                            viernes.appendChild(hijo);
                        }
                    }
                } else {
                    hijo.innerHTML = reser[data1].recurso + "<p></p> Hora: " + reser[data1].hora + " Permanente";
                    if (fecha == 1) { //filtramos
                        lunes.appendChild(hijo);
                    } else if (fecha == 2) {
                        martes.appendChild(hijo);
                    } else if (fecha == 3) {
                        miercoles.appendChild(hijo);
                    } else if (fecha == 4) {
                        jueves.appendChild(hijo);
                    } else {
                        viernes.appendChild(hijo);
                    }
                }
            }
        });
    });
}



/**
 * metodo que carga los recursos y clickeando en el recurso
 * carga las horas disponibles  segun el dia y clickeando la hora se realiza la reserva
 * tipo: tipo del recurso
 * node: elemento lista donde se cargan los recursos
 * lista: elemento lista donde se cargan las horas disponibles
 * fech: elemento del que se recogera la fecha
 * nrecurso: elemento p donde se pondra el nombre del producto selecciondo
 */
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
}

/**
 * Carga los datos del usuario en la pantalla home
 * nom: elemento en el que poner el nombre
 * foto: elemento en el que cargar la foto
 * cent: elemento en el que poner el centro
 * cod: elemento en el que  poner el codigo del centro
 * p: elemento input donde se pondra el codigo
 */
function recogerDatosUsuarioHome(nom, foto, cent, cod, p) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var data, a = snapshot.val();
        for (var i in a) {
            data = i;
        }
        nom.textContent = a[data].nombre + " " + a[data].apellido;//nombre y apellidos
        if (getCurrentUser().photoURL === null) {// si la foto es null le asignamos una por defecto
            foto.setAttribute("src", "https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/defecto.png?alt=media&token=e43978a7-9b61-4bb5-8737-e85ffd2e2b56");
        } else {
            foto.setAttribute("src", getCurrentUser().photoURL);
        }
        if (a[data].tipo == "administrador") {//si es administrador rellenamos los campos para que pueda ver el codigo del centro
            cod.innerHTML = "Comparta el codigo para que otros usuario ingresen al centro:<p> <a href='#ventana_codigo'  class='btn btn-primary btn-lg' data-toggle='modal'>Ver codigo</a></p>";
            p.value = a[data].codcentro;
        }
        REF.ref("centros/" + a[data].codcentro + "/nombre").once("value", function(nombre) {
            cent.textContent = "Nombre del centro: " + nombre.val();// nombre del centro
        });
    });
}

/**
 * recoge los y rellena los datos del usuario de la pagina de configuarcion
 * nom: elemento que se va a poner de atributo el nombre
 * apel: elemento que se va a poner de atributo el apellido
 * foto: elemento en el que se va la foto
 */
function recogerDatosUsuariosConfig(nom, apel, foto) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var data, a = snapshot.val();
        for (var i in a) {
            data = i;
        }
        nom.setAttribute("value", a[data].nombre);
        apel.setAttribute("value", a[data].apellido);
        if (getCurrentUser().photoURL === null) {
            foto.setAttribute("src", "https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/defecto.png?alt=media&token=e43978a7-9b61-4bb5-8737-e85ffd2e2b56");
        } else {
            foto.setAttribute("src", getCurrentUser().photoURL);
        }
    });
}

/**
 * Asigna una reserva permanente a un usuario
 * recurso: recurso que se ha asignado
 * hora: hora del dia
 * dia: numero del dia que esta asignado
 * usuario: usuario al que se asigna
 */
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


/**
 * Lista los recursos de un centro para poder verlos y borrar
 * nodo: lista para rellenar de recursos
 */
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

/**
 * Cambia el tipo del administrador
 * usuario: id del usuario que se va a cambiar
 * activo: booleano proporcionado por el toggle switch
 */
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

/**
 * Carga la tabla de los usuarios en el area de administradores
 * tabla: elemento tabla
 */
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

/**
 * Cargar la lista de las reservas permanentes en el area de administradores
 * lista: elemento lista en el que se cargan las reservas permanentes
 */
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

/**
 * carga el combobox de los usuarios
 * combo: elemento select
 */
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

/**
 * Rellena el combobox de los recursos
 * combo: elemento select
 */
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
}

/**
 * Rellena el combo de horas
 * combo: elemento select
 */
function comboHoras(combo) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var a = snapshot.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/horas").once("value", function(snapshot) {
            while (combo.hasChildNodes()) {
                combo.removeChild(combo.firstChild);
            }
            for (var i = 1; i <= snapshot.val(); i++) {
                var option = document.createElement("option");
                option.setAttribute("value", i);
                option.setAttribute("class", "opcion_combo");
                option.textContent = i;
                combo.appendChild(option);
            }
        });
    });
}

/*
 * Borras las reservas si se borra el recurso
 * recurso: recurso por el que se borran las reservas
 */
function borrarReservasRecurso(recurso) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(sna) {
        var a = sna.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/reservas/").orderByChild("recurso").equalTo(recurso).once("value", function(snapshot) {
            var data = snapshot.val();
            for (var data1 in data) {
                REF.ref("centros/" + cod + "/reservas/" + data1).remove();
            }
        });
    });
}

/**
 * Recoge los datos para cargarlos en el navigation
 * nombre: elemento donde se pondra en nombre
 * lista: elemento lista para añadir un elemento li en caso de ser administrador
 * salir: ultimo elemento ed la lista
 */
function recogerDatosUsuarioNav(nombre, lista, salir) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(codi) {
        var data = codi.val();
        for (var data1 in data) {
            nombre.innerHTML = "<strong>" + data[data1].nombre + " " + data[data1].apellido + "</strong><span class='caret'></span>";
            if (data[data1].tipo == "administrador") {
                var li = document.createElement("li"),
                    a = document.createElement("a");
                a.setAttribute("href", "administrador.html");
                a.setAttribute("class", "editar_perfil");

                a.textContent = "Administrador";
                li.appendChild(a);
                if (document.getElementById("admin_nav") == null) {//sino existe el elemento en la lista lo añade
                    a.setAttribute("id", "admin_nav");
                    lista.insertBefore(li, salir);
                }
            }
        }
    });
}

/**
* si el usuario intenta acceder al area de administradores sera redirigido a otro html
*/
function accesoDenegado() {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(codi) {
        var data = codi.val();
        for (var data1 in data) {
            if (data[data1].tipo == "estandar") {
                window.location = "acceso.html";
            }
        }
    });
}

/**
*
* tabla: elemento tbody de la tabla al que se le van a añadir las filas y columnas
*/
function rellenarTablaHorarios(tabla) {
    REF.ref("user/").orderByChild("id").equalTo(getCurrentUser().uid).once("value", function(sna) {
        var a = sna.val(),
            cod;
        for (var i in a) {
            cod = a[i].codcentro;
        }
        REF.ref("centros/" + cod + "/horas").once("value", function(horas) {
            REF.ref("horarios/").orderByChild("usuario").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
                var data = snapshot.val();
                while (tabla.hasChildNodes()) {
                    tabla.removeChild(tabla.firstChild);
                }
                for (var i = 1; i <= horas.val(); i++) { //filas
                    var fila = document.createElement("tr");//creamos la fila
                    fila.setAttribute("name", "fila");
                    var columnahora = document.createElement("th");//primera columna que es la hora
                    columnahora.textContent = i;
                    fila.appendChild(columnahora);
                    for (var j = 1; j <= 5; j++) { //columnas
                        var columna = document.createElement("td"),// creamos la columna
                            input = document.createElement("input");// creamos el input de dentro de la columna
                        input.setAttribute("type", "text");
                        input.setAttribute("maxlength", "20");
                        input.setAttribute("class", "form-control");
                        input.setAttribute("id", i + "-" + j);//le ponemos de id la fila y la columna
                        input.disabled = true;// lo ponemos no editable
                        for (var data1 in data) {
                            if (data[data1].dia == j && data[data1].hora == i) {// si existe un registro del horario en ese dia y hora se le pone como valor al input
                                input.value = data[data1].nombre;
                            }
                        }
                        columna.appendChild(input);
                        fila.appendChild(columna);
                        tabla.appendChild(fila);
                    }
                }
            });
        });
    });
}

/*
* guarda los datos de la tabla en la base de datos
* filas: numero de filas
*/
function guardarDatosTablaHorarios(filas) {
    REF.ref("horarios/").orderByChild("usuario").equalTo(getCurrentUser().uid).once("value", function(snapshot) {
        var data = snapshot.val();
        for (var i = 1; i <= filas; i++) { //filas
            for (var j = 1; j <= 5; j++) { //columnas
                var existe = false,
                    valor = document.getElementById(i + "-" + j).value,//recojo los valores de cada input
                    data1;

                for (data1 in data) {//comprobamos si existe algun registro
                    if (data[data1].hora == i && data[data1].dia == j) {
                        existe = true;
                        break;
                    }
                }
                if (existe) {//si existe
                    if (valor != 0) {//si el valor no es vacio se actuliza
                        REF.ref("horarios/" + data1).update({
                            nombre: valor
                        });
                    } else {// si es vacio se borra
                        REF.ref("horarios/" + data1).remove();
                    }
                } else {//sino existe se añade
                    if (valor != 0) {
                        REF.ref("horarios/").push({
                            dia: j,
                            hora: i,
                            usuario: getCurrentUser().uid,
                            nombre: valor
                        });
                    }
                }
            }
        }
    });
}
