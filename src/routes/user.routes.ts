import express from "express";
const router = express.Router();

import verifyAuth from "../middlewares/verifyAuth";
import verifySubscription from "../middlewares/verifySubscription";
import userController from "../controllers/user.controller";

router.get( "/getsubscription", verifyAuth, userController.getUserSubscription );
router.get( "/leaderboard", verifyAuth, verifySubscription, userController.getLeaderboard );

export default router;