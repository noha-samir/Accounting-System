var async = require('async');
const constants = require('../../constants');
var CRUD = require('../../helper/crud');

function User() {
    this.id = null;
    this.name = null;
    this.mobile = null;
    this.password = null;
    this.ballance = null;
    this.token = null;
    this.createdBy = null;
    this.updatedBy = null;
    this.createdOn = null;
    this.updatedOn = null;
    this.isAdmin = null;
}

function userMapping(userRow) {
    let aUser = new User();
    aUser.id = userRow.Id;
    aUser.name = userRow.Name;
    aUser.mobile = userRow.Mobile;
    aUser.password = userRow.Password;
    aUser.ballance = userRow.Ballance;
    aUser.token = userRow.Token;
    aUser.createdBy = userRow.CreatedBy;
    aUser.updatedBy = userRow.UpdatedBy;
    aUser.createdOn = userRow.CreatedOn;
    aUser.updatedOn = userRow.UpdatedOn;
    aUser.isAdmin = userRow.IsAdmin;
    return aUser;
};

User.prototype.getUserById = function (gConnection, id, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.getObjectById(gConnection,constants.userTableName,id,function (err,returnedObj) {
                if(err){
                    callback(err);
                }else{
                    let mappedObj = userMapping(returnedObj);
                    callback(null,mappedObj);
                }
            });
        }
    ], function (err,mappedObj) {
        finalCallback(err, mappedObj);
    });
};

User.prototype.checkCredentials = function (gConnection, mobile, password, finalCallback) {

    async.waterfall([
        function (callback) {
            var queryString = "select * from [AccountingDB].[dbo].[User] where Mobile = '" + mobile + "';";
            gConnection.query(queryString, (err, result) => {
                if (!err) {
                    if (result.recordsets[0].length > 0) {
                        let returnedUser = userMapping(result.recordsets[0][0]);
                        if (returnedUser != null && returnedUser.password == password) {
                            callback(null, returnedUser);
                        } else {
                            callback(null);
                        }
                    } else {
                        let Err = new Error();
                        Err.message = "No user with this Mobile!!!";
                        callback(Err);
                    }
                }
                else {
                    callback(err);
                }
            });
        }
    ], function (err, user) {
        finalCallback(err, user);
    });

};

User.prototype.updateUserToken = function (gConnection, user, token, finalCallback) {
    async.waterfall([
        function (callback) {
            var queryString = "update [AccountingDB].[dbo].[User] set Token = '" + token + "' where Id = " + user.id + ";";
            gConnection.query(queryString, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    if (result.rowsAffected.length > 0) {
                        user.token = token;
                        callback(null, user);
                    }
                    else {
                        var Err = new Error();
                        Err.message = "Err in update token!!!";
                        callback(Err);
                    }
                }
            });
        }
    ], function (err, user) {
        finalCallback(err, user);
    });
};

User.prototype.getUserAuth = function (gConnection, userId, finalCallback) {
    var self = this;
    self.id = userId;
    async.waterfall([
        function (callback) {
            var queryString = "SELECT Token FROM [AccountingDB].[dbo].[User] where Id = " + self.id + ";";
            gConnection.query(queryString, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    if (result.recordsets[0].length > 0) {
                        self.token = result.recordsets[0][0].Token;
                        callback(null);
                    }
                    else {
                        let Err = new Error();
                        Err.message = "No user with this token!!!";
                        callback(Err);
                    }
                }
            });
        }
    ], function (err) {
        finalCallback(err, self);
    });

};

User.prototype.getAllUsers = function (gConnection, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.getAllObjects(gConnection,constants.userTableName,function (err,returnedArr) {
                if(err){
                    callback(err);
                }else{
                    callback(null,returnedArr);
                }
            });
        },
        function (listOfUsers, callback) {
            let outputList = [];
            listOfUsers.forEach(element => {
                outputList.push(userMapping(element));
            });
            callback(null, outputList);
        }
    ],
        function (err, outputList) {
            finalCallback(err, outputList);
        });
};

User.prototype.insertUser = function (gConnection, user, finalCallback) {
    async.waterfall([
        //check redundancy
        function (callback) {
            let aUser = new User();
            aUser.checkMobile(gConnection, user.mobile, function (err, found) {
                if (err) {
                    callback(err);
                } else {
                    if (found == true) {
                        var Err = new Error();
                        Err.message = "This mobile is already exist!!!";
                        callback(Err);
                    } else {
                        callback(null);
                    }
                }
            });
        },
        function (callback) {
                let aCRUD = new CRUD();
                let ValuesString = "'"+ user.name + "','" + user.mobile + "','" + user.password + "',"
                + constants.initialBalance +","+ user.isAdmin +","+ user.createdBy + "," + user.updatedBy + ",GETDATE()," 
                + user.updatedOn +","+ user.token
    
                aCRUD.insertObject(gConnection,constants.userTableName,constants.userColsString,ValuesString,function (err,insertedId) {
                    if(err){
                        callback(err);
                    }else{
                        callback(null,insertedId);
                    }
                });
        },
        function (insertedId, callback) {
            let aUser = new User();
            aUser.getUserById(gConnection, insertedId, function (err, aUser) {
                callback(err, aUser);
            });
        }
    ],
        function (err, user) {
            finalCallback(err, user);
        });
};

User.prototype.checkMobile = function (gConnection, mobile, finalCallback) {
    async.waterfall([
        function (callback) {
            var queryString = "select * from [AccountingDB].[dbo].[User] where mobile = '" + mobile + "';";
            gConnection.query(queryString, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    if (result.recordsets[0].length > 0) {
                        callback(null, true, result.recordsets[0][0].Id);
                    }
                    else {
                        callback(null, false);
                    }
                }
            });
        }
    ],
        function (err, found, userId) {
            finalCallback(err, found, userId);
        });
};

User.prototype.updateUser = function (gConnection, user, finalCallback) {
    async.waterfall([
        function (callback) {
            let aUser = new User();
            aUser.checkMobile(gConnection, user.mobile, function (err, found,userID) {
                if (err) {
                    callback(err);
                } else {
                    if (user.id != userID && found == true) {
                        var Err = new Error();
                        Err.message = "This mobile is already exist!!!";
                        callback(Err);
                    } else {
                        callback(null);
                    }
                }
            });
        },
        function (callback) {

            var sets = " set Name = '" + user.name + "', Mobile= '" + user.mobile + "',Password = '" + user.password + "', "
                + "UpdatedBy = " + user.updatedBy + ",UpdatedOn = GETDATE(), "
                + "IsAdmin = '" + user.isAdmin + "'"

            let aCRUD = new CRUD();
            aCRUD.updateObject(gConnection,constants.userTableName,sets,user.id,function(err,user){
                callback(err, user);
            });

        }
    ],
        function (err, user) {
            finalCallback(err, user);
        });
};

User.prototype.deleteUser = function (gConnection, userID, finalCallback) {
    async.waterfall([
        function (callback) {
            let aCRUD = new CRUD();
            aCRUD.deleteAllRecordsRelatedToUser(gConnection, constants.transactionTableName, userID, function (err) {
                callback(err);
            });
        },
        function (callback) {
            let aUser = new User();
            aUser.getUserById(gConnection, userID, function (err, aUser) {
                callback(err, aUser);
            });
        },
        function (aUser,callback) {
            let aCRUD = new CRUD();
            aCRUD.deleteObject(gConnection,constants.userTableName,userID,function(err){
                callback(err,aUser);
            });
        }
    ],
        function (err, user) {
            finalCallback(err, user);
        });
};

module.exports = User;