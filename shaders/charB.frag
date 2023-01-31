#version 330

uniform sampler2D charB;
uniform sampler2D charA;
uniform sampler2D charC;
uniform sampler2D charI;
uniform sampler2D charS;

in vec2 uvCoord;
flat in int texIndex;

out vec4 outColor;

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange(sampler2D tex) {
	// Precalculate unitRange and pass it as 
	// a uniform for better performance
	vec2 unitRange = vec2(6.0)/vec2(textureSize(tex, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(uvCoord);
	return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

void main() {
	vec4 texel;
	float pxRange; 
	switch(texIndex) {
		case 0:
			texel = texture(charB, uvCoord);
			pxRange = screenPxRange(charB);
			break;
		case 1:
			texel = texture(charA, uvCoord);
			pxRange = screenPxRange(charA);
			break;
		case 2:
			texel = texture(charS, uvCoord);
			pxRange = screenPxRange(charS);
			break;
		case 3:
			texel = texture(charI, uvCoord);
			pxRange = screenPxRange(charI);
			break;
		case 4:
			texel = texture(charC, uvCoord);
			pxRange = screenPxRange(charC);
			break;
		default:
			break;
	};
	float dist = median(texel.r, texel.g, texel.b);
	
  	float pxDist = pxRange * (dist - 0.5);
	float opacity = clamp(pxDist + 0.5, 0.0, 1.0);
	
	outColor = vec4(0.80469, 0.917969, 0.9804688, opacity);
}