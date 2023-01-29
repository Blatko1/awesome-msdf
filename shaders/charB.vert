#version 330

uniform mat4 viewProj;
uniform mat4 transform;

layout (location = 0) in vec3 pos;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoord;

out vec2 uvCoord;

void main() {
	uvCoord = texCoord;
	gl_Position = viewProj * transform * vec4(pos, 1.0);
}