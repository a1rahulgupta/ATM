
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
cardModel = mongoose.model('cardModel'),
  transactionModel = mongoose.model('transactionModel'),
  atmModel = mongoose.model('atmModel')
var config = require('../models/config');
var waterfall = require('async-waterfall');
var async = require('async');
var moment = require('moment');

router.post('/checkCardInfo', function (req, res, next) {
  var finalResponse = {};
  var condition = {};
  var cardObj = {
    card_number: req.body.card_number,
    pin: req.body.pin,
  };
  if (!cardObj.card_number || !cardObj.pin) {
    res.json({
      code: 400,
      data: {},
      message: 'Required Fields is Missing'
    });
  } else {
    waterfall([
      function (callback) {
        condition.card_number = cardObj.card_number;
        condition.pin = cardObj.pin;
        cardModel.findOne(condition).exec(function (err, cardDetails) {
          if (err) {
            callback(err, false);
          } else {
            if (!cardDetails) {
              res.json({
                code: 406,
                data: {},
                message: "You have entered Invalid Pin or Card Number."
              });
            } else {
              finalResponse.cardDetails = cardDetails;
              callback(null, finalResponse);
            }

          }
        })
      },
    ], function (err, data) {
      if (err) {
        res.json({
          code: 400,
          data: {},
          message: "Internal Error"
        });
      } else {
        res.json({
          code: 200,
          data: data,
          message: "Card Tracked Successfull"
        });
      }
    });

  }
});

router.post('/cashWithdrwal', function (req, res, next) {
  var finalResponse = {};
  finalResponse.cardDetailsInfo = {};
  finalResponse.updateCardDetails = {};
  finalResponse.transactionDetails = {};
  var condition = {};
  var cashObj = {
    _id: req.body._id,
    amount: req.body.amount,
    withdrawalDate: req.body.withdrawalDate
  }
  if (!cashObj._id || !cashObj.amount) {
    res.json({
      code: 400,
      data: {},
      message: 'Required Fields is Missing'
    });
  } else {
    waterfall([
      function (callback) {
        condition._id = cashObj._id;
        cardModel.findOne(condition).exec(function (err, cardDetails) {
          if (err) {
            callback(err, false);
          } else {
            if (cashObj.amount >= cardDetails.balance) {
              res.json({
                code: 409,
                data: {},
                message: 'Insufficient funds in your account!'
              });
            } else {
              finalResponse.cardDetailsInfo = cardDetails;
              callback(null, finalResponse);
            }
          }
        })
      },
      function (finalResponse, callback) {
        cardModel.findOne({
          _id: finalResponse.cardDetailsInfo._id
        }).exec(function (err, fetchCardDetails) {
          if (err) {
            callback(err, false);
          } else {
            fetchCardDetails._id = finalResponse.cardDetailsInfo._id;
            fetchCardDetails.balance = fetchCardDetails.balance - cashObj.amount;
            fetchCardDetails.save(function (err, updateCardDetails) {
              if (err) {
                callback(err, false);
              } else {
                finalResponse.updateCardDetails = updateCardDetails;
                callback(null, finalResponse);
              }
            })
          }
        })
      },
      function (finalResponse, callback) {
        var transactionObj = {
          userId: finalResponse.updateCardDetails._id,
          withdrawalAmount: cashObj.amount,
          currentAmount: finalResponse.updateCardDetails.balance,
          withdrawalDate: cashObj.withdrawalDate
        };
        var transactionRecords = new transactionModel(transactionObj);
        transactionRecords.save(function (err, transactionData) {
          if (err) {
            callback(err, false);
          } else {
            finalResponse.transactionDetails = transactionData;
            callback(null, finalResponse);
          }
        });
      },
    ], function (err, data) {
      if (err) {
        res.json({
          code: 400,
          data: {},
          message: "Internal Error"
        });
      } else {
        res.json({
          code: 200,
          data: data,
          message: "Successfull Transaction!"
        });
      }
    });

  }
});

