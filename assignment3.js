import Input from "./js/input/input.js";
import { hex2rgb, deg2rad, normalize, dot, cross } from "./js/utils/utils.js";
import { Box } from "./js/app/object3d.js";
import AppState from "./js/app/appstate.js";

/*
In the implemantation of Mat4 class, I followed along:
1. Prof's Ma slides
2. Discussion slides and links
3. Campuswire class feed 
4. mdn web docs: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection#simple_projection
5. other links commented on along the code
*/
class Mat4 {
  /**
   * Creates an identity matrix
   *
   * @returns {Mat4} An identity matrix
   */
  static identity() {
    const m4x4 = new Mat4(1, 0, 0, 0, 
                          0, 1, 0, 0, 
                          0, 0, 1, 0, 
                          0, 0, 0, 1);
    return m4x4;
  }

  /**
   * Creates a translation matrix
   *
   * @param {Number} x Translation in X direction
   * @param {Number} y Translation in Y direction
   * @param {Number} z Translation in Z direction
   * @returns {Mat4} A translation matrix
   */
  static translation(x, y, z) {
    const t4x4 = new Mat4(1,0,0,x,
                          0,1,0,y,
                          0,0,1,z,
                          0,0,0,1);
    return t4x4;
  }
  /**
   * Creates a rotation matrix for X rotations
   *
   * @param {Number} deg Angle in degrees
   * @returns {Mat4} A X rotation matrix
   */
  static rotationx(deg) {
    let c = Math.cos(deg);
    let s = Math.sin(deg);
    const rotateX4x4 = new Mat4(1,0,0,0,
                                0,c,-s,0,
                                0,s,c,0,
                                0,0,0,1);
    return rotateX4x4;
  }

  /**
   * Creates a rotation matrix for Y rotations
   *
   * @param {Number} deg Angle in degrees
   * @returns {Mat4} A Y rotation matrix
   */
  static rotationy(deg) {
    let c = Math.cos(deg);
    let s = Math.sin(deg);
    const rotateY4x4 = new Mat4(c,0,s,0,
                                0,1,0,0,
                                -s,0,c,0,
                                0,0,0,1);
    return rotateY4x4;
  }
  /**
   * Creates a rotation matrix for Z rotations
   *
   * @param {Number} deg Angle in degrees
   * @returns {Mat4} A Z rotation matrix
   */
    static rotationz(deg) {
    let c = Math.cos(deg);
    let s = Math.sin(deg);
    const rotateZ4x4 = new Mat4(c,-s,0,0,
                                s,c,0,0,
                                0,0,1,0,
                                0,0,0,1);
    return rotateZ4x4;
  }

  /**
   * Creates a scaling matrix
   *
   * @param {Number} s The factor to scale by
   * @returns {Mat4} A scaling matrix
   */
  static scale(s) {
    const s4x4 = new Mat4(s,0,0,0,
                          0,s,0,0,
                          0,0,s,0,
                          0,0,0,1);
    return s4x4;
  }

  /**
   * Creates a view matrix using eye position and viewing target position
   *
   * @param {Array<Number>} eye Position of the camera as list of [x,y,z]
   * @param {Array<Number>} center Position of the viewing target point as list of [x,y,z]
   * @param {Array<Number>} up Direction of the up vector - this is usually the Y axis
   * @returns {Mat4} A view matrix
   */
  static lookat(eye, center, up) {
    //followed the format on Prof. Ma's slide 
    //also refered to 4.3 View Transform on this page: https://www3.ntu.edu.sg/home/ehchua/programming/opengl/CG_BasicsTheory.html

    //computing the camera coordinate frame (u,v,n)
    let N = [];
    for (let i = 0; i < 3; i++) {
        N.push(eye[i] - center[i]);
    }
    let n = normalize(N);
    
    let U = cross(up,n);
    let u = normalize(U);

    let V = cross(n,u);
    let v = normalize(V);

    //Transforming from World space to Camera Space: express all the coordinates in the camera space via view transform.
    /*Rotation matrix:
    const R = new Mat4(u[0], u[1], u[2], 0,
                       v[0], v[1], v[2], 0,
                       n[0], n[1], n[2], 0,
                       0, 0, 0, 1);
    
    //Translation matrix:
    const T= new Mat4(1, 0, 0, -eye[0],
                      0, 1, 0, -eye[1],
                      0, 0, 1, -eye[2],
                      0, 0, 0, 1);
    */
    //View Matrix = RT
    const view4x4 = new Mat4(u[0], u[1], u[2], -(dot(eye,u)),
                          v[0], v[1], v[2], -(dot(eye,v)),
                          n[0], n[1], n[2], -(dot(eye,n)),
                          0, 0, 0, 1);

     //return the view matrix
    return view4x4;
  }

