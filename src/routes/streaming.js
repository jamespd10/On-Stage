const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fs = require('fs');

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//PARA COMENRZAR UN STREAM
router.get('/', isLoggedIn, (req, res)=>{
    res.render('streaming/streaming');
});
//PARA VER EL VIDEO DEL STREAMER
router.get('/:id'/*, isLoggedIn*/, async (req, res)=>{
    const streamer = await User.find({username: req.params.id});
    res.render('streaming/streams', {streamer});
});
//PARA VER SI HA COMENZADO DIRECTO
router.post('/live'/*, isLoggedIn*/, async (req, res)=>{
    const { usuario, live } = req.body
    const liveQuery = await User.findOneAndUpdate({username: usuario}, {$set: {live: live}});
    res.json({message: "bien"});
});

//PARA SEGUIR AL STREAMER
router.post('/seguir'/*, isLoggedIn*/, async (req, res)=>{

    const {usuario, streamer} = req.body;

    const streameadorConsul = await User.find({username: streamer});

    const usuarioConsul = await User.find({username: usuario});

    let totalSeguidores;

    let totalUsuarioSeguidos;

    //PARA EL STREAMER
    if(streameadorConsul[0].seguidores){
        totalSeguidores = streameadorConsul[0].seguidores.length;

        totalSeguidores = totalSeguidores + 1;
    }
    else{
        totalSeguidores = 1;
    }
    //PARA EL USUARIO
    if(usuarioConsul[0].seguidos){
        totalUsuarioSeguidos = usuarioConsul[0].seguidos.length;

        totalUsuarioSeguidos = totalUsuarioSeguidos + 1;
    }
    else{
        totalUsuarioSeguidos = 1;
    }

    const streameador = await User.findOneAndUpdate({username: streamer}, {$set: {total_seguidores: totalSeguidores}, $push: {seguidores: usuario}});

    const usuarioUpdate = await User.findOneAndUpdate({username: usuario}, {$set: {total_seguidos: totalUsuarioSeguidos}, $push: {seguidos: streamer}});

    res.json({message: "bien"});

});

module.exports = router;