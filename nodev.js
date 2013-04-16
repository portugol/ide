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
			/*var el = r.card(200,150,80,50,2).attr({fill: 'orange', stroke: 'none',opacity: .5});*/
			var el = r.rect(200,150,80,50,2).attr({fill: 'orange', stroke: 'none',opacity: .5});
			var text = r.text((el.attr('x') + (el.attr('width')/2)), (el.attr('y') + (el.attr('height')/2)), this.node.data).attr({fill: 'black'});
			var set = r.set(el, text);
			this.shape = set;
			break;
		case 4:
		/*
			var el = r.rect(200,150,80,50,2).attr({fill: 'orange', stroke: 'none',opacity: .5});
			var text = r.text((el.attr('x') + (el.attr('width')/2)), (el.attr('y') + (el.attr('height')/2)), this.node.data).attr({fill: 'black'});
			var set = r.set(el, text);
			this.shape = set;
			break;*/
			var el = r.image("img.svg",200,200,80,150);
			var text = r.text((el.attr('x') + (el.attr('width')/2)), (el.attr('y') + (el.attr('height')/2)), this.node.data).attr({fill: 'black'});
			var set = r.set(el, text);
			this.shape = set;
			break;
	}

	Raphael.fn.card = function(R , x, y) {
    	this.x = x;
    	this.y = y;
    	this.r = R;

 		var card = r.path('M19,0 L93,0 A5,5,0,0,1,98,5 L98,55 A5,5,0,0,1,93,60 L5,60 A5,5,0,0,1,0,55 L0,20 L19,0 z');
 			card.attr({fill: 'orange', stroke: 'none',opacity: .5});
    		//var card = r.Raphael.transformPath('M19,0 L93,0 A5,5,0,0,1,98,5 L98,55 A5,5,0,0,1,93,60 L5,60 A5,5,0,0,1,0,55 L0,20 L19,0 z', '0,0');
 		card.translate(x,y);

    return this;
}
};