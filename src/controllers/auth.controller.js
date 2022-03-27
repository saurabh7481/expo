const db = require( "../models" );
const User = db.user;
const bcrypt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );
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

exports.login = async ( req, res ) => {
	const { email, password } = req.body;
	const user = await User.findOne( {
		where: {
			email: email
		}
	} );
	if ( !user ) return res.status( 404 ).json( { error: "User does not exists" } );

	const validPass = await bcrypt.compare( password, user.password );
	if ( !validPass ) return res.status( 401 ).json( { error: "Invalid Credentials" } );

	const token = jwt.sign( { id: user.id }, process.env.JWT_SECRET );

	res.cookie( "t", token, { expire: new Date() + 8 * 3600 } );

	const { username } = user;
	return res.status( 200 ).json( { token, user: { username, email } } );
};
