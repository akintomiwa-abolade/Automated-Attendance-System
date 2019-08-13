'use strict';
module.exports = (sequelize, DataTypes) => {
  const LectureAttendance = sequelize.define('LectureAttendance', {
    lecture_day: DataTypes.STRING,
    lecture_time: DataTypes.STRING,
    hall_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER
  }, {});
  LectureAttendance.associate = function(models) {
    // associations can be defined here
    LectureAttendance.belongsTo(models.LectureHall,{
      foreignKey: 'hall_id'
    })
    LectureAttendance.belongsTo(models.Course,{
      foreignKey: 'course_id'
    })
    LectureAttendance.belongsToMany(models.Student,{
      through: 'StudentAttendance',
      as: 'students',
      foreignKey: 'attendance_id'
    })
  };
  return LectureAttendance;
};