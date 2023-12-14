# Shader details, snippets and examples

> WIP

Below, you'll find more detailed explanations about specific shaders and a bunch of snippets and examples.

### Content

In the shaders, you can find examples of:

- basic text rendering in 3D space with quality preservation while being *magnified*, *minified* or *rotated*,
- modifying text thickness,
- adding one or more colored outlines with custom thickness,
- applying softness to the body or the outline,
- custom colored drop shadow,
- gamma correction

### MSDF tips

Here are a few valuable tips regarding MSDFs:

- **IMPORTANT:** The result of `screenPxRange()` function in *fragment* shaders must never be lower than 1. If it is lower than 2, there is a high probability that the antialiasing will fail. Also, if it is lower than 2, color can start spreading over the whole character quad, and to fix it, add a condition where the shader gets **discarded** if the known *distance* is 0.

- **Do not use mipmaps.** When the text is minified, mipmaps will break antialiasing.

- **Supersampling** helps with antialiasing but reduces performance.

- **Thicker fonts** can help with quality preservation when the text is downscaled.

- **Gamma correction** also helps with quality preservation when the text is downscaled.

- **Higher dimensions per character** (32x32 or more) are desirable when generating the MSDF texture. This helps reduce the artefacts created while rendering *more complex and thinner fonts*. These artefacts are caused by the lack of detail on MSDF textures.

- My preference when generating MSDF textures regarding the **distance field pixel range** is **setting it to 6**. However, putting it higher will likely make no difference, and setting it too high will create strange artefacts when rendered.

- MSDF texture **magnify filter** (MagFilter) should be **set to linear** and not nearest because distance fields wouldn't work then.
