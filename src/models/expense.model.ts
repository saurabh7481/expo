module.exports = ( sequelize: any, Sequelize: any ) => {
	const Expense = sequelize.define( "expense", {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
		description: {
			type: Sequelize.STRING
		},
		amount: {
			type: Sequelize.INTEGER
		},
		category: {
			type: Sequelize.STRING
		}
	} );
	return Expense;
};