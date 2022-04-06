const razorpayInstance = require( "../utils/razorpay" );
const crypto = require( "crypto" );
const AWS = require( "aws-sdk" );

const userController = require( "./user.controller" );

exports.createOrder = async ( req, res ) => {
	const { amount, currency, receipt, notes } = req.body;

	try {
		const order = await razorpayInstance.orders.create( {
			amount,
			currency,
			receipt,
			notes,
		} );
		console.log( "order", order );
		if ( order ) {
			res.json( { order: order, key: process.env.RAZORPAY_ID } );
		}
	} catch ( err ) {
		res.status( 500 ).send( err );
	}
};

exports.verifyOrder = async ( req, res ) => {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

	const key_secret = process.env.RAZORPAY_SECRET;

	let hmac = crypto.createHmac( "sha256", key_secret );

	hmac.update( razorpay_order_id + "|" + razorpay_payment_id );

	const generated_signature = hmac.digest( "hex" );

	if ( razorpay_signature === generated_signature ) {
		userController.changeUserSubscription( req.user, razorpay_order_id );
		res.json( { success: true, message: "Payment has been verified" } );
	} else res.json( { success: false, message: "Payment verification failed" } );
};

exports.downloadExpenses = async ( req, res ) => {
	try {
		const expenses = await req.user.getExpenses();
		const stringifiedExpenses = JSON.stringify( expenses );

		const fileName = `Expense-${req.user.id}-${new Date()}.txt`;

		const fileUrl = await upoloadToS3( stringifiedExpenses, fileName );

		await req.user.createExpensefile( {
			url: fileUrl,
			name: fileName,
		} );

		res.status( 200 ).json( { success: true, url: fileUrl } );
	} catch ( err ) {
		res.status( 500 ).json( { success: false, error: err } );
	}
};

const upoloadToS3 = ( data, name ) => {
	const s3 = new AWS.S3( {
		accessKeyId: process.env.IAM_USERID,
		secretAccessKey: process.env.IAM_SECRET,
	} );

	const params = {
		Bucket: process.env.S3_BUCKET,
		Key: name,
		Body: data,
		ACL: "public-read",
	};

	return new Promise( ( resolve, reject ) => {
		s3.upload( params, ( err, data ) => {
			if ( err ) {
				reject( err );
			}
			resolve( data.Location );
		} );
	} );
};

exports.getExpenseFiles = async (req, res) => {
	try{
		const files = await req.user.getExpensefiles();
		res.status(200).json({success: true, files: files});
	} catch(err){
		res.json({success: false, error: err});
	}
}