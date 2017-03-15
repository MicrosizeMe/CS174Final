var Tree = (function() {
            var trees = [];
            var trunkMaterial = new Material(
                                             vec4(0.627, 0.322, 0.176, 1.0),
                                             vec4(0.627, 0.322, 0.176, 1.0)
                                             );
            
            var foliageTex = null;
            var memeTex = null;
            function constructor(position, radius, height)
            {
            
            // Apply the foliage image texture
            if(!foliageTex) {
            foliageTex = new Texture.fromImageSrc('/img/foliage.png');
            }
            
            if (!memeTex) {
            memeTex = new Texture.fromImageSrc('/img/friedman.jpg');
            }
            
            var foliageMaterial = new Material(
                                               vec4(0.8, 1.0, 1.0, 1.0),
                                               vec4(0.3, 0.3, 0.3, 1.0)
                                               );
            var memeMaterial = new Material(
                                            vec4(1.0, 1.0, 1.0, 1.0),
                                            vec4(1.0, 1.0, 1.0, 1.0)
                                            );
            
            this.position = position;
            this.radius   = radius;
            this.height   = height;
            
            
            // The tree trunks are hexagonal prisms, while the tree leaves are spherical.
            this.trunk         = new HexagonalPrism(trunkMaterial, null, null);
            this.foliageRound  = new Sphere(foliageMaterial, foliageTex, false, null);
            this.memeSquare = new Cube(memeMaterial, memeTex, true, false, null);
            this.foliageRound.radius = 2;
            
            trees.push(this);
            }
            
            constructor.getTrees = function() {
            return trees;
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
    
    // Ignore y-component, and approximate using a cylinder shape
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
    
    this.memeSquare.position  = add(pos, vec3(0.2 * kX, 1.0, 0.0));
    this.memeSquare.scale		= vec3(0.1 * kX, 0.1 * kY, 0.1 * kZ);
    
    this.trunk.draw(dt, mat);
    this.foliageRound.draw(dt, mat);
    this.memeSquare.draw(dt, mat);
}
