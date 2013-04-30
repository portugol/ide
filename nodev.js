// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Nodev.js - CODEBY - SHAPES LIBRARY -                               │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ 																    │ \\
// │ Copyright © 2013 - ESTT - ESCOLA SUPERIOR DE TECNOLOGIA DE TOMAR   │ \\
// │ 																    │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ DEVELOP FOR: LEI - LICENCIATURA ENGENHARIA INFORMATICA             │ \\
// │              PSI - PROJECTO SISTEMAS INFORMACAO 2012/2013          │ \\
// │                                                                    │ \\
// │          BY: Jorge Martins   n.º 13683                             │ \\
// │              Rafael Costa    n.º 13686                             │ \\
// │              André Candido   n.º 14019                             │ \\
// │              Vasco Palmeirão n.º 14067                             │ \\
// │              Joni Correia    n.º 15501                             │ \\
// │              João Graça      n.º 15190                             │ \\
// │              Pedro Pacheco   n.º 15305                             │ \\
// │              André Farinha   n.º 16181                             │ \\
// │              João Mauricio   n.º 16499                             │ \\
// └────────────────────────────────────────────────────────────────────┘ \\


/*
*
* Nodev.js
* In this class is defined all drawable shapes used by 
* IDE in Codeby system.
*
* Nodev recives as parameters
* r: Raphael Paper Object
* type: is the shape to draw
* 	1 - Begin
*  	2 - End
*  	3 - Read
*  	4 - Write
*  	5 - Process
*  	6 - If
*  	7 - For
*  	8 - 
* data: Contains the text of the shape
******** NOT IMPLEMENTED YET ************
*  x: define the X position
*  y: define the Y position
*  w: define the WIDTH of the shape
*  h: define the HIGTH of the shape
* rx: define the X Radius of the ellipse
* ry: define the Y Radius of the ellipse 
*/


