#version 330

#define TIME_SPEED 0.7

uniform sampler2D texs;
uniform float time;

in vec2 uvCoord;

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
	vec2 unitRange = vec2(6.0)/vec2(textureSize(texs, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(uvCoord);
	return max(0.5 * dot(unitRange, screenTexSize), 1.0);
}

const vec4 fgColor = vec4(0.7, 0.3, 0.4, 1.0);

//float thicknessFactor = 0.1; // Range: -0.3 < thickness < 0.3
float maxThickness = 0.3;

void main() {
	vec4 texel = texture(texs, uvCoord);
	float dist = median(texel.r, texel.g, texel.b);
	if (dist <= 0.0001) {
		discard;
	}
	
	float thickness = maxThickness * cos(time * TIME_SPEED);
	
  	float pxDist = screenPxRange() * (dist - 0.5 + thickness);
	float opacity = smoothstep(-0.5, 0.5, pxDist);
	
	gl_FragColor = vec4(fgColor.rgb, opacity);
}