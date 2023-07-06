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


let chunkSize = 25;

let middleMouseDown = false;

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


generateTiles();
drawTiles();

function generateTiles(){

    for(let x = 0; x < columns; x++){ //column
        let column = [];

        for(let y = 0; y < rows; y++){ //row
            column.push(false);
        }

        tileMatrix.push(column);

    }

    // console.log(tileMatrix);
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
            
                //console.log( x + " " + y);
                addChunk(x,y);

            }
        }
    }

}

function drawChunk(chunkX, chunkY){

    const startingTileX = chunkX * chunkSize;
    const startingTileY = chunkY * chunkSize;

    for(let x = startingTileX; x < startingTileX + chunkSize; x++){ //column
        for(let y = startingTileY; y < startingTileY + chunkSize; y++){ //row
    
            ctx.beginPath();

            if(tileMatrix[x][y]){

                ctx.fillStyle = "white";
                drawShadow(x, y, "white");
            }else{
                ctx.fillStyle = "darkblue";
                drawShadow(x, y, "black");
            }

            ctx.stroke();
            ctx.fillRect(tileWidth * x, tileWidth * y, tileWidth, tileWidth);
            

        }
    }
}



function drawTiles(){

    console.log("draw tiles");
    //console.log(tileMatrix);

    // offset = [100,100];

    //get visible chunk coords

    //current tiles in height in window.

    //how many chunks is in that many tiles

    let visibleChunksX = Math.ceil(ctx.canvas.width / (tileWidth * chunkSize));
    let visibleChunksY = Math.ceil(ctx.canvas.height / (tileWidth * chunkSize));

    checkIfChunksNeedAdding(visibleChunksX, visibleChunksY);

    //which chunks need loading

    let startingChunkX = 0;
    let startingChunkY = 0;



    if(offset[0] != 0){
        startingChunkX = 1 / (Math.ceil((offset[0] / tileWidth) / chunkSize));
        console.log(startingChunkX);
    }

    if(offset[1] != 0){
        startingChunkY = 1 / (Math.ceil((offset[1] / tileWidth) / chunkSize));
        console.log(startingChunkY);

    }





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



    //load chunks

    endChunkX = visibleChunksX + startingChunkX;
    endChunkY = visibleChunksY + startingChunkY;



    for(let x = startingChunkX; x < endChunkX; x++){ //column

        for(let y = startingChunkY; y < endChunkY; y++){ //row

            drawChunk(x, y);

        }
    }


    // for(let x = 0; x < tileMatrix.length; x++){ //column
    //     for(let y = 0; y < tileMatrix[0].length; y++){ //row

    //         ctx.beginPath();

    //         if(tileMatrix[x][y]){
    //             ctx.fillStyle = "white";
    //             drawShadow(x, y, "white");
    //         }else{
    //             ctx.fillStyle = "darkblue";
    //             drawShadow(x, y, "black");
    //         }
            
    //         ctx.fillRect(tileWidth * x, tileWidth * y, tileWidth, tileWidth);
    //         ctx.stroke();

    //     }
    // }
}

function drawTile(x, y){


    if(!(tileMatrix[x] === undefined) && !(tileMatrix[x][y] === undefined)){ // to stop drawing in the y direction when there is no tile

        //clear previous tile
        ctx.clearRect(x * tileWidth, y * tileWidth, tileWidth, tileWidth);
        ctx.beginPath();

        if(!tileMatrix[x][y]){

            tileMatrix[x][y] = true;
            ctx.fillStyle = "white";

            //draw shadow
            drawShadow(x, y, "white");
        
        }else{

            tileMatrix[x][y] = false;
            ctx.fillStyle = "darkblue";
            drawShadow(x, y, "black");

        }

        ctx.stroke();
        ctx.fillRect(tileWidth * x, tileWidth * y, tileWidth, tileWidth);

    }else{
        //console.log(x + " " + y + " out of bounds");
    }


}


function drawShadow(x, y, colour){

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
        whiteContextMatrix[contextX][contextY].clearRect(x * tileWidth - (tileWidth/2), y * tileWidth - (tileWidth/2), tileWidth * 2, tileWidth * 2);
    }else{
        shadowctx = whiteContextMatrix[contextX][contextY];
        shadowctx.shadowBlur = 8;
        blackContextMatrix[contextX][contextY].clearRect(x * tileWidth - (tileWidth/2), y * tileWidth - (tileWidth/2), tileWidth * 2, tileWidth * 2);
    }

    //clear previous shadow
    shadowctx.clearRect(x * tileWidth - (tileWidth/2), y * tileWidth - (tileWidth/2), tileWidth * 2, tileWidth * 2);

    shadowctx.beginPath();
    shadowctx.fillStyle = "rgba(255, 255, 255, 1)";
    shadowctx.shadowColor = colour;

    shadowctx.stroke();
    shadowctx.fillRect(tileWidth * x, tileWidth * y, tileWidth, tileWidth);

    // clear rect fill to only show shadow
    shadowctx.clearRect(x * tileWidth, y * tileWidth, tileWidth, tileWidth);
   

}

shadowCanvas8.addEventListener('mouseover', (e) => {

    insideCanvas = true;

});

shadowCanvas8.addEventListener('mouseout', (e) => {

    insideCanvas = false;

});

addEventListener("mousemove", (e) => {

    if(insideCanvas){
        calculateHoveredTile(e.clientX, e.clientY);
    }
    
    if(middleMouseDown){
        initialX = e.clientX;
        initialY = e.clientY;


        console.log(e.clientX);
        console.log(e.clientY);
    }
    
});

shadowCanvas8.addEventListener("wheel", (e) => {
    e.preventDefault();

    console.log(e.deltaY);
    if(e.deltaY < 0){
        console.log("scroll up");
        tileWidth += 1;         
        drawTiles();

    }else{
        console.log("scroll down");
        if(tileWidth > 4){
            tileWidth -= 1; 
        }
        
        drawTiles();
    }

});

shadowCanvas8.addEventListener("mousedown", (e) => {

    if(e.button === 1){
        middleMouseDown = true;
        console.log("middle mouse down");
    }

});

shadowCanvas8.addEventListener("mouseup", (e) => {
    
    if(e.button === 1){
        middleMouseDown = false;
        console.log("middle mouse up");
    }

});

function calculateHoveredTile(pixelX, pixelY){

    x = Math.floor(pixelX / tileWidth);    
    y = Math.floor(pixelY / tileWidth);
    

    if(previousXTile != x || previousYTile != y){

        // if(!tileMatrix[x][y]){
           
        drawTile(x,y);
            //tileMatrix[x][y] = !tileMatrix[x][y];

        // }

        previousXTile = x;
        previousYTile = y;
        
    }

}



// container.addEventListener('pointerup', (e) => {
//     pointerDown = false;
// });

// container.addEventListener('pointerdown', (e) => {
    
//     initialAbsoluteLeft = origin.getBoundingClientRect().left - container.getBoundingClientRect().left; 
//     initialAbsoluteTop = origin.getBoundingClientRect().top; 

//     console.log(initialAbsoluteLeft);
//     console.log(initialAbsoluteTop);
    
//     initialXPos = e.clientX;
//     initialYPos = e.clientY;
//     pointerDown = true;

// });

// container.addEventListener('pointermove', (e) => {
    
//     if(pointerDown){
    
//         let differenceX = e.clientX - initialXPos;   
//         let differenceY = e.clientY - initialYPos;

//         origin.style.left = (initialAbsoluteLeft + differenceX) +'px';
//         origin.style.top = (initialAbsoluteTop + differenceY)  + 'px';

//     }
    
// });