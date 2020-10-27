//SOCKET IO
var socket = io();
//FUNCION PARA MOSTRAR EL MODAL LA SECCION DE TRANSMISION
function mostrarModal() {
    let verificarNick = document.getElementById("nickname");
    let parrafoValidarDirecto = document.getElementById("parrafoValidarDirecto");
    if(verificarNick){
        console.log("tienes nickname");
    }
    else{
        console.log("no tienes nickname");
        if(parrafoValidarDirecto){
            console.log("todo bien");
        }
        else{
            var tiempoSinNickName = setTimeout(function(){
                //console.log("se te acabo el tiempo mi rey");
                document.getElementById('modal-stream-text').innerHTML = `Su tiempo gratis a culminado!<br>
                                                                            crea una cuenta para seguir viendo.`;
                $('#staticBackdrop').modal('show');
                btnDismissDodalStreamer = document.querySelector("#btnModalCloseCerrar");
                btnDismissDodalStreamer.onclick = () => {
                    location.replace("http://localhost:3000/signin");
                }
                limpiarSinNickName();
            },7000);
        }
    }
    let URLactual = window.location;
    if (URLactual == "http://localhost:3000/streaming" || URLactual == "http://localhost:4000/streaming" ||
        URLactual == "http://192.168.0.137:3000/streaming" || URLactual == "http://192.168.0.137:3000/streaming") {
        document.getElementById('modal-stream-text').innerHTML = "Permitir que el navegador acceda a dispositivos de audio y video para comenzar";
        $('#staticBackdrop').modal('show');
    }
    socket.emit('cargar usuario', $('#nickname').text());
    //PARA MOSTRAR HACER UN SOCKET JOIN
    URLactual = URLactual.toString();
    let stringURL = URLactual.length;
    //console.log(URLactual.substr(7, 1));
    if (URLactual.substr(7, 1) == 'l') {
        if (stringURL > 31) {
            let cantidadUrl = URLactual.substring(32);
            socket.emit('cargar sala', cantidadUrl);
        }
    }
    else if (URLactual.substr(7, 1) == '1') {
        if (stringURL > 35) {
            let cantidadUrl = URLactual.substring(36);
            socket.emit('cargar sala', cantidadUrl);
        }
    }
    function limpiarSinNickName() {
        clearTimeout(tiempoSinNickName);
    }
}
function limpiarSelect(elemento) {
    for (let x = elemento.options.length - 1; x >= 0; x--) {
        elemento.options.remove(x);
    }
}
// Consulta la lista de dispositivos de entrada de audio y llena el select
let $dispositivosDeVideo = document.getElementById("dispositivosDeVideo");
let $dispositivosDeAudio = document.getElementById("dispositivosDeAudio");

