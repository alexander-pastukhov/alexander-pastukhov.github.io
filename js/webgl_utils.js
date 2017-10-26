function loadShader(gl, shaderSource, shaderType) {
    // Create the shader object
    var shader = gl.createShader(shaderType);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        // Something went wrong during compilation; get the error
        lastError = gl.getShaderInfoLog(shader);
        error("*** Error compiling shader '" + shader + "':" + lastError);
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createShaderFromScript(gl, scriptId) {
    // adopted from www.html5rocks.com tutorials
    var shaderSource = "";
    var shaderType;

    // getting the script text
    var shaderScript = document.getElementById(scriptId);
    if (!shaderScript) {
        throw("*** Error: unknown script element" + scriptId);
    }
    shaderSource = shaderScript.text;

    // gettings its type
    if (shaderScript.type == "x-shader/x-vertex") {
        shaderType = gl.VERTEX_SHADER;
    } else if (shaderScript.type == "x-shader/x-fragment") {
        shaderType = gl.FRAGMENT_SHADER;
    } else if (shaderType != gl.VERTEX_SHADER && shaderType != gl.FRAGMENT_SHADER) {
        throw("*** Error: unknown shader type");
        return null;
    }   

    return loadShader(gl, shaderSource, shaderType);
};

function createProgram(gl, shaders, opt_attribs, opt_locations) {
    var program = gl.createProgram();
    for (var ii = 0; ii < shaders.length; ++ii) {
        gl.attachShader(program, shaders[ii]);
    }
    if (opt_attribs) {
        for (var ii = 0; ii < opt_attribs.length; ++ii) {
        gl.bindAttribLocation(
            program,
            opt_locations ? opt_locations[ii] : ii,
            opt_attribs[ii]);
        }
    }
    gl.linkProgram(program);

    // Check the link status
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        // something went wrong with the link
        lastError = gl.getProgramInfoLog (program);
        error("Error in program linking:" + lastError);

        gl.deleteProgram(program);
        return null;
    }
    return program;
};            

// creates rotation matrix, relies on math.js
function prepare_rotation_matrix(angleXYZ){
    var rX= math.matrix([[1.0, 0.0, 0.0, 0.0], 
                            [0.0, math.cos(angleXYZ[0]), math.sin(angleXYZ[0]), 0.0], 
                            [0.0, -math.sin(angleXYZ[0]), math.cos(angleXYZ[0]), 0.0],
                            [0.0, 0.0, 0.0, 1.0]]);
                        
    var rY= math.matrix([[math.cos(angleXYZ[1]), 0.0, math.sin(angleXYZ[1]), 0.0], 
                            [0.0, 1.0, 0.0, 0.0], 
                            [-math.sin(angleXYZ[1]), 0.0, math.cos(angleXYZ[1]), 0.0],
                            [0.0, 0.0, 0.0, 1.0]]);

    var rZ= math.matrix([[math.cos(angleXYZ[2]), -math.sin(angleXYZ[2]), 0, 0], 
                            [math.sin(angleXYZ[2]), math.cos(angleXYZ[2]), 0, 0],
                            [0.0, 0.0, 1, 0.0], 
                            [0.0, 0.0, 0.0, 1.0]]);

    return math.multiply(rX, rY, rZ);
}