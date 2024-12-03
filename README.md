CS 405 - Project 2
This project implements a WebGL-based renderer with the following features:

Features
Lighting

Diffuse, ambient, and specular lighting are implemented using the Phong reflection model.
The lighting interacts dynamically with the scene and textures.
Textures

Supports two textures per object.
If both textures are uploaded, they are blended together for a combined effect.
If only one texture is uploaded, it displays the single texture correctly.
Interactive Controls

Ambient Light Density slider: Adjusts the ambient lighting level.
Specular Light Intensity slider: Adjusts the shininess of the surface.
Enable Light checkbox: Toggles lighting on/off.
Texture upload options for the first and second textures.
Blending Logic

Combines two textures seamlessly if both are provided.
Automatically handles cases where only one texture is uploaded without errors.
How to Use
Open the project2.html file in a WebGL-compatible browser.
Use the following features:
Load OBJ model: Upload an .obj file for the 3D object.
Texture image: Upload a base texture for the object.
Second Texture image: Upload an additional texture for blending.
Adjust the controls on the right panel to see the effects of lighting and texture blending.
Notes
If both textures are uploaded, they blend together for a mixed effect.
If only one texture is uploaded, it displays without blending.