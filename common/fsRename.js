let fs = require('fs'),
	path = require('path');
module.exports = async function(oldName, newName){
	return new Promise((resolve, reject) => {
		let newDir = path.dirname(newName), 
			_rename = function(){
				fs.rename(oldName, newName, function(err){
					if(err) reject(err);
					resolve(newName);
				});
			};
		if(!fs.existsSync(newDir)){
			fs.mkdir(newDir, function(err){
				if(err) reject(err);
				_rename();
			});
		}
		_rename();
	});
};