var Node = function (type, data, uuid,dx,dy){
	this.type = type;
	this.uuid = uuid;
	if(data !== undefined || data !== null){
		this.data = data;
	}
	this.dx = dx;
	this.dy = dy;
};