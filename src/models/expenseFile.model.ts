module.exports = ( sequelize: any, Sequelize: any ) => {
	const ExpenseFile = sequelize.define( "expensefile", {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
		url: {
			type: Sequelize.STRING
		},
		name: {
			type: Sequelize.STRING
		}
	} );
	return ExpenseFile;
};