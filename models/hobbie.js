'use strict'

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var HobbieSchema = Schema({
    name: {
        type: String,
        required: [true, 'name_required'],
    },
    description: {
        type: String,
        required: [true, 'description_required'],
    }

});


module.exports = mongoose.model('Hobbie', HobbieSchema);
