/* eslint-disable no-mixed-spaces-and-tabs */
const db = require( "../models" );
const User = db.user;
const ResetPasswordRequest = db.ResetPasswordRequest;
const bcrypt = require( "bcryptjs" );
const crypto = require( "crypto" );
const jwt = require( "jsonwebtoken" );
const sgMail = require( "@sendgrid/mail" );
const path = require( "path" );

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

	const {  username, subscription } = user;
	return res.status( 200 ).json( { token, user: {  username, email, subscription } } );
};

exports.forgotPassword = async ( req, res ) => {
	try{
		const email = req.body.email;
		const user = await User.findOne( {
			where: {
				email: email
			}
		} );

		const req_id = crypto.randomUUID();
		await user.createResetpasswordrequest( {
			id: req_id,
			isActive: true
		} );

		const url = `http://localhost:3000/api/password/resetpassword/${req_id}`;
		const msg = {
			to: email, 
			from: "saurabh7481@gmail.com",
			subject: "Your reset password link",
			text: "Here is your reset password link",
			html: `<h3>Here is your reset password link<h3><br/><br/>${url}`,
	  };

	    const response = await sgMail.send( msg );
		res.json( { success: true, response: response } );
	} catch( err ){
		res.json( { success: false, error: err } );
	}
};

exports.resetPassword = async ( req, res ) => {
	try{
		const req_id = req.params.id;

		const request = await ResetPasswordRequest.findByPk( req_id );
		if( request.isActive ){
			console.log( path.join( __dirname , ".." , "/utils/resetPassword.html" ) );
			res.sendFile( path.join( __dirname , ".." , "/utils/resetPassword.html" ) );
		} else {
			res.json( { success: false, message: "Something went wrong! Please try again." } );
		}
	} catch( err ){
		res.json( { success: false, message: "Something went wrong! Please try again." } );
	}
	

};

exports.updatePassword = async ( req, res ) => {
	try {
		const email = req.body.email;
		const user = await User.findOne( {
			where: {
				email: email
			}
		} );

		const newPass = bcrypt.hashSync( req.body.password, 8 );
		user.password = newPass;
		await user.save();

		const request = await ResetPasswordRequest.findOne( {
			user_id: user.id
		} );

		request.isActive = false;
		await request.save();

		res.status( 200 ).json( { success: true, message: "Password updated!" } );
	} catch ( error ) {
		res.json( { error: error } );
	}
};