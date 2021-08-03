var async = require('async');
const constants = require('../../constants');
var CRUD = require('../../helper/crud');
var User = require('./user-model');
var extraFunctions = require('../../helper/extraFunctions');

function Transaction() {
    this.id = null;
    this.senderId = null;
    this.receiverId = null;
    this.amount = null;
    this.date = null;
}

function transactionMapping(transactionRow) {
    let aTransaction = new Transaction();
    aTransaction.id = transactionRow.Id;
    aTransaction.senderId = transactionRow.SenderId;
    aTransaction.receiverId = transactionRow.ReceiverId;
    aTransaction.amount = transactionRow.Amount;
    aTransaction.date = transactionRow.Date;
    return aTransaction;       
};

Transaction.prototype.getTransactionById = function (gConnection, id, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.getObjectById(gConnection,constants.transactionTableName,id,function (err,returnedObj) {
                if(err){
                    callback(err);
                }else{
                    let mappedObj = transactionMapping(returnedObj);
                    callback(null,mappedObj);
                }
            });
        }
    ], function (err,mappedObj) {
        finalCallback(err, mappedObj);
    });
};

Transaction.prototype.getAllTransactions = function (gConnection, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.getAllObjects(gConnection,constants.transactionTableName,function (err,returnedArr) {
                if(err){
                    callback(err);
                }else{
                    callback(null,returnedArr);
                }
            });
        },
        function (listOfTransactions, callback) {
            let outputList = [];
            listOfTransactions.forEach(element => {
                outputList.push(transactionMapping(element));
            });
            callback(null, outputList);
        }
    ],
        function (err, outputList) {
            finalCallback(err, outputList);
        });
};

Transaction.prototype.insertTransaction = function (gConnection, transaction,SenderId,receiverMobile, finalCallback) {
    async.waterfall([
        //get Receiver by mobile number
        function(callback) {
            let queryString = "SELECT * FROM [AccountingDB].[dbo].["+constants.userTableName+"] WHERE Mobile = '"+receiverMobile+ "'";
            gConnection.query(queryString, (err, result) => {
                if (!err) {
                    if (result.recordsets[0].length > 0) {
                        callback(null, result.recordsets[0][0]);
                    }
                    else {
                        let Err = new Error();
                        Err.message = "No " + tableName + " with this mobile number !!!";
                        callback(Err);
                    }
                } else {
                    callback(err);
                }
            });
        },
        //check Receiver existance
        function(receiver,callback) {
            let aUser = new User();
            aUser.getUserById(gConnection, receiver.Id, function (err, Receiver) {
                callback(err,Receiver);
            });
        },
        //make the transaction
        function (Receiver,callback) {
            let queryString = "IF (SELECT Ballance FROM [AccountingDB].[dbo].["+constants.userTableName+"] WITH (UPDLOCK, INDEX(USRINDEX)) WHERE Id ="+SenderId+") >= "+transaction.amount
            + " BEGIN "
            + " update [AccountingDB].[dbo].[User] set Ballance = (select Ballance from [AccountingDB].[dbo].["+constants.userTableName+"] where Id ="+SenderId+" ) - '"+transaction.amount+"' where Id = "+SenderId+" "
            + " update [AccountingDB].[dbo].[User] set Ballance = (select Ballance from [AccountingDB].[dbo].["+constants.userTableName+"] where Id = "+Receiver.id+" ) + '"+transaction.amount+"' where Id = "+Receiver.id+" "
            + " END ";
            gConnection.query(queryString, (err, result) => {
                if (!err) {
                    if (result.rowsAffected.length == 2) {
                        callback(null,Receiver);
                    }
                    else {
                        let Err = new Error();
                        Err.message = "No enough money ballance in your account!!!";
                        callback(Err);
                    }
                } else {
                    callback(err);
                }
            });
        },
        //insert transaction obj
        function(Receiver,callback){
            let aCRUD = new CRUD();
            let ValuesString = "'"+SenderId + "'," + Receiver.id + ",'" + transaction.amount + "',"
            + " GETDATE()";
     
            aCRUD.insertObject(gConnection,constants.transactionTableName,constants.transactionColsString,ValuesString,function (err,insertedId) {
                if(err){
                    callback(err);
                }else{
                    callback(null,insertedId);
                }
            });
        },
        function (insertedId, callback) {
            let aTransaction = new Transaction();
            aTransaction.getTransactionById(gConnection, insertedId, function (err, aTransaction) {
                callback(err, aTransaction);
            });
        }
    ],
        function (err, transaction) {
            finalCallback(err, transaction);
        });
};

module.exports = Transaction;