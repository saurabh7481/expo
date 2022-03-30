const express = require( "express" );
const router = express.Router();

const verifyAuth = require( "../middlewares/verifyAuth" );
const expenseController = require( "../controllers/expense.controller" );

router.post( "/addexpense", verifyAuth, expenseController.addExpense );

module.exports = router;