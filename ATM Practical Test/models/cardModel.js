



var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var cardModelSchema = Schema({
    card_number: { type: String, default: '' },
    pin: { type: String, default: '' },
    balance: { type: Number, default: 0 }
});

var cardModel = mongoose.model('cardModel', cardModelSchema);

module.exports = cardModel;
