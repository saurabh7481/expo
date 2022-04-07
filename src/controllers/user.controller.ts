import db from "../models";
const User = db.user;
import {Request, Response} from "express";

interface UserInt {
	id: number,
	getExpenses: () => any,
	username: string
}

interface RequestExtended extends Request {
	user?: any
}

type Data = {
	[key: string]: any
}

const changeUserSubscription = async ( user: UserInt, order_id: string ) => {
	try {
		await User.update( { subscription: "plus", orderID: order_id }, 
			{
				where: {
					id: user.id
				}
			} );
	} catch( err ){
		console.log( err );
	}
};

const getUserSubscription = async ( req: RequestExtended, res: Response ) => {
	res.status( 200 ).json( req.user.subscription );
};

const getLeaderboard = async ( req: RequestExtended, res: Response ) => {
	try{
		const data: Data = {};
		const users = await User.findAll();
		await Promise.all(
			users.map( async ( user: UserInt ) => {
				let totalExp = 0;
				try{
					const expenses = await user.getExpenses();
					expenses.forEach( (exp: any) => totalExp += exp.amount );
				} catch( err ) {
					console.log( err );
				}
				data[user.username] = totalExp;
			} )
		);
		res.status( 200 ).json( { expenses: data } );
	} catch( err ) {
		console.log( err );
	}
};

export default {
	changeUserSubscription,
	getUserSubscription,
	getLeaderboard
};
