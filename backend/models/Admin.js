const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    username: {
        type: 'string',
        unique: true
    },
    password: String
}, {
    timestamps: true
});

const AdminModel = mongoose.model('Admin',AdminSchema);

module.exports = AdminModel;