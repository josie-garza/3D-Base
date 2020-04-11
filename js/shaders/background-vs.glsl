Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  out vec4 rayDir;

  uniform struct {
    mat4 rayDirMatrix;
  } camera;

  void main(void) {
  	vec4 newpos = vertexPosition;
  	newpos.z = 0.9999;
  	gl_Position = newpos;
    rayDir = newpos * camera.rayDirMatrix;
  }
`;