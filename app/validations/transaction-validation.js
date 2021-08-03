const Joi = require('joi');

// schema options
const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

////////////////////////////////////////////////////////////////////////////////////

const paramsIdSchema = Joi.object().keys({
    transactionId: Joi.number().positive().integer().error(new Error("ID must be positive integer!!!")),
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
const transactionInsertionSchema = Joi.object().keys({
    amount : Joi.number().positive().error(new Error("amount must be positive number!!!")),
    receiverMobile: Joi.string().length(11).error(new Error("Invalid Mobile format!!!!!!")),
});

module.exports.validTransactionInsertion = function (req, res, next) {
    // validate request body against schema
    const { error, value } = transactionInsertionSchema.validate(req.body, options);
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