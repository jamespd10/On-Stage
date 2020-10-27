//para pausar el video
function clickPlayVideo(videoSection) {
  playVideo(videoSection);
}
function playVideo(videoGrabacion) {
  var video = document.getElementById("video" + videoGrabacion);
  //controlsVideo
  let curtimeText = document.getElementById('curtime' + videoGrabacion);
  let durtimeText = document.getElementById('durtime' + videoGrabacion);
  let btnMuteVideo = document.getElementById('btnMute' + videoGrabacion);
  let volumeSlider = document.getElementById('volumen' + videoGrabacion);
  let btnFullScreen = document.getElementById('btnFull' + videoGrabacion);
  let btnCancelFullScreen = document.getElementById('btnCancelFull' + videoGrabacion);
  let iconPlay = document.getElementById("iconPlay" + videoGrabacion);
  let iconMute = document.getElementById("iconMute" + videoGrabacion);
  let orangeJuice = document.getElementById("orange-juice" + videoGrabacion);
  var videoContainer = document.getElementById("videoContainer" + videoGrabacion);
  console.log(video);
  if (video.paused) {
    video.play();
    //para agregar el tiempo al video
    video.addEventListener("timeupdate", seektimeupdate, false);
    iconPlay.classList.remove("fa-play");
    iconPlay.classList.add("fa-pause");
    //btnPlayVideo.innerHTML="Pause";
  }
  else {
    video.pause();
    iconPlay.classList.remove("fa-pause");
    iconPlay.classList.add("fa-play");
    //btnPlayVideo.innerHTML="Play";
  }
  function seektimeupdate() {

    var nt = video.currentTime * (100 / video.duration);
    orangeJuice.value = nt;
    var curmins = Math.floor(video.currentTime / 60);
    var cursecs = Math.floor(video.currentTime - curmins * 60);
    var durmins = Math.floor(video.duration / 60);
    var dursecs = Math.round(video.duration - durmins * 60);
    if (cursecs < 10) {
      cursecs = "0" + cursecs;
    }
    if (dursecs < 10) {
      dursecs = "0" + dursecs;
    }
    curtimeText.innerHTML = curmins + ":" + cursecs;
    durtimeText.innerHTML = durmins + ":" + dursecs;
    //nueva variable para la barra de minutos
    /*var juice = document.getElementById("orange-juice" + videoGrabacion);
    var juicePos = video.currentTime / video.duration;
    juice.style.width = juicePos * 100 + "%";*/
    //juice.style.width = cursecs + "%";
    //juice.style.width = nt;
  }
  //para mutear el video
  btnMuteVideo.onclick = () => {
    if (video.muted) {
      video.muted = false;
      iconMute.classList.remove("fa-volume-mute");
      iconMute.classList.add("fa-volume-up");
    }
    else {
      video.muted = true;
      iconMute.classList.remove("fa-volume-up");
      iconMute.classList.add("fa-volume-mute");
    }
  }
  //para la barra de tiempo del video
  orangeJuice.addEventListener("change", vidSeek, false);
  function vidSeek(){
    let seekto = video.duration * (orangeJuice.value/100);
    video.currentTime = seekto;
  }
  //para subir y bajar el vulumen del video
  volumeSlider.addEventListener("change", setVolume, false);
  function setVolume() {
    video.volume = volumeSlider.value / 100;
    if (video.volume === 0) {
      iconMute.classList.remove("fa-volume-up");
      iconMute.classList.add("fa-volume-mute");
    }
    else {
      iconMute.classList.remove("fa-volume-mute");
      iconMute.classList.add("fa-volume-up");
    }
  }

  //para pantalla completa
  btnFullScreen.onclick = () => {
    btnFullScreen.style.display = "none";
    btnCancelFullScreen.style.display = "inline";
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    }
    else if (videoContainer.mozRequestFullScreen) { /* Firefox */
      videoContainer.mozRequestFullScreen();
    }
    else if (videoContainer.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      videoContainer.webkitRequestFullscreen();
    }
    else if (videoContainer.msRequestFullscreen) { /* IE/Edge */
      videoContainer.msRequestFullscreen();
    }
  }
  //para salir de pantalla completa
  btnCancelFullScreen.onclick = () => {
    btnCancelFullScreen.style.display = "none";
    btnFullScreen.style.display = "inline";
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}