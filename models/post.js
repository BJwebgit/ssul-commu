'use strict';
module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define('post', {
    loginemail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    writer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content:{
      type: DataTypes.STRING,
      allowNull: false
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  post.associate = function(models) {
    post.hasMany(models.reply, {
      onDelete: 'cascade'
    });
  };
  return post;
};