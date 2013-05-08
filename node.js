var Node = function (type, data){
	this.type = type;
	if(data !== undefined || data != null){
		this.data = data;
	}
};