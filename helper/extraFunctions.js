
function Helper() {
}

Helper.prototype.convertDateToSQLDate = function (date) {
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth() + 1;
    let day = new Date(date).getDate();
    let hours = new Date(date).getHours();
    let mins = new Date(date).getMinutes();
    let sec = new Date(date).getSeconds();
    let sqlDate =  year + "-" + month + "-" + day +" " + hours + ":" + mins + ":" + sec ;
    return sqlDate;
};

module.exports = Helper;

