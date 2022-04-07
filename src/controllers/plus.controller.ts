import razorpayInstance from "../utils/razorpay";
import crypto from "crypto";
import AWS from "aws-sdk";
import {Request, Response} from "express";

import userController from "./user.controller";

interface RequestExtended extends Request {
	user?: any,
	page?: string,
	limit?: string
}

interface Result {
	next: any,
	previous: any,
	files?: any,
	expenses?: any
}

const ITEM_PER_PAGE = 5;


const createOrder = async ( req: Request, res: Response ) => {
	const { amount, currency, receipt, notes } = req.body;

	try {
		const order = await razorpayInstance.orders.create( {
			amount,
			currency,
			receipt,
			notes,
		} );
		if ( order ) {
			res.json( { order: order, key: process.env.RAZORPAY_ID } );
		}
	} catch ( err ) {
		res.status( 500 ).send( err );
	}
};

const verifyOrder = async ( req: RequestExtended, res: Response ) => {
	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

	const key_secret = process.env.RAZORPAY_SECRET;

	const hmac = crypto.createHmac( "sha256", key_secret ?? "" );

	hmac.update( razorpay_order_id + "|" + razorpay_payment_id );

	const generated_signature = hmac.digest( "hex" );

	if ( razorpay_signature === generated_signature ) {
		userController.changeUserSubscription( req.user, razorpay_order_id );
		res.json( { success: true, message: "Payment has been verified" } );
	} else res.json( { success: false, message: "Payment verification failed" } );
};

const downloadExpenses = async ( req: RequestExtended, res: Response ) => {
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

const upoloadToS3 = ( data: string, name: string ) => {
	const s3 = new AWS.S3( {
		accessKeyId: process.env.IAM_USERID,
		secretAccessKey: process.env.IAM_SECRET,
	} );

	const params: any = {
		Bucket: process.env.S3_BUCKET,
		Key: name,
		Body: data,
		ACL: "public-read",
	};

	return new Promise( ( resolve, reject ) => {
		s3.upload( params, ( err: object, data: any ) => {
			if ( err ) {
				reject( err );
			}
			resolve( data.Location );
		} );
	} );
};

const getExpenseFiles = async ( req: RequestExtended, res: Response ) => {
	try {
		const page =  Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || ITEM_PER_PAGE;
		const startIdx: number = ( page - 1 ) * limit;
		const lastIdx: number = page * limit;

		const result: Result = {
			next: undefined,
			previous: undefined,
			files: undefined
		};
		
		const files = await req.user.getExpensefiles();
		if ( lastIdx < files.length ) {
			result.next = {
				page: page + 1,
				limit: limit,
			};
		}
		if ( startIdx > 0 ) {
			result.previous = {
				page: page - 1,
				limit: limit,
			};
		}
		const paginatedFiles = await req.user.getExpensefiles( {
			offset: startIdx,
			limit: limit,
		} );

		result.files = paginatedFiles;
		res.status( 200 ).json( { success: true, result: result } );
	} catch ( err ) {
		res.json( { success: false, error: err } );
	}
};

const getAllExpenses = async (req: RequestExtended, res: Response) => {
	try {
		const page = Number( req.query.page ) || 1;
		const limit = Number( req.query.limit ) || ITEM_PER_PAGE;

		const startIdx = ( page - 1 ) * limit;
		const lastIdx = page * limit;

		const result: Result = {
			next: undefined,
			previous: undefined,
			expenses: undefined
		};

		const expenses = await req.user.getExpenses();
		if ( lastIdx < expenses.length ) {
			result.next = {
				page: page + 1,
				limit: limit,
			};
		}
		if ( startIdx > 0 ) {
			result.previous = {
				page: page - 1,
				limit: limit,
			};
		}

		const paginatedExpenses = await req.user.getExpenses( {
			offset: startIdx,
			limit: limit,
		} );

		result.expenses = paginatedExpenses;
		res.status( 200 ).json( { success: true, result: result } );
	} catch ( err ) {
		res.json( { success: false, error: err } );
	}
}

export default {
	createOrder,
	verifyOrder,
	downloadExpenses,
	getAllExpenses,
	getExpenseFiles
}