  /**
   * Creates a projection matrix using perspective projection
   *
   * @param {Number} fovy Vertical field of view in degrees
   * @param {Number} aspect Aspect ratio of the canvas (width / height)
   * @param {Number} near Near plane distance
   * @param {Number} far Far plane distance
   * @returns {Mat4} A perspective projection matrix
   */
  static projectionPerspective(fovy, aspect, near, far) {
    //followed the format on Prof. Ma's slide 
    //refered to this page for the math: https://stackoverflow.com/questions/28286057/trying-to-understand-the-math-behind-the-perspective-matrix-in-webgl/28301213#28301213
    //refered to section 8.3 on this page: http://learnwebgl.brown37.net/08_projections/projections_perspective.html
    //lastly, to viewing frustum on this page: https://jsantell.com/3d-projection/
    //calculate ymax and ymin using geometry 
    let ymin = -near * Math.tan(deg2rad(fovy)/2);
    let ymax = -ymin;
    //calculate xmax and xmin using geometry
    let xmin = aspect * ymin;
    let xmax = -xmin;
    //save the projection's matrix elements, calculated by help of the slides
    let p00 = (2*near) / (xmax-xmin);
    let p11 = (2*near) / (ymax-ymin);
    let p02 = (xmax+xmin) / (xmax-xmin);
    let p12 = (ymax+ymin) / (ymax-ymin);
    let p22 = (far+near) / (near-far);
    let p23 = (2*(near*far)) / (near-far);
    //create the perspective projection
    const perspective4x4 = new Mat4(p00,0,p02,0,
                                    0,p11,p12,0,
                                    0,0,p22,p23,
                                    0,0,-1,0);
    //return the perpective projection
    return perspective4x4;
  }

  /**
   * Creates a projection matrix using orthographic projection
   *
   * @param {Number} left The left extent of the camera frustum (negative)
   * @param {Number} right The right extent of the camera frustum (positive)
   * @param {Number} aspect Aspect ratio of the canvas (width / height)
   * @param {Number} near Near plane distance
   * @param {Number} far Far plane distance
   * @returns {Mat4} An orthographic projection matrix
   */
  static projectionOrthographic(left, right, aspect, near, far) {
    //followed the format on Prof. Ma's slide 
    //Referred to 8.2 section on this page: http://learnwebgl.brown37.net/08_projections/projections_ortho.html#:~:text=The%20Orthographic%20Projection%20Matrix&text=Translate%20the%20volume%20defined%20by,the%20clipping%20space's%20coordinate%20system.
    //calculate top and bottom using the aspect value 
    let top = right / aspect; 
    let bottom = left / aspect; 

    //save the projection's matrix element, calculated by the help of the slides
    let p00 = 2.0 / (right-left);
    let p11 = 2.0 / (top - bottom);
    let p22 = -2.0 / (far-near);
    let p03 = - ((right+left)/(right-left));
    let p13 = - ((top+bottom)/(top-bottom));
    let p23 = - ((far+near)/(far-near));
    //create the orthographic projection
    const orthographic4x4 = new Mat4(p00,0,0,p03,
                                     0,p11,0,p13,
                                     0,0,p22,p23,
                                     0,0,0,1);
    //return the orthographic projection
    return orthographic4x4;


  }

  /**
   * Constructs a new 4x4 matrix
   * Arguments are given in row-major order
   * They are stored in this.m in column-major order
   *
   */
  constructor(m00,m01,m02,m03,
              m10,m11,m12,m13,
              m20,m21,m22,m23,
              m30,m31,m32,m33) {
    // store in column major format
    this.m = [
      [m00, m10, m20, m30],
      [m01, m11, m21, m31],
      [m02, m12, m22, m32],
      [m03, m13, m23, m33],
    ];
  }

  /**
   * Flattens the matrix for use with WebGL/OpenGL calls
   *
   * @returns {Array<Number>} A linear list of matrix values in column-major order
   */
  flatten() {
    return [...this.m[0], ...this.m[1], ...this.m[2], ...this.m[3]];
  }

  /**
   * Performs column-major matrix multiplication of the current matrix and 'other'
   *
   * @param {Mat4} other The matrix to multiply with
   * @returns {Mat4} The resulting matrix
   */
  multiply(other) {
    //refered to the multilyMatrices(m1,m2) on this page: https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
    //create a Matrix for the result of multipication
    const res4x4 = Mat4.identity();
    //proceed with the matrix multiplication 
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            var sum = 0;
            for (let i = 0; i < 4; i++) {
                sum += this.m[i][r] * other.m[c][i];
            }
            //switch r(row) and c(column) to ensure multipication is correct
            res4x4.m[c][r]= sum;
  }
  }
  return res4x4;
}
}

/**
 * @Class
 * WebGlApp that will call basic GL functions, manage a list of shapes, and take care of rendering them
 *
 * This class will use the Shapes that you have implemented to store and render them
 */
