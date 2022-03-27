const express = require( "express" );
const router = express.Router();

const checkDetails = require( "../middlewares/checkUserDetails" );
const authController = require( "../controllers/auth.controller" );

router.post( "/signup", checkDetails, authController.signup );
router.post( "/login", authController.login );

module.exports = router;