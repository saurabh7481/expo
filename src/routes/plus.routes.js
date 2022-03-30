const express = require( "express" );
const router = express.Router();

const verifyAuth = require( "../middlewares/verifyAuth" );
const plusController = require( "../controllers/plus.controller" );

router.post( "/createOrder", verifyAuth, plusController.createOrder );
router.post( "/verifyOrder", verifyAuth, plusController.verifyOrder );

module.exports = router;