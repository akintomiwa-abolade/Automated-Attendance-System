'use strict';
module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define('Level', {
    level_name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Level.associate = function(models) {
    // associations can be defined here
    Level.hasMany(models.Student,{
      foreignKey: 'level_id',
      onDelete: 'CASCADE'
    })
    Level.hasMany(models.Course,{
      foreignKey: 'level_id',
      onDelete: 'CASCADE'
    })
  };
  return Level;
};