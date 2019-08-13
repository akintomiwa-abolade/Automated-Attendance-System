/*
/ ------------------------------------
/ Department Controller
/ ------------------------------------
/ Holds the basic operation
/ of the Department
*/

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Department = require('../middlewares/models/').Department;
const Lecturer = require('../middlewares/models/').Lecturer;
const Course = require('../middlewares/models/').Course;
const Student = require('../middlewares/models/').Student;
const LecturerCourse = require('../middlewares/models/').LecturerCourse;

require('dotenv').config();
var secret = process.env.SECRET;

class DepartmentController{

    // Department login
    static async departmentLogin(req, res){
        try{
            const {email,password} = req.body;
            await Department.findAll({
                where:{email: email}
            })
                .then(department=>{
                    if(department.length == 0){
                        res.status(400).json({message: "Sorry, department does not exist."});
                    }else{
                        var passwordIsValid = bcrypt.compareSync(req.body.password, department[0].dataValues.password.trim());

                        if (passwordIsValid){
                            var deptDetails = {
                                id: department[0].dataValues.id,
                                dept_name: department[0].dataValues.dept_name,
                                phone: department[0].dataValues.phone,
                                is_auth: 'hod'
                            }
                            var token = jwt.sign({
                                school: deptDetails
                            }, secret, {
                                expiresIn: '1d'
                            });

                            res.status(200).json({
                                success: true,
                                department: deptDetails,
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

    // Department register or add new lecturer
    static async createLecturerAccount(req, res){
        try{
            var alias_response = " ";
            var total = 0;

            const {title, firstname, lastname, middlename, gender, dob, email, phone, location, address, marital_status, religion, picture, dept_id} = req.body;
            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456',10);
            var username = "";

            // lets get the department alias
            Department.findAll({
                attributes: ['alias'],
                where: {id: dept_id}
            })
                .then(aliasValue=>{
                    alias_response = aliasValue[0].dataValues.alias;
                    console.log("Department ALIAS is "+alias_response);
                })
                .then(err=>{
                    res.status(500);
                })
            // here ends getting department alias

            // so, lets count the total number of lecturer already registered in the department
            Lecturer.findAll({
                where: {dept_id: dept_id}
            })
                .then(lecturers=>{
                    if(lecturers.length > 0){
                        total = (lecturers.length) + 1;
                        // pad and assign
                        var new_total = total.toString().padStart(3,"0");
                        // Lecturer username is derived
                        username = alias_response + "/STF/" + new_total + "";
                    }
                })
                .then(err=>{
                    res.status(500);
                })
            // here ends getting total number of registerd lecturer in the department

            Lecturer.findAll({
                where: {phone: phone, email: email}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({message: "Sorry, lecturer of this info already exist"});
                    }else{
                        var createNewLecturer = {
                            title: title,
                            firstname: firstname,
                            lastname: lastname,
                            middlename: middlename,
                            gender: gender,
                            dob: dob,
                            email: email,
                            phone: phone,
                            location: location,
                            address: address,
                            marital_status: marital_status,
                            religion: religion,
                            username: username,
                            password: password,
                            picture: base64,
                            dept_id: dept_id
                        }
                        Lecturer.create(createNewLecturer)
                            .then(data=>{
                                res.status(201).json({success:true, lecturerData: data});
                            })
                            .catch(err=> res.json({error: err}));
                    }
                })
                .then(err=>{
                    res.status(500);
                })

        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Department fetch all lecturers account
    static async fetchLecturerAccounts(req, res){
        try{
            let id = req.params.id;
            await Lecturer.findAll({
                attributes: ['title','firstname','lastname','phone'],
                include: [
                    {
                        model: Department,
                        attributes: ['dept_name'],
                        where:{id: id}
                    }

                ]
            })
                .then(result=>{
                    if(result){
                        res.status(201).json({success:true, result})
                    }else{
                        res.status(400).json({message: "No Lecturer created"});
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Department update Lecturer account
    static async updateLecturerAccount(req, res){
        try{
            const {title, firstname, lastname, middlename, gender, dob, email, phone, location, address, marital_status, religion, picture, dept_id} = req.body;
            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456',10);

            var updateLecturer = {
                title: title,
                firstname: firstname,
                lastname: lastname,
                middlename: middlename,
                gender: gender,
                dob: dob,
                email: email,
                phone: phone,
                location: location,
                address: address,
                marital_status: marital_status,
                religion: religion,
                password: password,
                picture: base64,
                dept_id: dept_id
            }
            await Department.update(updateLecturer, {
                where: {
                    id: req.params.id
                }
            })
                .then(response=>{
                    res.status(200).json({success:true, message: "Lecturer account updated successfully."})
                })
                .then(err=>res.json({error: err}));
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Department delete lecturer account
    static async deleteLecturerAccount(req, res){
        try{
            let id = req.params.id;

            await Lecturer.findAll({
                where: {id: id}
            })
                .then(result=>{
                    if(result.length == 1){
                        Lecturer.destroy({
                            where:{id: id}
                        })
                            .then(deleted => {
                                res.status(200).json({success: true, message: "Lecturer account deleted successfully"});
                            });
                    }else{
                        res.status(404).json("Sorry, operation could not be completed.");
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Department create courses
    static async createCourse(req, res){
        try{
            const {course_code, course_title, course_unit, dept_id, level_id} = req.body;
            await Course.findAll({
                where: {course_code: course_code}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({message: "Sorry, course code already exist"});
                    }else{
                        let createNewCourse = {
                            course_code: course_code,
                            course_title: course_title,
                            course_unit: course_unit,
                            dept_id: dept_id,
                            level_id: level_id
                        }
                        Course.create(createNewCourse)
                            .then(data=>{
                                res.status(201).json({success: true, message: "Course added successfully"});
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

    // Department update courses
    static async updateCourse(req, res){
        try{
            const {course_code, course_title, course_unit, level_id} = req.body;
            let updateACourse = {
                course_code: course_code,
                course_title: course_title,
                course_unit: course_unit,
                level_id: level_id
            }
            await Course.update(updateACourse,{
                where: {
                    id: req.params.id
                }
            })
                .then(response=>{
                    res.status(200).json({success:true, message: "Course updated successfully."})
                })
                .then(err=>res.json({error: err}));
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Department delete a course
    static async deleteCourse(req, res){
        try{
            let id = req.params.id;

            await Course.findAll({
                where: {id: id}
            })
                .then(result=>{
                    if(result.length == 1){
                        Course.destroy({
                            where:{id: id}
                        })
                            .then(deleted => {
                                res.status(200).json({success: true, message: "Course deleted successfully"});
                            });
                    }else{
                        res.status(404).json("Sorry, operation could not be completed.");
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Department create or add new student
    static async createStudentAccount(req, res){
        try{
            var total = 0;

            const {firstname, lastname, middlename, gender, dob, email, phone, location, address, religion, picture, dept_id, level_id} = req.body;
            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456',10);
            var matric_no = 0;

            // so, lets count the total number of students already registered
            Student.findAll({})
                .then(students=>{
                    if(students.length >= 0){
                        total = (students.length) + 1;
                        console.log("Total is " + total);
                        // pad and assign
                        let date = new Date();
                        let fullYear = date.getFullYear();
                        let year_of_adm = fullYear.toString().substr(-2);

                        let new_total = total.toString().padStart(4,"0");
                        // Student matric number is derived
                        let temp_matric = year_of_adm + "" + new_total + "";
                        console.log("All student is " + temp_matric);
                        matric_no = parseInt(temp_matric);
                    }
                })
                .then(err=>{
                    res.status(500);
                })
            // here ends getting total number of registered student in the school

            Student.findAll({
                where: {phone: phone}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({message: "Sorry, student of this info already exist"});
                    }else{
                        let createNewStudent = {
                            firstname: firstname,
                            lastname: lastname,
                            middlename: middlename,
                            gender: gender,
                            dob: dob,
                            email: email,
                            phone: phone,
                            location: location,
                            address: address,
                            religion: religion,
                            matric_no: matric_no,
                            password: password,
                            picture: base64,
                            dept_id: dept_id,
                            level_id: level_id
                        }
                        Student.create(createNewStudent)
                            .then(data=>{
                                res.status(201).json({success:true, studentData: data});
                            })
                            .catch(err=> res.json({error: err}));
                    }
                })
                .then(err=>{
                    res.status(500);
                })
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Department assign course to lecturer
    static async assignLecturerToCourse(req, res){
        try{
            const {lect_id, course_id} = req.body;
            LecturerCourse.findAll({
                where:{lect_id: lect_id}
            })
                .then(result=>{
                    if(result.length > 2){
                        res.status(203).json({message: "Sorry, lecturer cannot be assigned to more than three courses"})
                    }else{
                        let assignCosToLecturer = {
                            lect_id: lect_id,
                            course_id: course_id
                        }
                        LecturerCourse.create(assignCosToLecturer)
                            .then(data=>{
                                res.status(201).json({message: "Lecturer assign to course successfully", lecturerCourse: data});
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

    // Department fetch lecturer course
    static async fetchLecturerAssignedCourse(req, res){
        try{
            let id = req.params.id;
            Course.findAll({
                attributes: ['course_code'],
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
                        res.status(201).json({message: "This lecturer has the following list of Course", lecturerCourses: data})
                    }else{
                        res.status(400).json({message: "This lecturer has no course asigned yet"});
                    }
                })


        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Department shows or display list of lecturers taking a particular course
    static  async fetchLecturerTakingCourse(req, res){
        try{
            let id = req.params.id;
            Lecturer.findAll({
                attributes: ['firstname'],
                include:
                    [
                        {
                            model: Course,
                            as: 'courses',
                            attributes: ['course_code'],
                            where: {id: id}
                        }
                    ],
            })
                .then(data=>{
                    if(data.length > 0) {
                            res.status(201).json({message: "This Course is taken by the following Lectures", courseData: data})
                    }else{
                        res.status(400).json({message: "This Course has no lecturer asigned yet"});
                    }
                })


        }catch (e) {
            res.sendStatus(500);
        }
    }
}
module.exports = DepartmentController;