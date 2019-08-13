'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lecturer = sequelize.define('Lecturer', {
    title: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    middlename: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    location: DataTypes.STRING,
    address: DataTypes.STRING,
    marital_status: DataTypes.STRING,
    religion: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    picture: DataTypes.BLOB,
    dept_id: DataTypes.INTEGER
  }, {});
  Lecturer.associate = function(models) {
    // associations can be defined here
    Lecturer.belongsToMany(models.Course,{
      through: 'LecturerCourse',
      as: 'courses',
      foreignKey: 'lect_id'
    })
    Lecturer.belongsTo(models.Department, {
      foreignKey: 'dept_id'
    })
  };
  return Lecturer;
};