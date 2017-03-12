/*

The goal of this file is to act as a module that the rest of the front
end code will use to update both camera data (i.e yaw, pitch, roll) and
positional data (x, y, z, speed, so on) such that depending on the mode
of the handler, such data is either pushed to the server or retrieved 
from it.

mode a string equal to either "laptop", in which case positional data
is sent to the server and camera angle data is received from it, or 
"headset", in which case the opposite occurs.

*/

var mode = "laptop";
var IOHandler = function(mode) {
	this.mode = mode;
	this.state = {
		posX: 0,
		posY: 0,
		posZ: 0,
		yaw: 0,
		pitch: 0,
		roll: 0,
	};

	// Poll information from the server and push information 
	// as relevant.
	this.updateInfo = function() {
		console.log("startingUpdate");
		// Get information to be pushed
		var pushInfo = {};
		if (mode == "laptop") {
			pushInfo.clientID = "laptop";
			pushInfo.state = {
				posX: this.state.posX,
				posY: this.state.posY,
				posZ: this.state.posZ
			};
		}
		else if (mode == "headset") {
			pushInfo.clientID = "headset";
			pushInfo.state = {
				yaw: this.state.yaw,
				pitch: this.state.pitch,
				roll: this.state.roll
			};
		}

		$.ajax({
			method: "POST",
			url: "/apiSendInfo",
			data: pushInfo
		}).done(function(data) {
			console.log("!!!");
			if (mode == "laptop") {
				this.state.yaw = data.yaw;
				this.state.pitch = data.pitch;
				this.state.roll = data.roll;
			}
			else if (mode == "headset") {
				this.state.posX = data.posX;
				this.state.posY = data.posY;
				this.state.posZ = data.posZ;
			}
		});
	};

	this.setPos = function(x, y, z) {
		this.state.posX = posX;
		this.state.posY = posY;
		this.state.posZ = posZ;
	}

	this.setCamera = function(yaw, pitch, roll) {
		this.state.yaw = yaw;
		this.state.pitch = pitch;
		this.state.roll = roll;
	}
}; 

// Assume mode is a global variable declared elsewhere.
var ioHandler = new IOHandler(mode);

var updateLoop = function() {
	// Call the ioHandler's update function
	ioHandler.updateInfo();
	setTimeout(updateInfo, 17);
}

updateLoop();