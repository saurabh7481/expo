const express = require( "express" );
const router = express.Router();

const verifyAuth = require( "../middlewares/verifyAuth" );
const { getUserSubscription } = require( "../controllers/user.controller" );

router.get( "/getsubscription", verifyAuth, getUserSubscription );

module.exports = router;