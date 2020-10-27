const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.post('/buscar', async (req, res)=>{

    //res.render('buscar');
    const {buscar} = req.body;

    //puedo quitar lo de dentro de find
    const usuario = await User.find({ username: new RegExp(buscar), artista: true });

    res.render('buscar', {usuario, buscar});

});

module.exports = router;