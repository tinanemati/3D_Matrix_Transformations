'use strict'

/**
 * @Class
 * Base class for all drawable objects
 * 
 */
class Object3D
{
    /**
     * 
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Shader} shader The shader to be used to draw the object
     * @param {Array<Float>} vertices List of vertex positions
     * @param {Array<Int>} indices List of vertex indices
     * @param {Array<Float>} color Color as a three-element vector
     * @param {WebGL2RenderingContext.GL_TRIANGLES | WebGL2RenderingContext.GL_POINTS} draw_mode The draw mode to use. In this assignment we use GL_TRIANGLES and GL_POINTS
     */
    constructor( gl, shader, vertices, indices, color, draw_mode )
    {
        this.shader = shader

        this.vertices = vertices
        this.vertices_buffer = null
        this.createVBO( gl )

        this.indices = indices
        this.index_buffer = null
        this.createIBO( gl )

        this.color = color

        this.draw_mode = draw_mode

        this.num_components = 3

        this.vertex_array_object = null
        this.createVAO( gl, shader )
    }

    /**
     * Sets up a vertex attribute object that is used during rendering to automatically tell WebGL how to access our buffers
     * @param { WebGL2RenderingContext } gl The webgl2 rendering context
     */
    createVAO( gl, shader )
    {
        this.vertex_array_object = gl.createVertexArray();
        gl.bindVertexArray(this.vertex_array_object);
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertices_buffer )
        gl.enableVertexAttribArray( shader.getAttributeLocation( "a_position" ) )

        let stride = 0, offset = 0
        gl.vertexAttribPointer( shader.getAttributeLocation( "a_position" ), this.num_components, gl.FLOAT, false, stride, offset )

        gl.bindVertexArray( null )
        gl.bindBuffer( gl.ARRAY_BUFFER, null )
    }

    /**
     * Creates vertex buffer object for vertex data
     * @param { WebGL2RenderingContext } gl The webgl2 rendering context
     */
    createVBO( gl )
    {
        this.vertices_buffer = gl.createBuffer( );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertices_buffer )
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW )
        gl.bindBuffer( gl.ARRAY_BUFFER, null );
    }

    /**
     * Creates index buffer object for vertex data
     * @param { WebGL2RenderingContext } gl The webgl2 rendering context
     */
    createIBO( gl )
    {
        this.index_buffer = gl.createBuffer( );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.index_buffer )
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW )
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
    }

    /**
     * Render call for an individual shape.
     * 
     * In this function, you set both the vertex and index buffers active
     * After that you want to set the color uniform "u_color" in the shader, so that it knows which color to use
     * "u_color" is a vec3 i.e. a list of 3 floats
     * Finally, you draw the geometry
     * Don't forget to unbind the buffers after that
     * 
     * @param { WebGL2RenderingContext } gl The webgl2 rendering context
     * @param { Shader } shader The shader to use for rendering
     */
    render( gl )
    {
        // Bind vertex array object
        gl.bindVertexArray( this.vertex_array_object )

        // Bind index buffer
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.index_buffer )

        // Set shader uniforms
        this.shader.setUniform3f( "u_color", this.color )

        // Draw the element
        gl.drawElements( this.draw_mode, this.indices.length, gl.UNSIGNED_SHORT, 0 )

        // Clean Up
        gl.bindVertexArray( null )
        gl.bindBuffer( gl.ARRAY_BUFFER, null )
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null )
    }

}

class Box extends Object3D {

    /**
     * Creates a 3D box from 8 vertices and draws it as a line mesh
     * @param {WebGL2RenderingContext} gl The webgl2 rendering context
     * @param {Shader} shader The shader to be used to draw the object
     * @param {Array<Float>} color Color as a three-element vector
     */
    constructor( gl, shader, color) 
    {
        let vertices = [
            1.000000, 1.000000, -1.000000,
            1.000000, -1.000000, -1.000000,
            1.000000, 1.000000, 1.000000,
            1.000000, -1.000000, 1.000000,
            -1.000000, 1.000000, -1.000000,
            -1.000000, -1.000000, -1.000000,
            -1.000000, 1.000000, 1.000000,
            -1.000000, -1.000000, 1.000000
        ]

        let indices = [
            0, 1,
            1, 3,
            3, 2,
            2, 0,

            0, 4,
            1, 5,
            2, 6,
            3, 7,

            4, 5,
            5, 7,
            7, 6,
            6, 4
        ]
        
        super( gl, shader, vertices, indices, color, gl.LINES )
    }
}

export {
    Box
}