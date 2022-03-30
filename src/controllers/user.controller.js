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