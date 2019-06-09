'use strict'

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

var UserSchema = Schema({
    firstName: {
        type: String,
        required: [true, 'firstName_required'],
    },
    lastName: {
        type: String,
        required: [true, 'lastName_required'],
    },
    documentId: {
        type: String,
        required: [true, 'documentId_required'],
        unique:  [true, 'documentId_unique'],
    },
    password: {
        type: String,
        required: [true, 'password_required'],
    },
    birthDay: {
        type: Date,
        required: [true, 'birthDay_required'],
    },
    hobbies: [{
        type: 'ObjectId',
        ref: 'Hobbie'
    }]

});

UserSchema.pre('save', async function() {
    if(this.isModified('password')){
        try {
            this.password = await bcrypt.hashSync(this.password,10);   
        } catch (error) {
            console.log(error);
            
        }
    }
});

UserSchema.methods.validPassword = async function(password) {
    return await bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema);
