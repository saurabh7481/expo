"use strict";
module.exports = (sequelize, Sequelize) => {
    const ExpenseFile = sequelize.define("expensefile", {
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
    });
    return ExpenseFile;
};
