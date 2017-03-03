let mongoose = require('mongoose'),
	config = require("../config/config.js"),
	db = mongoose.connect(config.mongodb);
	const userSchema = new mongoose.Schema({
		//username 为唯一索引不可重复
		username: {type: String, index: { unique: true, dropDups: true }},
		password: {type: String},
		time: {type: Date, default: Date.now},
		email: {type: String, default: ''}
	}),
	dataSchema = new mongoose.Schema({
		username: {type: String},
		post: {type: String},
		time: {type: Date, default: Date.now},
		img: {type: String, default: ''}
	}),
	DataModel = db.model('postDatas', dataSchema),
	UserModel = db.model('users', userSchema);
db.connection.on('error', function(err){
	console.log('连接错误', err);
});
db.connection.on('open', function(){
	console.log('连接成功');
});

exports.UserModel = async function(obj){
	return new Promise((resolve, reject) =>{
		new UserModel(obj).save(function(err, doc){
			if(err){
				if(err.code == 11000) {
					resolve({error: 11000});
				}else{
					reject(err);
				}
			}else{
				resolve(doc);
			}
		});
	}).catch(e =>{
		console.log(e);
	});
};

exports.Userfind = async function(obj){
	return new Promise((resolve, reject) => {
		UserModel.find(obj, function(err, doc){
			if(err){
				reject(err);
			}
			resolve(doc);
			
		});
	}).catch(e => {
		console.log(e);
	});
};

exports.DataModel = async function(obj){
	return new Promise((resolve, reject) =>{
		new DataModel(obj).save(function(err, doc){
			if(err) reject(err);
			resolve(doc);
		});
	});
};
exports.Datafind = async function(obj){
	return new Promise((resolve, reject) =>{
		DataModel.find(obj, function(err, docs){
			if(err) reject(err);
			resolve(docs);
		});
	});
};