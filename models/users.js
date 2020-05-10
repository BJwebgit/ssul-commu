module.exports = function(sequelize, DataTypes){
    let user = sequelize.define("User", {
        email: {
            filed: "email",
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        password: {
            field: "password",
            type: DataTypes.STRING(30),
            allowNull: false
        },
        nickname: {
            field: "nickname",
            type: DataTypes.STRING(30),
            allowNull: false
        },
        tel: {
            field: "tel",
            type: DataTypes.STRING(30),
            allowNull: false
        },
        area: {
            field: "area",
            type: DataTypes.STRING(30),
            allowNull: false
        },
        gender: {
            field: "gender",
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        underscored: true,
        freezeTableName: true,
        tableName: "user"
    });
    return user;
}