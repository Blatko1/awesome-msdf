#version 330

#define CHANGE_SPEED 1.2
#define CHAR_COUNT 4

uniform sampler2D char_m;
uniform sampler2D char_i;
uniform sampler2D char_n;
uniform float time;

in vec2 uvCoord;

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange(sampler2D tex) {
	vec2 unitRange = vec2(6.0)/vec2(textureSize(tex, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(uvCoord);
	return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

const vec4 fgColor = vec4(0.4, 0.5, 0.6, 1.0);

void main() {
	vec4 texel;
	float pxRange;
	int texIndex = int(time * CHANGE_SPEED) % CHAR_COUNT;
	switch(texIndex) {
		case 0:
			texel = texture(char_m, uvCoord);
			pxRange = screenPxRange(char_m);
			break;
		case 1:
			texel = texture(char_i, uvCoord);
			pxRange = screenPxRange(char_i);
			break;
		case 2:
			texel = texture(char_n, uvCoord);
			pxRange = screenPxRange(char_n);
			break;
		case 3:
			texel = texture(char_i, uvCoord);
			pxRange = screenPxRange(char_i);
			break;
		default:
			break;
	}
	float dist = median(texel.r, texel.g, texel.b);
	float pxDist = pxRange * (dist - 0.5);
	float opacity = clamp(pxDist + 0.5, 0.0, 1.0);
	
	// Gamma correction:
	float gamma = 2.2;
	float alpha = pow(opacity, 1 / gamma);
	
	gl_FragColor = vec4(fgColor.rgb, alpha);
}