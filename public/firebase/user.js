const AUTH = firebase.auth(); // constante de autentificacion

/**
 * getter
 * return auth
 */
function getCurrentUser() {
    return AUTH.currentUser;
}
var newuser, newcentro;//variables donde se guardaran los datos del registro
//observador del estado de la sesion, si el usuario esta logueado enteramente user es true sino es false
//el observador es para no trabajar con currentUser sin que el inicio de sesion este completado
AUTH.onAuthStateChanged(function(user) {
    var id = document.getElementById("idpage").className;
    if (user) {//el usuario esta logueao
        if (AUTH.currentUser.displayName === null) { //si el usuario es nuevo(cuando se crea el usuario automaticamente inicia sesion) el displayName es null y por tanto le relleno sus datos en la base de datos
            AUTH.currentUser.updateProfile({
                displayName: newuser.nombre, //nombre
                photoURL: "https://firebasestorage.googleapis.com/v0/b/hourweb-4d325.appspot.com/o/defecto.png?alt=media&token=e43978a7-9b61-4bb5-8737-e85ffd2e2b56" //foto por defecto
            });

            insertarUsuario(newcentro, newuser, AUTH.currentUser.uid);//inserto el usuario en la base de datos
            AUTH.currentUser.sendEmailVerification();//envia un email de verificacio
            alert("Se ha enviado un email de verificacion a su correo");
            $('#ventana_user').modal('hide');//oculta el modal del formulario
            $('#ventana_admin').modal('hide');

        }
        if(AUTH.currentUser.emailVerified){//si esta verificado redirige, sino cierra la sesion
        redireccion(id);//redireccionara al home y modifica el atributo verificado
        switch (parseInt(id)) {//dependiendo del id rellenara un html u otro
            case 2://home
                montarDatosUsuarioHome();
                montarMisReservas();
                montarHorarios();
                montarNavigation();
                break;
            case 3://reservas
                montarNavigation();
                rellenarComboFecha();
                montarRecursosReserva();
                break;
            case 4://configuracion
                montarNavigation();
                montarDatosUsuariosConfig();
                break;
            case 5://administrado
                //accesoDenegado();
                montarNavigation();
                montarComboboxes();
                montarTablaUsuarios();
                montarListaReservasPermanentes();
                montarListaRecursoAdmin();
                break;
        }
      }else{//si el email no esta verificado se cierra sesion
			cerrarSesion();
		}

  } else {//si no esta logueado te redirigira al login
        if (id == 2 || id == 3 || id == 4 || id== 5 || id == 6) {
           window.location = "index.html"; // si se desloguea que sea enviado a este otro html
        }
    }
});


/**
 * Registra un usuario estandar
 * nom: nombre del usuario
 * apel: apellido del usuario
 * cent: codigo del centro
 * ema: email del usuario
 * pass: contraseña
 */
function registrarUser(nom, apel, cent, ema, pass) {
    AUTH.createUserWithEmailAndPassword(ema, pass).catch(function(error) { //crea el usuario
        switch (error.code) { //dependiendo del error ejecutara un alert u otro
            case "auth/email-already-in-use":
                alert("El email es usado");
                break;
            case "auth/operation-not-allowed":
                alert("Operacion no permitida");
                break;
            case "auth/invalid-email":
                alert("Email invalido");
                break;
            default:
                alert("Ha ocurrido un error");
        }
    });
    newuser = {//le damos los valores que se van a insertar en la base de datos a los objetos
      id:0,
        nombre: nom,
        apellido: apel,
        codcentro: cent,
        tipo: "estandar",
        verificado:false
    };
}

/**
 * crea un usuario administrador y un centro con el
 * nom: nombre del usuario
 * apel: apellido del usuario
 * nomcent: nombre del centro
 * hor: numero de horas que tiene el centro
 * ema: email del usuario
 * pass: contraseña
 */
function registrarUserAdmin(nom, apel, nomcent, hor, ema, pass) {
    AUTH.createUserWithEmailAndPassword(ema, pass).catch(function(error) { //crea el usuario
        switch (error.code) { //dependiendo del error ejecutara un alert u otro
            case "auth/email-already-in-use":
                alert("El email es usado");
                break;
            case "auth/operation-not-allowed":
                alert("Operacion no permitida");
                break;
            case "auth/invalid-email":
                alert("Email invalido");
                break;
            default:
                alert("Ha ocurrido un error");
        }
    });
    newcentro = {//le damos los valores que se van a insertar en la base de datos a los objetos
        nombre: nomcent,
        horas: hor
    };
    newuser = {
        id:0,
        nombre: nom,
        apellido: apel,
        codcentro: 0,
        tipo: "administrador",
        verificado:false
    };
}

/**
 * loguea al usuario
 * email: email
 * pass: contraseña
 */
function iniciarSesion(email, pass) {
    AUTH.signInWithEmailAndPassword(email, pass).catch(function(error) {
        switch (error.code) { //dependiendo del error ejecutara un alert u otro
            case "auth/invalid-email":
                alert("El email no valido");
                break;
            case "auth/user-not-found":
                alert("El email o la contraseña no son validos");
                break;
            case "auth/wrong-password":
                alert("El email o la contraseña no son validos");
                break;
            default:
                alert("Ha ocurrido un error");
        }
    });
}

/**
 * cierra la sesion actual
 */
function cerrarSesion() {
    AUTH.signOut();
}
