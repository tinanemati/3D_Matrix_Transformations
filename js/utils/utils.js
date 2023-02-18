'use strict'

/**
 * Loads a given URL; this is used to load the shaders from file
 * @param { String } url The relative url to the file to be loaded
 * @returns { String | null } The external file as text
 */
function loadExternalFile( url )
{

    let req = new XMLHttpRequest( );
    req.open( "GET", url, false );
    req.send( null );

    return ( req.status == 200 ) ? req.responseText : null;

}

/**
 * Converts a hex color string to a normalized rgba array
 * @param { String } hex The hex color as a string
 * @returns { Array<number> } The color as normalized values
 */
function hex2rgb( hex )
{

    let rgb = hex.match( /\w\w/g )
        .map( x => parseInt( x, 16 ) / 255 );

    return [ rgb[ 0 ], rgb[ 1 ], rgb[ 2 ] ]

}

/**
 * Converts degrees to radians
 * @param {Double | Float} deg Angle in degrees
 * @returns {Double | Float} Angle in radians 
 */
function deg2rad( deg ) {
    return deg * (Math.PI / 180)
}

/**
 * Returns the mouse coordinates relative to a clicking target, in our case the canvas
 * @param event The mouse click event
 * @returns { { x: number, y: number } } The x and y coordinates relative to the canvas
 */
function getRelativeMousePosition( event )
{

    let target = event.target

    // if the mouse is not over the canvas, return invalid values
    if ( target.id != 'canvas' )
    {

        return {

            x: -Infinity,
            y: +Infinity,

        }

    }

    target = target || event.target;
    let rect = target.getBoundingClientRect( );

    return {

        x: event.clientX - rect.left,
        y: event.clientY - rect.top,

    }

}

/**
 * Normalizes a 3-component vector
 * 
 * @param {Array<Number>} vector The vector to normalize [x,y,z]
 * @returns {Array<Number>} The normalized vector
 */
function normalize(vector) {
    let len = Math.sqrt(vector[0]*vector[0] + vector[1]*vector[1] + vector[2]*vector[2])

    return [vector[0]/len, vector[1]/len, vector[2]/len]
}

/**
 * Computes the dot product of two 3-component vectors
 * 
 * @param {Array<Number>} vector1 First vector [x,y,z]
 * @param {Array<Number>} vector2 Second vector [x,y,z]
 * @returns {Number} The dot product
 */
function dot(vector1, vector2) {
    return vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2]
    
}

/**
 * Computes the cross product of two 3-component vectors
 * 
 * @param {Array<Number>} vector1 First vector [x,y,z]
 * @param {Array<Number>} vector2 Second vector [x,y,z]
 * @returns {Array<Number>} The cross product
 */
function cross(vector1, vector2) {
    return [
        vector1[1] * vector2[2] - vector1[2] * vector2[1],
        vector1[2] * vector2[0] - vector1[0] * vector2[2],
        vector1[0] * vector2[1] - vector1[1] * vector2[0]
    ]
}

export
{

    loadExternalFile,
    hex2rgb,
    deg2rad,
    getRelativeMousePosition,
    normalize,
    dot,
    cross

}
