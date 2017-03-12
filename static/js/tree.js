var Tree = (function() {
            var trees = [];
            var sticks = [];
            
            var trunkMaterial = new Material(
                                             vec4(0.627, 0.322, 0.176, 1.0),
                                             vec4(0.627, 0.322, 0.176, 1.0)
                                             );
            
            var foliageTex = null;
            
            function constructor(position, radius, height, age)
            {
            if(!foliageTex) {
            foliageTex = new Texture.fromImageSrc('/img/foliage.png');
            }
            
            var foliageMaterial = new Material(
                                               vec4(0.8, 1.0, 1.0, 1.0),
                                               vec4(0.3, 0.3, 0.3, 1.0)
                                               );
            
            this.position = position;
            this.radius   = radius;
            this.height   = height;
            
            this.trunk         = new HexagonalPrism(trunkMaterial, null, null);
            this.foliageRound  = new Sphere(foliageMaterial, foliageTex, false, null);
            this.foliageRound.radius = 2;
            
            this.stick = null;
            
            trees.push(this);
            }
            
            constructor.getTrees = function() {
            return trees;
            }
            
            constructor.getSticks = function() {
            return sticks;
            }
            
            constructor.drawTrees = function(dt) {
            var identMat = mat4();
            
            glHelper.enableBumping(true);
            trees.forEach(function(e) {
                          e.draw(dt, mat4());
                          });
            glHelper.enableBumping(false);
            }
            
            return constructor;
            })();

Tree.prototype.checkCollision = function(pos, otherRadius) {
    var treeRadius = 0.17 * this.radius;
    var treeHeight = 4 * this.height + heightOf(pos[0], pos[2]);
    
    if(pos[1] > treeHeight * 2) {
        return false;
    }
    
    var dist = subtract(pos, this.trunk.position);
    
    // Ignore y-component, approximate using cylinder
    var distSq = (dist[0] * dist[0]) + (dist[2] * dist[2]);
    var radiusSq = otherRadius + treeRadius;
    radiusSq *= radiusSq;
    
    return distSq <= radiusSq;
}

Tree.prototype.draw = function(dt, mat) {
    var pos = this.position;
    
    var kX = this.radius;
    var kY = this.height;
    var kZ = this.radius;
    
    this.trunk.position = pos;
    this.trunk.scale = vec3(kX * 0.1, 1.0 * kY, kZ * 0.1);

    this.foliageRound.position  = add(pos, vec3(0.0, 1.0 * kY, 0.0));
    this.foliageRound.scale		= vec3(8.7 * kX, 8.5 * kY, 8.7 * kZ);
    
    this.trunk.draw(dt, mat);
    this.foliageRound.draw(dt, mat);
    
    if(this.stick) {
        this.stick.draw(dt, mat);
    }
}

Tree.prototype.addStick = function() {
    if(this.stick) {
        return;
    }
    
    // Pick a random 45 degree offset around the tree
    var rand = Math.floor(Math.random() * 10) - 1;
    var theta = rand * 45;
    var yaw = rand * -60;
    var rad = radians(theta);
    var sin = Math.sin(theta);
    var cos = Math.cos(theta);
    
    var y = Math.abs(Math.random() * this.height * 2);
    var radius = (this.radius * 0.15) + 0.15;
    var pos = vec3(radius * cos, y, radius * sin);
    
    var roll = Math.floor((Math.random() * 90) - 45);
    this.stick = new Stick(add(this.position, pos), yaw, 0, roll);
    this.stick.tree = this;
    
    Tree.getSticks().push(this.stick);
}