class WebGlApp {
  /**
   * Initializes the app with a box, and the model, view, and projection matrices
   *
   * @param {WebGL2RenderingContext} gl The webgl2 rendering context
   * @param {Shader} shader The shader to be used to draw the object
   */
  constructor(gl, shader) {
    // Store the shader
    this.shader = shader;

    // Create a box instance and create a variable to track its rotation
    this.box = new Box(gl, shader, hex2rgb("#FFBF00"));
    this.box_animation_step = 0;

    // Create the model matrix
    // Use an identity matrix initially
    this.model = Mat4.identity();

    // Create the view matrix
    // Point the camera at the origin and move it off-center
    this.eye = [2.5, 1.5, -2.5];
    this.center = [0, 0, 0];
    this.up = [0, 1, 0];
    this.view = Mat4.lookat(this.eye, this.center, this.up);

    // Create the projection matrix
    // Use a perspective projection initially
    this.fovy = 90;
    this.aspect = 16 / 9;
    this.left = -5;
    this.right = 5;
    this.near = 0.001;
    this.far = 1000.0;
    this.projection = Mat4.projectionPerspective(this.fovy, this.aspect, this.near, this.far);

    // Combine model, view and projection matrix into a single MVP
    // Pay attention to the correct order of multiplication
    this.mvp = this.projection.multiply(this.view);
  }

  /**
   * Sets the viewport of the canvas to fill the whole available space so we draw to the whole canvas
   *
   * @param {WebGL2RenderingContext} gl The webgl2 rendering context
   * @param {Number} width
   * @param {Number} height
   */
  setViewport(gl, width, height) {
    gl.viewport(0, 0, width, height);
  }

  /**
   * Clears the canvas color
   *
   * @param {WebGL2RenderingContext} gl The webgl2 rendering context
   */
  clearCanvas(gl) {
    gl.clearColor(...hex2rgb("#000000"), 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  /**
   * Updates components of this app
   *
   * @param { AppState } app_state The state of the UI
   */
  update(app_state) {
    // This creates values between -1.0 and 1.0 that change continuously with time
    // Use this.box_animation_step to redefine the model matrix and realize the animation
    this.box_animation_step = Math.sin(Date.now() / 2000);
    //use getState function to get the state of the app_state
    const anime = app_state.getState("Animation");
    const proj = app_state.getState("Projection");
    
    // Query the UI for Animation and set appropriate model matrix
    if (anime === "Translate") {
      this.model = Mat4.translation(this.box_animation_step * 3, 0, this.box_animation_step * 3);;
    } else if (anime === "Rotate") {
      let YrotateMatrix = Mat4.rotationy(this.box_animation_step);
      this.model = YrotateMatrix;
    } else if (anime === "Scale") {
      let scaleMatrix = Mat4.scale(this.box_animation_step);
      this.model = scaleMatrix; 
    }else {
      this.model = Mat4.identity();
    }
    // Query the UI for Projection and set appropriate projection matrix
    if (proj === "Perspective") {
      this.projection = Mat4.projectionPerspective(this.fovy, this.aspect, this.near, this.far);    
    } else {
      this.projection = Mat4.projectionOrthographic(this.left, this.right, this.aspect, this.near, this.far);
    }
    /* Extra Credit: Can you move the camera using the arrow keys on the keyboard? 
    Here we can look at the box from different angles by rotating the camera instead of translating the camera laterally.
    1. Check to see what key was pressed 
    2. Keep the center fixed 
    3. Move the eye and up to indicate movement of camera(picked 0.5 so the movement doesn't happen so fast or slow)
    4. Re-define the view Matrix with the new coordinates
    */
    if ( Input.isKeyDown("ArrowUp") ) {
      this.eye[1] = this.eye[1] + 0.5; 
      this.up[1] = this.up[1] + 0.5;
    } else if ( Input.isKeyDown("ArrowDown") ) {
      this.eye[1] = this.eye[1] - 0.5; 
      this.up[1] = this.up[1] - 0.5;
    } else if (Input.isKeyDown("ArrowLeft")) {
      this.eye[0] = this.eye[0] - 0.5; 
      this.up[0] = this.up[0] - 0.5;
    } else if (Input.isKeyDown("ArrowRight")) {
      this.eye[0] = this.eye[0] + 0.5; 
      this.up[0] = this.up[0] + 0.5;
    }

    // The View matrix given the new eye coordinates
    this.view = Mat4.lookat(this.eye, this.center, this.up);
    
    // Re-compute the MVP matrix
    this.mvp = this.projection.multiply(this.view.multiply(this.model)); 
  }

  /**
   * Main render loop which sets up the active viewport (i.e. the area of the canvas we draw to)
   * clears the canvas with a background color and draws a box
   *
   * @param {WebGL2RenderingContext} gl The webgl2 rendering context
   * @param {Number} canvas_width The canvas width. Needed to set the viewport
   * @param {Number} canvas_height The canvas height. Needed to set the viewport
   */
  render(gl, canvas_width, canvas_height) {
    // Set viewport and clear canvas
    this.setViewport(gl, canvas_width, canvas_height);
    this.clearCanvas(gl);

    // Activate the shader
    this.shader.use();

    // Pass the MVP to the shader
    // Use the shader's setUniform4x4f function to pass a 4x4 matrix
    // Use 'u_mvp' to find the MVP variable in the shader
    // Use Mat4's flatten() function to serialize the matrix for WebGL
    this.shader.setUniform4x4f('u_mvp', this.mvp.flatten());

    // Render the box
    // This will use the MVP that was passed to the shader
    this.box.render(gl);
  }
}

// JS Module Export -- No need to modify this
export { WebGlApp };
