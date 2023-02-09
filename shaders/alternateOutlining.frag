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
	return max(0.5*dot(unitRange, screenTexSize), 1.0);
}

const vec4 fgColor = vec4(0.2, 0.3, 0.4, 1.0);
const vec4 outlineColor = vec4(0.6, 0.7, 0.3, 1.0);

float thickness = 0.3;
float maxThickness = 0.4 + thickness;

void main() {
	vec4 texel = texture(tex, uvCoord);
	float dist = median(texel.r, texel.g, texel.b);
	if (dist <= 0.0001) {
		discard;
	}
	float pxRange = screenPxRange();
	dist -= 0.5 - thickness;
	
  	float charPxDist = pxRange * dist;
	float charOpacity = smoothstep(-0.5, 0.5, charPxDist);
	
	float outlineThickness = maxThickness * abs(cos(1.57+time*TIME_SPEED));
	
	float bodyPxDist = pxRange * (dist - outlineThickness);
	float bodyOpacity = smoothstep(-0.5, 0.5, bodyPxDist);
	
	float outlineOpacity = charOpacity - bodyOpacity;
	
	vec3 color = mix(outlineColor.rgb, fgColor.rgb, bodyOpacity);
	float alpha = bodyOpacity * fgColor.a + outlineOpacity * outlineColor.a;
	
	gl_FragColor = vec4(color, alpha);
}