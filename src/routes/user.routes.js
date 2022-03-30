const express = require( "express" );
const router = express.Router();

const verifyAuth = require( "../middlewares/verifyAuth" );
const verifySubscription = require( "../middlewares/verifySubscription" );
const userController = require( "../controllers/user.controller" );

router.get( "/getsubscription", verifyAuth, userController.getUserSubscription );
router.get( "/leaderboard", verifyAuth, verifySubscription, userController.getLeaderboard );

module.exports = router;