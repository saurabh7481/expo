const config = require( "../config/db.config.js" );
const Sequelize = require( "sequelize" );
const sequelize = new Sequelize(
	config.DB,
	config.USER,
	config.PASSWORD,
	{
		host: config.HOST,
		dialect: config.dialect,
	}
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require( "../models/user.model.js" )( sequelize, Sequelize );
db.expense = require( "./expense.model.js" )( sequelize, Sequelize );
db.ResetPasswordRequest = require( "./resetPasswordRequest.model" )( sequelize, Sequelize );
db.ExpenseFile = require( "./expenseFile.model" )( sequelize, Sequelize );

//Associations
db.user.hasMany( db.expense );
db.expense.belongsTo( db.user );

db.user.hasMany( db.ExpenseFile );
db.ExpenseFile.belongsTo( db.user );

db.user.hasMany( db.ResetPasswordRequest );
db.ResetPasswordRequest.belongsTo( db.user );

module.exports = db;