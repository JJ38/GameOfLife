var canvas = document.getElementById("GOLCanvas");

var shadowCanvas1 = document.getElementById("ShadowCanvas1"); 
var shadowCanvas2 = document.getElementById("ShadowCanvas2"); 
var shadowCanvas3 = document.getElementById("ShadowCanvas3"); 
var shadowCanvas4 = document.getElementById("ShadowCanvas4"); 

var shadowCanvas5 = document.getElementById("ShadowCanvas5"); 
var shadowCanvas6 = document.getElementById("ShadowCanvas6"); 
var shadowCanvas7 = document.getElementById("ShadowCanvas7"); 
var shadowCanvas8 = document.getElementById("ShadowCanvas8"); 

var ctx = canvas.getContext("2d");

var shadowctx1 = shadowCanvas1.getContext("2d");
var shadowctx2 = shadowCanvas2.getContext("2d");
var shadowctx3 = shadowCanvas3.getContext("2d");
var shadowctx4 = shadowCanvas4.getContext("2d");

var shadowctx5 = shadowCanvas5.getContext("2d");
var shadowctx6 = shadowCanvas6.getContext("2d");
var shadowctx7 = shadowCanvas7.getContext("2d");
var shadowctx8 = shadowCanvas8.getContext("2d");



let insideCanvas = false;

//stored in 2d array. Each couple refers to top left corner of tile.
const tileMatrix = [];
const chunkMatrix = [];
chunkMatrix.push([1]);

let previousXTile = -1;
let previousYTile = -1;

let rows = 25;
let columns = 25;
let tileWidth = 25;
let canvasWidth = tileWidth * columns;
let canvasHeight = tileWidth * rows;

let offset = [0,0];
let initialOffset = [0,0];


let chunkSize = 25;

let middleMouseDown = false;
let initialX = 0;
let initialY = 0;

ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;

// shadow canvas's
shadowctx1.canvas.width = canvasWidth;
shadowctx1.canvas.height = canvasHeight;

shadowctx2.canvas.width = canvasWidth;
shadowctx2.canvas.height = canvasHeight;

shadowctx3.canvas.width = canvasWidth;
shadowctx3.canvas.height = canvasHeight;

shadowctx4.canvas.width = canvasWidth;
shadowctx4.canvas.height = canvasHeight;

shadowctx5.canvas.width = canvasWidth;
shadowctx5.canvas.height = canvasHeight;

shadowctx6.canvas.width = canvasWidth;
shadowctx6.canvas.height = canvasHeight;

shadowctx7.canvas.width = canvasWidth;
shadowctx7.canvas.height = canvasHeight;

shadowctx8.canvas.width = canvasWidth;
shadowctx8.canvas.height = canvasHeight;


// generateTiles();



class Node {

    constructor()
    {
        this.matrix = generateMatrix();
        this.next = null;
        this.prev = null;
        this.up = null;
        this.down = null;

    }
}


const originNode = new Node();

console.table(originNode.matrix);


draw();



function generateMatrix(){

    matrix = []

    for(let y = 0; y < columns; y++){
        let column = [];

        for(let x = 0; x < rows; x++){
            column.push(false);
        }

        matrix.push(column);

    }

    return matrix;

}

function draw(){


    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shadowctx1.clearRect(0, 0, canvas.width, canvas.height);
    shadowctx2.clearRect(0, 0, canvas.width, canvas.height);
    shadowctx3.clearRect(0, 0, canvas.width, canvas.height);
    shadowctx4.clearRect(0, 0, canvas.width, canvas.height);
    shadowctx5.clearRect(0, 0, canvas.width, canvas.height);
    shadowctx6.clearRect(0, 0, canvas.width, canvas.height);
    shadowctx7.clearRect(0, 0, canvas.width, canvas.height);
    shadowctx8.clearRect(0, 0, canvas.width, canvas.height);

    //calculate visible chunks

    visibleChunks = [originNode];

    //draw chunks
    
    drawChunk(originNode);


}

function addChunk(chunkX, chunkY){

    //console.log("add chunk " + chunkX + " " + chunkY);

    // console.log(tileMatrix);
    // console.log(tileMatrix[chunkX * 25]);


    if(tileMatrix[chunkX * 25] === undefined){//columns

        addColumnsToChunk(chunkX, chunkY);
        //console.table(chunkMatrix);

    }else if(tileMatrix[chunkX * 25][chunkY * 25] === undefined){

        addRowsToChunk(chunkX, chunkY);
        //console.table(chunkMatrix);

    }

    //console.table(tileMatrix);
    
}

function addRowsToChunk(chunkX, chunkY){

    // console.log("No rows")
    //update existing array to add tiles

    chunkMatrix[chunkX].splice(chunkY, 0, 1);

    for(let x = 0; x < 25; x++){

        for(let y = 0; y < 25; y++){
            tileMatrix[chunkX * 25 + x].splice((chunkY * 25) + y, 0, false);
        } 

    }
}

function addColumnsToChunk(chunkX, chunkY){

    chunkMatrix.splice(chunkX, 0, [1]);

        // console.log("No columns")
        //create array to add tiles

        for(let x = 0; x < 25; x++){

            let column = [];

            for(let y = 0; y < 25; y++){
                column.splice(chunkX * 25 + y, 0, false);
            } 

            tileMatrix.splice(chunkX * 25 + x, 0, column);
        }

        if(tileMatrix[chunkY * 25] === undefined){

            addRowsToChunk(chunkX, chunkY);
            
        }

}

