'use strict';
module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    course_code: DataTypes.STRING,
    course_title: DataTypes.STRING,
    course_unit: DataTypes.INTEGER,
    dept_id: DataTypes.INTEGER,
    level_id: DataTypes.INTEGER
  }, {});
  Course.associate = function(models) {
    // associations can be defined here
    Course.belongsToMany(models.Student,{
      through: 'StudentCourse',
      as: 'students',
      foreignKey: 'course_id'
    })
    Course.belongsToMany(models.Lecturer,{
      through: 'LecturerCourse',
      as: 'lecturers',
      foreignKey: 'course_id'
    })
    Course.belongsTo(models.Department, {
      foreignKey: 'dept_id'
    })
    Course.belongsTo(models.Level, {
      foreignKey: 'level_id'
    })
    Course.hasMany(models.Attendance, {
      foreignKey: 'course_id',
      onDelete: 'CASCADE'
    })
  };
  return Course;
};