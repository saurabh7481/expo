const Razorpay = require( "razorpay" );

const razorpayInstance = new Razorpay( {
	key_id: process.env.RAZORPAY_ID,
	key_secret: process.env.RAZORPAY_SECRET
} );

module.exports = razorpayInstance;