function checkIfChunksNeedAdding(visibleChunksX, visibleChunksY){


    for(let x = 0; x < visibleChunksX; x++){
        for(let y = 0; y < visibleChunksY; y++){
            if(chunkMatrix[x] === undefined || chunkMatrix[x][y] === undefined){
            
                addChunk(x,y);

            }
        }
    }

}

function drawChunk(node){

    for(let x = 0; x < chunkSize; x++){
        for(let y = 0; y < chunkSize; y++){
    
            ctx.beginPath();

            if(node.matrix[x][y]){
                ctx.fillStyle = "white";
                drawShadow(x, y, offset[0], offset[1], "white");
            }else{
                ctx.fillStyle = "darkblue";
                drawShadow(x, y, offset[0], offset[1], "black");
            }

            ctx.stroke();
            ctx.fillRect(offset[0] + (tileWidth * x), offset[1] + (tileWidth * y), tileWidth, tileWidth);  //offset x + (tilewidth * position x) , offset y + (tilewidth * position y)
        
        }
    }
}

function drawTile(x, y, matrix){

    console.log(matrix);

    //clear previous tile
    ctx.clearRect(offset[0] + (x * tileWidth), offset[1] + (y * tileWidth), tileWidth, tileWidth);
    ctx.beginPath();

    if(matrix[x] == undefined){
        return;
    }

    if(matrix[x][y] == undefined){
        return;
    }

    if(!matrix[x][y]){

        matrix[x][y] = true;
        ctx.fillStyle = "white";

        //draw shadow
        drawShadow(x, y, offset[0], offset[1], "white");
    
    }else{

        matrix[x][y] = false;
        ctx.fillStyle = "darkblue";
        drawShadow(x, y, offset[0], offset[1], "black");

    }

    ctx.stroke();
    ctx.fillRect(offset[0] + (tileWidth * x), offset[1] + (tileWidth * y), tileWidth, tileWidth);

}

function drawShadow(x, y, offsetX, offsetY, colour){

    // offsetX = 0;
    // offsetY = 0;

    blackContextMatrix = 
    [[shadowctx1, shadowctx2]
    ,[shadowctx3, shadowctx4]];

    whiteContextMatrix = 
    [[shadowctx5, shadowctx6]
    ,[shadowctx7, shadowctx8]];

    contextX = x % 2;
    contextY = y % 2;

    let shadowctx = null;
    if(colour != "white"){
        shadowctx = blackContextMatrix[contextX][contextY];
        shadowctx.shadowBlur = 1;
        whiteContextMatrix[contextX][contextY].clearRect(offsetX + (x * tileWidth - (tileWidth/2)), offsetY + (y * tileWidth - (tileWidth/2)), tileWidth * 2, tileWidth * 2);
    }else{
        shadowctx = whiteContextMatrix[contextX][contextY];
        shadowctx.shadowBlur = 8;
        blackContextMatrix[contextX][contextY].clearRect(offsetX + (x * tileWidth - (tileWidth/2)), offsetY + (y * tileWidth - (tileWidth/2)), tileWidth * 2, tileWidth * 2);
    }

    //clear previous shadow
    shadowctx.clearRect(offsetX + (x * tileWidth - (tileWidth/2)), offsetY + (y * tileWidth - (tileWidth/2)), tileWidth * 2, tileWidth * 2);

    shadowctx.beginPath();
    shadowctx.fillStyle = "rgba(255, 255, 255, 1)";
    shadowctx.shadowColor = colour;

    shadowctx.stroke();
    shadowctx.fillRect(offsetX + (tileWidth * x), offsetY + (tileWidth * y), tileWidth, tileWidth);

    // clear rect fill to only show shadow
    shadowctx.clearRect(offsetX + (x * tileWidth), offsetY + (y * tileWidth), tileWidth, tileWidth);
   

}

shadowCanvas8.addEventListener('mouseover', (e) => {

    insideCanvas = true;

});

shadowCanvas8.addEventListener('mouseout', (e) => {

    insideCanvas = false;

});

addEventListener("mousemove", (e) => {


    if(middleMouseDown){
        
        differenceX = initialX - e.clientX;
        differenceY = initialY - e.clientY;

        offset[0] = initialOffset[0] + differenceX * -1;
        offset[1] = initialOffset[1] + differenceY * -1;

        // console.log(offset[0]);
        // console.log(offset[1]);

        draw();
    }else if(insideCanvas){
        calculateHoveredTile(e.clientX, e.clientY);
    }
    
   
    
});

shadowCanvas8.addEventListener("wheel", (e) => {
    e.preventDefault();

    if(e.deltaY < 0){

        tileWidth += 1;         
        draw();

    }else{

        if(tileWidth > 4){
            tileWidth -= 1; 
        }
        
        draw();
    }

});

shadowCanvas8.addEventListener("mousedown", (e) => {

    if(e.button === 1){
        initialX = e.clientX;
        initialY = e.clientY;
        middleMouseDown = true;
        console.log("middle mouse down");
    }

});

shadowCanvas8.addEventListener("mouseup", (e) => {
    
    if(e.button === 1){
        middleMouseDown = false;
        initialOffset[0] = offset[0];
        initialOffset[1] = offset[1];

        console.log("middle mouse up");
    }

});

function calculateHoveredTile(pixelX, pixelY){

    x = Math.floor((pixelX + (offset[0] * -1)) / tileWidth);    
    y = Math.floor((pixelY + (offset[1] * -1)) / tileWidth);


    node = originNode;


    if(previousXTile != x || previousYTile != y){

        matrix = node.matrix;
           
        drawTile(x, y, matrix);
          
        previousXTile = x;
        previousYTile = y;
        
    }

}
