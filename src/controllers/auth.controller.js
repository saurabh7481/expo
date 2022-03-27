const db = require( "../models" );
const User = db.user;
const bcrypt = require( "bcryptjs" );
exports.signup = async ( req, res ) => {
	try {
		const user = await User.create( {
			username: req.body.username,
			email: req.body.email,
			phone: req.body.phone,
			password: bcrypt.hashSync( req.body.password, 8 ),
		} );

		if ( user ) res.send( { message: "User registered successfully!" } );
	} catch ( error ) {
		res.status( 500 ).send( { message: error.message } );
	}
};