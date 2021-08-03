var async = require('async');
const sql = require('mssql/msnodesqlv8');
require('dotenv').config();
//msnodesqlv8 module is requiered for Windows Authentication without using Username and Password

const pool = new sql.ConnectionPool({
    database: process.env.DATABASE,
    server: process.env.WINDOWSAUTHSERVER,
    driver: process.env.DRIVER,
    options: {
        trustedConnection: true
    }
});

module.exports.connectToSql = function (finalCallback) {

    async.waterfall([
        function (callback) {
            try { 
                pool.connect().then(() => {
                    callback(null, pool);
                });
                
            } catch (error) {
                callback(error);
            }
        },
        function (aConnection,callback) {
            try {
                const transaction = aConnection.transaction();
                transaction.begin().then(() => {
                    callback(null, aConnection,transaction);
                });
                
            } catch (error) {
                callback(error);
            }
        }
    ], function (err, aConnection,transaction) {
        finalCallback(err, aConnection,transaction);
    })
}

module.exports.closeSqlConnection = function (err, aConnection,aTransaction, callback) {

    if (!aConnection) {
        let error = new Error();
        error.code = "DATABASE_ERROR";
        error.developerMessage = "DB Connection error";
        error.message = "Something went wrong..";
        callback(error);
    }
    else if (err) {
        aTransaction.rollback(function () {
            aConnection.close();
            callback(err);
        });
    }
    else {
        aTransaction.commit((function (err) {
            if (err) {
                aTransaction.rollback(function () {
                    aConnection.close();
                    callback(err);
                });
            }
            else {
                aConnection.close();
                callback(null);
            }
        }));
    }
}

module.exports.pool = pool;