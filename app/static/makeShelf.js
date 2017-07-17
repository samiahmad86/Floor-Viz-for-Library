function load() {
           // var json = require('./data.json');


        var data;
        $.getJSON("/data.json", function(data) {
            console.log("My data: " + data["features"]);
                // $.each(data["prime"], function(idx,prime) {
                //     alert("Prime number: " + prime);
                // });
            buildCanvas(data);
        })
            
        
}

var hoverObjects = [];
var stage; 
var data;
var canvas;
var shelfName = getParameterByName('shelf_name');
var bookName = getParameterByName('book');
var shelfCanvas = [];
var bookData = [["Algorithm - 1", "shelf_one"], ["Algorithm - 2", "shelf_one"],
               ["Informatic - 1", "shelf_two"], ["Informatic - 2", "shelf_two"],   ["HCI - 1", "shelf_three"], ["HCI - 2", "shelf_three"]];
var buildCanvas = function(data) {
        
        // console.log(data);
        // var ctx = document.getElementById("floorCanvas").getContext("2d");
        // ctx.rect(0,0,1000,600);
        // ctx.stroke();

        canvas = document.getElementById("floorCanvas");
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(20); 
        data = data;
       
     
        var myParam = location.search.split('shelf_name=')[1];

        
       

        for(var i = 0; i < data.features.length ; i++ ) {
           
            
           
           if((data.features[i].object == "Shelf") &&(data.features[i].properties.name == shelfName)) {
                
                var d = document.getElementById('info_obj');
                d.style.position = "absolute";
                d.style.display = "block";
                d.style.left = 600 +'px';
                d.style.top = 250 + 'px';
                d.innerHTML = data.features[i].properties.desc;

                var geometry = data.features[i].geometry;
                var property = data.features[i].properties;
                var shelfHeight = 500, shelfWidth = 400;
                var numRows = property.rows.length;
                var rowHeight = shelfHeight/numRows;
                var initial_x = 5, initial_y = 5;
                

                for( var j = 0; j < numRows; j++) {
                    var polygon = new createjs.Shape();
                    var shelfHasBook =  false;
                    if(bookName !== "") {
                       shelfHasBook = locateShelf(bookName, j, property);
                    }
                    if(shelfHasBook) {
                    polygon.graphics.setStrokeStyle(3)
                        .beginStroke("rgba(255,255,255,1)")
                        .beginFill("#92f442").drawRect(initial_x , (initial_y  +j * ( rowHeight) ) , shelfWidth, rowHeight);
                    } else {
                        polygon.graphics.setStrokeStyle(3)
                        .beginStroke("rgba(255,255,255,1)")
                        .beginFill("rgb(186, 169, 154)").drawRect(initial_x , (initial_y  +j * ( rowHeight) ) , shelfWidth, rowHeight);
                    }
                    polygon.name = property.rows[j].shelf_num;
                    polygon.addEventListener("mouseover", handleMouseOver);
                    polygon.addEventListener("mouseout", handleMouseOut);
                    
                    stage.addChild(polygon);
                    var rowData = property.rows[j];
                    shelfCanvas.push({polygon, rowData});

                }
                

                for(var k = 1; k <=numRows; k++) {
                        
                         // traversing each shelf
                         var rcount = 1;
                         var randomWidth =0;
                         text = new createjs.Text(property.rows[k-1].start + " - " + property.rows[k-1].end, "20px Arial", "#ff7700");
                         text.x = 450;
                        for(var l = initial_x; (l + randomWidth) < shelfWidth; l=l+randomWidth) {
                            var maxHeight = rowHeight / 1.5;
                        var minHeight = rowHeight / 2;
                        var maxWidth = maxHeight * 2 / 10;
                        var minWidth = minHeight * 2 / 10;
                        var color = getRandomColor();
                        
                        // var widthBook = shelfWidth / property.books_count[i];
                        var randomHeight = Math.random() * (maxHeight - minHeight) + minHeight;
                        var randomWidth = Math.random() * (maxWidth - minWidth) + minWidth;

                         
                         text.y = initial_y + rowHeight * k - rowHeight/2;
                         text.textBaseline = "alphabetic";
                            var polygon = new createjs.Shape();
                            polygon.graphics.setStrokeStyle(1)
                                .beginStroke("rgba(255,255,255,0.5)")
                                .beginFill(color).drawRect(initial_x + l, (initial_y + rowHeight * k - randomHeight ) , randomWidth, randomHeight);
                           
                            rcount ++;
                           stage.addChild(polygon); 
                          
                        }
                        stage.addChild(text);
                   
                        stage.update();

                    }
          



        }
    }
      
        stage.update();
        

}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function handleMouseOver(event) {

        for(var i = 0; i < shelfCanvas.length; i++) {

            if(shelfCanvas[i].rowData.shelf_num == event.currentTarget.name) {
                
                var d = document.getElementById('info_row');
                d.style.position = "absolute";
                d.style.display = "block";
                var x =  event.localX  * 1;
                var y =  event.localY * 1;
                d.style.left = x +'px';
                d.style.top = y  + 'px';
                d.innerHTML = shelfCanvas[i].rowData.start + '-' + shelfCanvas[i].rowData.end;
            }
        }

        // var d = document.getElementById('info_row');
        // d.style.position = "absolute";
        // d.style.display = "block";
        // var x =  event.localX  * 0.7;
        // var y =  event.localY * 0.7;
        // d.style.left = x + 50 +'px';
        // d.style.top = y  + 'px';
        // for(var i = 0; i < hoverObjects.length; i++) {
        //     if(hoverObjects[i][0] == event.currentTarget.name) {
        //         d.innerHTML = hoverObjects[i][1];
        //     }
        // }
}
function handleMouseOut(event) {
        var d = document.getElementById('info_row');
        d.style.position = "absolute";
        d.style.display = "none";

        
        // canvas.height = 1200;
        // canvas.width = 2000;
        // stage.scaleX = stage.scaleY = 2;
        // stage.update();
         
}


// TODO
function locateShelf(bookName, j, property) {

    var key = bookName[0].charCodeAt(0);
    var sName;
    for(var i = 0; i < bookData.length; i ++) {

        if(bookData[i][0] === bookName) {
             sName = bookData[i][1];
         }
     }

         
        
        if(sName === property.name) {

        for(var i = 0; i < property.rows.length; i++) {
                var startVal = property.rows[i].start.charCodeAt(0);
                var endVal = property.rows[i].end.charCodeAt(0);
                if((key >= startVal) && (key <=endVal)) {
                    if(j===i)
                    return true;
                }

            }
        }  
   
 return false;


}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
