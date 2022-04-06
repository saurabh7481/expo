"use strict";
module.exports = (sequelize, Sequelize) => {
    const ResetPasswordRequest = sequelize.define("resetpasswordrequest", {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    });
    return ResetPasswordRequest;
};
