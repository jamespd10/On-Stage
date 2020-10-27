const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    apellido: {
        type: String,
        require: true,
        trim: true
    },
    correo: {
        type: String,
        require: true,
        trim: true
    },
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    ubicacion: {
        type: String,
        require: true,
        trim: true
    }, 
    web: {
        type: String,
        require: true,
        trim: true
    }, 
    descripcion: {
        type: String,
        require: true,
        trim: true
    },
    artista: {
        type: Boolean,
        require: true,
        default: false,
        trim: true
    },
    imagen: {
        type: String,
        require: true,
        default: 'LogoOnStage.png'
    },
    tags: [String],
    videos: [String],
    total_videos: Number,
    seguidores: [String],
    total_seguidores: Number,
    seguidos: [String],
    total_seguidos: Number,
    live: Boolean
}, {
    timestamps: true
})

module.exports = model('User', userSchema);