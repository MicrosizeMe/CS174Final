"use strict"

var steepness = .2;

for(var x=quarterSize; x<islandSize; x++) {
    for(var z=quarterSize; z>0; z--) {
        var rand=Math.random();
        if(rand <= 0.5) {
            heights[x][z]=llAvg(x,z)+(steepness*Math.random());
        }
        else {
            heights[x][z]=llAvg(x,z)-(steepness*Math.random());
        }
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

