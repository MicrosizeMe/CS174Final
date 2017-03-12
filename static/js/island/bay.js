"use strict"

var steepness = .3;

for(var x=quarterSize; x<islandSize; x++) {
    for(var z=quarterSize; z>0; z--) {
        //var rand=Math.random();
        //heights[x][z] = (rand <= 0.5) ? llAvg(x,z)+(steepness*Math.random()) : llAvg(x,z)-(steepness*Math.random());
        heights[x][z] = (x % 2 == 0) ? llAvg(x,z)+(steepness*Math.random()) : llAvg(x,z)-(steepness*Math.random());
    }
}

//smooth everything
for(var x=1; x<islandSize; x++) {
    for(var z=1; z<islandSize; z++) {
        heights[x][z]=findAvg(x,z);
    }
}

//smooth everything
for(var x=1; x<islandSize; x++) {
    for(var z=1; z<islandSize; z++) {
        heights[x][z]=findAvg(x,z);
    }
}

