/* eslint-disable no-mixed-spaces-and-tabs */
const db = require( "../models" );
const User = db.user;
const bcrypt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );
const sgMail = require( "@sendgrid/mail" );

sgMail.setApiKey( process.env.SENDGRID_KEY );

exports.signup = async ( req, res ) => {
	try {
		const user = await User.create( {
			username: req.body.username,
			email: req.body.email,
			phone: req.body.phone,
			password: bcrypt.hashSync( req.body.password, 8 ),
			subscription: "standard"
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

	res.cookie( "token", token, {
		httpOnly: true, 
		expire: new Date() + 8 * 3600 } 
	);

	const { username, subscription } = user;
	return res.status( 200 ).json( { token, user: { username, email, subscription } } );
};

exports.forgotPassword = async ( req, res ) => {
	const email = req.body.email;

	const msg = {
		to: email, 
		from: "saurabh7481@gmail.com",
		subject: "Sending with SendGrid is Fun",
		text: "and easy to do anywhere, even with Node.js",
		html: "<strong>and easy to do anywhere, even with Node.js</strong>",
	  };
	  
	  try{
		const response = await sgMail.send( msg );
		res.json( { success: true, response: response } );
	  } catch( err ) {
		  res.json( { success: false, error: err } );
	  }
};