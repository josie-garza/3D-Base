Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  out vec4 rayDir;

  uniform struct {
    vec4 rayDirMatrix;
  } camera;

  void main(void) {
  	rayDir = camera.rayDirMatrix;
  }
`;