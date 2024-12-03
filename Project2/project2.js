/**
 * @Instructions
 * 		@task1 : Complete the setTexture function to handle non power of 2 sized textures
 * 		@task2 : Implement the lighting by modifying the fragment shader, constructor,
 *      @task3: 
 *      @task4: 
 * 		setMesh, draw, setAmbientLight, setSpecularLight and enableLighting functions 
 */


function GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY) {
	
	var trans1 = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
	var rotatXCos = Math.cos(rotationX);
	var rotatXSin = Math.sin(rotationX);

	var rotatYCos = Math.cos(rotationY);
	var rotatYSin = Math.sin(rotationY);

	var rotatx = [
		1, 0, 0, 0,
		0, rotatXCos, -rotatXSin, 0,
		0, rotatXSin, rotatXCos, 0,
		0, 0, 0, 1
	]

	var rotaty = [
		rotatYCos, 0, -rotatYSin, 0,
		0, 1, 0, 0,
		rotatYSin, 0, rotatYCos, 0,
		0, 0, 0, 1
	]

	var test1 = MatrixMult(rotaty, rotatx);
	var test2 = MatrixMult(trans1, test1);
	var mvp = MatrixMult(projectionMatrix, test2);

	return mvp;
}


class MeshDrawer {
	// The constructor is a good place for taking care of the necessary initializations.
	constructor() {
		this.prog = InitShaderProgram(meshVS, meshFS);
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
		this.showTexLoc = gl.getUniformLocation(this.prog, 'showTex');

		this.colorLoc = gl.getUniformLocation(this.prog, 'color');

		this.vertPosLoc = gl.getAttribLocation(this.prog, 'pos');
		this.texCoordLoc = gl.getAttribLocation(this.prog, 'texCoord');
		this.specularIntensityLoc = gl.getUniformLocation(this.prog, 'specularIntensity');

		this.vertbuffer = gl.createBuffer();
		this.texbuffer = gl.createBuffer();

		this.numTriangles = 0;
		/**
		 * @Task2 : You should initialize the required variables for lighting here
		 */
		
	}

	setMesh(vertPos, texCoords, normalCoords) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

		this.numTriangles = vertPos.length / 3;

		/**
		 * @Task2 : You should update the rest of this function to handle the lighting
		 */
	}

	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw(trans) {
		gl.useProgram(this.prog);

		gl.uniformMatrix4fv(this.mvpLoc, false, trans);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.enableVertexAttribArray(this.vertPosLoc);
		gl.vertexAttribPointer(this.vertPosLoc, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.enableVertexAttribArray(this.texCoordLoc);
		gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);
		
		/**
		 * @Task2 : You should update this function to handle the lighting
		 */

		///////////////////////////////


		updateLightPos();
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);


	}

	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img1, img2) {
		if (!img1 || !img2) {
			console.error("Both textures must be valid images:", img1, img2);
			return;
		}
	
		// First texture
		const texture1 = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img1);
	
		if (isPowerOf2(img1.width) && isPowerOf2(img1.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
	
		// Second texture
		const texture2 = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img2);
	
		if (isPowerOf2(img2.width) && isPowerOf2(img2.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
	
		gl.useProgram(this.prog);
	
		// Bind the first texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture1);
		const sampler1 = gl.getUniformLocation(this.prog, 'tex1');
		gl.uniform1i(sampler1, 0);
	
		// Bind the second texture
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture2);
		const sampler2 = gl.getUniformLocation(this.prog, 'tex2');
		gl.uniform1i(sampler2, 1);
	}
	
	showTexture(show) {
		gl.useProgram(this.prog);
		gl.uniform1i(this.showTexLoc, show);
	}

	enableLighting(show) {
		gl.useProgram(this.prog);
		const lightPosLoc = gl.getUniformLocation(this.prog, 'lightPos');
		const lightColorLoc = gl.getUniformLocation(this.prog, 'color');
		const enableLightingLoc = gl.getUniformLocation(this.prog, 'enableLighting');
		gl.uniform1i(enableLightingLoc, show);
		const lightPosition = [lightX, lightY, 1];
		console.log("Updated light position: ", lightPosition);
		const lightColor = [1, 1, 1];

		gl.uniform3fv(lightPosLoc, lightPosition);
		gl.uniform3fv(lightColorLoc, lightColor);
		gl.uniform1i(enableLightingLoc, show);
		/**
		 * console.error("Task 2: You should implement the lighting and implement this function ");
		 * @Task2 : You should implement the lighting and implement this function
		 */
	}
	
	setAmbientLight(ambient) {
		gl.useProgram(this.prog);
		const ambientLightLoc = gl.getUniformLocation(this.prog, 'ambient');
		gl.uniform1f(ambientLightLoc, ambient);

		/**
		 * console.error("Task 2: You should implement the lighting and implement this function ");
		 * @Task2 : You should implement the lighting and implement this function
		 */
	}

	setSpecularLight(intensity) {
		console.log("Updating specular light: ", intensity);
		gl.useProgram(this.prog);
		gl.uniform1f(this.specularIntensityLoc, intensity);
	}
	
}

