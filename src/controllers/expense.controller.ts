import {Request, Response} from "express";
import db from "../models/index";
const User = db.user;

interface RequestExtended extends Request {
	user?: typeof User
}

export const addExpense = async ( req: RequestExtended, res: Response ) => {
	try {
		const expense = await req.user.createExpense( {
			description: req.body.description,
			amount: req.body.amount,
			category: req.body.category,
		} );

		if ( expense ) res.send( { message: "Expense Added!" } );
	} catch ( error: any ) {
		res.status( 500 ).send( { message: error.message } );
	}
};

