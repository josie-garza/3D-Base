"use strict"; 
/* exported GameObject */
class BallObject extends UniformProvider {
  constructor(mesh) { 
    super("gameObject");

    this.position = new Vec3(0, 0, 0); 
    this.scale = new Vec3(1, 1, 1); 
    
    this.move = function(){};
    this.control = function(){};
    this.force = new Vec3();
    this.torque = 0;
    this.velocity = new Vec3();
    this.invMass = 1;

    this.invAngularMass = 1;
    this.angularVelocity = 0;
    this.angularDrag = 1;
    this.axis = new Vec3(1, 1, 1);
    this.rotateIn = new Mat4();
    this.orientation = 0;

    this.addComponentsAndGatherUniforms(mesh); // defines this.modelMatrix
  }

  update() {
    this.modelMatrix.set().scale(this.scale).rotate(this.orientation, this.axis.x, this.axis.y, this.axis.z).translate(this.position);
  }
}