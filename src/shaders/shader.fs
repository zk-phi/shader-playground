precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main(void) {
  vec2 pos = gl_FragCoord.xy / resolution;
  gl_FragColor = vec4(mod(pos - mouse + 0.5, 1.0), sin(time), 1.0);
}
