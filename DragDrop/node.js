var Node = function (type, data){
	this.type = type;
	if(data !== undefined){
		this.data = data;
	}
	console.log('type: ' + this.type);
	console.log('data: ' + this.data);
};