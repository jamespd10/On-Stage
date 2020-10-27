const User = require('./models/User');
const fs = require('fs');

module.exports = async function (io) {
  let users = {};
  io.on('connection', (socket) => {

    socket.on('cargar usuario', (data) => {
      if (data !== '') {
        //console.log('la data es: ' + data);
        socket.nickname = data;
        //console.log("socket consola: " + socket.nickname);
        users[socket.nickname] = socket;
        //console.log('el socket del usuario es: ' + users[socket.nickname].id);
        //console.log(socket);
      }
    });

    socket.on('cargar sala', (cantidad) => {
      
        socket.join(cantidad);
      
    });

    socket.on('emitirvideo', (canvasCaptura, sala) => {

        io.to(sala).emit('emitirvideo', canvasCaptura);

    });

    socket.on('guardarvideo', async (videos, username) => {

      const streamer = await User.find({ username: username });

      const videoName = streamer[0].videos.length + 1;

      let totalVideos;

      if(streamer[0].videos){
        totalVideos = streamer[0].videos.length;

        totalVideos = totalVideos + 1;
      }
      else{
        totalVideos = 1;
      }

      fs.writeFile(__dirname + '/public/img/videos/video' + streamer[0].username + videoName + '.webm', videos, () => {
        console.log("video guardado")
      });

      const video = 'video' + streamer[0].username + videoName;

      const usuario = await User.findOneAndUpdate(streamer[0].username, { $push: {videos: video}, $set: {total_videos: totalVideos}});

    });

    socket.on('enviarcomentario', (mensaje, nombre, sala) => {

      io.emit('recibircomentario', mensaje, nombre);

    });

    socket.on('finalizar stream', ()=>{
      io.emit('final stream');
    })

    socket.on('canaltransmitiendo', (nombre, nicknameCanal) => {

      io.emit('enviarcanal', nombre, nicknameCanal);

    });

    //PARA RECIBIR LA DONACION
    socket.on('enviaralertdonacion', (nombre, sala, cantidad, mensaje) => {

      io.emit('recibirdonacionalert', nombre, cantidad, mensaje);

    });

    socket.on('disconnect', () => {
      //if(!socket.nickname) return;
      console.log('el usuario ' + socket.nickname + ' se ha desconectado');
      delete users[socket.nickname];
    });

  });
}