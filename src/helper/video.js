export function getHeight({width = null, aspect_width = 16, aspect_height = 9}) {
    return (aspect_height/ aspect_width) * width
}
