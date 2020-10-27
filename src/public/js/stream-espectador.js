let btnStreamFollow = document.querySelector(".btn-stream-follow");
//let btnStreamDonar = document.getElementsByClassName("btn-stream-donar");
let btnStreamDonacionEnviar = document.getElementById("btn-modal-donar-enviar");
let btnEviarMensajeEspectador = document.getElementById("btnEviarMensajeEspectador");
let streamsOverlay = document.querySelector(".streams-overlay");
let nombreAlertDonar = document.getElementById("nombre-alert-donar");
let btnMas = document.getElementById("btn-mas");
let btnMenos = document.getElementById("btn-menos");
let cantidadDonacion = document.getElementById("cantidad-donacion");

//VARIABLE DE SOCKET
var socket = io();

//PARA DONAR
function mostrarModalDonar() {
    $('#modalDonar').modal('show');
    let formPaypal = document.getElementById("formPaypal");
    formPaypal.submit();
}
//PARA ENVIAR LA DONACIÓN
btnStreamDonacionEnviar.onclick = () => {
    let nombre = document.getElementById("nombre-user").textContent;
    $('#modalDonar').modal('hide');
    document.getElementById('staticBackdropLabel').innerHTML = "Felicidades! <i class='fas fa-grin-hearts'></i>";
    document.getElementById('modal-stream-text').innerHTML = "Su donación ha sido enviada con exito.<br>Gracias por su donación.";
    $('#staticBackdrop').modal('show');
    //PARA SABER SI ES EN CELULAR O NO
    let URLactual = window.location;
    URLactual = URLactual.toString();
    let stringURL = URLactual.length;
    let cantidadUrl;
    if(URLactual.substr(7, 1)=='l'){
        if(stringURL>31){
            cantidadUrl = URLactual.substring(32);
        }
    }
    else if(URLactual.substr(7, 1)=='1'){
        if(stringURL>35){
            cantidadUrl = URLactual.substring(36);
        }
    }
    let cantidadDonacion = document.getElementById("cantidad-donacion").value;
    let textAreaMensajeDonacion = document.getElementById("textAreaMensajeDonacion").value;
    //EMITIR EVENTO
    socket.emit('enviaralertdonacion', nombre, cantidadUrl, cantidadDonacion, textAreaMensajeDonacion);
}

btnMas.onclick = (e) => {
    e.preventDefault();
    cantidadDonacion.value = parseInt(cantidadDonacion.value) + 1;
}
btnMenos.onclick = (e) => {
    e.preventDefault();
    if (cantidadDonacion.value > 1) {
        cantidadDonacion.value = cantidadDonacion.value - 1;
    }
}

//PARA TRANSMITIR EL VIDEO
socket.on('emitirvideo', function (canvasCaptura) {

    var video2 = document.querySelector('#video-streaming');
    var blob5 = new Blob([canvasCaptura], { 'type': 'video/ogg; codecs=opus' });
    video2.src = window.URL.createObjectURL(blob5);
    video2.onloadedmetadata = function (e) {
        video2.play();
    };

});
//PARA MOSTRAR LA ALERTA DE DONACION
socket.on('recibirdonacionalert', function (nombre, cantidad, mensaje) {
    //nombreAlertDonar.innerHTML = nombre;
    //$('.darker-alert').alert()
    let elementDiv = document.createElement("div");
    elementDiv.setAttribute("class", "media container-chat darker-alert alert alert-dismissible fade show");
    elementDiv.setAttribute("role", "alert");
    let m = Math.floor(Math.random() * 7);
    elementDiv.setAttribute("id", m);
    elementDiv.innerHTML = `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <img src="/img/LogoOnStage.png" class="mr-3" alt="Avatar">
                            <div class="media-body">
                                <p class="mt-0 h5 text-capitalize font-weight-bold" id="nombre-alert-donar">`+ nombre + `</p>
                                <p class="text-light">Donó: `+cantidad+` estrellas</p>
                                <p>`+mensaje+`</p>
                            </div>`;
    $(".streams-overlay").prepend(elementDiv);
    streamsOverlay.style.display = "flex";
    var tiempo = setTimeout(function () {
        let aux = "#" + m;
        let elementDiv = document.getElementById(m);
        $(aux).alert('close');
        elementDiv.remove();
        limpiarTime();
        //streamsOverlay.style.display = "none";
    }, 5000);

});

function limpiarTime() {
    clearTimeout(tiempo);
}

//PARA ENVIAR MENSAJE
btnEviarMensajeEspectador.onclick = () => {
    let inputSendMessage = document.getElementById("inputSendMessage");
    let nombreUser = document.getElementById("nombre-user");
    //PARA SABER SI ES EN CELULAR O NO
    let URLactual = window.location;
    URLactual = URLactual.toString();
    let stringURL = URLactual.length;
    let cantidadUrl;
    if(URLactual.substr(7, 1)=='l'){
        if(stringURL>31){
            cantidadUrl = URLactual.substring(32);
        }
    }
    else if(URLactual.substr(7, 1)=='1'){
        if(stringURL>35){
            cantidadUrl = URLactual.substring(36);
        }
    }
    //EMITIR EVENTO
    if (inputSendMessage.value != "") {
        socket.emit('enviarcomentario', inputSendMessage.value, nombreUser.textContent, cantidadUrl);
    }
}

//PARA MOSTRAR EL MENSAJE
socket.on('recibircomentario', function (mensaje, nombre) {

    // ` = ALT 96
    let elementDiv = document.createElement("div");
    let columnaComentario = document.querySelector(".scroll-col-stream");
    let inputSendMessage = document.getElementById("inputSendMessage");
    let colWithoutComent = document.getElementById("col-withoutcoment");

    let date = new Date();
    let hora = date.getHours();
    let minuto = date.getMinutes();

    if (minuto < 10) {
        minuto = "0" + minuto;
    }
    if (hora > 12) {
        hora = hora - 12;
        minuto = minuto + " P.M"
    }

    if (colWithoutComent) {
        colWithoutComent.remove();
    }

    elementDiv.setAttribute("class", "container-chat darker media");

    elementDiv.innerHTML = `
                            <img src="/img/LogoOnStage.png" class="mr-3" alt="Avatar">
                            <div class="media-body">
                                <p>
                                    <span class="mt-0 h5 text-capitalize font-weight-bold">`+ nombre + `</span>
                                    <span class="text-muted"> : </span>
                                    <span class="text-muted">`+ hora + `:` + minuto + `</span>
                                </p>
                                <p>`+ mensaje + `</p>
                            </div>`;

    columnaComentario.appendChild(elementDiv);

    inputSendMessage.value = "";

    columnaComentario.scrollTop = columnaComentario.scrollHeight - columnaComentario.clientHeight;

});

//FUNCION PARA SEGUIR AL STREAMER
function seguirStreamer() {
    //declaracion de variables
    let URLactual = window.location;
    URLactual = URLactual.toString();
    let streamer = URLactual.substring(32);
    //crear data para enviar
    let data = new FormData();
    data.append('usuario', $('#nickname').text());
    data.append('streamer', streamer);
    //fetch para envio de datos
    fetch('http://localhost:3000/streaming/seguir', {
        method: 'POST',
        body: data
    })
        .then(response => response.json())
        .then(response => {
            document.getElementById('staticBackdropLabel').innerHTML = "Notificación! <i class='fas fa-bell'></i>";
            document.getElementById('modal-stream-text').innerHTML = "A comenzado a seguir a "+streamer;
            $('#staticBackdrop').modal('show');
        })
        .catch(error => console.error('Error:', error));
}