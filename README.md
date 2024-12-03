# CS 405 - Project 2

This project implements a WebGL-based renderer with the following features:

## Features

1. **Lighting**
   - Diffuse, ambient, and specular lighting are implemented using the Phong reflection model.
   - The lighting interacts dynamically with the scene and textures.

2. **Textures**
   - Supports two textures per object.
   - If both textures are uploaded, they are blended together for a combined effect.
   - If only one texture is uploaded, it displays the single texture correctly.

3. **Interactive Controls**
   - `Ambient Light Density` slider: Adjusts the ambient lighting level.
   - `Specular Light Intensity` slider: Adjusts the shininess of the surface.
   - `Enable Light` checkbox: Toggles lighting on/off.
   - Texture upload options for the first and second textures.

4. **Blending Logic**
   - Combines two textures seamlessly if both are provided.
   - Automatically handles cases where only one texture is uploaded without errors.

## How to Use

1. Open the `project2.html` file in a WebGL-compatible browser.
2. Use the following features:
   - **Load OBJ model:** Upload an `.obj` file for the 3D object.
   - **Texture image:** Upload a base texture for the object.
   - **Second Texture image:** Upload an additional texture for blending.
3. Adjust the controls on the right panel to see the effects of lighting and texture blending.

## Notes

- If both textures are uploaded, they blend together for a mixed effect.
- If only one texture is uploaded, it displays without blending.
- Make sure the textures are valid image files (e.g., `.jpg`, `.png`).

