function load() {
    var mycars = new Array();
    mycars[0]='Algorithm - 1';
    mycars[1]='Algorithm - 2';
    mycars[2]='Informatic - 1';
    mycars[3]='Informatic - 2';
    mycars[4]='HCI - 1';
    mycars[5]='HCI - 2';
    var options = '';
    for(var i = 0; i < mycars.length; i++)
        options += '<option value="'+mycars[i]+'" />';
    document.getElementById('anrede').innerHTML = options;
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
var shelfMapCanvas = [];
var shelfMapPoints = [];
var bookData = [["Algorithm - 1", "shelf_one"], ["Algorithm - 2", "shelf_one"],
["Informatic - 1", "shelf_two"], ["Informatic - 2", "shelf_two"],   ["HCI - 1", "shelf_three"], ["HCI - 2", "shelf_three"]];
var buildCanvas = function(data) {
    canvas = document.getElementById("floorCanvas");
    stage = new createjs.Stage(canvas);
    data = data;
    var rect = new createjs.Shape();
    rect.graphics.setStrokeStyle(0.2).beginStroke("rgba(0,0,0,1)").drawRect(2, 2, 1000, 600);
    stage.addChild(rect);
    stage.enableMouseOver(20); 
    var currentLocation = new createjs.Bitmap("location.jpg");
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
    for(var i = 0; i < data.features.length ; i++ ) {
      var geometry = data.features[i].geometry;
      var property = data.features[i].properties;
      if(geometry.type == "FilledRectangle") {
        var polygon = new createjs.Shape();   
        polygon.graphics.moveTo(geometry.coordinates[0][0], geometry.coordinates[0][1]);
        polygon.graphics.setStrokeStyle(0.5).beginStroke("rgba(0,0,0,1)");
        polygon.graphics.beginFill("#dd4949");
        var width =  geometry.coordinates[1][0] - geometry.coordinates[0][0];
        var height =  geometry.coordinates[2][1] - geometry.coordinates[1][1];
        polygon.graphics.drawRect(geometry.coordinates[0][0], geometry.coordinates[0][1], width, height);
        polygon.graphics.endFill();
        polygon.name = property.name;
        stage.addChild(polygon);
        var c = geometry.coordinates;
        var name = property.name;
        var desc = property.desc;
        hoverObjects.push({name, desc, c, polygon});
        polygon.addEventListener("mouseover", handleMouseOver);
        polygon.addEventListener("mouseout", handleMouseOut);
        polygon.addEventListener("click", handleMouseClick);
        shelfMapCanvas.push({polygon, c});
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
    for(var i = 0; i < hoverObjects.length; i++) {
        if(hoverObjects[i].name == event.currentTarget.name) {
            var d = document.getElementById('info_obj');
            d.style.position = "absolute";
            d.style.display = "block";
            var x =  event.localX  * 0.7;
            var y =  event.localY * 0.7;
            d.style.left = x + 50 +'px';
            d.style.top = y  + 'px';
            d.innerHTML = hoverObjects[i].desc;
            hoverObjects[i].polygon.graphics.moveTo(hoverObjects[i].c[0][0], hoverObjects[i].c[0][1]);
            var width = hoverObjects[i].c[1][0] - hoverObjects[i].c[0][0];
            var height =  hoverObjects[i].c[2][1] -  hoverObjects[i].c[1][1];
            hoverObjects[i].polygon.graphics.clear().beginFill("rgba(255,255,0,1)")
            .drawRect(hoverObjects[i].c[0][0], hoverObjects[i].c[0][1], width, height).endFill();
            stage.update();
        }
    }
}

function handleMouseOut(event) {
    var d = document.getElementById('info_obj');
    d.style.position = "absolute";
    d.style.display = "none";
    for(var i = 0; i < hoverObjects.length; i++) {
        if(hoverObjects[i].name == event.currentTarget.name) {
            d.innerHTML = hoverObjects[i].desc;
            hoverObjects[i].polygon.graphics.moveTo(hoverObjects[i].c[0][0], hoverObjects[i].c[0][1]);
            var width = hoverObjects[i].c[1][0] - hoverObjects[i].c[0][0];
            var height =  hoverObjects[i].c[2][1] -  hoverObjects[i].c[1][1];
            hoverObjects[i].polygon.graphics.clear().beginFill("#dd4949")
            .drawRect(hoverObjects[i].c[0][0], hoverObjects[i].c[0][1], width, height).endFill();
            stage.update();
        }
    }
}

// TODO
function locateShelf() {
    var bookName = document.getElementById('srch-term').value;
    for(var i = 0; i < bookData.length; i ++) {
        if(bookData[i][0] === bookName) {
            var shelfName = bookData[i][1];
            for( var i = 0; i< hoverObjects.length; i ++) {
                if(shelfName === hoverObjects[i].name) {
                    var d = document.getElementById('info_obj');
                    d.style.position = "absolute";
                    d.style.display = "block";
                    d.style.left = 50 +'px';
                    d.style.top = 150 + 'px';
                    d.innerHTML = hoverObjects[i].desc;
                    var width = hoverObjects[i].c[1][0] - hoverObjects[i].c[0][0];
                    var height =  hoverObjects[i].c[2][1] -  hoverObjects[i].c[1][1];
                    hoverObjects[i].polygon.graphics.clear().beginFill("rgba(255,255,0,1)")
                    .drawRect(hoverObjects[i].c[0][0], hoverObjects[i].c[0][1], width, height).endFill();
                    stage.update();
                    break;
                }
            }
            break;
        }
    }
    stage.update();
}
