var router = require('express').Router();
var constants = require("./constants");
var UserController = require('./app/controllers/user-controller');

//Allow CORS
router.use(function (req, res, next) {
    // .. some logic here .. like any other middleware
    global.req=req;

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, X-Custom-Header, Content-Type, Accept, Authorization, errorcode, errormessage, server-name ,version-number,x-access-token,platform-number');
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    res.header('Access-Control-Expose-Headers', "errorcode, errormessage, server-name");

    //Add server name 
    res.header('server-name', 'your-server');

    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
        return;
    }
    next();
});

router.use(function (req, res, next) {
    //Authentication logic
    if (req.url == "/v1/user/login" || req.url == "/v1/user/signup") {
        next();
    } else {
        var token = req.headers['x-access-token'];
        if (!token) {
            res.status(403).send({ auth: false, message: 'No token provided.' });
        }
        else {
            UserController.verifyToken(token, function (err, aUser) {
                req.user = aUser;
                next(err);
            });
        }
    }
});

//All APIs
router.use('/v1/user', require('./app/routes/user-route'));
router.use('/v1/transaction', require('./app/routes/transaction-route'));

module.exports = router;