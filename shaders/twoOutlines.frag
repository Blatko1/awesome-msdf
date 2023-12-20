#version 330

#define TIME1_SPEED 0.3
#define TIME2_SPEED 2

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

const vec4 fgColor = vec4(0.41797, 0.480469, 0.54688, 1.0);
const vec4 outline1Color = vec4(0.230469, 0.300781, 0.378906, 1.0);
const vec4 outline2Color = vec4(0.972656, 0.816406, 0.05859, 1.0);

float bodyThickness = -0.3;
float outline1Thickness = 0.35;
float outline2Thickness = 0.25;

void main() {
	vec4 texel = texture(tex, uvCoord);
	float dist = median(texel.r, texel.g, texel.b);
	if (dist <= 0.0001) {
		discard;
	}
	float pxRange = screenPxRange();
	dist -= 0.5;
	
	// Distance to the body (no outline) edge
	dist += bodyThickness;
	
	// Get that distance in pixels and the opacity
  	float bodyPxDist = pxRange * dist;
	float bodyOpacity = smoothstep(-0.5, 0.5, bodyPxDist);
	
	float t1 = outline1Thickness * abs(cos(time*TIME1_SPEED));
	
	// Distance (in pixels) to the body with first outline edge and opacity
	dist += t1;
	float outline1PxDist = pxRange * dist;
	float bodyWithOutline1Opacity = smoothstep(-0.5, 0.5, outline1PxDist);
	
	float t2 = outline2Thickness * abs(cos(time*TIME2_SPEED));
	
	// Distance (in pixels) to the body with second outline edge and opacity
	dist += t2;
	float outline2PxDist = pxRange * dist;
	float bodyWithOutline2Opacity = smoothstep(-0.5, 0.5, outline2PxDist);

	// Get the first and second outline opacity
	float outline1Opacity = bodyWithOutline1Opacity - bodyOpacity;
	float outline2Opacity = bodyWithOutline2Opacity - bodyWithOutline1Opacity;

	// Calculate the output color
	vec3 color = mix(mix(outline2Color.rgb, outline1Color.rgb, outline1Opacity), fgColor.rgb, bodyOpacity);
	float alpha = bodyOpacity * fgColor.a + outline1Opacity * outline1Color.a + outline2Opacity * outline2Color.a;
	
	gl_FragColor = vec4(color, alpha);
}