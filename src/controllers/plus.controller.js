const razorpayInstance = require( "../utils/razorpay" );
const crypto = require( "crypto" );

const userController = require( "./user.controller" );

exports.createOrder = async ( req, res ) => {
	const { amount,currency,receipt, notes }  = req.body;      
          
	try{
		const order = await razorpayInstance.orders.create( { amount, currency, receipt, notes } );
		console.log( "order", order );
		if( order ){
			res.json( { order: order, key: process.env.RAZORPAY_ID } );
		}
	} catch( err ){
		res.status( 500 ).send( err );
	}
};

exports.verifyOrder = async ( req, res ) => {
	const {
		razorpay_order_id,
		razorpay_payment_id,
		razorpay_signature
	} = req.body;

	const key_secret = process.env.RAZORPAY_SECRET;     

	let hmac = crypto.createHmac( "sha256", key_secret ); 
  
	hmac.update( razorpay_order_id + "|" + razorpay_payment_id );
      
	const generated_signature = hmac.digest( "hex" );
      
	if( razorpay_signature===generated_signature ){
		userController.changeUserSubscription( req.user, razorpay_order_id );
		res.json( { success:true, message:"Payment has been verified" } );
	}
	else
		res.json( { success:false, message:"Payment verification failed" } );


    
};

