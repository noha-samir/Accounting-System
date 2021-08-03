var router = require('express').Router();
var TransactionController = require('../controllers/transaction-controller');
var TransactionValidation = require('../validations/transaction-validation');

router.get('/all', TransactionController.controllerGetAllTransactions);

router.get('/:transactionId',TransactionValidation.validParamsId, TransactionController.controllerGetTransactionById);

router.post('/',TransactionValidation.validTransactionInsertion, TransactionController.controllerInsertTransaction);

module.exports = router;