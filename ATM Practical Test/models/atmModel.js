



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var atmModelSchema = Schema({
    currency_denomination: { type: Number },
    count: { type: Number }
});

var atmModel = mongoose.model('atmModel', atmModelSchema);

module.exports = atmModel;

