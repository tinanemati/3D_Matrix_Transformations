# 3D Matrix Transformations
An  app that will allow the user to implement many of the transformation matrices used in graphics programming using WebGl. 

### Application Showcase

[Video Showcase]() 

![preview img](/preview-1.png)

![preview img](/preview-2.png)

## This project fulfills the following requirements:
* Successfully render a wireframe box.
* Support perspective and orthographic projections.
* Support look-at style view matrix.
* Support three animation types that change the model matrix;
    * Translation from left to right.
    * Rotation in any axis or combination thereof.
    * Oscillating up- and down-scaling.
    * "Off" mode, that resets the model matrix and stops the   animation.

## There were roughly two tasks done in this project
1. Implementing a matrix class that supports the creation of affine transformations (translate, rotate, scale), and view and projection matrices. 
2. Implementing matrix multiplication to combine matrices. 
    * Use this class to render and manipulate a 3D box by providing the correct Model-View-Projection matrix to correctly display it.