router.post('/getTransactionDetails', function (req, res, next) {
  var finalResponse = {};
  finalResponse.transactionDetails = {};
  finalResponse.twoThousands = {};
  finalResponse.fiveHundreds = {};
  finalResponse.twoHundreds = {};
  finalResponse.oneHundreds = {};
  finalResponse.widthrawlTwoThousandNote = 0;
  finalResponse.widthrawlFiveHundredNote = 0;
  finalResponse.widthrawlTwoHundredNote = 0;
  finalResponse.widthrawlOneHundredNote = 0;
  finalResponse.cashWithrawlAmount = 0;
  finalResponse.remainingAmount = 0;
  finalResponse.totalAmountofAtm = 0;
  var condition = {};
  var transactionObj = {
    _id: req.body._id
  }
  waterfall([
    function (callback) {
      condition._id = transactionObj._id;
      transactionModel.findOne(condition).exec(function (err, transactionDetails) {
        if (err) {
          callback(err, false);
        } else {
          finalResponse.transactionDetails = transactionDetails;
          callback(null, finalResponse);
        }
      })
    },
    function (finalResponse, callback) {
      atmModel.find({}).exec(function (err, atmDetails) {
        if (err) {
          callback(err, false);
        } else {
          finalResponse.atmDetails = atmDetails;
          callback(null, finalResponse);

        }
      })
    },
    function (finalResponse, callback) {
      async.eachSeries(finalResponse.atmDetails, function (singleObject, next) {
        if (singleObject.currency_denomination == 2000) {
          finalResponse.twoThousands = singleObject;
        } else if (singleObject.currency_denomination == 500) {
          finalResponse.fiveHundreds = singleObject;
        } else if (singleObject.currency_denomination == 200) {
          finalResponse.twoHundreds = singleObject;
        } else if (singleObject.currency_denomination == 100) {
          finalResponse.oneHundreds = singleObject;
        } else {
          callback(err, false)
        }
        finalResponse.totalAmountofAtm = (singleObject.currency_denomination * singleObject.count) + finalResponse.totalAmountofAtm;
        next();
      },
        function (err) {
          if (err) {
            callback(err, false)
          } else {
            callback(null, finalResponse);
          }
        })
    },
    function (finalResponse, callback) {

      finalResponse.cashWithrawlAmount = finalResponse.transactionDetails.withdrawalAmount;
      finalResponse.remainingAmount = finalResponse.cashWithrawlAmount;

      for (let i = 1; i <= 4; i++) {
        if (parseInt(finalResponse.remainingAmount / 2000) >= 1) {
          finalResponse.widthrawlTwoThousandNote = parseInt(finalResponse.remainingAmount / 2000);
          finalResponse.remainingAmount = finalResponse.remainingAmount - parseInt(2000 * finalResponse.widthrawlTwoThousandNote)
        } else if (parseInt(finalResponse.remainingAmount / 500) >= 1) {
          finalResponse.widthrawlFiveHundredNote = parseInt(finalResponse.remainingAmount / 500);
          finalResponse.remainingAmount = finalResponse.remainingAmount - (500 * finalResponse.widthrawlFiveHundredNote)
        } else if (parseInt(finalResponse.remainingAmount / 200) >= 1) {
          finalResponse.widthrawlTwoHundredNote = parseInt(finalResponse.remainingAmount / 200);
          finalResponse.remainingAmount = finalResponse.remainingAmount - (200 * finalResponse.widthrawlTwoHundredNote)
        } else if (parseInt(finalResponse.remainingAmount / 100) >= 1) {
          finalResponse.widthrawlOneHundredNote = parseInt(finalResponse.remainingAmount / 100);
          finalResponse.remainingAmount = finalResponse.remainingAmount - (100 * finalResponse.widthrawlOneHundredNote)
        }
      }
      callback(null, finalResponse);
    },
    function (finalResponse, callback) {

      async.eachSeries(finalResponse.atmDetails, function (singleObject, next) {
        atmModel.findOne({
          _id: singleObject._id
        }).exec(function (err, fetchATMDetails) {
          if (err) {
            callback(err, false);
          } else {
            if (fetchATMDetails.currency_denomination == 2000) {
              fetchATMDetails.count = finalResponse.twoThousands.count - finalResponse.widthrawlTwoThousandNote
            } else if (fetchATMDetails.currency_denomination == 500) {
              fetchATMDetails.count = finalResponse.fiveHundreds.count - finalResponse.widthrawlFiveHundredNote
            } else if (fetchATMDetails.currency_denomination == 200) {
              fetchATMDetails.count = finalResponse.twoHundreds.count - finalResponse.widthrawlTwoHundredNote
            } else if (fetchATMDetails.currency_denomination == 100) {
              fetchATMDetails.count = finalResponse.oneHundreds.count - finalResponse.widthrawlOneHundredNote
            }
            fetchATMDetails.save(function (err, updateATMCardDetails) {
              if (err) {
                callback(err, false);
              } else {
                next();
              }
            })
          }
        })

      },
        function (err) {
          if (err) {
            callback(err, false)
          } else {
            callback(null, finalResponse);
          }
        })
    },
  ], function (err, data) {
    if (err) {
      res.json({
        code: 400,
        data: {},
        message: "Internal Error"
      });
    } else {
      res.json({
        code: 200,
        data: data,
        message: "Transaction Details!"
      });
    }
  });
})

module.exports = router;

