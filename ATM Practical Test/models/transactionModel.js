
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionModelSchema = Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'cardModel' },
    currentAmount: { type: Number, default: 0 },
    withdrawalAmount : { type: Number, default: 0 },
    withdrawalDate : { type: Date ,default: Date.now },

});

var transactionModel = mongoose.model('transactionModel', transactionModelSchema);

module.exports = transactionModel;

