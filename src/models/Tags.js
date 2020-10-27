const { Schema, model } = require('mongoose');

const tagsSchema = new Schema({
    name: {
        type: String
    },
    imagen: {
        type: String
    }
})

module.exports = model('Tags', tagsSchema);