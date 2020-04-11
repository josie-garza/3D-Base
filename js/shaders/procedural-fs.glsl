Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 modelPosition;

  void main(void) {
    vec3 colorA = vec3(0.149,0.141,0.912);
    vec3 colorB = vec3(1.000,0.833,0.224);
    float w = fract( modelPosition.x );
    vec3 color = mix(colorA, colorB, w);
    fragmentColor = vec4(color,1.0);
  }
`;