
module.exports = Object.freeze({
    userTableName: "User",
    userColsString: "Name,Mobile,Password,Ballance,IsAdmin,CreatedBy,UpdatedBy,CreatedOn,UpdatedOn,Token",
    transactionTableName: "Transaction",
    transactionColsString:"SenderId,ReceiverId,Amount,Date",
    initialBalance:1000
});