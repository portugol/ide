var Node = function (type, data, uuid, dx, dy){
	this.type = type;
	//console.log(uuid);
	this.uuid = uuid;
	if(data !== undefined || data !== null){
		this.data = data;
	}

	//para guardar as posicoes dos nodes para depois volta a fazer o redraw
	this.dx = dx;
	this.dy = dy;
};