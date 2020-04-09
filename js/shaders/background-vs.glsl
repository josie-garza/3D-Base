Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  out vec4 rayDir;

  uniform struct {
  	mat4 modelMatrix;
  } gameObject;

  uniform struct {
    mat4 rayDirMatrix;
  } camera;

  void main(void) {
    rayDir = vertexPosition * camera.rayDirMatrix * gameObject.modelMatrix;
    rayDir.z = 0.99999;
  }
`;