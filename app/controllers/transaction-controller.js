var Transaction = require('../models/transaction-model');
var ConnectionSteps = require('../../helper/connection-steps');
const constants = require('../../constants');

module.exports.controllerGetAllTransactions = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aTransaction = new Transaction();
        aTransaction.getAllTransactions(connection, function (err, listOfTransactions) {
            callback(err, listOfTransactions);
        });
    });
};

module.exports.controllerGetTransactionById = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aTransaction = new Transaction();
        aTransaction.id = req.params.transactionId;
        aTransaction.getTransactionById(connection, aTransaction.id, function (err, aTransaction) {
            callback(err, aTransaction);
        });
    });
};

module.exports.controllerInsertTransaction = function (req, res, next) {
    var aConnectionSteps = new ConnectionSteps();
    aConnectionSteps.controllerSteps(req, res, next, function (connection, callback) {
        let aTransaction = new Transaction();
        aTransaction.amount = req.body.amount;
        let receiverMobile = req.body.receiverMobile;
        aTransaction.insertTransaction(connection, aTransaction,req.user.id,receiverMobile, function (err, aTransaction) {
            callback(err, aTransaction);
        });
    });
};