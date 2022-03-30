const jwt = require( "jsonwebtoken" );
const config = process.env;

const db = require( "../models" );
const User = db.user;

const verifyAuth = async ( req, res, next ) => {
	const token = req.cookies.token;
	if ( !token ) {
		return res.status( 403 ).send( "Unauthorized" );
	}
	try {
		const decode = jwt.verify( token, config.JWT_SECRET );
		const user = await User.findByPk( decode.id );
		if( user ) req.user = user;
	} catch ( err ) {
		console.log( err );
		return res.status( 401 ).send( "Invalid Authorization" );
	}
	return next();
};

module.exports = verifyAuth;