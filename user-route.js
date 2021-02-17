var router = require('express').Router();
var UserController = require('./user-controller');

router.get('/topFavouriteMoviesAmongFriends/:userId', UserController.topFavouriteMoviesAmongFriends);

module.exports = router;