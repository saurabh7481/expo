/* eslint-disable no-mixed-spaces-and-tabs */
import db from "../models";
const User = db.user;
const ResetPasswordRequest = db.ResetPasswordRequest;
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import path from "path";
import {Request, Response} from "express";

sgMail.setApiKey( process.env.SENDGRID_KEY ?? "" );

export const signUp = async ( req: Request, res: Response ) => {
	try {
		const user = await User.create( {
			username: req.body.username,
			email: req.body.email,
			phone: req.body.phone,
			password: bcrypt.hashSync( req.body.password, 8 ),
			subscription: "standard"
		} );

		if ( user ) res.send( { message: "User registered successfully!" } );
	} catch ( error: any ) {
		res.status( 500 ).send( { message: error.message } );
	}
};

export const login = async ( req: Request, res: Response ) => {
	const { email, password } = req.body;
	const user = await User.findOne( {
		where: {
			email: email
		}
	} );
	if ( !user ) return res.status( 404 ).json( { error: "User does not exists" } );

	const validPass = await bcrypt.compare( password, user.password );
	if ( !validPass ) return res.status( 401 ).json( { error: "Invalid Credentials" } );

	const token = jwt.sign( { id: user.id }, process.env.JWT_SECRET ?? "" );

	res.cookie( "token", token, {
		httpOnly: true,
		expires: new Date(Date.now() + 90000)	
	});

	const {  username, subscription } = user;
	return res.status( 200 ).json( { token, user: {  username, email, subscription } } );
};

export const forgotPassword = async ( req: Request, res: Response ) => {
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

export const resetPassword = async ( req: Request, res: Response ) => {
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

export const updatePassword = async ( req: Request, res: Response ) => {
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

export const logout = (req: Request, res: Response) => {
	res.clearCookie("token");
	return res.redirect("/");
}