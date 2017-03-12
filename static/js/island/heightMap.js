"use strict"

var islandSize = 60;
var quarterSize = Math.trunc(islandSize*.5);
var heights = [];
var steepness = .2;

function findAvg(x, z) {
    var avg = (heights[x-1][z-1] + heights[x  ][z-1] + heights[x+1][z-1] +
               heights[x-1][z  ] + heights[x  ][z  ] + heights[x+1][z  ] +
               heights[x-1][z+1] + heights[x  ][z+1] + heights[x+1][z+1]) / 9;
    return avg;
}

function ulAvg(x, z) {
    var avg = (heights[x-1][z-1] + heights[x][z-1] + heights[x-1][z]) / 3;
    return avg;
}

function urAvg(x, z) {
    var avg = (heights[x][z-1] + heights[x+1][z-1] + heights[x+1][z]) / 3;
    return avg;
}

function llAvg(x, z) {
    var avg = (heights[x-1][z] + heights[x-1][z+1] + heights[x][z+1]) / 3;
    return avg;
}

function lrAvg(x, z) {
    var avg = (heights[x][z+1] + heights[x+1][z+1] + heights[x+1][z]) / 3;
    return avg;
}

for(var x=0; x<islandSize+1; x++) {
    heights[x]=[];
    for(var z=0; z<islandSize+1; z++) {
        heights[x][z]=-0.15;
    }
}


// Upper Left
for(var x=1; x<quarterSize; x++) {
    for(var z=1; z<quarterSize; z++) {
        //var rand=Math.random();
        //heights[x][z] = (rand <= 0.6) ? ulAvg(x,z)+(steepness*Math.random()) : ulAvg(x,z)-(steepness*Math.random());
        heights[x][z] = (x < quarterSize/2) ? ulAvg(x,z)+(steepness*Math.random()) : ulAvg(x,z)-(steepness*Math.random());
    }
}

// Lower Right
for(var x=islandSize-1; x>quarterSize; x--) {
    for(var z=islandSize-1; z>=quarterSize; z--) {
        //var rand=Math.random();
        //heights[x][z] = (rand <= 0.55) ? lrAvg(x,z)+(steepness*Math.random()) : lrAvg(x,z)-(steepness*Math.random());
        heights[x][z] = (x < (3*quarterSize)/2) ? lrAvg(x,z)+(steepness*Math.random()) : lrAvg(x,z)-(steepness*Math.random());
    }
}

// was 21
for(var x=islandSize-13; x>quarterSize; x--) {
    for(var z=islandSize-13; z>=quarterSize; z--) {
        //var rand=Math.random();
        //heights[x][z] = (rand <= 0.6) ? lrAvg(x,z)+(1*Math.random()) : findAvg(x,z)-(0*Math.random());
        heights[x][z] = (x < 39) ? lrAvg(x,z)+(1*Math.random()) : findAvg(x,z)-(0*Math.random());
    }
}
