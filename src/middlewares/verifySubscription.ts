import {Request, Response, NextFunction} from "express";

interface RequestExtended extends Request {
	user?: any
}

const verifySubscription = async ( req: RequestExtended, res: Response, next: NextFunction ) => {
	const sub = req.user.subscription;
	if( sub === "plus" ){
		next();
	} else {
		res.status( 401 ).json( { success: false } );
	}
};

export default verifySubscription;