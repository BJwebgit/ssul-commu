'use strict';
module.exports = (sequelize, DataTypes) => {
  var user2 = sequelize.define('user2', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nickname: {
      field: "nickname",
      type: DataTypes.STRING,
      allowNull: false
    },
    tel: {
      field: "tel",
      type: DataTypes.STRING,
      allowNull: false
    },
    area: {
      field: "area",
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      field: "gender",
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user2;
};