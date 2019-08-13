'use strict';
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    dept_name: DataTypes.STRING,
    alias: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    long: DataTypes.BIGINT,
    lat: DataTypes.BIGINT,
    dept_pix: DataTypes.BLOB,
    password: DataTypes.STRING,
    faculty_id: DataTypes.INTEGER
  }, {});
  Department.associate = function(models) {
    // associations can be defined here
    Department.belongsTo(models.Faculty,{
      foreignKey: 'faculty_id'
    })
    Department.hasMany(models.Lecturer,{
      foreignKey: 'dept_id',
      onDelete: 'CASCADE'
    })
    Department.hasMany(models.Student,{
      foreignKey: 'dept_id',
      onDelete: 'CASCADE'
    })
    Department.hasMany(models.Course, {
      foreignKey: 'dept_id',
      onDelete: 'CASCADE'
    })
  };
  return Department;
};