const STORAGE = firebase.storage().ref();//constante de storage

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
