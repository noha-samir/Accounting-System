const Joi = require('joi');

// schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

// create schema object
const loginSchema = Joi.object().keys({
    mobile: Joi.string().length(11).error(new Error("Invalid Mobile format!!!")),
    password:  Joi.string().min(8).error(new Error("Invalid password format!!!"))
});

module.exports.validLogIn = function (req, res, next) {
    // validate request body against schema
    const { error, value } = loginSchema.validate(req.body, options);
    if (error) {
        // on fail return comma separated errors
        let Err = new Error();
        Err.message = `Validation error: ${error.message}`;
        next(Err);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////

// create schema object
const signUpSchema = Joi.object().keys({
    name: Joi.string().error(new Error("Name must be string!!!")),
    mobile: Joi.string().length(11).error(new Error("Invalid Mobile format!!!")),
    password: Joi.string().min(8).error(new Error("Invalid password format!!!"))
});

module.exports.validSignUp = function (req, res, next) {
    // validate request body against schema
    const { error, value } = signUpSchema.validate(req.body, options);
    if (error) {
        // on fail return comma separated errors
        let Err = new Error();
        Err.message = `Validation error: ${error.message}`;
        next(Err);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}

////////////////////////////////////////////////////////////////////////////////////

const paramsIdSchema = Joi.object().keys({
    userId: Joi.number().positive().integer().error(new Error("ID must be positive integer!!!")),
});

module.exports.validParamsId = function (req, res, next) {
    // validate request body against schema
    const { error, value } = paramsIdSchema.validate(req.params, options);
    if (error) {
        // on fail return comma separated errors
        let Err = new Error();
        Err.message = `Validation error: ${error.message}`;
        next(Err);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}
////////////////////////////////////////////////////////////////////////////////////////

// create schema object
const userInsertionSchema = Joi.object().keys({
    name: Joi.string().error(new Error("Name must be string!!!")),
    mobile: Joi.string().length(11).error(new Error("Invalid Mobile format!!!")),
    password:  Joi.string().min(8).error(new Error("Invalid password format!!!")),
    isAdmin :Joi.boolean().error(new Error("Invalid IsAdmin value!!!"))
});

module.exports.validUserInsertion = function (req, res, next) {
    // validate request body against schema
    const { error, value } = userInsertionSchema.validate(req.body, options);
    if (error) {
        // on fail return comma separated errors
        let Err = new Error();
        Err.message = `Validation error: ${error.message}`;
        next(Err);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}
////////////////////////////////////////////////////////////////////////////////////////

// create schema object
const userModificationSchema = Joi.object().keys({
    id: Joi.number().positive().integer().error(new Error("ID must be positive integer!!!")),
    name: Joi.string().error(new Error("Name must be string!!!")),
    mobile: Joi.string().length(11).error(new Error("Invalid Mobile format!!!")),
    password:  Joi.string().min(8).error(new Error("Invalid password format!!!")),
    isAdmin :Joi.boolean().error(new Error("Invalid IsAdmin value!!!"))
});

module.exports.validUserModification = function (req, res, next) {
    // validate request body against schema
    const { error, value } = userModificationSchema.validate(req.body, options);
    if (error) {
        // on fail return comma separated errors
        let Err = new Error();
        Err.message = `Validation error: ${error.message}`;
        next(Err);
    } else {
        // on success replace req.body with validated value and trigger next middleware function
        req.body = value;
        next();
    }
}