"use strict";

var canvasId         = 'gl-canvas';
var vertexSourceId   = 'shader-vertex';
var fragmentSourceId = 'shader-fragment';

// Shader attributes/uniforms
var attrPosition           = 'vPosition';
var attrNormal             = 'vNormal';
var attrTexCoord           = 'texCoord';
var attrTangent            = 'objTangent';
var uniformModelMatrix     = 'modelMatrix';
var uniformProjViewMatrix  = 'projViewMatrix';
var uniformAmbientProduct  = 'ambientProduct';
var uniformDiffuseProduct  = 'diffuseProduct';
var uniformNormalMat       = 'normalMat';
var uniformLightPosition   = 'lightPosition';
var uniformTexSampler      = 'uSampler';
var uniformBumpTexSampler  = 'nSampler';
var uniformEnableLighting  = 'enableLighting';
var uniformUniformLighting = 'uniformLighting';
var uniformEnableBumpingV   = 'enableBumpingV';
var uniformEnableBumpingF   = 'enableBumpingF';

var shapes = [];
var sun;

var gl;
var canvas;
var program;
var camera;
var player;
var resetCount = 0;

var timer = new Timer();

var cutscene = false;

// Steps in for moving camera
var rotateDegree = 1;
var moveUnit = 0.075;
var mouseSensitivity = 0.1;

var mode = "headset";

// Set the shader attributes
var glHelper = (function() {
	var helper = {};
	function setAttrib(name, vbo) {
		var loc = gl.getAttribLocation(program, name);
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
	}

	function setUniformMat(name, mat) {
		var loc = gl.getUniformLocation(program, name);
		gl.uniformMatrix4fv(loc, false, flatten(mat));
	}

	function setUniformVec4(name, vec) {
		var loc = gl.getUniformLocation(program, name);
		gl.uniform4fv(loc, flatten(vec));
	}

	helper.setPositionAttrib = function(vbo) {
		setAttrib(attrPosition, vbo);
	}

	helper.setNormalAttrib = function(vbo) {
		setAttrib(attrNormal, vbo);
	}

	helper.setTangentAttrib = function(vbo) {
		setAttrib(attrTangent, vbo);
	}

	helper.setTexCoordAttrib = function(vbo) {
		var loc = gl.getAttribLocation(program, attrTexCoord);
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
	}

	helper.setNormalModelMatrix = function(mat) {
		setUniformMat(uniformNormalMat, mat);
	}

	helper.setModelMatrix = function(mat) {
		setUniformMat(uniformModelMatrix, mat);
	}

	helper.setProjViewMatrix = function(mat) {
		setUniformMat(uniformProjViewMatrix, mat);
	}

	helper.setTexSampler = function(arg) {
		var loc = gl.getUniformLocation(program, uniformTexSampler);
		gl.uniform1i(loc, arg);
	}
	
	helper.setBumpTexSampler = function(arg) {
		var loc = gl.getUniformLocation(program, uniformBumpTexSampler);
		gl.uniform1i(loc, arg);
	}

	helper.uniformLighting = function(arg) {
		var loc = gl.getUniformLocation(program, uniformUniformLighting);
		gl.uniform1i(loc, (arg ? 1 : 0));
	}

	helper.enableLighting = function(arg) {
		var loc = gl.getUniformLocation(program, uniformEnableLighting);
		gl.uniform1i(loc, (arg ? 1 : 0));
	}

	helper.enableBumping = function(arg) {
		var loc = gl.getUniformLocation(program, uniformEnableBumpingF);
		gl.uniform1i(loc, (arg ? 1 : 0));
		loc = gl.getUniformLocation(program, uniformEnableBumpingV);
		gl.uniform1i(loc, (arg ? 1 : 0));
	}

	helper.setAmbientProduct = function(vec) {
		setUniformVec4(uniformAmbientProduct, mult(this.material.ambient, vec));
	}

	helper.setLightMaterial = function(mat){
		this.material = mat;
	}

	helper.setDiffuseProduct = function(vec) {
		setUniformVec4(uniformDiffuseProduct, mult(this.material.diffuse, vec));
	}

	helper.setLightPosition = function(vec) {
		var loc = gl.getUniformLocation(program, uniformLightPosition);
                gl.uniform3fv(loc, flatten(vec));
	}

	return helper;
})();

function handleOrientation(event) {
	console.log(event);
	// if (event.absolute) {
	var alpha = event.alpha; // Corresponding to yaw
	var beta = (90 - Math.abs(event.beta)) * ((event.beta > 0) ? 1 : -1); // Corresponding to roll
	var gamma = event.gamma; // Corresponding to pitch
	console.log("alpha: " + alpha + "\nbeta: " + beta + "\ngamma: " + gamma);

	player.camera.setYaw(alpha);
	player.camera.setRoll(beta);
	player.camera.setPitch(gamma);

	$("#output").html("event.absolute: " + event.absolute + "\nalpha: " + alpha + "\nbeta: " + beta + "\ngamma: " + gamma);
	// }
}

