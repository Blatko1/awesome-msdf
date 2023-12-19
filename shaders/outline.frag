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

// Range: -0.4 < midBodyThickness < 0.4
float midBodyThickness = -0.1;
// Range: 0.0 < outlineThickness < (0.4 - midBodyThickness)
float outlineThickness = 0.48;

void main() {
	vec4 texel = texture(tex, uvCoord);
	float dist = median(texel.r, texel.g, texel.b);
	if (dist <= 0.0001) {
		discard;
	}
	float pxRange = screenPxRange();
	
	// Distance to the mid body (no outline) edge
	dist += -0.5 + midBodyThickness;
	
	// Get that distance in pixels and the opacity
  	float bodyPxDist = pxRange * dist;
  	// Since we have pxDist representing distance in screen
  	// pixels, we can smoothstep between the two closest pixels
  	// to the character border (0.5 to the inside and outside).
	float bodyOpacity = smoothstep(-0.5, 0.5, bodyPxDist);
	
	float outlineThickness = outlineThickness * abs(cos(time*TIME_SPEED));

	// Distance in pixels to the full body (with outline) edge and opacity
	float charPxDist = pxRange * (dist + outlineThickness);
	float charOpacity = smoothstep(-0.5, 0.5, charPxDist);
	
	// Get only the outline opacity
	float outlineOpacity = charOpacity - bodyOpacity;
	
	// Calculate the output color
	vec3 color = mix(outlineColor.rgb, fgColor.rgb, bodyOpacity);
	float alpha = bodyOpacity * fgColor.a + outlineOpacity * outlineColor.a;
	
	gl_FragColor = vec4(color, alpha);
}