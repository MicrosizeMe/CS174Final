# CS174Final

Anbo Wei
Vamsi Mokkapati
Sabrina Chiang

WHAT THIS IS

This repository is the list of all files needed in order to run both the phone and desktop version
of this vr island simulator. It works off of a node.js server used to serve static files. Most of
the code works on the front end.

HOW DO YOU RUN THIS

To run this, first install node. This repository does not contain required dependencies, so to 
install this, you need to install node.

Unpack the repository wherever you want to be and travel to the folder containing this readme. 
Type in the following commands:

npm install
node main.js

Assuming all dependencies are installed correctly (if not, you can install them manually by
typing "npm install [missing package]", where the missing package should be given to you),
the code can then be run. In order to actually run the code, you need to pull up the websites
on both your laptop or desktop and your phone (at /html/laptop.html and /html/phone.html 
respectively). These will both attempt to call home and send locational and directional data
respectively. Both are necessary for proper interaction. 

While this is occuring, you should be able to see a horrible spam of json objects printed out
in the console representing the data being sent from both sides of the front end. What these represent
are fairly self-evident. 

To close the server, simply to control + c. 


The code is also being hosted on my webserver at 192.241.227.179:9000/html/laptop.html and 
192.241.227.179:9000/html/phone.html, respectively, if none of that seems interesting.


Advance topics are collision and physics (via jumping)