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

float thickness = -0.3;
//float outline1Thickness = 0.4;
//float outline2Thickness = 0.2;
float maxThickness = 0.4 - thickness;

void main() {
	vec4 texel = texture(tex, uvCoord);
	float dist = median(texel.r, texel.g, texel.b);
	if (dist <= 0.0001) {
		discard;
	}
	float pxRange = screenPxRange();
	dist -= 0.5 - thickness;
	
  	float bodyPxDist = pxRange * dist;
	float bodyOpacity = smoothstep(-0.5, 0.5, bodyPxDist);
	
	float outline1Thickness = maxThickness * abs(cos(time*TIME1_SPEED));
	
	float char1PxDist = pxRange * (dist + outline1Thickness);
	float char1Opacity = smoothstep(-0.5, 0.5, char1PxDist);
	
	float outline2Thickness = (maxThickness-outline1Thickness) * abs(cos(time*TIME2_SPEED));
	
	float char2PxDist = pxRange * (dist + outline1Thickness + outline2Thickness);
	float char2Opacity = smoothstep(-0.5, 0.5, char2PxDist);

	float outline1Opacity = char1Opacity - bodyOpacity;
	float outline2Opacity = char2Opacity - char1Opacity;
	
	vec3 color = mix(outline2Color.rgb, mix(outline1Color.rgb, fgColor.rgb, bodyOpacity),char1Opacity);
	float alpha = bodyOpacity * fgColor.a + outline1Opacity * outline1Color.a + outline2Opacity * outline2Color.a;
	
	gl_FragColor = vec4(color, alpha);
}