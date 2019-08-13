'use strict';
module.exports = (sequelize, DataTypes) => {
  const LecturerCourse = sequelize.define('LecturerCourse', {
    lect_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER
  }, {});
  LecturerCourse.associate = function(models) {
    // associations can be defined here
  };
  return LecturerCourse;
};