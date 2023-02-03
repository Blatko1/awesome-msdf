#version 330

uniform sampler2D msdf;

in vec2 uvCoord;

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
	vec2 unitRange = vec2(6.0)/vec2(textureSize(msdf, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(uvCoord);
	float product = dot(unitRange, screenTexSize);
	return max(0.5 * product, 1.0);
}

const vec4 fgColor = vec4(0.2, 0.3, 0.4, 1.0);
const vec4 outlineColor = vec4(0.5, 0.4, 0.3, 1.0);

float thickness = 0.2; // Range: -0.3 < thickness < 0.3
float outlineThickness = 0.6; // Range: 0.0 < outlineThickness < 0.4

void main() {
	vec4 texel = texture(msdf, uvCoord);
	float dist = median(texel.r, texel.g, texel.b);
	if (dist <= 0.0001) {
		discard;
	}
	float pxRange = screenPxRange();
	dist -= 0.5 - thickness;
	
  	float charPxDist = pxRange * dist;
	float charOpacity = smoothstep(-0.5, 0.5, charPxDist);
	
	float bodyPxDist = pxRange * (dist - outlineThickness);
	float bodyOpacity = smoothstep(-0.5, 0.5, bodyPxDist);
	
	float outlineOpacity = charOpacity - bodyOpacity;
	
	vec3 color = mix(outlineColor.rgb, fgColor.rgb, bodyOpacity);
	float alpha = bodyOpacity * fgColor.a + outlineOpacity * outlineColor.a;
	
	gl_FragColor = vec4(color, alpha);
}