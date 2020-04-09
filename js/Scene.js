"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];

    this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
    this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");
    this.fsBackground = new Shader(gl, gl.FRAGMENT_SHADER, "background-fs.glsl");
    this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "background-vs.glsl");
    this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured)   
    this.programs.push(this.texturedProgram);
    this.backgroundProgram = new TexturedProgram(gl, this.vsBackground, this.fsBackground)   
    this.programs.push(this.backgroundProgram);

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.gameObjects = [];
    this.pokemonMaterials = [];

    this.envTexture = new TextureCube(gl, [
        "media/posx512.jpg",
        "media/negx512.jpg",
        "media/posy512.jpg",
        "media/negy512.jpg",
        "media/posz512.jpg",
        "media/negz512.jpg",]
        );
    this.backgroundMaterial = new Material(this.backgroundProgram);
    this.backgroundMaterial.envTexture.set(this.envTexture);
    this.texturedQuadGeometry = new TexturedQuadGeometry(gl);
    this.backgroundMesh = new Mesh(this.backgroundMaterial, this.texturedQuadGeometry);
    this.background = new GameObject(this.backgroundMesh);
    this.gameObjects.push(this.background);

    this.bodyMaterial = new Material(this.texturedProgram);
    this.bodyMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonDh.png"))
    this.pokemonMaterials.push(this.bodyMaterial);
    this.eyeMaterial = new Material(this.texturedProgram);
    this.eyeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonEyeDh.png"))
    this.pokemonMaterials.push(this.eyeMaterial);
    this.pokemonMesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", this.pokemonMaterials);
    this.avatar = new GameObject(this.pokemonMesh);
    //this.gameObjects.push(this.avatar);

    this.avatar.position.set(0, -1, 0);
    this.avatar.scale.set(0.1, 0.1, 0.1);
    this.avatar.yaw = 1.5;

    this.camera = new PerspectiveCamera(...this.programs);
    this.addComponentsAndGatherUniforms(...this.programs);
    gl.enable(gl.DEPTH_TEST);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.width / canvas.height);
  }

  mouseDown() {
    this.camera.mouseDown();
  }

    mouseMove(event) {
    this.camera.mouseMove(event);
    }

    mouseUp() {
    this.camera.mouseUp();
    }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
    this.timeAtLastFrame = timeAtThisFrame;
    this.time = t;

    this.camera.move(dt, keysPressed);

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(const gameObject of this.gameObjects) {
        gameObject.update();
    }
    for(const gameObject of this.gameObjects) {
        gameObject.draw(this, this.camera);
    }
  }
}
