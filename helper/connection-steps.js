var conn = require('../database');
var async = require('async');

function Helper() {
}

Helper.prototype.controllerSteps = function (req, res, next, UserAction) {
    let aConnection = null;
    let aTransaction = null;
    async.waterfall([
        function (callback) {
            conn.connectToSql(function (err, connection,transaction) {
                aConnection = connection;
                aTransaction = transaction;
                callback(err);
            });
        }, 
        function (callback) {
            UserAction(aConnection, function (err, returnedObject) {
                callback(err, returnedObject);
            });
        }
    ],
        function (err, output) {
            conn.closeSqlConnection(err, aConnection,aTransaction, function (err) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json(output);
                }
            });
        }
    );
};

module.exports = Helper;

