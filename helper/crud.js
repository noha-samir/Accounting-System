var async = require('async');

function CRUD() {

}

CRUD.prototype.getObjectById = function (gConnection, tableName, id, finalCallback) {
    async.waterfall([
        function (callback) {
            var queryString = "select * from [AccountingDB].[dbo].[" + tableName + "] where Id = " + id + ";";
            gConnection.query(queryString, (err, result) => {
                if (!err) {
                    if (result.recordsets[0].length > 0) {
                        callback(null, result.recordsets[0][0]);
                    }
                    else {
                        let Err = new Error();
                        Err.message = "No " + tableName + " with this ID!!!";
                        callback(Err);
                    }
                } else {
                    callback(err);
                }
            });
        }
    ], function (err, returnedObj) {
        finalCallback(err, returnedObj);
    });
};

CRUD.prototype.getAllObjects = function (gConnection, tableName, finalCallback) {
    async.waterfall([
        function (callback) {
            var queryString = "select * from [AccountingDB].[dbo].[" + tableName + "] order by Id desc ;";
            gConnection.query(queryString, (err, result) => {
                if (err)
                    callback(err);
                else
                    callback(null, result.recordsets[0]);
            });
        }
    ], function (err, returnedArr) {
        finalCallback(err, returnedArr);
    });
};

CRUD.prototype.insertObject = function (gConnection, tableName, cols, values, finalCallback) {
    async.waterfall([
        function (callback) {
            var queryString = "insert into [AccountingDB].[dbo].[" + tableName + "] "
                + " (" + cols + ") "
                + " OUTPUT inserted.Id"
                + " values(" + values + ") ;";

            gConnection.query(queryString, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    if (result.recordsets[0].length > 0) {
                        insertedId = result.recordsets[0][0].Id;
                        callback(null, insertedId);
                    }
                    else {
                        var Err = new Error();
                        Err.message = "Err in " + tableName + " insertion!!!";
                        callback(Err);
                    }
                }
            });
        }
    ], function (err, insertedId) {
        finalCallback(err, insertedId);
    });
};

CRUD.prototype.updateObject = function (gConnection, tableName, Sets, id, finalCallback) {
    async.waterfall([
        function (callback) {
            var queryString = "update [AccountingDB].[dbo].["+tableName+"] "
                + Sets 
                + " where Id = " + id + ";";

            gConnection.query(queryString, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    if (result.rowsAffected.length > 0) {
                        let aCRUD = new CRUD();
                        aCRUD.getObjectById(gConnection,tableName,id, function (err, returnedObj) {
                            callback(err, returnedObj);
                        });
                    }
                    else {
                        var Err = new Error();
                        Err.message = "Err in "+tableName+" modification!!!";
                        callback(Err);
                    }
                }
            });
        }
    ], function (err, returnedObj) {
        finalCallback(err, returnedObj);
    });
};

module.exports = CRUD;
