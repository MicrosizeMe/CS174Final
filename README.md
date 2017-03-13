# CS174Final

Anbo Wei 604480880
Vamsi Mokkapati 404464206
Sabrina Chiang 204411921

WHAT THIS IS

This repository is the list of all files needed in order to run both the phone and desktop version
of this vr island simulator. It works off of a node.js server used to serve static files. Most of
the code works on the front end.

NO BUT REALLY WHAT IS GOING ON

You just walk around an island. There is calming ocean sounds and not calming footsteps. Feel free
to run around using shift, or jump using space. Enjoy some trees. Enjoy your solitude.


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

BUT WAIT I DON'T HAVE GOOGLE CARDBOARD OR A VR HEADSET

okay don't enjoy an island fine then 

But the code all still works if you go to the website on your phone.
You just see a split screen, one for each eye. 


Advance topics are collision detection (with trees and the water) (don't drown yourself)
 and physics (via jumping).