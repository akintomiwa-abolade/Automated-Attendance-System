'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentAttendance = sequelize.define('StudentAttendance', {
    matric_no: DataTypes.INTEGER,
    attendance_id: DataTypes.INTEGER
  }, {});
  StudentAttendance.associate = function(models) {
    // associations can be defined here
  };
  return StudentAttendance;
};