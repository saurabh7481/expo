import {Request, Response} from "express";

interface RequestExtended extends Request {
	user?: any
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

