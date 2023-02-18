#version 300 es

// an attribute will receive data from a buffer
in vec3 a_position;

// transformation matrices
uniform mat4x4 u_mvp;

void main() {

    // transform a vertex from object space directly to screen space
    // the full chain of transformations is:
    // object space -{model}-> world space -{view}-> view space -{projection}-> clip space
    gl_Position = u_mvp * vec4(a_position, 1.0);

}