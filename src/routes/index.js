const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res)=>{

    let streamers = await User.find({ artista: true });

    res.render('index', { layout: 'index', streamers });
});

module.exports = router;