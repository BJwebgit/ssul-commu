'use strict';
module.exports = (sequelize, DataTypes) => {
  var reply = sequelize.define('reply', {
    re_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    writer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  reply.associate = function(models){
    reply.belongsTo(models.post, {
      foreignKey: "postId"
    })
  };
  return reply;
};