#version 330

uniform sampler2D msdf;

in vec2 uvCoord;
in vec2 viewport;

float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}

float screenPxRange() {
	vec2 unitRange = vec2(6.0)/vec2(textureSize(msdf, 0));
	vec2 screenTexSize = vec2(1.0)/fwidth(uvCoord);
	//return max(0.5 * dot(unitRange, screenTexSize), 1.0);
	return max(0.5 * dot(unitRange, screenTexSize), 1.0);
}

const vec4 fgColor = vec4(0.7, 0.3, 0.4, 1.0);
const vec4 outlineColor = vec4(0.5, 0.4, 0.3, 1.0);

float thicknessFactor = 0.1; // Range: -0.3 < thickness < 0.3
float outlineThickness = 0.0; // Range: 0.0 < outlineThickness < 0.4

void main() {
	vec4 texel = texture(msdf, uvCoord);
	float dist = median(texel.r, texel.g, texel.b);
	float pxRange = screenPxRange();
	if (dist <= 0.0001) {
		discard;
	}
	//float maxPxDist = pxRange/2;
	//float thickness = maxPxDist * thicknessFactor;
	
  	float pxDist = pxRange * (dist-0.5 + thicknessFactor);
  	//float bodyOpacity = clamp(bodyPxDist, 0, 1);
  	
	//float opacity = clamp(pxDist + 0.5, 0.0, 1.0);
	float opacity = smoothstep(-0.5, 0.5, pxDist);
	

	//float charPxDist = pxRange * (dist);
	//float charOpacity = clamp(charPxDist + 0.5 - thickness, 0.0, 1.0);

	//float charPxDist = pxRange * (dist + outlineThickness);
	//float charOpacity = clamp(charPxDist + borderDist - outlineThickness, 0.0, 1.0);
	
	//float outlineOpacity = charOpacity - bodyOpacity;
	
	//vec3 color = mix(outlineColor.rgb, fgColor.rgb, charOpacity);
	vec3 color = fgColor.rgb;
	//float alpha = bodyOpacity * fgColor.a + outlineOpacity * outlineColor.a;
	float alpha = opacity;
	
	gl_FragColor = vec4(color, alpha);
}