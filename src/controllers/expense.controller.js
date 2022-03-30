exports.addExpense = async ( req, res ) => {
	try {
		const expense = await req.user.createExpense( {
			description: req.body.description,
			amount: req.body.amount,
			category: req.body.category,
		} );

		if ( expense ) res.send( { message: "Expense Added!" } );
	} catch ( error ) {
		res.status( 500 ).send( { message: error.message } );
	}
};

