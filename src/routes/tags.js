const express = require('express');
const router = express.Router();

const Tags = require('../models/Tags');
const User = require('../models/User');

router.get('/', async(req, res)=>{

    const tags = await Tags.find();
    
    res.render('tags/tags', {tags});

});

router.get('/:id', async(req, res)=>{

    const tag = req.params.id;

    const canal = await User.find({ tags: tag });

    const tags = await Tags.find();
    
    res.render('tags/canales', {tags, tag, canal});

});

module.exports = router;