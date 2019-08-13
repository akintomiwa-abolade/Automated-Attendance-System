/*
/ ------------------------------------
/ Faculty Controller
/ ------------------------------------
/ Holds the basic operation
/ of the Faculty controlled
/ by the Dean
*/

const callbacks = require('../config/callbacks.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Faculty = require('../middlewares/models/').Faculty;
const Department = require('../middlewares/models/').Department;

require('dotenv').config();
var secret = process.env.SECRET;

class FacultyController{

    // Faculty login process
    static facultyLogin(req, res){
        try{
            const {email, password} = req.body;
            Faculty.findAll({
                where:{email: email}
            })
                .then(faculty=>{
                    if(faculty.length == 0){
                        res.status(400).json({message: "Sorry, faculty does not exist."});
                    }else{
                        var passwordIsValid = bcrypt.compareSync(req.body.password, faculty[0].dataValues.password.trim());

                        if (passwordIsValid){
                            var facDetails = {
                                id: faculty[0].dataValues.id,
                                faculty_name: faculty[0].dataValues.faculty_name,
                                phone: faculty[0].dataValues.phone,
                                is_auth: 'dean'
                            }
                            var token = jwt.sign({
                                faculty: facDetails
                            }, secret, {
                                expiresIn: '1d'
                            });

                            res.status(200).json({
                                success: true,
                                faculty: facDetails,
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

    // Faculty create or add new department
    static async createDepartmentAccount(req, res){
        try{
            const {dept_name, alias, email, phone, long, lat, dept_pix, faculty_id} = req.body;
            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456', 10);

            await Department.findAll({
                where: {alias: alias}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({message: "Sorry, department name already exist."});
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
                                res.status(201).json({message: "Department account created successfully.",deptData: data});
                            })
                            .catch(err=> res.json({error: err}));
                    }
                })
                .catch(err=>{
                    res.status(500);
                })

        }catch (e) {
            res.sendStatus(500)
        }
    }

    // Faculty view all departments account
    static async fetchDepartments(req, res){
        try{
            let id = req.params.id;
            await Department.findAll({
                attributes: ['dept_name','alias'],
                include: [
                    {
                        model: Faculty,
                        attributes: ['alias'],
                        where:{id: id}
                    }
                ]
            })
                .then(result=>{
                    if(result >=1){
                        res.status(201).json({success:true, result})
                    }else{
                        res.status(400).json({message: "No Department created"});
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }


    // Faculty update Department account
    static async updateDepartmentAccount(req, res){
        try{
            const {dept_name, alias, email, phone, long, lat, dept_pix, faculty_id} = req.body;

            var base64 = req.file.buffer.toString("base64");
            var password = bcrypt.hashSync('123456', 10);

            let updateDepartment = {
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
            await Department.update(updateDepartment,{
                where: {
                    id: req.params.id
                }
            })
                .then(response=>{
                    res.status(200).json({success:true, message: "Department account updated successfully."})
                })
                .then(err=>res.json({error: err}));

        }catch (e) {
            res.sendStatus(500);
        }
    }

    // Faculty delete department account
    static async deleteDepartmentAccount(req, res){
        try{
            let id = req.params.id;

            await Department.findAll({
                where: {id: id}
            })
                .then(result=>{
                    if(result.length == 1){
                        Department.destroy({
                            where:{id: id}
                        })
                            .then(deleted => {
                                res.status(200).json({success: true, message: "Department account deleted successfully"});
                            });
                    }else{
                        res.status(404).json("Sorry, operation could not be completed.");
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }
}
module.exports = FacultyController;