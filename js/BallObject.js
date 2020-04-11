"use strict"; 
/* exported GameObject */
class BallObject extends UniformProvider {
  constructor(mesh) { 
    super("gameObject");

    this.position = new Vec3(0, 0, 0); 
    this.scale = new Vec3(1, 1, 1); 
    this.roll = 0; 
    this.pitch = 0; 
    this.yaw = 0; 
    
    this.move = function(){};
    this.control = function(){};
    this.force = new Vec3();
    this.torque = 0;
    this.velocity = new Vec3();
    this.invMass = 1;
    this.invAngularMass = 1;
    this.angularVelocity = new Vec3();
    this.angularDrag = 1;

    this.rotation = new Mat4();
    this.addComponentsAndGatherUniforms(mesh); // defines this.modelMatrix
  }

  update() {
  	this.modelMatrix.set().
  		scale(this.scale).
      mul(this.rotation).         
  		translate(this.position);
  }
}