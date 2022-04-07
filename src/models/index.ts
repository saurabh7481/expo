/* eslint-disable @typescript-eslint/no-var-requires */
const config = require( "../config/db.config" );
const Sequelize = require( "sequelize" );

interface Model {
	[key: string]: any
}

const sequelize = new Sequelize(
	config.DB,
	config.USER,
	config.PASSWORD,
	{
		host: config.HOST,
		dialect: config.dialect,
	}
);
const db: Model = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require( "../models/user.model" )( sequelize, Sequelize );
db.expense = require( "./expense.model" )( sequelize, Sequelize );
db.ResetPasswordRequest = require( "./resetPasswordRequest.model" )( sequelize, Sequelize );
db.ExpenseFile = require( "./expenseFile.model" )( sequelize, Sequelize );

//Associations
db.user.hasMany( db.expense );
db.expense.belongsTo( db.user );

db.user.hasMany( db.ExpenseFile );
db.ExpenseFile.belongsTo( db.user );

db.user.hasMany( db.ResetPasswordRequest );
db.ResetPasswordRequest.belongsTo( db.user );

export default db;