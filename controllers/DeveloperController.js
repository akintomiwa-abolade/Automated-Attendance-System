/**
 /------------------------------------
 / Developers Controller
 /-------------------------------------
 / Holds all basic operations
 / of the developer
 */

const callbacks = require('../config/callbacks.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const School = require('../middlewares/models/').School;
const Campus = require('../middlewares/models/').Campus;
const Faculty = require('../middlewares/models/').Faculty;
const Department = require('../middlewares/models/').Department;
const Developer = require('../middlewares/models/').Developer;
//const Sender = require('../middlewares/mailing');
//const mailer = require('@sendgrid/mail');

require('dotenv').config();
var secret = process.env.SECRET;
//var apiKey = process.env.SENDGRID_API_KEY;

//mailer.setApiKey(apiKey);

class DeveloperController{

    // select * from f faculty inner join s school on f.f_id = s.f_id

    // Developer welcome message
    static welcome(req, res){
        res.json({message: "Welcome to developer endpoint."});
    }

    // Developer login operation
    static async login(req, res){
        try{
            let { email,password } = req.body;
            await Developer.findAll({
                where:{email: email}
            })
                .then(developer=>{
                    if(developer.length == 0){
                        res.status(400).json({message: "Sorry, developer does not exist."});
                    }else{
                        var passwordIsValid = bcrypt.compareSync(req.body.password, developer[0].dataValues.password.trim());

                        if (passwordIsValid){
                            var devDetails = {
                                id: developer[0].dataValues.id,
                                fullname: developer[0].dataValues.fullname,
                                email: developer[0].dataValues.email,
                                is_auth: 'developer'
                            }
                            var token = jwt.sign({
                                developer: devDetails
                            }, secret, {
                                expiresIn: '1d'
                            });

                            res.status(200).json({
                                success: true,
                                developer: devDetails,
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
            res.send(500);
        }
    }

    // Developer create or add new school
    static createSchoolAccount(req, res){
        try {

            const {school_name, alias, logo, email, phone, location, address, established, long, lat} = req.body;

            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456', 10);

            School.findAll({
                where: {alias: alias}
            })
                .then(result => {
                    if (result.length > 0) {
                        res.status(203).json({message: "Sorry, school name already exist ."});
                    } else {
                        console.log('Hi');
                        let createNewSchool = {
                            school_name: school_name,
                            alias: alias,
                            logo: base64,
                            email: email,
                            phone: phone,
                            location: location,
                            address: address,
                            password: password,
                            established: established,
                            long: long,
                            lat: lat
                        }
                        School.create(createNewSchool)
                            .then(data => {
                                if(data){
                                    // const msg = {
                                    //     to: 'abolade.akintomiwa@gmail.com',
                                    //     from: 'tommybosgust@gmail.com',
                                    //     subject: 'Sendgrid mail testing',
                                    //     text: 'Texting mailing',
                                    //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                                    // };
                                    // mailer.send(msg)
                                    //     .then(() => {
                                    //         return res.send('Email has been sent!');
                                    //     }).catch((error) => {
                                    //     return res.send('There was an error sending the email');
                                    // })

                                    res.status(201).json({message: "New School created", school: data})
                                }
                            })
                            .catch(err => res.json({error: err}));
                    }
                })
                .catch(err => {
                    res.sendStatus(500);
                })
        }
        catch (e) {
            res.sendStatus(500);
        }
    }

    // Developer create Campus Account
    static async createCampusAccount(req, res){
        try{
            const {campus_name, location, address, long, lat, school_id} = req.body;

            await Campus.findAll({
                where: {campus_name: campus_name}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({message: "Sorry, Campus name already exist."});
                    }else{
                        let createNewCampus = {
                            campus_name: campus_name,
                            location: location,
                            address: address,
                            long: long,
                            lat: lat,
                            school_id: school_id
                        }
                        Campus.create(createNewCampus)
                            .then(data=>{
                                res.status(201).json({message: "Campus account created successfully",campusData: data});
                            })
                            .then(err=>res.json({error: err}));
                    }
                })
                .then(err=>{
                    res.status(500);
                })
        }catch (e) {
            res.send(500);
        }
    }

    // Developer create Faculty Account
    static async createFacultyAccount(req, res){
        try{
            const {faculty_name, alias, email,phone, long, lat, faculty_pix, school_id} = req.body;

            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456', 10);

            await Faculty.findAll({
                where: {alias: alias}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({message: "Sorry, Faculty name exists already."});
                    }else{
                        let createNewFaculty = {
                            faculty_name: faculty_name,
                            alias: alias,
                            email: email,
                            phone: phone,
                            long: long,
                            lat: lat,
                            faculty_pix: base64,
                            school_id: school_id,
                            password: password
                        }
                        Faculty.create(createNewFaculty)
                            .then(data=>{
                                res.status(201).json({message: "Faculty account created successfully.",facultyData: data});
                            })
                            .catch(err=> res.json({error: err}));
                    }
                })
                .catch(err=>{
                    res.status(500);
                })

        }catch (e) {
            res.send(500);
        }
    }

    // Developer create Department Account
    static createDeptAccount(req, res){
        try{
            const {dept_name, alias, email, phone, long, lat, dept_pix, faculty_id} = req.body;

            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456',10);

            Department.findAll({
                where: {alias: alias}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({message: "Sorry, Department name already exist."});
                    }else{
                        let createNewDepartment = {
                            dept_name: dept_name,
                            alias: alias,
                            email: email,
                            phone: phone,
                            long: long,
                            lat: lat,
                            dept_pix: base64,
                            password: password,
                            faculty_id: faculty_id
                        }
                        Department.create(createNewDepartment)
                            .then(data=>{
                                res.status(201).json({message: "Department Created Successfully.",deptData: data});
                            })
                            .then(err=>res.json({error: err}));
                    }
                })
                .then(err=>{
                    res.status(500);
                })
        }catch (e) {
            res.send(500);
        }
    }

    // Developer view All school accounts
    static async fetchSchools(req, res){
        try{
            await School.findAll({
                attributes: ['school_name','alias','email','phone']
            })
                .then(result=>{
                    if(result.length == 0){
                        res.status(203).json({message: "No school account has been created."});
                    }else{
                        res.status(201).json({message: true, schools: result});
                    }
                })
        }catch (e) {
            res.send(500);
        }
    }

    // Developer view a particular school account
    static async fetchSingleSchool(req, res){
        try{
            let school_id = req.params.school_id;
            await School.findAll({
                attributes: ['school_name','alias','email','phone'],
                where:{school_id: school_id}
            })
                .then(result=>{
                    if(result.length == 0){
                        res.status(203).json({message: "No school account has been created."});
                    }else{
                        res.status(201).json({message: true, schools: result});
                    }
                })
        }catch (e) {
            res.send(500);
        }
    }

    // Developer update school account
    static async updateSchoolAccount(req, res){
        try{
            const {school_name, alias, logo, email, phone, location, address, established, long, lat} = req.body;

            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456', 10);

            let updateSchool = {
                school_name: school_name,
                alias: alias,
                logo: base64,
                email: email,
                phone: phone,
                location: location,
                address: address,
                password: password,
                established: established,
                long: long,
                lat: lat
            }
            await School.update(updateSchool,{
                where: {
                    id: req.params.id
                }
            })
                .then(response=>{
                    res.status(200).json({success:true, message: "School account updated successfully."})
                })
                .then(err=>res.json({error: err}));
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Developer delete school account
    static async deleteSchoolAccount(req, res){
        try{
            let id = req.params.id;

            await School.findAll({
                where: {id: id}
            })
                .then(result=>{
                    if(result.length == 1){
                        School.destroy({
                            where:{id: id}
                        })
                            .then(deleted => {
                                res.status(200).json({success: true, message: "School account deleted successfully"});
                            });
                    }else{
                        res.status(404).json("Sorry, operation could not be completed.");
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Developer get list of faculty in a school
    static async fetchFacultyAccount(req, res){
        try{
            let id = req.params.id;
            await Faculty.findAll({
                attributes: ['faculty_name','alias'],
                include: [
                    {
                        model: School,
                        attributes: ['alias'],
                        where:{id: id}
                    }
                    ]
            })
                .then(result=>{
                    if(result){
                        res.status(201).json({success:true, result})
                    }else{
                        res.status(400).json({message: "No Faculty created"});
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Developer update Faculty account
    static async updateFacultyAccount(req, res){
        try{
            const {faculty_name, alias, email,phone, long, lat, faculty_pix, school_id} = req.body;

            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456', 10);

            let updateFaculty = {
                faculty_name: faculty_name,
                alias: alias,
                email: email,
                phone: phone,
                long: long,
                lat: lat,
                faculty_pix: base64,
                school_id: school_id,
                password: password
            }
            await Faculty.update(updateFaculty,{
                where: {
                    id: req.params.id
                }
            })
                .then(response=>{
                    res.status(200).json({success:true, message: "Faculty account updated successfully."})
                })
                .then(err=>res.json({error: err}));

        }catch (e) {
            res.sendStatus(500);
        }
    }


}
module.exports = DeveloperController;



