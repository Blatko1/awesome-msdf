#version 330

uniform sampler2D msdf;

in vec2 uvCoord;

out vec4 outColor;

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
	vec2 unitRange = vec2(6.0)/vec2(textureSize(msdf, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(uvCoord);
	return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

void main() {
	vec4 texel = texture(msdf, uvCoord);
	float dist = median(texel.r, texel.g, texel.b);
	
  	float pxDist = screenPxRange() * (dist - 0.5);
	float opacity = clamp(pxDist + 0.5, 0.0, 1.0);
	
	outColor = vec4(1.0, 0.0, 0.0, opacity);
}