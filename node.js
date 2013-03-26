var Node = function(r, type, data) {
	this.type = type;

	this.r = r;

	switch(this.type) {
		case 1:
			this.shape = this.r.ellipse(190, 100, 30, 20);
			break;
		case 2:
			this.shape = this.r.ellipse(190, 100, 30, 20);
			break;
		case 3:
			this.data = data;
			this.shape = this.r.rect(290, 180, 60, 40, 2);
			break;
	}
};

