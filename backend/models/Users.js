const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
    name: {
        type: String,
        default: 'John Travolta',
    },
    email: {
        type: String,
        required: [true, 'db: email is required'],
    },
    password: {
        type: String,
        required: [true, 'db: password is required'],
    },
    token: {
        type: String,
        default: null,
    },
    roles: [
        {
            type: String,
            ref: 'roles',
        },
    ],
});

module.exports = model('users', usersSchema);
