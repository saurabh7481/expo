import express from "express";
const router = express.Router();

import checkDetails from "../middlewares/checkUserDetails";
import {signUp, login, forgotPassword, resetPassword, updatePassword, logout} from "../controllers/auth.controller";

router.post( "/signup", checkDetails, signUp );
router.post( "/login", login );
router.post( "/password/forgotpassword", forgotPassword );
router.get( "/password/resetpassword/:id", resetPassword );
router.post( "/password/updatepassword", updatePassword );
router.get("/logout", logout);

export default router;