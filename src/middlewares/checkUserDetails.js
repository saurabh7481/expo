const db = require( "../models" );
const User = db.user;
const checkUserDetails = async ( req, res, next ) => {
	try {
		let user = await User.findOne( {
			where: {
				username: req.body.username
			}
		} );
		if ( user ) {
			return res.status( 400 ).send( {
				message: "Username is taken, try something else!"
			} );
		}
		user = await User.findOne( {
			where: {
				email: req.body.email
			}
		} );
		if ( user ) {
			return res.status( 400 ).send( {
				message: "Email is taken, try something else!"
			} );
		}
		next();
	} catch ( error ) {
		return res.status( 500 ).send( {
			message: "Oops! Something went wrong. Try again later"
		} );
	}
};

module.exports = checkUserDetails;