const express = require('express');
const router = express.Router();
const Tags = require('../models/Tags');
const User = require('../models/User');
const helpers = require('../lib/helpers');

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//MOSTRAR EL PERFIL PROPIO
router.get('/', isLoggedIn, (req, res)=>{

    res.render('profile/profile');

});

//MOSTRAR EL PERFIL DEL STREAMER
router.get('/:id', async (req, res)=>{

    const streamer = await User.findOne({ username: req.params.id });

    res.render('profile/streamer', {streamer});

});

//MOSTRAR PANTALLA DE CONFIGURACIÓN
router.get('/:id/configuracion', isLoggedIn, async (req, res)=>{

    const usuario = await User.find({username: req.params.id});

    const tagsCon = await Tags.find({name: { $in: usuario[0].tags }});

    let tags;

    if(tagsCon.length==3){
        tags = false
    }
    else{
        tags = await Tags.find({name: { $nin: usuario[0].tags }});
    }

    res.render('profile/config', {tags, usuario});

});

//MOSTRAR PANTALLA DE TERMINOS Y CONDICIONES
router.get('/terminos/condiciones', (req, res)=>{

    res.render('profile/terminos');

});

//ACTUALIZAR DATOS DEL USUARIO
router.put('/edit/:id', isLoggedIn, async (req, res)=>{

    if (!req.files || Object.keys(req.files).length === 0) {

        console.log('No files were uploaded.');

    }
    //else if(req.files.file.mimetype){}
    else if(req.files.file){
        const file = req.files.file;
        let auxImage = false;
        const fileName = file.name;
        /*console.log(file.mimetype);
        console.log(fileName);*/
        let allowedExtensions = /(.jpg|.jpeg|.png)$/i;
        if(allowedExtensions.exec(fileName)){
            console.log("es imagen");
            file.mv('./src/public/img/profile/'+fileName, async function(err){

                if(err){
                    console.log(err);
                }
                else{
                    console.log("archivo subido");
                    auxImage = true;
                    if(auxImage){
                        const imagen = fileName;
                        await User.findByIdAndUpdate(req.params.id, { imagen });
                    }
                }
    
            });
        }
    }

    let { name, apellido, correo, password, ubicacion, web, descripcion } = req.body;
    
    if(password){
        password = await helpers.encryptPassword(password);
        await User.findByIdAndUpdate(req.params.id, { name, apellido, correo, password, ubicacion, web, descripcion });
    }
    else{
        await User.findByIdAndUpdate(req.params.id, { name, apellido, correo, ubicacion, web, descripcion });
    }

    res.redirect("/profile");

});

//CONVERTIRSE EN STREAMER
router.post('/streamer/accepted/:id', isLoggedIn, async (req, res)=>{

    const artista = true;

    const { checkBoxTerminos, check } = req.body;

    if(checkBoxTerminos && checkBoxTerminos==1){

        await User.findByIdAndUpdate(req.params.id, { artista });
        
        if(check){
            
                await User.findById(req.params.id, function (err, User) {

                check.forEach(element => 
                    User.tags.push(element)
                );

                User.save();

            });
        }

    }

    res.redirect("/profile");

});

module.exports = router;