var Node = function (r, type, data){
	this.type = type;

	this.r = r;

	switch(this.type){
		case 1:
			var el = r.circle(200,50,30).attr({fill: "red", stroke: "none", opacity: .5});
			var text = r.text(el.attr('cx'),el.attr('cy'),'Inicio').attr({fill: 'white'});;
			var set = r.set(el,text);
			this.shape = set;
			break;
		case 2:
			var el = r.circle(200,300,30).attr({fill: "yellow", stroke: "none", opacity: .5});
			var text = r.text(el.attr('cx'),el.attr('cy'),'Fim').attr({fill: 'white'});;
			var set = r.set(el,text);
			this.shape = set;
			break;
		case 3:
			var el = r.rect(200,150,80,50).attr({fill: 'orange', stroke: "none",opacity: .5});
			var text = r.text(el.attr('cx'),el.attr('cy'),'teste').attr({fill: 'white'});;//r.text((el.attr('x') + (el.attr('width')/2)), (el.attr('y') + (el.attr('height')/2)), 'ola mundo').attr({fill: 'white'});
			var set = r.set(el, text);
			this.shape = set;
			break;
	}
};