// Init function to start GL and draw everything
window.onload = function() {
	canvas = document.getElementById(canvasId);
	gl = WebGLUtils.setupWebGL(canvas);

	if(!gl) {
		var msg = 'Unable to start WebGL!';
		alert(msg);
		throw msg;
	}

	// Compile and load the gl program
	try {
		program = initShaders(gl, vertexSourceId, fragmentSourceId);
		gl.useProgram(program);
		gl.viewport(0, 0, canvas.width, canvas.height);
	} catch(e) {
		alert(e);
		throw e;
	}

	// Initialize the player
	player = new Player(canvas, vec3(quarterSize, 0, -quarterSize), moveUnit); // pos parameter = player's initial position.
    
    var waterMaterial = new Material(
        vec4(0.117, 0.5647, 1, 1),
        vec4(0.117, 0.5647, 1, 1)
    );
    
	var water = new Cube(waterMaterial, null, true, false);
	water.position = vec3(islandSize * 0.66, 0.0, islandSize * 0.66);
	water.scale = vec3(islandSize*10, 0.1, islandSize*10);
    
    var theIsland = new Island();

    sun = new Sun(300);
	shapes = [water, theIsland];
    
    /*
    for (var x=1; x<islandSize; x+=2)
    {
        for(var z=1; z<islandSize; z+=2)
        {
            var kXZ = 2.5 * (Math.random() + 1.5);
            var kY = 4.0 * (Math.random() * 0.3 +1.0);
            var age = Math.random();
            var rand = Math.random();
            if(heights[x][z]>0.21 && rand<=0.03 && (x < 49 || x > 51 || z < 29 || z > 31)) {
                new Tree(
                         vec3(x, heights[x][z] - 0.5, z),
                         kXZ, kY,
                         age);
            }
        }
    }
    */
    
    // Non-random tree placement
    for (var x=1; x<islandSize; x+=2)
    {
        for(var z=1; z<islandSize; z+=2)
        {
            var kXZ = 2.5 * (0.5 + 1.5);
            var kY = 4.0 * (0.5 * 0.3 +1.0);
            /*
            if(heights[x][z]>0.21 && (x == 20 || x == 40) && (z < 29 || z > 31)) {
                new Tree(
                         vec3(x, heights[x][z] - 0.5, z),
                         kXZ, kY);
            }
            */
            if (x == 19 || x == 41) {
                new Tree(
                         vec3(x, heights[x][z] - 0.5, z),
                         kXZ, kY);
            }
        }
    }
    
	draw();
    
    setTimeout(function() {
        var playerHandleKeyDown = function(e){ return player.handleKeyDown(e); }
        var playerHandleKeyUp = function(e){ return player.handleKeyUp(e); }
        var playerHandleMouseDown = function(){ return player.handleMouseDown(); }
		var playerHandleMouseUp = function(){ return player.handleMouseUp(); }
        window.addEventListener('keydown', playerHandleKeyDown);
        window.addEventListener('keyup', playerHandleKeyUp);
    	window.addEventListener('mousedown', playerHandleMouseDown);
		window.addEventListener('mouseup', playerHandleMouseUp);
		window.addEventListener('deviceorientation', handleOrientation);
    }, 3000);

    resetStuff();
}

function resetStuff() {
	var trees = Tree.getTrees();
}


// Draws the data in the vertex buffer on the canvas repeatedly
function draw() {

    resetCount++;
    if(resetCount > 1000) {
	    resetCount = 0;
	    resetStuff();
    }

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	glHelper.uniformLighting(true);
	glHelper.enableLighting(true);
	glHelper.enableBumping(false);
	player.move(); // This will set our camera in the world
	glHelper.setProjViewMatrix(player.camera.getProjViewMatrix());

	var identMat = mat4();
	var dt = timer.getElapsedTime();

	sun.draw(dt);  // This will set our light position and material

	dt += timer.getElapsedTime();
	Tree.drawTrees(dt);
	

	shapes.forEach(function(e) {
		dt += timer.getElapsedTime();
		e.draw(dt, identMat);
	});
    
	player.draw(); // Draw player on the phone screen
	glHelper.setLightMaterial(sun.lightMaterial);

	player.draw();
    if(cutscene) {
        if(player.camera.getRoll()!=0) {
            player.camera.rollBy(1);
        }
    }
	window.requestAnimFrame(draw);
}
