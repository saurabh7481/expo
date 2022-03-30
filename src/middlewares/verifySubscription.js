const verifySubscription = async ( req, res, next ) => {
	const sub = req.user.subscription;
	if( sub === "plus" ){
		next();
	} else {
		res.status( 401 ).json( { success: false } );
	}
};

module.exports = verifySubscription;