function llenarLista() {
    navigator
        .mediaDevices
        .enumerateDevices()
        .then(dispositivos => {
            limpiarSelect($dispositivosDeAudio);
            limpiarSelect($dispositivosDeVideo);
            dispositivos.forEach((dispositivo, indice) => {
                if (dispositivo.kind === "audioinput") {
                    const $opcion = document.createElement("option");
                    // Firefox no trae nada con label, que viva la privacidad
                    // y que muera la compatibilidad
                    $opcion.text = dispositivo.label || `Micrófono ${indice + 1}`;
                    $opcion.value = dispositivo.deviceId;
                    $dispositivosDeAudio.appendChild($opcion);
                } else if (dispositivo.kind === "videoinput") {
                    const $opcion = document.createElement("option");
                    // Firefox no trae nada con label, que viva la privacidad
                    // y que muera la compatibilidad
                    $opcion.text = dispositivo.label || `Cámara ${indice + 1}`;
                    $opcion.value = dispositivo.deviceId;
                    $dispositivosDeVideo.appendChild($opcion);
                }
            })
        })
};
llenarLista();
//function para comenzar con el stream
function comenzarStream() {

    let btnComenzarVideo = document.getElementById("btnComenzarVideo");
    let btnComenzarStream = document.getElementById("btnComenzarStream");
    let btnDetenerVideo = document.getElementById("btnDetenerVideo");
    let embedResponsiveVideo = document.getElementById("embed-responsive-video");
    var video = document.getElementById("video");
    //PARA GUARDAR EL VIDEO TRANSMITIDO
    var mediaRecorderVideo;
    var fragmentosDeVideo = [];
    //FIN DE VARIABLES DE VIDEO GUARDADO
    var mediaRecorder;
    let iconStreamingTop = document.getElementById("icon-streaming-top");

    var promisifiedOldGUM = function (constraints, successCallback, errorCallback) {

        // First get ahold of getUserMedia, if present
        var getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msgGetUserMedia);

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (successCallback, errorCallback) {
            getUserMedia.call(navigator, constraints, successCallback, errorCallback);
        });

    }
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
    }

    var constraints = {
        audio: { deviceId: $dispositivosDeAudio.value },
        video: { width: 1200, height: 700, deviceId: $dispositivosDeVideo.value }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorderVideo = new MediaRecorder(stream);
            video.srcObject = stream;
            video.onloadedmetadata = function (e) {
                video.play();
                //oculta el boton de habilitar camara
                btnComenzarVideo.style.display = "none";
                //habilita el boton de comenzar stream
                btnComenzarStream.style.display = "block";
                //muestra el boton de live
                embedResponsiveVideo.style.display = "block";
            };

        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        });

    //para agregar el tiempo al video
    function agregarTiempo() {
        let curtimeText = document.getElementById('curtimeText');
        var curmins = Math.floor(video.currentTime / 60);
        var cursecs = Math.floor(video.currentTime - curmins * 60);
        if (cursecs < 10) {
            cursecs = "0" + cursecs;
        }
        curtimeText.innerHTML = curmins + ":" + cursecs;
    }

    //para comenzar el stream
    btnComenzarStream.onclick = () => {
        //PARA PONER SI ESTÁ TRANSMITIENDO
        liveFunction(true);
        //PARA OCULTAR LOS BOTONES DE CAMARA Y AUDIO
        let rowSelectDispositivos = document.getElementById("rowSelectDispositivos");
        rowSelectDispositivos.style.display = "none";
        //PARA MOSTRAR LOS CANALES EN EL INDEX
        let usernameCanal = document.getElementById("nombre-user").textContent;
        let nicknameCanal = document.getElementById("nickname").textContent;
        socket.emit('canaltransmitiendo', usernameCanal, nicknameCanal);
        //INICIALIZAR VARIABLES
        btnComenzarStream.style.display = "none";
        btnDetenerVideo.style.display = "block";
        iconStreamingTop.style.display = "flex";
        //PARA MOSTRAR EL MODAL
        document.getElementById('modal-stream-text').innerHTML = "El stream ha comenzado!";
        $('#staticBackdrop').modal('show');
        //para agregar tiempo al video
        video.addEventListener("timeupdate", agregarTiempo, false);
        //Comenzamos a grabar el stream
        mediaRecorder.start();
        mediaRecorderVideo.start();
        // En el arreglo pondremos los datos que traiga el evento dataavailable
        const fragmentosDeAudio = [];
        // Escuchar cuando haya datos disponibles
        mediaRecorder.addEventListener("dataavailable", evento => {
            fragmentosDeAudio.push(evento.data);
        });
        //FUNCION PARA EL VIDEO A GUARDAR
        mediaRecorderVideo.addEventListener("dataavailable", evento => {
            fragmentosDeVideo.push(evento.data);
        });
        // Cuando se detenga (haciendo click en el botón) se ejecuta esto
        mediaRecorder.addEventListener("stop", () => {
            const blobVideo = new Blob(fragmentosDeAudio);
            fragmentosDeAudio.length = 0;
            socket.emit('emitirvideo', blobVideo, $('#nickname').text());
        });
        setInterval(function () {
            mediaRecorder.stop();
            mediaRecorder.start();
        }, 5000);
        //PARA GUARDAR EL VIDEO STREMEADO
        mediaRecorderVideo.addEventListener("stop", () => {
            const blobVideoSave = new Blob(fragmentosDeVideo);
            var blobPrueba = new Blob(fragmentosDeVideo, { 'type': 'video/webm; codecs=opus' });
            socket.emit('guardarvideo', blobPrueba, $('#nickname').text());
            fragmentosDeVideo.length = 0;
        });
    }
    //para detener el stream
    btnDetenerVideo.onclick = () => {
        btnDetenerVideo.style.display = "none";
        let btnModalCloseX = document.getElementById("btnModalCloseX");
        btnModalCloseX.style.display = "none";
        video.pause();
        mediaRecorder.stop();
        mediaRecorderVideo.stop();
        liveFunction(false);
        socket.emit('finalizar stream');
    }

}
//FUNCTION PARA EL LIVE
function liveFunction(auxLive){
    const urlLive = 'http://localhost:3000/streaming/live';
    let dataLive = new FormData();
    dataLive.append('usuario', $('#nickname').text());
    dataLive.append('live', auxLive);
    fetch(urlLive, {
        method: 'POST',
        body: dataLive
    })
    .then(res => res.json())
    .then(response => {
        console.log(response);
    })
    .catch(error => console.error('Error:', error));
}
//PARA MOSTRAR EL MENSAJE DE STREAM FINALIZADO
socket.on('final stream', function(){
    //PARA MOSTRAR EL MODAL
    document.getElementById('modal-stream-text').innerHTML = "La transmisión en vivo ha terminado!";
    $('#staticBackdrop').modal('show');
    btnDismissDodalStreamer = document.querySelector("#btnModalCloseCerrar");
    btnDismissDodalStreamer.onclick = () => {
        location.replace("http://localhost:3000/profile");
    }
});
//PARA MOSTRAR EL MENSAJE
socket.on('recibircomentario', function (mensaje, nombre) {

    // ` = ALT 96
    let elementDiv = document.createElement("div");
    let columnaComentarioStreamer = document.querySelector("#scroll-col-stream-streamer");
    let colWithoutComentStreamer = document.getElementById("col-withoutcoment-streamer");

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

    if (colWithoutComentStreamer) {
        colWithoutComentStreamer.remove();
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

    columnaComentarioStreamer.appendChild(elementDiv);

    columnaComentarioStreamer.scrollTop = columnaComentarioStreamer.scrollHeight - columnaComentarioStreamer.clientHeight;

});

//PARA MOSTRAR LA ALERTA DE DONACION
socket.on('recibirdonacionalert', function (nombre) {
    //nombreAlertDonar.innerHTML = nombre;
    //$('.darker-alert').alert()
    let elementDiv = document.createElement("div");
    elementDiv.setAttribute("class", "media container-chat darker-alert alert alert-dismissible fade show");
    elementDiv.setAttribute("role", "alert");
    let m = Math.floor(Math.random() * 7);
    let streamsOverlay = document.getElementById("streams-overlayStreaming");
    m = m + "Streaming";
    elementDiv.setAttribute("id", m);
    elementDiv.innerHTML = `<button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <img src="/img/LogoOnStage.png" class="mr-3" alt="Avatar">
                            <div class="media-body">
                                <p class="mt-0 h5 text-capitalize font-weight-bold" id="nombre-alert-donar">`+ nombre + `</p>
                                <p class="text-light">Donó: 10 estrellas</p>
                                <p>Lorem ipsum dolor sit amet consectetur adipisicing</p>
                            </div>`;
    $(".streams-overlayStreaming").prepend(elementDiv);
    //streamsOverlay.style.display = "flex";
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

//PARA VALIDAR EL USUARIO LOGGEADO
function mandarTiempoVideo() {
    var tiempoVideo = setTimeout(function () {
        limpiarTimeVideo();
    }, 5000);
}
function limpiarTimeVideo() {
    clearTimeout(tiempoVideo);
}