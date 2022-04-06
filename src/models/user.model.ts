module.exports = ( sequelize: any, Sequelize: any ) => {
	const User = sequelize.define( "users", {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
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
		},
		subscription: {
			type: Sequelize.STRING
		},
		orderID: {
			type: Sequelize.STRING
		}
	} );
	return User;
};