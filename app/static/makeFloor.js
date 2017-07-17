function load() {
    var data;
    $.getJSON("../static/data.json", function(data) {
        console.log("My data: " + data["features"]);
      	buildCanvas(data);
    })	
}

var hoverObjects = [];
var stage; 
var data;
var canvas;
var buildCanvas = function(data) {
    canvas = document.getElementById("floorCanvas");
    stage = new createjs.Stage(canvas);
    data = data;
   
    var rect = new createjs.Shape();
    rect.graphics.setStrokeStyle(0.2).beginStroke("rgba(0,0,0,1)").drawRect(2, 2, 1000, 600);
    stage.addChild(rect);
    stage.enableMouseOver(20); 

    var currentLocation = new createjs.Bitmap("../static/location.jpg");
    stage.addChild(currentLocation);
    currentLocation.x = 500;
    currentLocation.y = 200;
    currentLocation.name = "my_loc";
    currentLocation.scaleX = .5;
    currentLocation.scaleY = .5;
    currentLocation.image.onload = function() {
        stage.scaleX = stage.scaleY = 0.7;
        stage.update();
    };
    currentLocation.addEventListener("mouseover", handleMouseOver);
    currentLocation.addEventListener("mouseout", handleMouseOut);
    hoverObjects.push([currentLocation.name, "You"]);

	for(var i = 0; i < data.features.length ; i++ ) {
		var geometry = data.features[i].geometry;
        var property = data.features[i].properties;
		if(geometry.type == "Line") {
			ctx.moveTo(geometry.coordinates[0][0], geometry.coordinates[0][1]);
			for( var j =1; j < geometry.coordinates.length; j++) {
				ctx.lineTo(geometry.coordinates[j][0], geometry.coordinates[j][1]);	
			}
			ctx.stroke();	
		}
	   if(geometry.type == "FilledRectangle") {
            var polygon = new createjs.Shape();
           
            polygon.graphics.moveTo(geometry.coordinates[0][0], geometry.coordinates[0][1]);
            polygon.graphics.setStrokeStyle(0.5).beginStroke("rgba(0,0,0,1)");
            polygon.graphics.beginFill("#dd4949");
			for( var j = geometry.coordinates.length -1; j >= 0; j--) {
			 polygon.graphics.lineTo(geometry.coordinates[j][0], geometry.coordinates[j][1]);
            }
            polygon.graphics.endFill();
            polygon.name = property.name;
            stage.addChild(polygon);
            hoverObjects.push([property.name, property.desc]);

            polygon.addEventListener("mouseover", handleMouseOver);
            polygon.addEventListener("mouseout", handleMouseOut);
            polygon.addEventListener("click", handleMouseClick);
		}
	}
    stage.scaleX = stage.scaleY = 0.7;
    stage.update();
}
function handleMouseClick(event) {
    var bookName = document.getElementById('autocomplete').value;
    var form = document.createElement("form");
    input1 = document.createElement("input");
    input2 = document.createElement("input");
    form.action = "/shelf";
    form.method = "post"
    input1.type = "hidden";
    input1.name = "shelf_name";
    input1.value = event.currentTarget.name;
    input2.type = "hidden";
    input2.name = "book";
    input2.value = bookName;
    form.appendChild(input1).appendChild(input2);
    document.body.appendChild(form);
    form.submit();
    event.currentTarget.name; // this is the shelf_name which we get when clicked
}





function handleMouseOver(event) {
    var d = document.getElementById('info_obj');
    d.style.position = "absolute";
    d.style.display = "block";
    var x =  event.localX  * 0.7;
    var y =  event.localY * 0.7;
    d.style.left = x + 50 +'px';
    d.style.top = y  + 'px';
    for(var i = 0; i < hoverObjects.length; i++) {
        if(hoverObjects[i][0] == event.currentTarget.name) {
            d.innerHTML = hoverObjects[i][1];
        }
    }
}
function handleMouseOut(event) {
    var d = document.getElementById('info_obj');
    d.style.position = "absolute";
    d.style.display = "none";
}


// TODO
function locateShelf() {
    stage.removeChild(stage.children[2]);
    var polygon = new createjs.Shape();
    polygon.graphics.setStrokeStyle(0.5).beginStroke("rgba(0,0,0,1)");
    polygon.graphics.beginFill("#ffe41c");
    polygon.graphics.moveTo(10, 10);
    polygon.graphics.lineTo(200, 10);
    polygon.graphics.lineTo(200, 50);
    polygon.graphics.lineTo(10, 50);
    polygon.graphics.lineTo(10, 10);
    polygon.graphics.endFill();
    stage.addChild(polygon);
    stage.update();
}
