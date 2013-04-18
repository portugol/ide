// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Nodev.js - CODEBY - SHAPES LIBRARY -                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ 																    │ \\
// │ Copyright © 2013 - ESTT - ESCOLA SUPERIOR DE TECNOLOGIA DE TOMAR   │ \\
// │ 																    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ DEVELOP BY: LEI - LICENCIATURA ENGENHARIA INFORMATICA              │ \\
// │             PSI - PROJECTO SISTEMAS INFORMACAO 2012/2013           │ \\
// └────────────────────────────────────────────────────────────────────┘ \\


var NodeV = function (r, type, data){
	this.node = new Node(type, data);

	this.r = r;

	/*
	*
	* Defines all shapes used in IDE drawing
	* Attributes
	* x: define the X position
	* y: define the Y position
	* w: define the WIDTH of the shape
	* h: define the HIGTH of the shape
	* in JOINSHAPE the h attr defines the radius 
	*
	*/
	Raphael.fn.MyShapes = {
		beginshape: function(x, y, rx, ry, text){
			var el = r.ellipse(x, y, rx, ry).attr({fill: "red", stroke: "none", opacity: .5});
			var text = r.text(el.attr('cx'),el.attr('cy'),text).attr({fill: 'black'});;
			var set = r.set(el,text);
			//this.shape = set;
			var start = function () {
			  this.lastdx ? this.odx += this.lastdx : this.odx = 0;
			  this.lastdy ? this.ody += this.lastdy : this.ody = 0;
			  this.next.lastdx ? this.next.odx += this.next.lastdx : this.next.odx = 0;
			  this.next.lastdy ? this.next.ody += this.next.lastdy : this.next.ody = 0;
			  this.animate({"fill-opacity": 0.2}, 500);
			  this.next.animate({"fill-opacity": 0.2}, 500);
			},
			move = function (dx, dy) {
				//console.log("WriteShape Drag:",this);
			  	this.transform("T"+(dx+this.odx)+","+(dy+this.ody));
			  	this.next.transform("T"+(dx+this.odx)+","+(dy+this.ody));
			  	this.lastdx = dx;
			  	this.lastdy = dy;
			  	this.next.lastdx = dx;
			  	this.next.lastdy = dy;

			},
			up = function () {
			  this.animate({"fill-opacity": 1}, 500);
			  this.next.animate({"fill-opacity": 1}, 500);
			};
			el.drag(move, start, up);
			return set;
		},
		endshape: function(x, y, rx, ry, text){
			var el = r.ellipse(x, y, rx, ry).attr({fill: "red", stroke: "none", opacity: .5});
			var text = r.text(el.attr('cx'),el.attr('cy'),text).attr({fill: 'black'});;
			var set = r.set(el,text);
			//this.shape = set;
			var start = function () {
			  this.lastdx ? this.odx += this.lastdx : this.odx = 0;
			  this.lastdy ? this.ody += this.lastdy : this.ody = 0;
			  this.next.lastdx ? this.next.odx += this.next.lastdx : this.next.odx = 0;
			  this.next.lastdy ? this.next.ody += this.next.lastdy : this.next.ody = 0;
			  this.animate({"fill-opacity": 0.2}, 500);
			  this.next.animate({"fill-opacity": 0.2}, 500);
			},
			move = function (dx, dy) {
				//console.log("WriteShape Drag:",this);
			  	this.transform("T"+(dx+this.odx)+","+(dy+this.ody));
			  	this.next.transform("T"+(dx+this.odx)+","+(dy+this.ody));
			  	this.lastdx = dx;
			  	this.lastdy = dy;
			  	this.next.lastdx = dx;
			  	this.next.lastdy = dy;

			},
			up = function () {
			  this.animate({"fill-opacity": 1}, 500);
			  this.next.animate({"fill-opacity": 1}, 500);
			};
			el.drag(move, start, up);
			return set;
		},
		readshape: function(x, y, w, h){

		},
		writeshape: function(x, y, w, h, data){
			var el = r.path("M{0},{1} L{2},{1} L{2},{3} L{4},{3} L{4},{5} L{0},{1} z", x+20, y, x+w, y+h, x, y+20);
			
 			el.attr({fill: 'orange', stroke: 'none',opacity: .5});
 			var text = r.text((x+w/2),(y+h/2),'Click Me').attr({fill: 'black'});;
			var set = r.set(el, text);
			//el.type = 'writeshape';
			//this.shape = set;
			console.log(el);
			//#############################################\\
		    r.customAttributes.pathXY = function( nx,ny ) {
		        return { path: Raphael.transformPath(this.attr('path'), ['T', nx - el.attr('path')[0][1], ny - el.attr('path')[0][2] ]) };
		    };
		    el.attr({pathXY: [el.attr('path')[0][1],el.attr('path')[0][2]]});		    
			console.log(el);
			var start = function () {
			  this.lastdx ? this.odx += this.lastdx : this.odx = 0;
			  this.lastdy ? this.ody += this.lastdy : this.ody = 0;
			  this.next.lastdx ? this.next.odx += this.next.lastdx : this.next.odx = 0;
			  this.next.lastdy ? this.next.ody += this.next.lastdy : this.next.ody = 0;
			  this.animate({"fill-opacity": 0.2}, 500);
			  this.next.animate({"fill-opacity": 0.2}, 500);
			},
			move = function (dx, dy) {
				//console.log("WriteShape Drag:",this);
			  	this.transform("T"+(dx+this.odx)+","+(dy+this.ody));
			  	this.next.transform("T"+(dx+this.odx)+","+(dy+this.ody));
			  	this.lastdx = dx;
			  	this.lastdy = dy;
			  	this.next.lastdx = dx;
			  	this.next.lastdy = dy;

			},
			up = function () {
			  this.animate({"fill-opacity": 1}, 500);
			  this.next.animate({"fill-opacity": 1}, 500);
			};
			
			el.drag(move, start, up);
			return set;

		},
		ifshape: function(x, y, w, h){

		},
		forshape: function(x, y, w, h){

		},
		processshape: function(x, y, w, h){

		},
		switchshape: function(x, y, w, h){

		},
		returnchape: function(x, y, w, h){

		},
		joinshape: function(x, y, h){

		},
		commentshape: function(x, y, w, h){

		}
	};

	//alert(this.node.type);

	switch(this.node.type){
		case 1:
			// BEGIN SHAPE
			this.shape = r.MyShapes.beginshape(200,50,50,30,'BEGIN');
			//this.shape = 'behinshape';
			break;
		case 2:
			// END SHAPE
			this.shape = r.MyShapes.endshape(200,350,50,30,'END');
			//this.shape ='endshape';
			break;
		case 3:
			// WRITE SHAPE
			this.shape = r.MyShapes.writeshape(200,200,100,65,this.node.data);
			//this.shape = ;
			break;
		case 4:
			// IMAGE SHAPE
			var el = r.image("img.svg",200,200,80,150);
			var text = r.text((el.attr('x') + (el.attr('width')/2)), (el.attr('y') + (el.attr('height')/2)), this.node.data).attr({fill: 'black'});
			var set = r.set(el, text);
			this.shape = set;
			break;
		case 5:
			// WRITE SHAPE
			break;
		case 6:
			// READ SHAPE
			break;
		case 5:
			// PROCESS SHAPE
			break;
		case 5:
			// IF SHAPE
			break;
		case 5:
			// SWITCH SHAPE
			break;
		case 5:
			// ??? SHAPE
			break;
	}
	

};