/*
/ ------------------------------------
/ Student Controller
/ ------------------------------------
/ Holds the basic operation
/ of the Student
*/

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Student = require('../middlewares/models/').Student;
const Course = require('../middlewares/models/').Course;
const StudentCourse = require('../middlewares/models/').StudentCourse;
const Attendance = require('../middlewares/models/').Attendance;
const StudentAttendance = require('../middlewares/models/').StudentAttendance;
const LectureHall = require('../middlewares/models/').LectureHall;

require('dotenv').config();
var secret = process.env.SECRET;

class StudentController{

    // Student login
    static async studentLogin(req, res){
        try{
            const {matric_no,password} = req.body;
            await Student.findAll({
                where:{matric_no: matric_no}
            })
                .then(student=>{
                    if(student.length == 0){
                        res.status(400).json({message: "Sorry, Matric number does not exist."});
                    }else{
                        var passwordIsValid = bcrypt.compareSync(req.body.password, student[0].dataValues.password.trim());

                        if (passwordIsValid){
                            var studDetails = {
                                id: student[0].dataValues.id,
                                stud_fname: student[0].dataValues.firstname,
                                stud_lname: student[0].dataValues.lastname,
                                phone: student[0].dataValues.phone,
                                is_auth: 'student'
                            }
                            var token = jwt.sign({
                                student: studDetails
                            }, secret, {
                                expiresIn: '1d'
                            });

                            res.status(200).json({
                                success: true,
                                student: studDetails,
                                message: "Login successful. Token generated successfully.",
                                token: token
                            });
                        }else{
                            res.status(401).json({
                                success: false,
                                message: 'Authentication failed. Wrong password'
                            });
                        }
                    }
                })
                .catch(e=>{
                    res.status(500);
                })
        }catch (e) {
            res.sendStatus(500);
        }
    }


    // Student register courses
    static async registerForCourse(req, res){
        try{
            const {student_id, course_id} = req.body;
            StudentCourse.findAll({
                where:{student_id: student_id}
            })
                .then(result=>{
                    if(result.length > 2){
                        res.status(203).json({message: "Sorry, you cannot register above 24 units courses"})
                    }else{
                        let assignCosToStudent = {
                            student_id: student_id,
                            course_id: course_id
                        }
                        StudentCourse.create(assignCosToStudent)
                            .then(data=>{
                                res.status(201).json({message: "Course registered successfully", studentCourse: data});
                            })
                            .catch(err=>res.json({error: err}));
                    }
                })
                .then(err=>{
                    res.status(500);
                })
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Student view all registered course
    static async fetchRegisteredCourse(req, res){
        try{
            let id = req.params.id;
            await Course.findAll({
                attributes: ['course_code', 'course_title', 'course_unit'],
                include:
                    [
                        {
                            model: Student,
                            as: 'students',
                            attributes: ['firstname'],
                            where: {id: id}
                        }
                    ],
            })
                .then(data=>{
                    if(data.length > 0) {
                        let studentDetails = [];

                        for(let i = 0; i < data.length; i++){
                            studentDetails.push(data[i].dataValues.course_title, data[i].dataValues.course_code, data[i].dataValues.course_unit);
                        }


                        res.status(201).json({message: "These are list of Course(s) you registered", studentCourses: studentDetails})
                    }else{
                        res.status(400).json({message: "Sorry, no course has been registered yet"});
                    }
                })


        }catch (e) {
            res.sendStatus(500);
        }
    }


    // Student view or see lectures
    static async fetchLecturesCreated(req, res){
        try{
            let id = req.params.id;
            await Course.findAll({
                attributes: ['course_code'],
                include:
                    [
                        {
                            model: Student,
                            as: 'attendance',
                            attributes: ['firstname'],
                            where: {id: id}
                        }
                    ],
            })
                .then(preload=>{
                    if(preload.length >= 0) {
                        let studentDetails = [];

                        for(let i = 0; i < preload.length; i++){
                            studentDetails.push(preload[i].dataValues.course_title, preload[i].dataValues.course_code, preload[i].dataValues.course_unit);
                        }
                        res.status(201).json({message: "These are list of Course(s) you registered", studentCourses: studentDetails})
                    }else{
                        res.status(400).json({message: "Sorry, no course has been registered yet"});
                    }
                })
                .then(err=>{
                    res.status(500);
                })


        }catch (e) {
            res.sendStatus(500);
        }
    }


    // Student attend lectures or mark attendance
    static attendLectures(req, res){
        try{
            let {student_long, student_lat,student_id, attendance_id, hall_id} = req.body;

            let long = 0, lat = 0;

            //check to see if attendance was created or not
            Attendance.findAll({
                where: {id: attendance_id}
            })
                .then(check=>{
                    if(check.length > 0){
                        attendance_id = attendance_id;
                    }else{
                        res.status(203).json({success: false, message: "Sorry, lecturer did not set any lecture attendance"})
                    }
                })
                .then(err=>{
                    res.status(500);
                })

            // verification to see validity in hall location here
            LectureHall.findAll({
                where: {id: hall_id}
            })
                .then(validate=>{
                    if(validate.length > 0){
                            long = validate[0].dataValues.long;
                            lat = validate[0].dataValues.lat;
                           // use student device long and lat then compare it with hall_long and lat
                            if(student_long == long && student_lat == lat){
                               hall_id = hall_id;
                            }
                    }else {
                        res.status(203).json({success: false, message: "Lecture hall does not exist."})
                    }
                })
                .then(err=>{
                    res.status(500);
                })

            // We then mark an attendance
            let createAttendance = {
                attendance_id: attendance_id,
                student_id: student_id
            }
            StudentAttendance.findAll({
                where: {student_id: student_id}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({success: false, message: "Sorry, you cannot attend this lecture twice"});
                    }else{
                        StudentAttendance.create(createAttendance)
                            .then(data=>{
                                res.status(201).json({sucess: true, message: "Attendance marked"})
                            })
                            .catch(err=>res.json({error: err}));

                    }
                })
                .then(err=>{
                    res.status(500);
                })

        }catch (e) {
            res.sendStatus(500);
        }
    }
}
module.exports = StudentController;