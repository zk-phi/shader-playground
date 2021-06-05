import vertexShader from "./shaders/shader.vs";
import fragmentShader from "./shaders/shader.fs";

const QUALITY_FACTOR = 0.5;

const log = document.getElementById("log");

const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

gl.getExtension('OES_standard_derivatives');
gl.getExtension('EXT_shader_texture_lod');

log.append("Compiling (vertex shader) ...");
const compiledVertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(compiledVertexShader, vertexShader);
gl.compileShader(compiledVertexShader);
if (!gl.getShaderParameter(compiledVertexShader, gl.COMPILE_STATUS)) {
  log.append("\n" + gl.getShaderInfoLog(compiledVertexShader));
  throw "compile error";
}
log.append(" Done.\n");

log.append("Compiling (fragment shader) ...");
const compiledFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(compiledFragmentShader, fragmentShader);
gl.compileShader(compiledFragmentShader);
if (!gl.getShaderParameter(compiledFragmentShader, gl.COMPILE_STATUS)) {
  log.append("\n" + gl.getShaderInfoLog(compiledFragmentShader));
  throw "compile error";
}
log.append(" Done.\n");

log.append("Linking ...");
const program = gl.createProgram();
gl.attachShader(program, compiledVertexShader);
gl.attachShader(program, compiledFragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  log.append("\n" + gl.getProgramInfoLog(program));
  throw "link error";
}
log.append(" Done.\n");

const vertices = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1.0,  1.0,
  -1.0, -1.0,
  1.0,  1.0,
  1.0, -1.0,
]), gl.STATIC_DRAW);

const pos = gl.getAttribLocation(program, 'pos');
gl.enableVertexAttribArray(pos);
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0 ,0);

/* ---- */

const resolutionLoc = gl.getUniformLocation(program, 'resolution');
const mouseLoc = gl.getUniformLocation(program, 'mouse');
const timeLoc = gl.getUniformLocation(program, 'time');

const startTime = new Date().getTime();

const updateResolution = () => {
  canvas.height = window.innerHeight * QUALITY_FACTOR;
  canvas.width = window.innerWidth * QUALITY_FACTOR;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
};
window.addEventListener('resize', updateResolution);
updateResolution();

let mouse = [0.5, 0.5];
const updateMousePos = (e) => {
  mouse = [
    e.offsetX / canvas.width * QUALITY_FACTOR,
    1 - e.offsetY / canvas.height * QUALITY_FACTOR
  ];
};
const resetMousePos = () => {
  mouse = [0.5, 0.5];
};
window.addEventListener('mousemove', updateMousePos);
window.addEventListener('mouseout', resetMousePos);

const render = () => {
  gl.uniform1f(timeLoc, (new Date().getTime() - startTime) / 1000);
  gl.uniform2fv(mouseLoc, mouse)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  window.requestAnimationFrame(render);
};
render();
