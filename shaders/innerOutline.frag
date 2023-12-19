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

// Watch out if the difference between the two thicknesses is bigger than,
// in this case, 0.4! Artefacts will appear!
// Range: -0.4 < fullBodyThickness < 0.4
float fullBodyThickness = 0.2;
// Range: 0.0 < innerOutlineThickness < (fullBodyThickness + 0.4)
float innerOutlineThickness = 0.3;

void main() {
	vec4 texel = texture(tex, uvCoord);
	float dist = median(texel.r, texel.g, texel.b);
	if (dist <= 0.0001) {
		discard;
	}
	float pxRange = screenPxRange();
	
	// Distance to the full body (with outline) edge
	dist += -0.5 + fullBodyThickness;
	
	// Get that distance in pixels and get the opacity
  	float charPxDist = pxRange * dist;
	float charOpacity = smoothstep(-0.5, 0.5, charPxDist);
	
	float outlineThickness = innerOutlineThickness * abs(cos(1.57+time*TIME_SPEED));
	
	// Distance in pixels to the mid body edge (outline subtracted) and opacity
	float bodyPxDist = pxRange * (dist - outlineThickness);
	float bodyOpacity = smoothstep(-0.5, 0.5, bodyPxDist);
	
	// Get only the outline opacity
	float outlineOpacity = charOpacity - bodyOpacity;
	
	// Calculate the output color
	vec3 color = mix(outlineColor.rgb, fgColor.rgb, bodyOpacity);
	float alpha = bodyOpacity * fgColor.a + outlineOpacity * outlineColor.a;
	
	gl_FragColor = vec4(color, alpha);
}