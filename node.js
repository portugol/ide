var Node = function (type, data, uuid){
	this.type = type;
	//console.log(uuid);
	this.uuid = uuid;
	if(data !== undefined || data !== null){
		this.data = data;
	}
};