var NodeV = function (r, type, data){
	this.node = new Node(type, data);

	this.r = r;

	/*
	*
	* Defines all shapes used in IDE drawing
	* Attributes
	*  x: define the X position
	*  y: define the Y position
	*  w: define the WIDTH of the shape
	*  h: define the HIGTH of the shape
	* rx: define the X Radius of the ellipse
	* ry: define the Y Radius of the ellipse 
	* in JOINSHAPE the h attr defines the radius 
	*
	*/
	Raphael.fn.MyShapes = {
		beginshape: function(x, y, rx, ry, text){
			var el = r.ellipse(x, y, rx, ry).attr({fill: "red", stroke: "none", opacity: .5});
			// ellipse(200,200,50,100);
			var text = r.text(el.attr('cx'),el.attr('cy'),text).attr({fill: 'black'});;
			var set = r.set(el,text);
			//el.drag(move, start, up);
			return set;
		},
		endshape: function(x, y, rx, ry, text){
			var el = r.ellipse(x, y, rx, ry).attr({fill: "red", stroke: "none", opacity: .5});
			var text = r.text(el.attr('cx'),el.attr('cy'),text).attr({fill: 'black'});;
			var set = r.set(el,text);
			return set;
		},
		readshape: function(x, y, w, h){
			var el = r.path("M{0},{1} L{2},{1} L{3},{4}, L{5},{4} L{0},{1}  z", x+20, y, x+w, x+w-20, y+h, x);
			// read=path("M20,0 L100,0 L80,70 L0,70 L20,0 Z");
			
 			el.attr({fill: 'orange', stroke: 'none',opacity: .5});
 			var text = r.text((x+w/2),(y+h/2),'Click Me').attr({fill: 'black'});;
			var set = r.set(el, text);
		    r.customAttributes.pathXY = function(nx, ny ) {
		        return { path: Raphael.transformPath(this.attr('path'), ['T', nx - el.attr('path')[0][1], ny - el.attr('path')[0][2] ]) };
		    };
		    el.attr({pathXY: [el.attr('path')[0][1],el.attr('path')[0][2]]});
			return set;

		},
		writeshape: function(x, y, w, h, data){
			var el = r.path("M{0},{1} L{2},{1} L{2},{3} L{4},{3} L{4},{5} L{0},{1} z", x+20, y, x+w, y+h, x, y+20);
			//write=path("M20,0 L100,0 L100,70 L0,70 L0,20 L20,0 Z");
			
 			el.attr({fill: 'orange', stroke: 'none',opacity: .5});
 			var text = r.text((x+w/2),(y+h/2),'Click Me').attr({fill: 'black'});;
			var set = r.set(el, text);
		    r.customAttributes.pathXY = function(nx, ny ) {
		        return { path: Raphael.transformPath(this.attr('path'), ['T', nx - el.attr('path')[0][1], ny - el.attr('path')[0][2] ]) };
		    };
		    el.attr({pathXY: [el.attr('path')[0][1],el.attr('path')[0][2]]});
			return set;
		},
		ifshape: function(x, y, w, h){
			var el = r.path("M{0},{1} L{2},{3} L{0},{4} L{5},{3} z", x+(w/2), y, x+w, y+(h/2),y+h,x);
			//if=path("M25,0 L75,50 L50,75 L0,50 L25,0 Z");
			
 			el.attr({fill: 'orange', stroke: 'none',opacity: .5});
 			var text = r.text((x+w/2),(y+h/2),'Click Me').attr({fill: 'black'});;
			var set = r.set(el, text);
		    r.customAttributes.pathXY = function(nx, ny ) {
		        return { path: Raphael.transformPath(this.attr('path'), ['T', nx - el.attr('path')[0][1], ny - el.attr('path')[0][2] ]) };
		    };
		    el.attr({pathXY: [el.attr('path')[0][1],el.attr('path')[0][2]]});
			return set;
		},
		forshape: function(x, y, w, h){

		},
		processshape: function(x, y, w, h){
			var el = r.rect(x,y,w,h);
			//process=path("M0,0 L100,0 L100,70 L0,70 L0,0 Z");
			
 			el.attr({fill: 'orange', stroke: 'none',opacity: .5});
 			var text = r.text((x+w/2),(y+h/2),'Click Me').attr({fill: 'black'});;
			var set = r.set(el, text);
		    r.customAttributes.pathXY = function(nx, ny ) {
		        return { path: Raphael.transformPath(this.attr('path'), ['T', nx - el.attr('path')[0][1], ny - el.attr('path')[0][2] ]) };
		    };
		    el.attr({pathXY: [el.attr('path')[0][1],el.attr('path')[0][2]]});		    

			return set;
		},
		switchshape: function(x, y, w, h){
			var el = r.path("M{0},{1} L{2},{1} L{3},{4} L{2},{5} L{2},{5} L{0},{5} L{6},{4} z", x+(w/3), y, x+(2*(w/3)), x+w, y+(h/2), y+h, x);
			
 			el.attr({fill: 'orange', stroke: 'none',opacity: .5});
 			var text = r.text((x+w/2),(y+h/2),'Click Me').attr({fill: 'black'});;
			var set = r.set(el, text);
		    r.customAttributes.pathXY = function(nx, ny ) {
		        return { path: Raphael.transformPath(this.attr('path'), ['T', nx - el.attr('path')[0][1], ny - el.attr('path')[0][2] ]) };
		    };
		    el.attr({pathXY: [el.attr('path')[0][1],el.attr('path')[0][2]]});
			return set;

		},
		returnchape: function(x, y, w, h){

		},
		joinshape: function(x, y, h){
			var el = r.circle(x, y, h).attr({fill: "yellow", stroke: "none", opacity: .5});
			//var text = r.text(el.attr('cx'),el.attr('cy'),text).attr({fill: 'black'});;
			var set = r.set(el);
			//el.drag(move, start, up);
			return set;

		},
		commentshape: function(x, y, w, h){
			var el = r.path("M{0},{1} L{2},{1} L{2},{3} L{4},{3} L{5},{6} L{7},{3} L{0},{3} L{0},{1} z",	x, y, x+w, y+h, x+(3*(w/4)), x+(w/4), y+h+(h/4), x+(w/8));
			
 			el.attr({fill: 'orange', stroke: 'none',opacity: .5});
 			var text = r.text((x+w/2),(y+h/2),'Click Me').attr({fill: 'black'});;
			var set = r.set(el, text);
		    r.customAttributes.pathXY = function(nx, ny ) {
		        return { path: Raphael.transformPath(this.attr('path'), ['T', nx - el.attr('path')[0][1], ny - el.attr('path')[0][2] ]) };
		    };
		    el.attr({pathXY: [el.attr('path')[0][1],el.attr('path')[0][2]]});
			return set;

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
			this.shape = r.MyShapes.endshape(200,450,50,30,'END');
			//this.shape ='endshape';
			break;
		case 3:
			// READ SHAPE
			this.shape = r.MyShapes.readshape(200,300,100,65,this.node.data);
			break;
		case 4:
			// WRITE SHAPE
			this.shape = r.MyShapes.writeshape(200,200,100,65,this.node.data);
			break;
		case 5:
			// IF SHAPE
			this.shape = r.MyShapes.ifshape(200,300,100,65,this.node.data);
			break;
		case 6:
			// PROCESS SHAPE
			this.shape = r.MyShapes.processshape(200,300,100,65,this.node.data);
			break;
		case 7:
			// FOR SHAPE
			break;
		case 8:
			// SWITCH SHAPE
			this.shape = r.MyShapes.switchshape(200,300,99,66,this.node.data);
			break;
		case 9:
			// JOIN SHAPE
			this.shape = r.MyShapes.joinshape(200,300,20);
			break;
		case 10:
			// RETURN SHAPE
			
			break;
		case 11:
			// COMMENT SHAPE
			this.shape = r.MyShapes.commentshape(200,300,100,65,this.node.data);
			break;
	}
	

};