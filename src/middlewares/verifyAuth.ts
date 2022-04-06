import jwt from "jsonwebtoken";
const config = process.env;

import db from "../models";
const User = db.user;

import {Request, Response, NextFunction} from "express";

interface RequestExtended extends Request {
	user?: any
}

interface JWT {
	id: any
}

const verifyAuth = async ( req: RequestExtended, res: Response, next: NextFunction ) => {
	const token = req.cookies.token;
	if ( !token ) {
		return res.status( 403 ).send( "Unauthorized" );
	}
	try {
		const decode = jwt.verify( token, config.JWT_SECRET ?? "" ) as JWT;
		const user = await User.findByPk( decode.id );
		if( user ) req.user = user;
	} catch ( err ) {
		console.log( err );
		return res.status( 401 ).send( "Invalid Authorization" );
	}
	return next();
};

export default verifyAuth;
