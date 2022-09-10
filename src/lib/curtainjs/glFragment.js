export const scrollFs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform sampler2D uRenderTexture;

// lerped scroll deltas
// negative when scrolling down, positive when scrolling up
uniform float uScrollEffect;

// default to 2.5
uniform float uScrollStrength;


void main() {
    vec2 scrollTextCoords = vTextureCoord;
    float horizontalStretch;

    // branching on an uniform is ok
    if(uScrollEffect >= 0.0) {
        scrollTextCoords.y *= 1.0 + -uScrollEffect * 0.00625 * uScrollStrength;
        horizontalStretch = sin(scrollTextCoords.y);
    }
    else if(uScrollEffect < 0.0) {
        scrollTextCoords.y += (scrollTextCoords.y - 1.0) * uScrollEffect * 0.00625 * uScrollStrength;
        horizontalStretch = sin(-1.0 * (1.0 - scrollTextCoords.y));
    }

    scrollTextCoords.x = scrollTextCoords.x * 2.0 - 1.0;
    scrollTextCoords.x *= 1.0 + uScrollEffect * 0.0035 * horizontalStretch * uScrollStrength;
    scrollTextCoords.x = (scrollTextCoords.x + 1.0) * 0.5;

    gl_FragColor = texture2D(uRenderTexture, scrollTextCoords);
}
`;

export const vs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// default mandatory variables
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// custom variables
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    // varyings
    vVertexPosition = aVertexPosition;
    vTextureCoord = aTextureCoord;
}
`;

export const fs = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform sampler2D uTexture;

void main( void ) {
    gl_FragColor = texture2D(uTexture, vTextureCoord);
}
`;
