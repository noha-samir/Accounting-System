var User = require('./user-model');

module.exports.topFavouriteMoviesAmongFriends = function (req, res, next) {
        let aUser = new User();
        aUser.userId = req.params.userId;
        aUser.topFavouriteMoviesAmongFriends(function (err, outputArr) {
            if (err) {
                next(err);
            }
            else {
                res.status(200).json(outputArr);
            }
        });
};