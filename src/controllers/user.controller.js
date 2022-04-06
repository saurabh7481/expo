const db = require( "../models" );
const User = db.user;

exports.changeUserSubscription = async ( user, order_id ) => {
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

exports.getUserSubscription = async ( req, res ) => {
	res.status( 200 ).json( req.user.subscription );
};

exports.getLeaderboard = async ( req, res ) => {
	try{
		const data = {};
		const users = await User.findAll();
		await Promise.all(
			users.map( async ( user ) => {
				let totalExp = 0;
				try{
					const expenses = await user.getExpenses();
					expenses.forEach( exp => totalExp += exp.amount );
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

