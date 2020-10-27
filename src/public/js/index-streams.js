//PARA MOSTRAR EL CANAL
socket.on('enviarcanal', function (nombre, nicknameCanal) {

    // ` = ALT 96
    let canalesIndexLive = document.getElementById("canales-no-life-index");
    canalesIndexLive.remove();
    let elementA = document.createElement("a");
    let divSideBar = document.querySelector("#sideBarChannels");
    
    elementA.setAttribute("class", "nav-side-link-bar nav-link");
    elementA.setAttribute("href", "/streaming/"+nicknameCanal);

    elementA.innerHTML = `<img src="/img/LogoOnStage.png" alt="imagen" class="mr-2">
                            <span class="text-capitalize" id="txt">`+nombre+`</span>
                            `;

    divSideBar.appendChild(elementA);

});