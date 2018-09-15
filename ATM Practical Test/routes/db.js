
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('../models/cardModel');
require('../models/atmModel');
require('../models/transactionModel');


var uri = 'mongodb://localhost:27017/atmProject';


mongoose.connect(uri,{}, function(error) {
  if(error){
    console.log('connection failed!')
  }else{
    console.log("Database connected successfully!");
  }
});