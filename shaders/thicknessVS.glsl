#version 330

uniform mat4 viewProj;
uniform mat4 transform;
uniform vec2 port;

layout (location = 0) in vec3 pos;
layout (location = 1) in vec2 texCoord;
 
out vec2 uvCoord;
out vec2 viewport;

void main() {
	viewport = port;
	uvCoord = vec2(1-texCoord.x, texCoord.y);
	gl_Position = viewProj * transform * vec4(pos, 1.0);
}