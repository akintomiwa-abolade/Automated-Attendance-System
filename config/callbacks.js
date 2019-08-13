/**
|-------------------------------------
| A callback class for all constant
| function callbacks
|-------------------------------------
*/

module.exports ={
	async fetchSingle(modelName, val){

		return await modelName.findAll({
			where:{
				id:val
			}
		})
	},

	async validatePhone(modelName, val){

		return await modelName.findAll({
			where:{
				phone:val
			}
		})
	},

	async validateEmail(modelName, val){

		return await modelName.findAll({
			where:{
				email:val
			}
		})
	},

	async multiple(modelName, obj){
		return await modelName.findAll({
			where:obj
		})
	},

	async transform(name){
		var fullname = name;
		var splitName = fullname.split(' ');
		var newName = "";

		for (var i = 0; i < splitName.length; i++) {
			newName += ' '+splitName[i].charAt(0).toUpperCase() + splitName[i].slice(1);
		}

		return  newName;
	}
}
// try{
// 	var auth = req.decoded.user.is_auth;

// 	if(auth == 'developer')
// 	{

// 	}else{
// 		res.status(403).json({message: "Invalid request..."});
// 	}
// }catch(e){
// 	res.sendStatus(500)
// }
