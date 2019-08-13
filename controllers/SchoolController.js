/*
/ ------------------------------------
/ School Controller
/ ------------------------------------
/ Holds the basic operation
/ of the School controlled
/ by the Senate
*/
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const School = require('../middlewares/models/').School;
const Faculty = require('../middlewares/models/').Faculty;
const LectureHall = require('../middlewares/models/').LectureHall;
const Level = require('../middlewares/models/').Level;

require('dotenv').config();
var secret = process.env.SECRET;

class SchoolController{

    // School login
    static async schoolLogin(req, res){
        try{
            const {email,password} = req.body;
            await School.findAll({
                where:{email: email}
            })
                .then(school=>{
                    if(school.length == 0){
                        res.status(400).json({message: "Sorry, school does not exist."});
                    }else{
                        var passwordIsValid = bcrypt.compareSync(req.body.password, school[0].dataValues.password.trim());

                        if (passwordIsValid){
                            var schDetails = {
                                id: school[0].dataValues.id,
                                school_name: school[0].dataValues.school_name,
                                phone: school[0].dataValues.phone,
                                is_auth: 'senate'
                            }
                            var token = jwt.sign({
                                school: schDetails
                            }, secret, {
                                expiresIn: '1d'
                            });

                            res.status(200).json({
                                success: true,
                                school: schDetails,
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

    // School create faculty account
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

    // School view all Faculties
    static async fetchFacAccount(req, res){
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

    // School update Faculty account
    static async updateFacAccount(req, res){
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

    // School delete faculty account
    static async deleteFacultyAccount(req, res){
        try{
            let id = req.params.id;

            await Faculty.findAll({
                where: {id: id}
            })
                .then(result=>{
                    if(result.length == 1){
                        Faculty.destroy({
                            where:{id: id}
                        })
                            .then(deleted => {
                                res.status(200).json({success: true, message: "Faculty account deleted successfully"});
                            });
                    }else{
                        res.status(404).json("Sorry, operation could not be completed.");
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // School create or add new lecture hall
    static async createLectureHall(req, res){
        try{
            const {hall_name, alias, capacity, long, lat, hall_pix, school_id} = req.body;
            let base64 = req.file.buffer.toString("base64");

            await LectureHall.findAll({
                where:{school_id: school_id}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({message: "Sorry, lecture hall already exist in this School."})
                    }else{
                        let createNewHall = {
                            hall_name: hall_name,
                            alias: alias,
                            capacity: capacity,
                            long: long,
                            lat: lat,
                            hall_pix: base64,
                            school_id: school_id
                        }
                        LectureHall.create(createNewHall)
                            .then(data=>{
                                res.status(201).json({success:true, hallData: data});
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

    // School view all lecture halls
    static async fetchHalls(req, res){
        try{
            let id = req.params.id;
            await LectureHall.findAll({
                attributes: ['hall_name','alias','capacity'],
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
                        res.status(400).json({message: "Sorry, no lecture hall created"});
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // --CHECK School view a particular lecture hall
    static async fetchSingleHall(req, res){
        try{
            let id = req.params.id;
            await LectureHall.findAll({
                attributes: ['hall_name','alias','capacity'],
                where:{school_id: school_id},
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
                        res.status(400).json({message: "Sorry, no lecture hall created"});
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // School update hall account
    static async updateHall(req, res){
        try{
            const {hall_name, alias, capacity, long, lat, hall_pix, school_id} = req.body;
            let base64 = req.file.buffer.toString("base64");

            let updateHall = {
                hall_name: hall_name,
                alias: alias,
                capacity: capacity,
                long: long,
                lat: lat,
                hall_pix: base64,
                school_id: school_id,
            }
            await LectureHall.update(updateHall,{
                where: {
                    id: req.params.id
                }
            })
                .then(response=>{
                    res.status(200).json({success:true, message: "Lecture hall updated successfully."})
                })
                .then(err=>res.json({error: err}));

        }catch (e) {
            res.sendStatus(500);
        }
    }

    // School delete a lecture hall
    static async deleteHall(req, res){
        try{
            let id = req.params.id;

            await LectureHall.findAll({
                where: {id: id}
            })
                .then(result=>{
                    if(result.length == 1){
                        LectureHall.destroy({
                            where:{id: id}
                        })
                            .then(deleted => {
                                res.status(200).json({success: true, message: "Lecture hall deleted successfully"});
                            });
                    }else{
                        res.status(404).json("Sorry, operation could not be completed.");
                    }
                });
        }catch (e) {
            res.sendStatus(500);
        }
    }

    // School create or add new Level
    static async createLevel(req, res){
        try{
            const {level_name, description} = req.body;
            Level.findAll({
                where: {level_name: level_name}
            })
                .then(result=>{
                    if(result.length > 0){
                        res.status(203).json({message: "Sorry, level name already exist."});
                    }else{
                        var createNewLevel = {
                            level_name: level_name,
                            description: description
                        }
                        Level.create(createNewLevel)
                            .then(data=>{
                                    res.status(201).json({success: true, message: "New Level added", levelData: data});
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

    // School update level
    static async updateLevel(req, res){
        try{
            const {level_name, description} = req.body;

            let updateLevelData = {
                level_name: level_name,
                description: description
            }
            await Level.update(updateLevelData,{
                where: {
                    id: req.params.id
                }
            })
                .then(response=>{
                    res.status(200).json({success:true, message: "Level data updated successfully."})
                })
                .then(err=>res.json({error: err}));

        }catch (e) {
            res.sendStatus(500);
        }
    }

    // School delete a level
    static async deleteLevel(req, res){
        try{
            let id = req.params.id;

            await Level.findAll({
                where: {id: id}
            })
                .then(result=>{
                    if(result.length == 1){
                        Level.destroy({
                            where:{id: id}
                        })
                            .then(deleted => {
                                res.status(200).json({success: true, message: "Level data deleted successfully"});
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
module.exports = SchoolController;