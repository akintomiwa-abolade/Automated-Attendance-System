/*
/ ------------------------------------
/ Lecturer Controller
/ ------------------------------------
/ Holds the basic operation
/ of the Lecturer
*/

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Lecturer = require('../middlewares/models/').Lecturer;
const Attendance = require('../middlewares/models/').Attendance;
const Course = require('../middlewares/models/').Course;

require('dotenv').config();
var secret = process.env.SECRET;

class LecturerController{

    // Lecturer login
    static async lecturerLogin(req, res){
        try{
            const {username,password} = req.body;
            await Lecturer.findAll({
                where:{username: username}
            })
                .then(lecturer=>{
                    if(lecturer.length == 0){
                        res.status(400).json({message: "Sorry, lecturer does not exist."});
                    }else{
                        var passwordIsValid = bcrypt.compareSync(req.body.password, lecturer[0].dataValues.password.trim());

                        if (passwordIsValid){
                            var lectDetails = {
                                id: lecturer[0].dataValues.id,
                                lect_fname: lecturer[0].dataValues.firstname,
                                lect_lname: lecturer[0].dataValues.lastname,
                                phone: lecturer[0].dataValues.phone,
                                is_auth: 'lecturer'
                            }
                            var token = jwt.sign({
                                lecturer: lectDetails
                            }, secret, {
                                expiresIn: '1d'
                            });

                            res.status(200).json({
                                success: true,
                                lecturer: lectDetails,
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

    // Lecturer view all assigned course
    static async fetchAssignedCourse(req, res){
        try{
            let id = req.params.id;
            Course.findAll({
                attributes: ['course_code', 'course_title', 'course_unit'],
                include:
                    [
                        {
                            model: Lecturer,
                            as: 'lecturers',
                            attributes: ['firstname'],
                            where: {id: id}
                        }
                    ],
            })
                .then(data=>{
                    if(data.length > 0) {
                        let lecturerDetails = [];

                            for(let i = 0; i < data.length; i++){
                                lecturerDetails.push(data[i].dataValues.course_title, data[i].dataValues.course_code, data[i].dataValues.course_unit);
                            }
                        res.status(201).json({message: "These are list of Course(s) assigned to you", lecturerCourses: lecturerDetails})
                    }else{
                        res.status(400).json({message: "Sorry, no course has been asigned yet"});
                    }
                })


        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Lecturer create or set lecture
    static async createLectures(req, res){
        try{
            const {lect_id, course_id, start_time, end_time, hall_id, lecture_date} = req.body;

            await Attendance.findAll({
                where: {lecture_date: lecture_date, start_time: start_time, hall_id: hall_id}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({success: false, message: "Sorry, a lecturer will be holding lecture in this hall, kindly choose another time"})
                    }else{
                        let createNewLecture = {
                            lect_id: lect_id,
                            course_id: course_id,
                            start_time: start_time,
                            end_time: end_time,
                            hall_id: hall_id,
                            lecture_date: lecture_date
                        }
                        Attendance.create(createNewLecture)
                            .then(data=>{
                                res.status(201).json({success: true, message: "Lecture added successfully"});
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


    // Lecturer view Lecture history
    static async fetchLectureHistory(req, res){
        try{

        }catch (e) {
            res.sendStatus(500);
        }
    }

}
module.exports = LecturerController;