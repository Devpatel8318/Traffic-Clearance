const mongoose = require('mongoose')

const LocalAdminSchema = new mongoose.Schema({
    username: {
        type: 'string',
        unique: true
    },
    password: String,
    city: String,
    contact : String
}, {
    timestamps: true
});

const LocalAdminModel = mongoose.model('LocalAdmin',LocalAdminSchema);

module.exports = LocalAdminModel;