var NodeV = function (r, type, data){
	this.node = new Node(type, data);

	this.r = r;
	//alert(this.node.type);

	switch(this.node.type){
		case 1:
			var el = r.ellipse(200,50,50,30).attr({fill: "red", stroke: "none", opacity: .5});
			var text = r.text(el.attr('cx'),el.attr('cy'),'Inicio').attr({fill: 'black'});;
			var set = r.set(el,text);
			this.shape = set;
			break;
		case 2:
			var el = r.ellipse(200,300,50,30).attr({fill: "red", stroke: "none", opacity: .5});
			var text = r.text(el.attr('cx'),el.attr('cy'),'Fim').attr({fill: 'black'});;
			var set = r.set(el,text);
			this.shape = set;
			break;
		case 3:
			var el = r.rect(200,150,80,50).attr({fill: 'orange', stroke: 'none',opacity: .5});
			var text = r.text((el.attr('x') + (el.attr('width')/2)), (el.attr('y') + (el.attr('height')/2)), this.node.data).attr({fill: 'black'});
			var set = r.set(el, text);
			this.shape = set;
			break;
		case 4:
			var el = r.lineto(10,20,30);
			break;
	}
};