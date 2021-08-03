var router = require('express').Router();
var UserController = require('../controllers/user-controller');
var UserValidation = require('../validations/user-validation');

router.post('/login', UserValidation.validLogIn, UserController.controllerLogin);
//pattern('^(((0))[0-9]{10})$').
router.post('/signup', UserValidation.validSignUp, UserController.controllerSignup);

router.get('/all', UserController.controllerGetAllUsers);

router.get('/:userId',UserValidation.validParamsId, UserController.controllerGetUserById);

router.post('/',UserValidation.validUserInsertion, UserController.controllerInsertUser);

router.put('/', UserValidation.validUserModification, UserController.controllerUpdateUser);

module.exports = router;