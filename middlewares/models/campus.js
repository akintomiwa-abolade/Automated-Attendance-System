'use strict';
module.exports = (sequelize, DataTypes) => {
  const Campus = sequelize.define('Campus', {
    campus_name: DataTypes.STRING,
    location: DataTypes.STRING,
    address: DataTypes.STRING,
    long: DataTypes.BIGINT,
    lat: DataTypes.BIGINT,
    school_id: DataTypes.INTEGER
  }, {});
  Campus.associate = function(models) {
    // associations can be defined here
    Campus.belongsTo(models.School,{
      foreignKey: 'school_id'
    })
  };
  return Campus;
};