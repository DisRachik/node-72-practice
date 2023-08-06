const { Schema, model } = require('mongoose');

const rolesSchema = new Schema({
    value: {
        type: String,
        default: 'USER',
    },
});

module.exports = model('roles', rolesSchema);