function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function normalize(v, dst) {
	dst = dst || new Float32Array(3);
	var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	// make sure we don't divide by 0.
	if (length > 0.00001) {
		dst[0] = v[0] / length;
		dst[1] = v[1] / length;
		dst[2] = v[2] / length;
	}
	return dst;
}

// Vertex shader source code
const meshVS = `
			attribute vec3 pos; 
			attribute vec2 texCoord; 
			attribute vec3 normal;

			uniform mat4 mvp; 

			varying vec2 v_texCoord; 
			varying vec3 v_normal; 

			void main()
			{
				v_texCoord = texCoord;
				v_normal = normal;

				gl_Position = mvp * vec4(pos,1);
			}`;

// Fragment shader source code
/**
 * @Task2 : You should update the fragment shader to handle the lighting
 */
const meshFS = `
		precision mediump float;

		uniform bool showTex;           // Flag to indicate whether textures are shown
		uniform sampler2D tex1;         // First texture sampler
		uniform sampler2D tex2;         // Second texture sampler
		uniform vec3 color;             // Base color for lighting
		uniform vec3 lightPos;          // Position of the light source
		uniform float ambient;          // Ambient lighting intensity
		uniform float specularIntensity;// Specular lighting intensity
		varying vec2 v_texCoord;        // Texture coordinates from vertex shader
		varying vec3 v_normal;          // Normal vector from vertex shader

		void main()
		{
			// Default color for the fragment
			vec3 finalColor = vec3(0.0);

			// Normalize the interpolated normal
			vec3 normal = normalize(v_normal);

			// Calculate the direction of the light
			vec3 lightDir = normalize(lightPos);

			// Diffuse lighting
			float diff = max(dot(normal, lightDir), 0.0);
			vec3 diffuseLight = diff * color;

			// Ambient lighting
			vec3 ambientLight = ambient * color;

			// Specular lighting (Phong reflection model)
			vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0)); // Assumes the viewer is along the z-axis
			vec3 reflectDir = reflect(-lightDir, normal);
			float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
			vec3 specularLight = specularIntensity * spec * color;

			// Combine all lighting components
			finalColor = diffuseLight + ambientLight + specularLight;

			// Texture blending logic
			if (showTex) {
				vec4 color1 = texture2D(tex1, v_texCoord); // Sample first texture
				vec4 color2 = texture2D(tex2, v_texCoord); // Sample second texture

				// Default blending of two textures
				vec4 blendedColor = mix(color1, color2, 0.5);

				// Handle cases where only one texture is provided (white fallback logic)
				if (color1 == vec4(1.0, 1.0, 1.0, 1.0)) {
					blendedColor = color2;
				}
				if (color2 == vec4(1.0, 1.0, 1.0, 1.0)) {
					blendedColor = color1;
				}

				// Multiply blended texture color with the lighting
				finalColor *= blendedColor.rgb;
			}

			// Output the final fragment color
			gl_FragColor = vec4(finalColor, 1.0);
		}


`;


// Light direction parameters for Task 2
var lightX = 1;
var lightY = 1;

const keys = {};
function updateLightPos() {
	const translationSpeed = 1;
	if (keys['ArrowUp']) lightY -= translationSpeed;
	if (keys['ArrowDown']) lightY += translationSpeed;
	if (keys['ArrowRight']) lightX -= translationSpeed;
	if (keys['ArrowLeft']) lightX += translationSpeed;
	console.log("Light position: ", lightX, lightY);
}
///////////////////////////////////////////////////////////////////////////////////