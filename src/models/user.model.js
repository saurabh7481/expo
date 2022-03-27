module.exports = ( sequelize, Sequelize ) => {
	const User = sequelize.define( "users", {
		username: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING
		},
		phone: {
			type: Sequelize.BIGINT
		},
		password: {
			type: Sequelize.STRING
		}
	} );
	return User;
};