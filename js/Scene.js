"use strict";
/* exported Scene */
class Scene extends UniformProvider {
    constructor(gl) {
        super("scene");
        this.programs = [];
        this.gameObjects = [];
        this.pokemonMaterials = [];
        this.colliders = [];

        this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
        this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");
        this.fsBackground = new Shader(gl, gl.FRAGMENT_SHADER, "background-fs.glsl");
        this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "background-vs.glsl");
        this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured);
        this.programs.push(this.texturedProgram);
        this.backgroundProgram = new TexturedProgram(gl, this.vsBackground, this.fsBackground);
        this.programs.push(this.backgroundProgram);

        this.timeAtFirstFrame = new Date().getTime();
        this.timeAtLastFrame = this.timeAtFirstFrame;

        this.envTexture = new TextureCube(gl, [
            "media/posx512.jpg",
            "media/negx512.jpg",
            "media/posy512.jpg",
            "media/negy512.jpg",
            "media/posz512.jpg",
            "media/negz512.jpg",
        ]);

        this.backgroundMaterial = new Material(this.backgroundProgram);
        this.backgroundMaterial.envTexture.set(this.envTexture);
        this.texturedQuadGeometry = new TexturedQuadGeometry(gl);
        this.backgroundMesh = new Mesh(this.backgroundMaterial, this.texturedQuadGeometry);
        this.background = new GameObject(this.backgroundMesh);
        this.background.update = function() {};
        this.gameObjects.push(this.background);

        this.bodyMaterial = new Material(this.texturedProgram);
        this.bodyMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonDh.png"))
        this.pokemonMaterials.push(this.bodyMaterial);
        this.eyeMaterial = new Material(this.texturedProgram);
        this.eyeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonEyeDh.png"))
        this.pokemonMaterials.push(this.eyeMaterial);
        this.pokemonMesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json", this.pokemonMaterials);
        this.avatar = new GameObject(this.pokemonMesh);
        this.gameObjects.push(this.avatar);

        this.ballMaterial = new Material(this.texturedProgram);
        this.ballMaterial.colorTexture.set(new Texture2D(gl, "media/ball2.png"));
        this.ballMaterials = [];
        this.ballMaterials.push(this.ballMaterial);
        this.ballMesh = new MultiMesh(gl, "media/ball.json", this.ballMaterials);
        this.ball = new GameObject(this.ballMesh);
        this.ball1 = new GameObject(this.ballMesh);
        this.gameObjects.push(this.ball);
        this.gameObjects.push(this.ball1);
        this.colliders.push(this.ball);
        this.colliders.push(this.ball1);

        this.ball.position.set(2, -0.5, 0);
        this.ball.scale.set(0.5, 0.5, 0.5);
        this.ball1.position.set(-2, -0.5, 0);
        this.ball1.scale.set(0.5, 0.5, 0.5);
        this.avatar.position.set(0, -1, 0);
        this.avatar.scale.set(0.1, 0.1, 0.1);

        const genericMove = function(t, dt) {
            var acceleration = this.force.mul(this.invMass);
            this.velocity.addScaled(dt, acceleration);
            this.velocity.x *= 0.96;
            this.velocity.z *= 0.96;
            this.position.addScaled(dt, this.velocity);

            //var factor = dt * 5;
            //this.yaw += this.angularVelocity.x * factor;
            //this.pitch += this.angularVelocity.z * factor;

        };

        const ballMove = function(t, dt) {
        };

        this.avatar.control = function(t, dt, keysPressed, colliders) {
            this.thrust = 0;
            if (keysPressed.UP) {
                this.thrust += 10;
            }
            if (keysPressed.DOWN) {
                this.thrust -= 10;
            }
            if (keysPressed.RIGHT) {
                this.yaw -= 0.1;
            }
            if (keysPressed.LEFT) {
                this.yaw += 0.1;
            }
            const ahead = new Vec3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
            this.force = ahead.mul(this.thrust);

            for (const other of colliders) {
                if (other == this) {
                    continue;
                } else {
                    const dist = this.position.minus(other.position);
                    const dist2 = dist.dot(dist);
                    var radius = this.scale.x + other.scale.x;
                    radius *= 2.2;
                    if (Math.sqrt(dist2) < radius) {
                        //var rotationAxis = this.velocity.cross(new Vec3(0, 1, 0));
                        //other.angularVelocity = this.velocity;
                        other.force = this.velocity.direction();
                    }
                }
            }
        }
        this.avatar.move = genericMove;
        this.ball.move = genericMove;
        this.ball1.move = genericMove;
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

        this.camera.move(dt, keysPressed, this.avatar);

        // clear the screen
        gl.clearColor(0.3, 0.0, 0.3, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (const gameObject of this.gameObjects) {
            gameObject.control(t, dt, keysPressed, this.colliders);
        }

        for (const gameObject of this.gameObjects) {
            gameObject.move(t, dt);
        }
        for (const gameObject of this.gameObjects) {
            gameObject.update();
        }
        for (const gameObject of this.gameObjects) {
            gameObject.draw(this, this.camera);
        }
    }
}