#version 330

#define TIME_SPEED 0.5

uniform sampler2D tex;
uniform float time;

in vec2 uvCoord;

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
	vec2 unitRange = vec2(6.0)/vec2(textureSize(tex, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(uvCoord);
	return max(0.5 * dot(unitRange, screenTexSize), 1.0);
}

const vec4 fgColor = vec4(0.1, 0.3, 0.4, 1.0);
const vec4 outlineColor = vec4(0.95, 0.4, 0.3, 1.0);

// Ranges:
// -0.3 < thickness < 0.3
// 0.0 < softness < 0.5
float thickness = -0.3;
float outlineThickness = 0.3;
float softness = 0.2;
float outlineSoftness = 0.5;

void main() {
	vec4 texel = texture(tex, uvCoord);
	float a = texel.a;
	float dist = median(texel.r, texel.g, texel.b);
	if (dist <= 0.0001) {
		discard;
	}
	float pxRange = screenPxRange();
	dist -= 0.5;
	
	dist += thickness;

  	float bodyPxDist = pxRange * dist;
  	softness *= pxRange;
	float bodyOpacity = smoothstep(-0.5 - softness, 0.5 + softness, bodyPxDist);
	
	float charPxDist = pxRange * (dist + outlineThickness);
	outlineSoftness *= pxRange;
	float charOpacity = smoothstep(-0.5 - outlineSoftness, 0.5 + outlineSoftness, charPxDist);

	float outlineOpacity = charOpacity - bodyOpacity;
	
	vec3 color = mix(outlineColor.rgb, fgColor.rgb, bodyOpacity);
	float alpha = bodyOpacity * fgColor.a + outlineOpacity * outlineColor.a;
	
	gl_FragColor = vec4(color, alpha);
}