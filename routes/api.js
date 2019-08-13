/**
 |----------------------------------
 | Api Route
 |----------------------------------
 */

const express = require("express");
const router = express.Router();
const con = require('../config/database.js');
const jwt = require('jsonwebtoken');
const checkJWT = require('../middlewares/check-jwt');
const upload = require('../middlewares/uploadMiddleware');

const DeveloperController = require('../controllers/DeveloperController');
const SchoolController = require('../controllers/SchoolController');
const FacultyController = require('../controllers/FacultyController');
const DepartmentController = require('../controllers/DepartmentController');

require('dotenv').config();

/**
 |-------------------------
 | Developer Api Routes
 |-------------------------
 */

// developer welcome
router.get('/developer/', DeveloperController.welcome);

// developer login
router.post('/developer/login', DeveloperController.login);

// create School account
router.post('/developer/create_school_acct', checkJWT, upload.single('logo'), DeveloperController.createSchoolAccount);

// fetch school accounts
router.get('/developer/get_school_acct', checkJWT, DeveloperController.fetchSchools);

// update School account
router.post('/developer/update_school_acct/:id', checkJWT, upload.single('logo'), DeveloperController.updateSchoolAccount);

// delete school account
router.delete('/developer/delete_school_acct/:id', checkJWT, DeveloperController.deleteSchoolAccount);

// create Campus account
router.post('/developer/create_campus_acct', checkJWT, DeveloperController.createCampusAccount);

// create Faculty account
router.post('/developer/create_faculty_acct', checkJWT, upload.single('faculty_pix'), DeveloperController.createFacultyAccount);

// update Faculty account
router.post('/developer/update_faculty_acct/:id',checkJWT,upload.single('faculty_pix'), DeveloperController.updateFacultyAccount);

// fetch faculty account
router.get('/developer/get_faculty_acct/:id', checkJWT, DeveloperController.fetchFacultyAccount)

// create Department account
router.post('/developer/create_dept_acct', checkJWT, upload.single('logo'), DeveloperController.createDeptAccount);


/**
 |-------------------------
 | School Api Routes
 |-------------------------
 */

// School login
router.post('/school/login', SchoolController.schoolLogin);

// School create Faculty account
router.post('/school/create_faculty_acct', checkJWT, upload.single('faculty_pix'), SchoolController.createFacultyAccount);

// -CHECK School fetch Faculty accounts
router.get('/school/get_faculty_acct/:id', checkJWT, SchoolController.fetchFacAccount);

// School update faculty account
router.post('/school/update_faculty_acct/:id', checkJWT, upload.single('faculty_pix'), SchoolController.updateFacAccount);

// School delete faculty account
router.delete('/school/delete_faculty_acct/:id', checkJWT, SchoolController.deleteFacultyAccount);

// School create new Level
router.post('/school/create_level/', checkJWT, SchoolController.createLevel);

// School update level
router.post('/school/update_level', checkJWT, SchoolController.updateLevel);

// School delete a level
router.delete('/school/delete_level/', checkJWT, SchoolController.deleteLevel);


/**
 |-------------------------
 | Faculty Api Routes
 |-------------------------
 */

// Faculty login
router.post('/faculty/login', FacultyController.facultyLogin);

// faculty create Department account
router.post('/faculty/create_dept_acct', checkJWT, upload.single('dept_pix'), FacultyController.createDepartmentAccount);

// faculty fetch Department accounts
router.get('/faculty/get_dept_acct/:id', checkJWT, FacultyController.fetchDepartments);

// faculty update Department account
router.post('/faculty/update_dept_acct/:id', checkJWT, upload.single('dept_pix'), FacultyController.updateDepartmentAccount);

// faculty delete department account
router.delete('/faculty/delete_dept_acct/:id', checkJWT, FacultyController.deleteDepartmentAccount);


/**
 |-------------------------
 | Department Api Routes
 |-------------------------
 */

// Department login
router.post('/department/login/', DepartmentController.departmentLogin);

// Department add new or create a lecturer account
router.post('/department/create_lecturer_acct/', checkJWT, upload.single('picture'), DepartmentController.createLecturerAccount);

// Department fetch lecturer account
router.get('/department/get_lecturer_acct/:id', checkJWT, DepartmentController.fetchLecturerAccounts);

// Department update lecturer account
router.post('/department/update_lecturer_acct/:id', checkJWT, upload.single('picture'), DepartmentController.updateLecturerAccount);

// Department delete lecturer account
router.delete('/department/delete_lecturer_acct/:id', checkJWT, DepartmentController.deleteLecturerAccount);

// Department create or add new course
router.post('/department/create_course/', checkJWT, DepartmentController.createCourse);

// Department update course
router.post('/department/update_course/', checkJWT, DepartmentController.updateCourse);

// Department delete course
router.delete('/department/delete_course/', checkJWT, DepartmentController.deleteCourse);

// Department create or add new student
router.post('/department/create_student_acct/', checkJWT, upload.single('picture'), DepartmentController.createStudentAccount);

// Deprtment assign course to lecturer
router.post('/department/assign_course_lecturer/', checkJWT, DepartmentController.assignLecturerToCourse);

// Department fetch lecturer assigned to course, lecturer id is ued here
router.get('/department/get_lecturer_assigned_course/:id', checkJWT, DepartmentController.fetchLecturerAssignedCourse);

// Department view all lecturer taking a course, course id is used here
router.get('/department/get_course_lecturer/:id', checkJWT, DepartmentController.fetchLecturerTakingCourse);

module.exports = router;